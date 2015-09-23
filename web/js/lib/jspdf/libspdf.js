/*
 * Extracted from pdf.js
 * https://github.com/andreasgal/pdf.js
 *
 * Copyright (c) 2011 Mozilla Foundation
 *
 * Contributors: Andreas Gal <gal@mozilla.com>
 *               Chris G Jones <cjones@mozilla.com>
 *               Shaon Barman <shaon.barman@gmail.com>
 *               Vivien Nicolas <21@vingtetun.org>
 *               Justin D'Arcangelo <justindarc@gmail.com>
 *               Yury Delendik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

var DecodeStream = (function() {
  function constructor() {
    this.pos = 0;
    this.bufferLength = 0;
    this.eof = false;
    this.buffer = null;
  }

  constructor.prototype = {
    ensureBuffer: function decodestream_ensureBuffer(requested) {
      var buffer = this.buffer;
      var current = buffer ? buffer.byteLength : 0;
      if (requested < current)
        return buffer;
      var size = 512;
      while (size < requested)
        size <<= 1;
      var buffer2 = new Uint8Array(size);
      for (var i = 0; i < current; ++i)
        buffer2[i] = buffer[i];
      return this.buffer = buffer2;
    },
    getByte: function decodestream_getByte() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return this.buffer[this.pos++];
    },
    getBytes: function decodestream_getBytes(length) {
      var pos = this.pos;

      if (length) {
        this.ensureBuffer(pos + length);
        var end = pos + length;

        while (!this.eof && this.bufferLength < end)
          this.readBlock();

        var bufEnd = this.bufferLength;
        if (end > bufEnd)
          end = bufEnd;
      } else {
        while (!this.eof)
          this.readBlock();

        var end = this.bufferLength;
      }

      this.pos = end;
      return this.buffer.subarray(pos, end);
    },
    lookChar: function decodestream_lookChar() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return String.fromCharCode(this.buffer[this.pos]);
    },
    getChar: function decodestream_getChar() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return String.fromCharCode(this.buffer[this.pos++]);
    },
    makeSubStream: function decodestream_makeSubstream(start, length, dict) {
      var end = start + length;
      while (this.bufferLength <= end && !this.eof)
        this.readBlock();
      return new Stream(this.buffer, start, length, dict);
    },
    skip: function decodestream_skip(n) {
      if (!n)
        n = 1;
      this.pos += n;
    },
    reset: function decodestream_reset() {
      this.pos = 0;
    }
  };

  return constructor;
})();

var FlateStream = (function() {
  if (typeof Uint32Array === 'undefined') {
    return undefined;
  }
  var codeLenCodeMap = new Uint32Array([
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
  ]);

  var lengthDecode = new Uint32Array([
    0x00003, 0x00004, 0x00005, 0x00006, 0x00007, 0x00008, 0x00009, 0x0000a,
    0x1000b, 0x1000d, 0x1000f, 0x10011, 0x20013, 0x20017, 0x2001b, 0x2001f,
    0x30023, 0x3002b, 0x30033, 0x3003b, 0x40043, 0x40053, 0x40063, 0x40073,
    0x50083, 0x500a3, 0x500c3, 0x500e3, 0x00102, 0x00102, 0x00102
  ]);

  var distDecode = new Uint32Array([
    0x00001, 0x00002, 0x00003, 0x00004, 0x10005, 0x10007, 0x20009, 0x2000d,
    0x30011, 0x30019, 0x40021, 0x40031, 0x50041, 0x50061, 0x60081, 0x600c1,
    0x70101, 0x70181, 0x80201, 0x80301, 0x90401, 0x90601, 0xa0801, 0xa0c01,
    0xb1001, 0xb1801, 0xc2001, 0xc3001, 0xd4001, 0xd6001
  ]);

  var fixedLitCodeTab = [new Uint32Array([
    0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c0,
    0x70108, 0x80060, 0x80020, 0x900a0, 0x80000, 0x80080, 0x80040, 0x900e0,
    0x70104, 0x80058, 0x80018, 0x90090, 0x70114, 0x80078, 0x80038, 0x900d0,
    0x7010c, 0x80068, 0x80028, 0x900b0, 0x80008, 0x80088, 0x80048, 0x900f0,
    0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c8,
    0x7010a, 0x80064, 0x80024, 0x900a8, 0x80004, 0x80084, 0x80044, 0x900e8,
    0x70106, 0x8005c, 0x8001c, 0x90098, 0x70116, 0x8007c, 0x8003c, 0x900d8,
    0x7010e, 0x8006c, 0x8002c, 0x900b8, 0x8000c, 0x8008c, 0x8004c, 0x900f8,
    0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c4,
    0x70109, 0x80062, 0x80022, 0x900a4, 0x80002, 0x80082, 0x80042, 0x900e4,
    0x70105, 0x8005a, 0x8001a, 0x90094, 0x70115, 0x8007a, 0x8003a, 0x900d4,
    0x7010d, 0x8006a, 0x8002a, 0x900b4, 0x8000a, 0x8008a, 0x8004a, 0x900f4,
    0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cc,
    0x7010b, 0x80066, 0x80026, 0x900ac, 0x80006, 0x80086, 0x80046, 0x900ec,
    0x70107, 0x8005e, 0x8001e, 0x9009c, 0x70117, 0x8007e, 0x8003e, 0x900dc,
    0x7010f, 0x8006e, 0x8002e, 0x900bc, 0x8000e, 0x8008e, 0x8004e, 0x900fc,
    0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c2,
    0x70108, 0x80061, 0x80021, 0x900a2, 0x80001, 0x80081, 0x80041, 0x900e2,
    0x70104, 0x80059, 0x80019, 0x90092, 0x70114, 0x80079, 0x80039, 0x900d2,
    0x7010c, 0x80069, 0x80029, 0x900b2, 0x80009, 0x80089, 0x80049, 0x900f2,
    0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900ca,
    0x7010a, 0x80065, 0x80025, 0x900aa, 0x80005, 0x80085, 0x80045, 0x900ea,
    0x70106, 0x8005d, 0x8001d, 0x9009a, 0x70116, 0x8007d, 0x8003d, 0x900da,
    0x7010e, 0x8006d, 0x8002d, 0x900ba, 0x8000d, 0x8008d, 0x8004d, 0x900fa,
    0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c6,
    0x70109, 0x80063, 0x80023, 0x900a6, 0x80003, 0x80083, 0x80043, 0x900e6,
    0x70105, 0x8005b, 0x8001b, 0x90096, 0x70115, 0x8007b, 0x8003b, 0x900d6,
    0x7010d, 0x8006b, 0x8002b, 0x900b6, 0x8000b, 0x8008b, 0x8004b, 0x900f6,
    0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900ce,
    0x7010b, 0x80067, 0x80027, 0x900ae, 0x80007, 0x80087, 0x80047, 0x900ee,
    0x70107, 0x8005f, 0x8001f, 0x9009e, 0x70117, 0x8007f, 0x8003f, 0x900de,
    0x7010f, 0x8006f, 0x8002f, 0x900be, 0x8000f, 0x8008f, 0x8004f, 0x900fe,
    0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c1,
    0x70108, 0x80060, 0x80020, 0x900a1, 0x80000, 0x80080, 0x80040, 0x900e1,
    0x70104, 0x80058, 0x80018, 0x90091, 0x70114, 0x80078, 0x80038, 0x900d1,
    0x7010c, 0x80068, 0x80028, 0x900b1, 0x80008, 0x80088, 0x80048, 0x900f1,
    0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c9,
    0x7010a, 0x80064, 0x80024, 0x900a9, 0x80004, 0x80084, 0x80044, 0x900e9,
    0x70106, 0x8005c, 0x8001c, 0x90099, 0x70116, 0x8007c, 0x8003c, 0x900d9,
    0x7010e, 0x8006c, 0x8002c, 0x900b9, 0x8000c, 0x8008c, 0x8004c, 0x900f9,
    0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c5,
    0x70109, 0x80062, 0x80022, 0x900a5, 0x80002, 0x80082, 0x80042, 0x900e5,
    0x70105, 0x8005a, 0x8001a, 0x90095, 0x70115, 0x8007a, 0x8003a, 0x900d5,
    0x7010d, 0x8006a, 0x8002a, 0x900b5, 0x8000a, 0x8008a, 0x8004a, 0x900f5,
    0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cd,
    0x7010b, 0x80066, 0x80026, 0x900ad, 0x80006, 0x80086, 0x80046, 0x900ed,
    0x70107, 0x8005e, 0x8001e, 0x9009d, 0x70117, 0x8007e, 0x8003e, 0x900dd,
    0x7010f, 0x8006e, 0x8002e, 0x900bd, 0x8000e, 0x8008e, 0x8004e, 0x900fd,
    0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c3,
    0x70108, 0x80061, 0x80021, 0x900a3, 0x80001, 0x80081, 0x80041, 0x900e3,
    0x70104, 0x80059, 0x80019, 0x90093, 0x70114, 0x80079, 0x80039, 0x900d3,
    0x7010c, 0x80069, 0x80029, 0x900b3, 0x80009, 0x80089, 0x80049, 0x900f3,
    0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900cb,
    0x7010a, 0x80065, 0x80025, 0x900ab, 0x80005, 0x80085, 0x80045, 0x900eb,
    0x70106, 0x8005d, 0x8001d, 0x9009b, 0x70116, 0x8007d, 0x8003d, 0x900db,
    0x7010e, 0x8006d, 0x8002d, 0x900bb, 0x8000d, 0x8008d, 0x8004d, 0x900fb,
    0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c7,
    0x70109, 0x80063, 0x80023, 0x900a7, 0x80003, 0x80083, 0x80043, 0x900e7,
    0x70105, 0x8005b, 0x8001b, 0x90097, 0x70115, 0x8007b, 0x8003b, 0x900d7,
    0x7010d, 0x8006b, 0x8002b, 0x900b7, 0x8000b, 0x8008b, 0x8004b, 0x900f7,
    0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900cf,
    0x7010b, 0x80067, 0x80027, 0x900af, 0x80007, 0x80087, 0x80047, 0x900ef,
    0x70107, 0x8005f, 0x8001f, 0x9009f, 0x70117, 0x8007f, 0x8003f, 0x900df,
    0x7010f, 0x8006f, 0x8002f, 0x900bf, 0x8000f, 0x8008f, 0x8004f, 0x900ff
  ]), 9];

  var fixedDistCodeTab = [new Uint32Array([
    0x50000, 0x50010, 0x50008, 0x50018, 0x50004, 0x50014, 0x5000c, 0x5001c,
    0x50002, 0x50012, 0x5000a, 0x5001a, 0x50006, 0x50016, 0x5000e, 0x00000,
    0x50001, 0x50011, 0x50009, 0x50019, 0x50005, 0x50015, 0x5000d, 0x5001d,
    0x50003, 0x50013, 0x5000b, 0x5001b, 0x50007, 0x50017, 0x5000f, 0x00000
  ]), 5];
  
  function error(e) {
      throw new Error(e)
  }

  function constructor(bytes) {
    //var bytes = stream.getBytes();
    var bytesPos = 0;

    var cmf = bytes[bytesPos++];
    var flg = bytes[bytesPos++];
    if (cmf == -1 || flg == -1)
      error('Invalid header in flate stream');
    if ((cmf & 0x0f) != 0x08)
      error('Unknown compression method in flate stream');
    if ((((cmf << 8) + flg) % 31) != 0)
      error('Bad FCHECK in flate stream');
    if (flg & 0x20)
      error('FDICT bit set in flate stream');

    this.bytes = bytes;
    this.bytesPos = bytesPos;

    this.codeSize = 0;
    this.codeBuf = 0;

    DecodeStream.call(this);
  }

  constructor.prototype = Object.create(DecodeStream.prototype);

  constructor.prototype.getBits = function(bits) {
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;
    var bytes = this.bytes;
    var bytesPos = this.bytesPos;

    var b;
    while (codeSize < bits) {
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad encoding in flate stream');
      codeBuf |= b << codeSize;
      codeSize += 8;
    }
    b = codeBuf & ((1 << bits) - 1);
    this.codeBuf = codeBuf >> bits;
    this.codeSize = codeSize -= bits;
    this.bytesPos = bytesPos;
    return b;
  };

  constructor.prototype.getCode = function(table) {
    var codes = table[0];
    var maxLen = table[1];
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;
    var bytes = this.bytes;
    var bytesPos = this.bytesPos;

    while (codeSize < maxLen) {
      var b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad encoding in flate stream');
      codeBuf |= (b << codeSize);
      codeSize += 8;
    }
    var code = codes[codeBuf & ((1 << maxLen) - 1)];
    var codeLen = code >> 16;
    var codeVal = code & 0xffff;
    if (codeSize == 0 || codeSize < codeLen || codeLen == 0)
      error('Bad encoding in flate stream');
    this.codeBuf = (codeBuf >> codeLen);
    this.codeSize = (codeSize - codeLen);
    this.bytesPos = bytesPos;
    return codeVal;
  };

  constructor.prototype.generateHuffmanTable = function(lengths) {
    var n = lengths.length;

    // find max code length
    var maxLen = 0;
    for (var i = 0; i < n; ++i) {
      if (lengths[i] > maxLen)
        maxLen = lengths[i];
    }

    // build the table
    var size = 1 << maxLen;
    var codes = new Uint32Array(size);
    for (var len = 1, code = 0, skip = 2;
         len <= maxLen;
         ++len, code <<= 1, skip <<= 1) {
      for (var val = 0; val < n; ++val) {
        if (lengths[val] == len) {
          // bit-reverse the code
          var code2 = 0;
          var t = code;
          for (var i = 0; i < len; ++i) {
            code2 = (code2 << 1) | (t & 1);
            t >>= 1;
          }

          // fill the table entries
          for (var i = code2; i < size; i += skip)
            codes[i] = (len << 16) | val;

          ++code;
        }
      }
    }

    return [codes, maxLen];
  };

  constructor.prototype.readBlock = function() {
    function repeat(stream, array, len, offset, what) {
      var repeat = stream.getBits(len) + offset;
      while (repeat-- > 0)
        array[i++] = what;
    }

    // read block header
    var hdr = this.getBits(3);
    if (hdr & 1)
      this.eof = true;
    hdr >>= 1;

    if (hdr == 0) { // uncompressed block
      var bytes = this.bytes;
      var bytesPos = this.bytesPos;
      var b;

      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      var blockLen = b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      blockLen |= (b << 8);
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      var check = b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      check |= (b << 8);
      if (check != (~blockLen & 0xffff))
        error('Bad uncompressed block length in flate stream');

      this.codeBuf = 0;
      this.codeSize = 0;

      var bufferLength = this.bufferLength;
      var buffer = this.ensureBuffer(bufferLength + blockLen);
      var end = bufferLength + blockLen;
      this.bufferLength = end;
      for (var n = bufferLength; n < end; ++n) {
        if (typeof (b = bytes[bytesPos++]) == 'undefined') {
          this.eof = true;
          break;
        }
        buffer[n] = b;
      }
      this.bytesPos = bytesPos;
      return;
    }

    var litCodeTable;
    var distCodeTable;
    if (hdr == 1) { // compressed block, fixed codes
      litCodeTable = fixedLitCodeTab;
      distCodeTable = fixedDistCodeTab;
    } else if (hdr == 2) { // compressed block, dynamic codes
      var numLitCodes = this.getBits(5) + 257;
      var numDistCodes = this.getBits(5) + 1;
      var numCodeLenCodes = this.getBits(4) + 4;

      // build the code lengths code table
      var codeLenCodeLengths = Array(codeLenCodeMap.length);
      var i = 0;
      while (i < numCodeLenCodes)
        codeLenCodeLengths[codeLenCodeMap[i++]] = this.getBits(3);
      var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);

      // build the literal and distance code tables
      var len = 0;
      var i = 0;
      var codes = numLitCodes + numDistCodes;
      var codeLengths = new Array(codes);
      while (i < codes) {
        var code = this.getCode(codeLenCodeTab);
        if (code == 16) {
          repeat(this, codeLengths, 2, 3, len);
        } else if (code == 17) {
          repeat(this, codeLengths, 3, 3, len = 0);
        } else if (code == 18) {
          repeat(this, codeLengths, 7, 11, len = 0);
        } else {
          codeLengths[i++] = len = code;
        }
      }

      litCodeTable =
        this.generateHuffmanTable(codeLengths.slice(0, numLitCodes));
      distCodeTable =
        this.generateHuffmanTable(codeLengths.slice(numLitCodes, codes));
    } else {
      error('Unknown block type in flate stream');
    }

    var buffer = this.buffer;
    var limit = buffer ? buffer.length : 0;
    var pos = this.bufferLength;
    while (true) {
      var code1 = this.getCode(litCodeTable);
      if (code1 < 256) {
        if (pos + 1 >= limit) {
          buffer = this.ensureBuffer(pos + 1);
          limit = buffer.length;
        }
        buffer[pos++] = code1;
        continue;
      }
      if (code1 == 256) {
        this.bufferLength = pos;
        return;
      }
      code1 -= 257;
      code1 = lengthDecode[code1];
      var code2 = code1 >> 16;
      if (code2 > 0)
        code2 = this.getBits(code2);
      var len = (code1 & 0xffff) + code2;
      code1 = this.getCode(distCodeTable);
      code1 = distDecode[code1];
      code2 = code1 >> 16;
      if (code2 > 0)
        code2 = this.getBits(code2);
      var dist = (code1 & 0xffff) + code2;
      if (pos + len >= limit) {
        buffer = this.ensureBuffer(pos + len);
        limit = buffer.length;
      }
      for (var k = 0; k < len; ++k, ++pos)
        buffer[pos] = buffer[pos - dist];
    }
  };

  return constructor;
})();// Generated by CoffeeScript 1.4.0

/*
# PNG.js
# Copyright (c) 2011 Devon Govett
# MIT LICENSE
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy of this 
# software and associated documentation files (the "Software"), to deal in the Software 
# without restriction, including without limitation the rights to use, copy, modify, merge, 
# publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
# to whom the Software is furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all copies or 
# substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
# BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
# DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


(function(global) {
  var PNG;

  PNG = (function() {
    var APNG_BLEND_OP_OVER, APNG_BLEND_OP_SOURCE, APNG_DISPOSE_OP_BACKGROUND, APNG_DISPOSE_OP_NONE, APNG_DISPOSE_OP_PREVIOUS, makeImage, scratchCanvas, scratchCtx;

    PNG.load = function(url, canvas, callback) {
      var xhr,
        _this = this;
      if (typeof canvas === 'function') {
        callback = canvas;
      }
      xhr = new XMLHttpRequest;
      xhr.open("GET", url, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function() {
        var data, png;
        data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
        png = new PNG(data);
        if (typeof (canvas != null ? canvas.getContext : void 0) === 'function') {
          png.render(canvas);
        }
        return typeof callback === "function" ? callback(png) : void 0;
      };
      return xhr.send(null);
    };

    APNG_DISPOSE_OP_NONE = 0;

    APNG_DISPOSE_OP_BACKGROUND = 1;

    APNG_DISPOSE_OP_PREVIOUS = 2;

    APNG_BLEND_OP_SOURCE = 0;

    APNG_BLEND_OP_OVER = 1;

    function PNG(data) {
      var chunkSize, colors, palLen, delayDen, delayNum, frame, i, index, key, section, palShort, text, _i, _j, _ref;
      this.data = data;
      this.pos = 8;
      this.palette = [];
      this.imgData = [];
      this.transparency = {};
      this.animation = null;
      this.text = {};
      frame = null;
      while (true) {
        chunkSize = this.readUInt32();
        section = ((function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; _i < 4; i = ++_i) {
            _results.push(String.fromCharCode(this.data[this.pos++]));
          }
          return _results;
        }).call(this)).join('');
        switch (section) {
          case 'IHDR':
            this.width = this.readUInt32();
            this.height = this.readUInt32();
            this.bits = this.data[this.pos++];
            this.colorType = this.data[this.pos++];
            this.compressionMethod = this.data[this.pos++];
            this.filterMethod = this.data[this.pos++];
            this.interlaceMethod = this.data[this.pos++];
            break;
          case 'acTL':
            this.animation = {
              numFrames: this.readUInt32(),
              numPlays: this.readUInt32() || Infinity,
              frames: []
            };
            break;
          case 'PLTE':
            this.palette = this.read(chunkSize);
            break;
          case 'fcTL':
            if (frame) {
              this.animation.frames.push(frame);
            }
            this.pos += 4;
            frame = {
              width: this.readUInt32(),
              height: this.readUInt32(),
              xOffset: this.readUInt32(),
              yOffset: this.readUInt32()
            };
            delayNum = this.readUInt16();
            delayDen = this.readUInt16() || 100;
            frame.delay = 1000 * delayNum / delayDen;
            frame.disposeOp = this.data[this.pos++];
            frame.blendOp = this.data[this.pos++];
            frame.data = [];
            break;
          case 'IDAT':
          case 'fdAT':
            if (section === 'fdAT') {
              this.pos += 4;
              chunkSize -= 4;
            }
            data = (frame != null ? frame.data : void 0) || this.imgData;
            for (i = _i = 0; 0 <= chunkSize ? _i < chunkSize : _i > chunkSize; i = 0 <= chunkSize ? ++_i : --_i) {
              data.push(this.data[this.pos++]);
            }
            break;
          case 'tRNS':
            this.transparency = {};
            switch (this.colorType) {
              case 3:
            	palLen = this.palette.length/3;
                this.transparency.indexed = this.read(chunkSize);
                if(this.transparency.indexed.length > palLen)
                	throw new Error('More transparent colors than palette size');
                /*
                 * According to the PNG spec trns should be increased to the same size as palette if shorter
                 */
                //palShort = 255 - this.transparency.indexed.length;
                palShort = palLen - this.transparency.indexed.length;
                if (palShort > 0) {
                  for (i = _j = 0; 0 <= palShort ? _j < palShort : _j > palShort; i = 0 <= palShort ? ++_j : --_j) {
                    this.transparency.indexed.push(255);
                  }
                }
                break;
              case 0:
                this.transparency.grayscale = this.read(chunkSize)[0];
                break;
              case 2:
                this.transparency.rgb = this.read(chunkSize);
            }
            break;
          case 'tEXt':
            text = this.read(chunkSize);
            index = text.indexOf(0);
            key = String.fromCharCode.apply(String, text.slice(0, index));
            this.text[key] = String.fromCharCode.apply(String, text.slice(index + 1));
            break;
          case 'IEND':
            if (frame) {
              this.animation.frames.push(frame);
            }
            this.colors = (function() {
              switch (this.colorType) {
                case 0:
                case 3:
                case 4:
                  return 1;
                case 2:
                case 6:
                  return 3;
              }
            }).call(this);
            this.hasAlphaChannel = (_ref = this.colorType) === 4 || _ref === 6;
            colors = this.colors + (this.hasAlphaChannel ? 1 : 0);
            this.pixelBitlength = this.bits * colors;
            this.colorSpace = (function() {
              switch (this.colors) {
                case 1:
                  return 'DeviceGray';
                case 3:
                  return 'DeviceRGB';
              }
            }).call(this);
            this.imgData = new Uint8Array(this.imgData);
            return;
          default:
            this.pos += chunkSize;
        }
        this.pos += 4;
        if (this.pos > this.data.length) {
          throw new Error("Incomplete or corrupt PNG file");
        }
      }
      return;
    }

    PNG.prototype.read = function(bytes) {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) {
        _results.push(this.data[this.pos++]);
      }
      return _results;
    };

    PNG.prototype.readUInt32 = function() {
      var b1, b2, b3, b4;
      b1 = this.data[this.pos++] << 24;
      b2 = this.data[this.pos++] << 16;
      b3 = this.data[this.pos++] << 8;
      b4 = this.data[this.pos++];
      return b1 | b2 | b3 | b4;
    };

    PNG.prototype.readUInt16 = function() {
      var b1, b2;
      b1 = this.data[this.pos++] << 8;
      b2 = this.data[this.pos++];
      return b1 | b2;
    };

    PNG.prototype.decodePixels = function(data) {
      var abyte, c, col, i, left, length, p, pa, paeth, pb, pc, pixelBytes, pixels, pos, row, scanlineLength, upper, upperLeft, _i, _j, _k, _l, _m;
      if (data == null) {
        data = this.imgData;
      }
      if (data.length === 0) {
        return new Uint8Array(0);
      }
      data = new FlateStream(data);
      data = data.getBytes();
      pixelBytes = this.pixelBitlength / 8;
      scanlineLength = pixelBytes * this.width;
      pixels = new Uint8Array(scanlineLength * this.height);
      length = data.length;
      row = 0;
      pos = 0;
      c = 0;
      while (pos < length) {
        switch (data[pos++]) {
          case 0:
            for (i = _i = 0; _i < scanlineLength; i = _i += 1) {
              pixels[c++] = data[pos++];
            }
            break;
          case 1:
            for (i = _j = 0; _j < scanlineLength; i = _j += 1) {
              abyte = data[pos++];
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              pixels[c++] = (abyte + left) % 256;
            }
            break;
          case 2:
            for (i = _k = 0; _k < scanlineLength; i = _k += 1) {
              abyte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
              pixels[c++] = (upper + abyte) % 256;
            }
            break;
          case 3:
            for (i = _l = 0; _l < scanlineLength; i = _l += 1) {
              abyte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
              pixels[c++] = (abyte + Math.floor((left + upper) / 2)) % 256;
            }
            break;
          case 4:
            for (i = _m = 0; _m < scanlineLength; i = _m += 1) {
              abyte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              if (row === 0) {
                upper = upperLeft = 0;
              } else {
                upper = pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                upperLeft = col && pixels[(row - 1) * scanlineLength + (col - 1) * pixelBytes + (i % pixelBytes)];
              }
              p = left + upper - upperLeft;
              pa = Math.abs(p - left);
              pb = Math.abs(p - upper);
              pc = Math.abs(p - upperLeft);
              if (pa <= pb && pa <= pc) {
                paeth = left;
              } else if (pb <= pc) {
                paeth = upper;
              } else {
                paeth = upperLeft;
              }
              pixels[c++] = (abyte + paeth) % 256;
            }
            break;
          default:
            throw new Error("Invalid filter algorithm: " + data[pos - 1]);
        }
        row++;
      }
      return pixels;
    };

    PNG.prototype.decodePalette = function() {
      var c, i, length, palette, pos, ret, transparency, _i, _ref, _ref1;
      palette = this.palette;
      transparency = this.transparency.indexed || [];
      ret = new Uint8Array((transparency.length || 0) + palette.length);
      pos = 0;
      length = palette.length;
      c = 0;
      for (i = _i = 0, _ref = palette.length; _i < _ref; i = _i += 3) {
        ret[pos++] = palette[i];
        ret[pos++] = palette[i + 1];
        ret[pos++] = palette[i + 2];
        ret[pos++] = (_ref1 = transparency[c++]) != null ? _ref1 : 255;
      }
      return ret;
    };

    PNG.prototype.copyToImageData = function(imageData, pixels) {
      var alpha, colors, data, i, input, j, k, length, palette, v, _ref;
      colors = this.colors;
      palette = null;
      alpha = this.hasAlphaChannel;
      if (this.palette.length) {
        palette = (_ref = this._decodedPalette) != null ? _ref : this._decodedPalette = this.decodePalette();
        colors = 4;
        alpha = true;
      }
      data = imageData.data || imageData;
      length = data.length;
      input = palette || pixels;
      i = j = 0;
      if (colors === 1) {
        while (i < length) {
          k = palette ? pixels[i / 4] * 4 : j;
          v = input[k++];
          data[i++] = v;
          data[i++] = v;
          data[i++] = v;
          data[i++] = alpha ? input[k++] : 255;
          j = k;
        }
      } else {
        while (i < length) {
          k = palette ? pixels[i / 4] * 4 : j;
          data[i++] = input[k++];
          data[i++] = input[k++];
          data[i++] = input[k++];
          data[i++] = alpha ? input[k++] : 255;
          j = k;
        }
      }
    };

    PNG.prototype.decode = function() {
      var ret;
      ret = new Uint8Array(this.width * this.height * 4);
      this.copyToImageData(ret, this.decodePixels());
      return ret;
    };

    try {
        scratchCanvas = global.document.createElement('canvas');
        scratchCtx = scratchCanvas.getContext('2d');
    } catch(e) {
        return -1;
    }

    makeImage = function(imageData) {
      var img;
      scratchCtx.width = imageData.width;
      scratchCtx.height = imageData.height;
      scratchCtx.clearRect(0, 0, imageData.width, imageData.height);
      scratchCtx.putImageData(imageData, 0, 0);
      img = new Image;
      img.src = scratchCanvas.toDataURL();
      return img;
    };

    PNG.prototype.decodeFrames = function(ctx) {
      var frame, i, imageData, pixels, _i, _len, _ref, _results;
      if (!this.animation) {
        return;
      }
      _ref = this.animation.frames;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        frame = _ref[i];
        imageData = ctx.createImageData(frame.width, frame.height);
        pixels = this.decodePixels(new Uint8Array(frame.data));
        this.copyToImageData(imageData, pixels);
        frame.imageData = imageData;
        _results.push(frame.image = makeImage(imageData));
      }
      return _results;
    };

    PNG.prototype.renderFrame = function(ctx, number) {
      var frame, frames, prev;
      frames = this.animation.frames;
      frame = frames[number];
      prev = frames[number - 1];
      if (number === 0) {
        ctx.clearRect(0, 0, this.width, this.height);
      }
      if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_BACKGROUND) {
        ctx.clearRect(prev.xOffset, prev.yOffset, prev.width, prev.height);
      } else if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_PREVIOUS) {
        ctx.putImageData(prev.imageData, prev.xOffset, prev.yOffset);
      }
      if (frame.blendOp === APNG_BLEND_OP_SOURCE) {
        ctx.clearRect(frame.xOffset, frame.yOffset, frame.width, frame.height);
      }
      return ctx.drawImage(frame.image, frame.xOffset, frame.yOffset);
    };

    PNG.prototype.animate = function(ctx) {
      var doFrame, frameNumber, frames, numFrames, numPlays, _ref,
        _this = this;
      frameNumber = 0;
      _ref = this.animation, numFrames = _ref.numFrames, frames = _ref.frames, numPlays = _ref.numPlays;
      return (doFrame = function() {
        var f, frame;
        f = frameNumber++ % numFrames;
        frame = frames[f];
        _this.renderFrame(ctx, f);
        if (numFrames > 1 && frameNumber / numFrames < numPlays) {
          return _this.animation._timeout = setTimeout(doFrame, frame.delay);
        }
      })();
    };

    PNG.prototype.stopAnimation = function() {
      var _ref;
      return clearTimeout((_ref = this.animation) != null ? _ref._timeout : void 0);
    };

    PNG.prototype.render = function(canvas) {
      var ctx, data;
      if (canvas._png) {
        canvas._png.stopAnimation();
      }
      canvas._png = this;
      canvas.width = this.width;
      canvas.height = this.height;
      ctx = canvas.getContext("2d");
      if (this.animation) {
        this.decodeFrames(ctx);
        return this.animate(ctx);
      } else {
        data = ctx.createImageData(this.width, this.height);
        this.copyToImageData(data, this.decodePixels());
        return ctx.putImageData(data, 0, 0);
      }
    };

    return PNG;

  })();

  global.PNG = PNG;

})(typeof window !== "undefined" && window || this);
/** @preserve
 * jsPDF - PDF Document creation from JavaScript
 * Version ${versionID}
 *                           CommitID ${commitID}
 *
 * Copyright (c) 2010-2014 James Hall, https://github.com/MrRio/jsPDF
 *               2010 Aaron Spike, https://github.com/acspike
 *               2012 Willow Systems Corporation, willow-systems.com
 *               2012 Pablo Hess, https://github.com/pablohess
 *               2012 Florian Jenett, https://github.com/fjenett
 *               2013 Warren Weckesser, https://github.com/warrenweckesser
 *               2013 Youssef Beddad, https://github.com/lifof
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2013 Stefan Slonevskiy, https://github.com/stefslon
 *               2013 Jeremy Morel, https://github.com/jmorel
 *               2013 Christoph Hartmann, https://github.com/chris-rock
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Makes, https://github.com/dollaruw
 *               2014 Diego Casorran, https://github.com/diegocr
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Contributor(s):
 *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
 *    kim3er, mfo, alnorth,
 */

/**
 * Creates new jsPDF document object instance.
 *
 * @class
 * @param orientation One of "portrait" or "landscape" (or shortcuts "p" (Default), "l")
 * @param unit        Measurement unit to be used when coordinates are specified.
 *                    One of "pt" (points), "mm" (Default), "cm", "in"
 * @param format      One of 'pageFormats' as shown below, default: a4
 * @returns {jsPDF}
 * @name jsPDF
 */
var jsPDF = (function(global) {
	'use strict';
	var pdfVersion = '1.3',
		pageFormats = { // Size in pt of various paper formats
			'a0'  : [2383.94, 3370.39], 'a1'  : [1683.78, 2383.94],
			'a2'  : [1190.55, 1683.78], 'a3'  : [ 841.89, 1190.55],
			'a4'  : [ 595.28,  841.89], 'a5'  : [ 419.53,  595.28],
			'a6'  : [ 297.64,  419.53], 'a7'  : [ 209.76,  297.64],
			'a8'  : [ 147.40,  209.76], 'a9'  : [ 104.88,  147.40],
			'a10' : [  73.70,  104.88], 'b0'  : [2834.65, 4008.19],
			'b1'  : [2004.09, 2834.65], 'b2'  : [1417.32, 2004.09],
			'b3'  : [1000.63, 1417.32], 'b4'  : [ 708.66, 1000.63],
			'b5'  : [ 498.90,  708.66], 'b6'  : [ 354.33,  498.90],
			'b7'  : [ 249.45,  354.33], 'b8'  : [ 175.75,  249.45],
			'b9'  : [ 124.72,  175.75], 'b10' : [  87.87,  124.72],
			'c0'  : [2599.37, 3676.54], 'c1'  : [1836.85, 2599.37],
			'c2'  : [1298.27, 1836.85], 'c3'  : [ 918.43, 1298.27],
			'c4'  : [ 649.13,  918.43], 'c5'  : [ 459.21,  649.13],
			'c6'  : [ 323.15,  459.21], 'c7'  : [ 229.61,  323.15],
			'c8'  : [ 161.57,  229.61], 'c9'  : [ 113.39,  161.57],
			'c10' : [  79.37,  113.39], 'dl'  : [ 311.81,  623.62],
			'letter'            : [612,   792],
			'government-letter' : [576,   756],
			'legal'             : [612,  1008],
			'junior-legal'      : [576,   360],
			'ledger'            : [1224,  792],
			'tabloid'           : [792,  1224],
			'credit-card'       : [153,   243]
		};

	/**
	 * jsPDF's Internal PubSub Implementation.
	 * See mrrio.github.io/jsPDF/doc/symbols/PubSub.html
	 * Backward compatible rewritten on 2014 by
	 * Diego Casorran, https://github.com/diegocr
	 *
	 * @class
	 * @name PubSub
	 */
	function PubSub(context) {
		var topics = {};

		this.subscribe = function(topic, callback, once) {
			if(typeof callback !== 'function') {
				return false;
			}

			if(!topics.hasOwnProperty(topic)) {
				topics[topic] = {};
			}

			var id = Math.random().toString(35);
			topics[topic][id] = [callback,!!once];

			return id;
		};

		this.unsubscribe = function(token) {
			for(var topic in topics) {
				if(topics[topic][token]) {
					delete topics[topic][token];
					return true;
				}
			}
			return false;
		};

		this.publish = function(topic) {
			if(topics.hasOwnProperty(topic)) {
				var args = Array.prototype.slice.call(arguments, 1), idr = [];

				for(var id in topics[topic]) {
					var sub = topics[topic][id];
					try {
						sub[0].apply(context, args);
					} catch(ex) {
						if(global.console) {
							console.error('jsPDF PubSub Error', ex.message, ex);
						}
					}
					if(sub[1]) idr.push(id);
				}
				if(idr.length) idr.forEach(this.unsubscribe);
			}
		};
	}

	/**
	 * @constructor
	 * @private
	 */
	function jsPDF(orientation, unit, format, compressPdf) {
		var options = {};

		if (typeof orientation === 'object') {
			options = orientation;

			orientation = options.orientation;
			unit = options.unit || unit;
			format = options.format || format;
			compressPdf = options.compress || options.compressPdf || compressPdf;
		}

		// Default options
		unit        = unit || 'mm';
		format      = format || 'a4';
		orientation = ('' + (orientation || 'P')).toLowerCase();

		var format_as_string = ('' + format).toLowerCase(),
			compress = !!compressPdf && typeof Uint8Array === 'function',
			textColor            = options.textColor  || '0 g',
			drawColor            = options.drawColor  || '0 G',
			activeFontSize       = options.fontSize   || 16,
			lineHeightProportion = options.lineHeight || 1.15,
			lineWidth            = options.lineWidth  || 0.200025, // 2mm
			objectNumber =  2,  // 'n' Current object number
			outToPages   = !1,  // switches where out() prints. outToPages true = push to pages obj. outToPages false = doc builder content
			offsets      = [],  // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
			fonts        = {},  // collection of font objects, where key is fontKey - a dynamically created label for a given font.
			fontmap      = {},  // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
			activeFontKey,      // will be string representing the KEY of the font as combination of fontName + fontStyle
			k,                  // Scale factor
			tmp,
			page = 0,
			pages = [],
			content = [],
			lineCapID = 0,
			lineJoinID = 0,
			content_length = 0,
			pageWidth,
			pageHeight,
			documentProperties = {
				'title'    : '',
				'subject'  : '',
				'author'   : '',
				'keywords' : '',
				'creator'  : ''
			},
			API = {},
			events = new PubSub(API),

		/////////////////////
		// Private functions
		/////////////////////
		f2 = function(number) {
			return number.toFixed(2); // Ie, %.2f
		},
		f3 = function(number) {
			return number.toFixed(3); // Ie, %.3f
		},
		padd2 = function(number) {
			return ('0' + parseInt(number)).slice(-2);
		},
		out = function(string) {
			if (outToPages) {
				/* set by beginPage */
				pages[page].push(string);
			} else {
				// +1 for '\n' that will be used to join 'content'
				content_length += string.length + 1;
				content.push(string);
			}
		},
		newObject = function() {
			// Begin a new object
			objectNumber++;
			offsets[objectNumber] = content_length;
			out(objectNumber + ' 0 obj');
			return objectNumber;
		},
		putStream = function(str) {
			out('stream');
			out(str);
			out('endstream');
		},
		putPages = function() {
			var n,p,arr,i,deflater,adler32,wPt = pageWidth * k, hPt = pageHeight * k, adler32cs;

			adler32cs = global.adler32cs || jsPDF.adler32cs;
			if (compress && typeof adler32cs === 'undefined') {
				compress = false;
			}

			// outToPages = false as set in endDocument(). out() writes to content.

			for (n = 1; n <= page; n++) {
				newObject();
				out('<</Type /Page');
				out('/Parent 1 0 R');
				out('/Resources 2 0 R');
				out('/Contents ' + (objectNumber + 1) + ' 0 R>>');
				out('endobj');

				// Page content
				p = pages[n].join('\n');
				newObject();
				if (compress) {
					arr = [];
					i = p.length;
					while(i--) {
						arr[i] = p.charCodeAt(i);
					}
					adler32 = adler32cs.from(p);
					deflater = new Deflater(6);
					deflater.append(new Uint8Array(arr));
					p = deflater.flush();
					arr = new Uint8Array(p.length + 6);
					arr.set(new Uint8Array([120, 156])),
					arr.set(p, 2);
					arr.set(new Uint8Array([adler32 & 0xFF, (adler32 >> 8) & 0xFF, (adler32 >> 16) & 0xFF, (adler32 >> 24) & 0xFF]), p.length+2);
					p = String.fromCharCode.apply(null, arr);
					out('<</Length ' + p.length + ' /Filter [/FlateDecode]>>');
				} else {
					out('<</Length ' + p.length + '>>');
				}
				putStream(p);
				out('endobj');
			}
			offsets[1] = content_length;
			out('1 0 obj');
			out('<</Type /Pages');
			var kids = '/Kids [';
			for (i = 0; i < page; i++) {
				kids += (3 + 2 * i) + ' 0 R ';
			}
			out(kids + ']');
			out('/Count ' + page);
			out('/MediaBox [0 0 ' + f2(wPt) + ' ' + f2(hPt) + ']');
			out('>>');
			out('endobj');
		},
		putFont = function(font) {
			font.objectNumber = newObject();
			out('<</BaseFont/' + font.PostScriptName + '/Type/Font');
			if (typeof font.encoding === 'string') {
				out('/Encoding/' + font.encoding);
			}
			out('/Subtype/Type1>>');
			out('endobj');
		},
		putFonts = function() {
			for (var fontKey in fonts) {
				if (fonts.hasOwnProperty(fontKey)) {
					putFont(fonts[fontKey]);
				}
			}
		},
		putXobjectDict = function() {
			// Loop through images, or other data objects
			events.publish('putXobjectDict');
		},
		putResourceDictionary = function() {
			out('/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]');
			out('/Font <<');

			// Do this for each font, the '1' bit is the index of the font
			for (var fontKey in fonts) {
				if (fonts.hasOwnProperty(fontKey)) {
					out('/' + fontKey + ' ' + fonts[fontKey].objectNumber + ' 0 R');
				}
			}
			out('>>');
			out('/XObject <<');
			putXobjectDict();
			out('>>');
		},
		putResources = function() {
			putFonts();
			events.publish('putResources');
			// Resource dictionary
			offsets[2] = content_length;
			out('2 0 obj');
			out('<<');
			putResourceDictionary();
			out('>>');
			out('endobj');
			events.publish('postPutResources');
		},
		addToFontDictionary = function(fontKey, fontName, fontStyle) {
			// this is mapping structure for quick font key lookup.
			// returns the KEY of the font (ex: "F1") for a given
			// pair of font name and type (ex: "Arial". "Italic")
			if (!fontmap.hasOwnProperty(fontName)) {
				fontmap[fontName] = {};
			}
			fontmap[fontName][fontStyle] = fontKey;
		},
		/**
		 * FontObject describes a particular font as member of an instnace of jsPDF
		 *
		 * It's a collection of properties like 'id' (to be used in PDF stream),
		 * 'fontName' (font's family name), 'fontStyle' (font's style variant label)
		 *
		 * @class
		 * @public
		 * @property id {String} PDF-document-instance-specific label assinged to the font.
		 * @property PostScriptName {String} PDF specification full name for the font
		 * @property encoding {Object} Encoding_name-to-Font_metrics_object mapping.
		 * @name FontObject
		 */
		addFont = function(PostScriptName, fontName, fontStyle, encoding) {
			var fontKey = 'F' + (Object.keys(fonts).length + 1).toString(10),
			// This is FontObject
			font = fonts[fontKey] = {
				'id'             : fontKey,
				'PostScriptName' : PostScriptName,
				'fontName'       : fontName,
				'fontStyle'      : fontStyle,
				'encoding'       : encoding,
				'metadata'       : {}
			};
			addToFontDictionary(fontKey, fontName, fontStyle);
			events.publish('addFont', font);

			return fontKey;
		},
		addFonts = function() {

			var HELVETICA     = "helvetica",
				TIMES         = "times",
				COURIER       = "courier",
				NORMAL        = "normal",
				BOLD          = "bold",
				ITALIC        = "italic",
				BOLD_ITALIC   = "bolditalic",
				encoding      = 'StandardEncoding',
				standardFonts = [
					['Helvetica', HELVETICA, NORMAL],
					['Helvetica-Bold', HELVETICA, BOLD],
					['Helvetica-Oblique', HELVETICA, ITALIC],
					['Helvetica-BoldOblique', HELVETICA, BOLD_ITALIC],
					['Courier', COURIER, NORMAL],
					['Courier-Bold', COURIER, BOLD],
					['Courier-Oblique', COURIER, ITALIC],
					['Courier-BoldOblique', COURIER, BOLD_ITALIC],
					['Times-Roman', TIMES, NORMAL],
					['Times-Bold', TIMES, BOLD],
					['Times-Italic', TIMES, ITALIC],
					['Times-BoldItalic', TIMES, BOLD_ITALIC]
				];

			for (var i = 0, l = standardFonts.length; i < l; i++) {
				var fontKey = addFont(
						standardFonts[i][0],
						standardFonts[i][1],
						standardFonts[i][2],
						encoding);

				// adding aliases for standard fonts, this time matching the capitalization
				var parts = standardFonts[i][0].split('-');
				addToFontDictionary(fontKey, parts[0], parts[1] || '');
			}
			events.publish('addFonts', { fonts : fonts, dictionary : fontmap });
		},
		SAFE = function __safeCall(fn) {
			fn.foo = function __safeCallWrapper() {
				try {
					return fn.apply(this, arguments);
				} catch (e) {
					var stack = e.stack || '';
					if(~stack.indexOf(' at ')) stack = stack.split(" at ")[1];
					var m = "Error in function " + stack.split("\n")[0].split('<')[0] + ": " + e.message;
					if(global.console) {
						global.console.error(m, e);
						if(global.alert) alert(m);
					} else {
						throw new Error(m);
					}
				}
			};
			fn.foo.bar = fn;
			return fn.foo;
		},
		to8bitStream = function(text, flags) {
		/**
		 * PDF 1.3 spec:
		 * "For text strings encoded in Unicode, the first two bytes must be 254 followed by
		 * 255, representing the Unicode byte order marker, U+FEFF. (This sequence conflicts
		 * with the PDFDocEncoding character sequence thorn ydieresis, which is unlikely
		 * to be a meaningful beginning of a word or phrase.) The remainder of the
		 * string consists of Unicode character codes, according to the UTF-16 encoding
		 * specified in the Unicode standard, version 2.0. Commonly used Unicode values
		 * are represented as 2 bytes per character, with the high-order byte appearing first
		 * in the string."
		 *
		 * In other words, if there are chars in a string with char code above 255, we
		 * recode the string to UCS2 BE - string doubles in length and BOM is prepended.
		 *
		 * HOWEVER!
		 * Actual *content* (body) text (as opposed to strings used in document properties etc)
		 * does NOT expect BOM. There, it is treated as a literal GID (Glyph ID)
		 *
		 * Because of Adobe's focus on "you subset your fonts!" you are not supposed to have
		 * a font that maps directly Unicode (UCS2 / UTF16BE) code to font GID, but you could
		 * fudge it with "Identity-H" encoding and custom CIDtoGID map that mimics Unicode
		 * code page. There, however, all characters in the stream are treated as GIDs,
		 * including BOM, which is the reason we need to skip BOM in content text (i.e. that
		 * that is tied to a font).
		 *
		 * To signal this "special" PDFEscape / to8bitStream handling mode,
		 * API.text() function sets (unless you overwrite it with manual values
		 * given to API.text(.., flags) )
		 * flags.autoencode = true
		 * flags.noBOM = true
		 *
		 * ===================================================================================
		 * `flags` properties relied upon:
		 *   .sourceEncoding = string with encoding label.
		 *                     "Unicode" by default. = encoding of the incoming text.
		 *                     pass some non-existing encoding name
		 *                     (ex: 'Do not touch my strings! I know what I am doing.')
		 *                     to make encoding code skip the encoding step.
		 *   .outputEncoding = Either valid PDF encoding name
		 *                     (must be supported by jsPDF font metrics, otherwise no encoding)
		 *                     or a JS object, where key = sourceCharCode, value = outputCharCode
		 *                     missing keys will be treated as: sourceCharCode === outputCharCode
		 *   .noBOM
		 *       See comment higher above for explanation for why this is important
		 *   .autoencode
		 *       See comment higher above for explanation for why this is important
		 */

			var i,l,sourceEncoding,encodingBlock,outputEncoding,newtext,isUnicode,ch,bch;

			flags = flags || {};
			sourceEncoding = flags.sourceEncoding || 'Unicode';
			outputEncoding = flags.outputEncoding;

			// This 'encoding' section relies on font metrics format
			// attached to font objects by, among others,
			// "Willow Systems' standard_font_metrics plugin"
			// see jspdf.plugin.standard_font_metrics.js for format
			// of the font.metadata.encoding Object.
			// It should be something like
			//   .encoding = {'codePages':['WinANSI....'], 'WinANSI...':{code:code, ...}}
			//   .widths = {0:width, code:width, ..., 'fof':divisor}
			//   .kerning = {code:{previous_char_code:shift, ..., 'fof':-divisor},...}
			if ((flags.autoencode || outputEncoding) &&
				fonts[activeFontKey].metadata &&
				fonts[activeFontKey].metadata[sourceEncoding] &&
				fonts[activeFontKey].metadata[sourceEncoding].encoding) {
				encodingBlock = fonts[activeFontKey].metadata[sourceEncoding].encoding;

				// each font has default encoding. Some have it clearly defined.
				if (!outputEncoding && fonts[activeFontKey].encoding) {
					outputEncoding = fonts[activeFontKey].encoding;
				}

				// Hmmm, the above did not work? Let's try again, in different place.
				if (!outputEncoding && encodingBlock.codePages) {
					outputEncoding = encodingBlock.codePages[0]; // let's say, first one is the default
				}

				if (typeof outputEncoding === 'string') {
					outputEncoding = encodingBlock[outputEncoding];
				}
				// we want output encoding to be a JS Object, where
				// key = sourceEncoding's character code and
				// value = outputEncoding's character code.
				if (outputEncoding) {
					isUnicode = false;
					newtext = [];
					for (i = 0, l = text.length; i < l; i++) {
						ch = outputEncoding[text.charCodeAt(i)];
						if (ch) {
							newtext.push(
								String.fromCharCode(ch));
						} else {
							newtext.push(
								text[i]);
						}

						// since we are looping over chars anyway, might as well
						// check for residual unicodeness
						if (newtext[i].charCodeAt(0) >> 8) {
							/* more than 255 */
							isUnicode = true;
						}
					}
					text = newtext.join('');
				}
			}

			i = text.length;
			// isUnicode may be set to false above. Hence the triple-equal to undefined
			while (isUnicode === undefined && i !== 0) {
				if (text.charCodeAt(i - 1) >> 8) {
					/* more than 255 */
					isUnicode = true;
				}
				i--;
			}
			if (!isUnicode) {
				return text;
			}

			newtext = flags.noBOM ? [] : [254, 255];
			for (i = 0, l = text.length; i < l; i++) {
				ch = text.charCodeAt(i);
				bch = ch >> 8; // divide by 256
				if (bch >> 8) {
					/* something left after dividing by 256 second time */
					throw new Error("Character at position " + i + " of string '"
						+ text + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
				}
				newtext.push(bch);
				newtext.push(ch - (bch << 8));
			}
			return String.fromCharCode.apply(undefined, newtext);
		},
		pdfEscape = function(text, flags) {
			/**
			 * Replace '/', '(', and ')' with pdf-safe versions
			 *
			 * Doing to8bitStream does NOT make this PDF display unicode text. For that
			 * we also need to reference a unicode font and embed it - royal pain in the rear.
			 *
			 * There is still a benefit to to8bitStream - PDF simply cannot handle 16bit chars,
			 * which JavaScript Strings are happy to provide. So, while we still cannot display
			 * 2-byte characters property, at least CONDITIONALLY converting (entire string containing)
			 * 16bit chars to (USC-2-BE) 2-bytes per char + BOM streams we ensure that entire PDF
			 * is still parseable.
			 * This will allow immediate support for unicode in document properties strings.
			 */
			return to8bitStream(text, flags).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
		},
		putInfo = function() {
			out('/Producer (jsPDF ' + jsPDF.version + ')');
			for(var key in documentProperties) {
				if(documentProperties.hasOwnProperty(key) && documentProperties[key]) {
					out('/'+key.substr(0,1).toUpperCase() + key.substr(1)
						+' (' + pdfEscape(documentProperties[key]) + ')');
				}
			}
			var created = new Date();
			out(['/CreationDate (D:',
					created.getFullYear(),
					padd2(created.getMonth() + 1),
					padd2(created.getDate()),
					padd2(created.getHours()),
					padd2(created.getMinutes()),
					padd2(created.getSeconds()), ')'].join(''));
		},
		putCatalog = function() {
			out('/Type /Catalog');
			out('/Pages 1 0 R');
			// @TODO: Add zoom and layout modes
			out('/OpenAction [3 0 R /FitH null]');
			out('/PageLayout /OneColumn');
			events.publish('putCatalog');
		},
		putTrailer = function() {
			out('/Size ' + (objectNumber + 1));
			out('/Root ' + objectNumber + ' 0 R');
			out('/Info ' + (objectNumber - 1) + ' 0 R');
		},
		beginPage = function() {
			page++;
			// Do dimension stuff
			outToPages = true;
			pages[page] = [];
		},
		_addPage = function() {
			beginPage();
			// Set line width
			out(f2(lineWidth * k) + ' w');
			// Set draw color
			out(drawColor);
			// resurrecting non-default line caps, joins
			if (lineCapID !== 0) {
				out(lineCapID + ' J');
			}
			if (lineJoinID !== 0) {
				out(lineJoinID + ' j');
			}
			events.publish('addPage', { pageNumber : page });
		},
		/**
		 * Returns a document-specific font key - a label assigned to a
		 * font name + font type combination at the time the font was added
		 * to the font inventory.
		 *
		 * Font key is used as label for the desired font for a block of text
		 * to be added to the PDF document stream.
		 * @private
		 * @function
		 * @param fontName {String} can be undefined on "falthy" to indicate "use current"
		 * @param fontStyle {String} can be undefined on "falthy" to indicate "use current"
		 * @returns {String} Font key.
		 */
		getFont = function(fontName, fontStyle) {
			var key;

			fontName  = fontName  !== undefined ? fontName  : fonts[activeFontKey].fontName;
			fontStyle = fontStyle !== undefined ? fontStyle : fonts[activeFontKey].fontStyle;

			try {
			 // get a string like 'F3' - the KEY corresponding tot he font + type combination.
				key = fontmap[fontName][fontStyle];
			} catch (e) {}

			if (!key) {
				throw new Error("Unable to look up font label for font '" + fontName + "', '"
					+ fontStyle + "'. Refer to getFontList() for available fonts.");
			}
			return key;
		},
		buildDocument = function() {

			outToPages = false; // switches out() to content
			objectNumber = 2;
			content = [];
			offsets = [];

			// putHeader()
			out('%PDF-' + pdfVersion);

			putPages();

			putResources();

			// Info
			newObject();
			out('<<');
			putInfo();
			out('>>');
			out('endobj');

			// Catalog
			newObject();
			out('<<');
			putCatalog();
			out('>>');
			out('endobj');

			// Cross-ref
			var o = content_length, i, p = "0000000000";
			out('xref');
			out('0 ' + (objectNumber + 1));
			out(p+' 65535 f ');
			for (i = 1; i <= objectNumber; i++) {
				out((p + offsets[i]).slice(-10) + ' 00000 n ');
			}
			// Trailer
			out('trailer');
			out('<<');
			putTrailer();
			out('>>');
			out('startxref');
			out(o);
			out('%%EOF');

			outToPages = true;

			return content.join('\n');
		},
		getStyle = function(style) {
			// see path-painting operators in PDF spec
			var op = 'S'; // stroke
			if (style === 'F') {
				op = 'f'; // fill
			} else if (style === 'FD' || style === 'DF') {
				op = 'B'; // both
			} else if (style === 'f' || style === 'f*' || style === 'B' || style === 'B*') {
				/*
				Allow direct use of these PDF path-painting operators:
				- f	fill using nonzero winding number rule
				- f*	fill using even-odd rule
				- B	fill then stroke with fill using non-zero winding number rule
				- B*	fill then stroke with fill using even-odd rule
				*/
				op = style;
			}
			return op;
		},
		getArrayBuffer = function() {
			var data = buildDocument(), len = data.length,
				ab = new ArrayBuffer(len), u8 = new Uint8Array(ab);

			while(len--) u8[len] = data.charCodeAt(len);
			return ab;
		},
		getBlob = function() {
			return new Blob([getArrayBuffer()], { type : "application/pdf" });
		},
		/**
		 * Generates the PDF document.
		 *
		 * If `type` argument is undefined, output is raw body of resulting PDF returned as a string.
		 *
		 * @param {String} type A string identifying one of the possible output types.
		 * @param {Object} options An object providing some additional signalling to PDF generator.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name output
		 */
		output = SAFE(function(type, options) {
			var datauri = ('' + type).substr(0,6) === 'dataur'
				? 'data:application/pdf;base64,'+btoa(buildDocument()):0;

			switch (type) {
				case undefined:
					return buildDocument();
				case 'save':
					if (navigator.getUserMedia) {
						if (global.URL === undefined
						|| global.URL.createObjectURL === undefined) {
							return API.output('dataurlnewwindow');
						}
					}
					saveAs(getBlob(), options);
					if(typeof saveAs.unload === 'function') {
						if(global.setTimeout) {
							setTimeout(saveAs.unload,911);
						}
					}
					break;
				case 'arraybuffer':
					return getArrayBuffer();
				case 'blob':
					return getBlob();
				case 'bloburi':
				case 'bloburl':
					// User is responsible of calling revokeObjectURL
					return global.URL && global.URL.createObjectURL(getBlob()) || void 0;
				case 'datauristring':
				case 'dataurlstring':
					return datauri;
				case 'dataurlnewwindow':
					var nW = global.open(datauri);
					if (nW || typeof safari === "undefined") return nW;
					/* pass through */
				case 'datauri':
				case 'dataurl':
					return global.document.location.href = datauri;
				default:
					throw new Error('Output type "' + type + '" is not supported.');
			}
			// @TODO: Add different output options
		});

		switch (unit) {
			case 'pt':  k = 1;          break;
			case 'mm':  k = 72 / 25.4;  break;
			case 'cm':  k = 72 / 2.54;  break;
			case 'in':  k = 72;         break;
			case 'px':  k = 96 / 72;    break;
			case 'pc':  k = 12;         break;
			case 'em':  k = 12;         break;
			case 'ex':  k = 6;          break;
			default:
				throw ('Invalid unit: ' + unit);
		}

		// Dimensions are stored as user units and converted to points on output
		if (pageFormats.hasOwnProperty(format_as_string)) {
			pageHeight = pageFormats[format_as_string][1] / k;
			pageWidth = pageFormats[format_as_string][0] / k;
		} else {
			try {
				pageHeight = format[1];
				pageWidth = format[0];
			} catch (err) {
				throw new Error('Invalid format: ' + format);
			}
		}

		if (orientation === 'p' || orientation === 'portrait') {
			orientation = 'p';
			if (pageWidth > pageHeight) {
				tmp = pageWidth;
				pageWidth = pageHeight;
				pageHeight = tmp;
			}
		} else if (orientation === 'l' || orientation === 'landscape') {
			orientation = 'l';
			if (pageHeight > pageWidth) {
				tmp = pageWidth;
				pageWidth = pageHeight;
				pageHeight = tmp;
			}
		} else {
			throw('Invalid orientation: ' + orientation);
		}

		//---------------------------------------
		// Public API

		/**
		 * Object exposing internal API to plugins
		 * @public
		 */
		API.internal = {
			'pdfEscape' : pdfEscape,
			'getStyle' : getStyle,
			/**
			 * Returns {FontObject} describing a particular font.
			 * @public
			 * @function
			 * @param fontName {String} (Optional) Font's family name
			 * @param fontStyle {String} (Optional) Font's style variation name (Example:"Italic")
			 * @returns {FontObject}
			 */
			'getFont' : function() {
				return fonts[getFont.apply(API, arguments)];
			},
			'getFontSize' : function() {
				return activeFontSize;
			},
			'getLineHeight' : function() {
				return activeFontSize * lineHeightProportion;
			},
			'write' : function(string1 /*, string2, string3, etc */) {
				out(arguments.length === 1 ? string1 : Array.prototype.join.call(arguments, ' '));
			},
			'getCoordinateString' : function(value) {
				return f2(value * k);
			},
			'getVerticalCoordinateString' : function(value) {
				return f2((pageHeight - value) * k);
			},
			'collections' : {},
			'newObject' : newObject,
			'putStream' : putStream,
			'events' : events,
			// ratio that you use in multiplication of a given "size" number to arrive to 'point'
			// units of measurement.
			// scaleFactor is set at initialization of the document and calculated against the stated
			// default measurement units for the document.
			// If default is "mm", k is the number that will turn number in 'mm' into 'points' number.
			// through multiplication.
			'scaleFactor' : k,
			'pageSize' : {
				'width' : pageWidth,
				'height' : pageHeight
			},
			'output' : function(type, options) {
				return output(type, options);
			},
			'getNumberOfPages' : function() {
				return pages.length - 1;
			},
			'pages' : pages
		};

		/**
		 * Adds (and transfers the focus to) new page to the PDF document.
		 * @function
		 * @returns {jsPDF}
		 *
		 * @methodOf jsPDF#
		 * @name addPage
		 */
		API.addPage = function() {
			_addPage();
			return this;
		};

		/**
		 * Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings.
		 *
		 * @function
		 * @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Object} flags Collection of settings signalling how the text must be encoded. Defaults are sane. If you think you want to pass some flags, you likely can read the source.
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name text
		 */
		API.text = function(text, x, y, flags, angle) {
			/**
			 * Inserts something like this into PDF
			 *   BT
			 *    /F1 16 Tf  % Font name + size
			 *    16 TL % How many units down for next line in multiline text
			 *    0 g % color
			 *    28.35 813.54 Td % position
			 *    (line one) Tj
			 *    T* (line two) Tj
			 *    T* (line three) Tj
			 *   ET
			 */
			function ESC(s) {
				s = s.split("\t").join(Array(options.TabLen||9).join(" "));
				return pdfEscape(s, flags);
			}

			// Pre-August-2012 the order of arguments was function(x, y, text, flags)
			// in effort to make all calls have similar signature like
			//   function(data, coordinates... , miscellaneous)
			// this method had its args flipped.
			// code below allows backward compatibility with old arg order.
			if (typeof text === 'number') {
				tmp = y;
				y = x;
				x = text;
				text = tmp;
			}

			// If there are any newlines in text, we assume
			// the user wanted to print multiple lines, so break the
			// text up into an array.  If the text is already an array,
			// we assume the user knows what they are doing.
			if (typeof text === 'string' && text.match(/[\n\r]/)) {
				text = text.split(/\r\n|\r|\n/g);
			}
			if (typeof flags === 'number') {
				angle = flags;
				flags = null;
			}
			var xtra = '',mode = 'Td';
			if (angle) {
				angle *= (Math.PI / 180);
				var c = Math.cos(angle),
				s = Math.sin(angle);
				xtra = [f2(c), f2(s), f2(s * -1), f2(c), ''].join(" ");
				mode = 'Tm';
			}
			flags = flags || {};
			if (!('noBOM' in flags))
				flags.noBOM = true;
			if (!('autoencode' in flags))
				flags.autoencode = true;

			if (typeof text === 'string') {
				text = ESC(text);
			} else if (text instanceof Array) {
				// we don't want to destroy  original text array, so cloning it
				var sa = text.concat(), da = [], len = sa.length;
				// we do array.join('text that must not be PDFescaped")
				// thus, pdfEscape each component separately
				while (len--) {
					da.push(ESC(sa.shift()));
				}
				text = da.join(") Tj\nT* (");
			} else {
				throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
			}
			// Using "'" ("go next line and render text" mark) would save space but would complicate our rendering code, templates

			// BT .. ET does NOT have default settings for Tf. You must state that explicitely every time for BT .. ET
			// if you want text transformation matrix (+ multiline) to work reliably (which reads sizes of things from font declarations)
			// Thus, there is NO useful, *reliable* concept of "default" font for a page.
			// The fact that "default" (reuse font used before) font worked before in basic cases is an accident
			// - readers dealing smartly with brokenness of jsPDF's markup.
			out(
				'BT\n/' +
				activeFontKey + ' ' + activeFontSize + ' Tf\n' +     // font face, style, size
				(activeFontSize * lineHeightProportion) + ' TL\n' +  // line spacing
				textColor +
				'\n' + xtra + f2(x * k) + ' ' + f2((pageHeight - y) * k) + ' ' + mode + '\n(' +
				text +
				') Tj\nET');
			return this;
		};

		API.line = function(x1, y1, x2, y2) {
			return this.lines([[x2 - x1, y2 - y1]], x1, y1);
		};

		/**
		 * Adds series of curves (straight lines or cubic bezier curves) to canvas, starting at `x`, `y` coordinates.
		 * All data points in `lines` are relative to last line origin.
		 * `x`, `y` become x1,y1 for first line / curve in the set.
		 * For lines you only need to specify [x2, y2] - (ending point) vector against x1, y1 starting point.
		 * For bezier curves you need to specify [x2,y2,x3,y3,x4,y4] - vectors to control points 1, 2, ending point. All vectors are against the start of the curve - x1,y1.
		 *
		 * @example .lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212,110, 10) // line, line, bezier curve, line
		 * @param {Array} lines Array of *vector* shifts as pairs (lines) or sextets (cubic bezier curves).
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} scale (Defaults to [1.0,1.0]) x,y Scaling factor for all vectors. Elements can be any floating number Sub-one makes drawing smaller. Over-one grows the drawing. Negative flips the direction.
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @param {Boolean} closed If true, the path is closed with a straight line from the end of the last curve to the starting point.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name lines
		 */
		API.lines = function(lines, x, y, scale, style, closed) {
			var scalex,scaley,i,l,leg,x2,y2,x3,y3,x4,y4;

			// Pre-August-2012 the order of arguments was function(x, y, lines, scale, style)
			// in effort to make all calls have similar signature like
			//   function(content, coordinateX, coordinateY , miscellaneous)
			// this method had its args flipped.
			// code below allows backward compatibility with old arg order.
			if (typeof lines === 'number') {
				tmp = y;
				y = x;
				x = lines;
				lines = tmp;
			}

			scale = scale || [1, 1];

			// starting point
			out(f3(x * k) + ' ' + f3((pageHeight - y) * k) + ' m ');

			scalex = scale[0];
			scaley = scale[1];
			l = lines.length;
			//, x2, y2 // bezier only. In page default measurement "units", *after* scaling
			//, x3, y3 // bezier only. In page default measurement "units", *after* scaling
			// ending point for all, lines and bezier. . In page default measurement "units", *after* scaling
			x4 = x; // last / ending point = starting point for first item.
			y4 = y; // last / ending point = starting point for first item.

			for (i = 0; i < l; i++) {
				leg = lines[i];
				if (leg.length === 2) {
					// simple line
					x4 = leg[0] * scalex + x4; // here last x4 was prior ending point
					y4 = leg[1] * scaley + y4; // here last y4 was prior ending point
					out(f3(x4 * k) + ' ' + f3((pageHeight - y4) * k) + ' l');
				} else {
					// bezier curve
					x2 = leg[0] * scalex + x4; // here last x4 is prior ending point
					y2 = leg[1] * scaley + y4; // here last y4 is prior ending point
					x3 = leg[2] * scalex + x4; // here last x4 is prior ending point
					y3 = leg[3] * scaley + y4; // here last y4 is prior ending point
					x4 = leg[4] * scalex + x4; // here last x4 was prior ending point
					y4 = leg[5] * scaley + y4; // here last y4 was prior ending point
					out(
						f3(x2 * k) + ' ' +
						f3((pageHeight - y2) * k) + ' ' +
						f3(x3 * k) + ' ' +
						f3((pageHeight - y3) * k) + ' ' +
						f3(x4 * k) + ' ' +
						f3((pageHeight - y4) * k) + ' c');
				}
			}

			if (closed) {
				out(' h');
			}

			// stroking / filling / both the path
			if (style !== null) {
				out(getStyle(style));
			}
			return this;
		};

		/**
		 * Adds a rectangle to PDF
		 *
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} w Width (in units declared at inception of PDF document)
		 * @param {Number} h Height (in units declared at inception of PDF document)
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name rect
		 */
		API.rect = function(x, y, w, h, style) {
			var op = getStyle(style);
			out([
					f2(x * k),
					f2((pageHeight - y) * k),
					f2(w * k),
					f2(-h * k),
					're'
				].join(' '));

			if (style !== null) {
				out(getStyle(style));
			}

			return this;
		};

		/**
		 * Adds a triangle to PDF
		 *
		 * @param {Number} x1 Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y1 Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} x2 Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y2 Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} x3 Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y3 Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name triangle
		 */
		API.triangle = function(x1, y1, x2, y2, x3, y3, style) {
			this.lines(
				[
					[x2 - x1, y2 - y1], // vector to point 2
					[x3 - x2, y3 - y2], // vector to point 3
					[x1 - x3, y1 - y3]// closing vector back to point 1
				],
				x1,
				y1, // start of path
				[1, 1],
				style,
				true);
			return this;
		};

		/**
		 * Adds a rectangle with rounded corners to PDF
		 *
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} w Width (in units declared at inception of PDF document)
		 * @param {Number} h Height (in units declared at inception of PDF document)
		 * @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
		 * @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name roundedRect
		 */
		API.roundedRect = function(x, y, w, h, rx, ry, style) {
			var MyArc = 4 / 3 * (Math.SQRT2 - 1);
			this.lines(
				[
					[(w - 2 * rx), 0],
					[(rx * MyArc), 0, rx, ry - (ry * MyArc), rx, ry],
					[0, (h - 2 * ry)],
					[0, (ry * MyArc),  - (rx * MyArc), ry, -rx, ry],
					[(-w + 2 * rx), 0],
					[ - (rx * MyArc), 0, -rx,  - (ry * MyArc), -rx, -ry],
					[0, (-h + 2 * ry)],
					[0,  - (ry * MyArc), (rx * MyArc), -ry, rx, -ry]
				],
				x + rx,
				y, // start of path
				[1, 1],
				style);
			return this;
		};

		/**
		 * Adds an ellipse to PDF
		 *
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
		 * @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name ellipse
		 */
		API.ellipse = function(x, y, rx, ry, style) {
			var lx = 4 / 3 * (Math.SQRT2 - 1) * rx,
				ly = 4 / 3 * (Math.SQRT2 - 1) * ry;

			out([
					f2((x + rx) * k),
					f2((pageHeight - y) * k),
					'm',
					f2((x + rx) * k),
					f2((pageHeight - (y - ly)) * k),
					f2((x + lx) * k),
					f2((pageHeight - (y - ry)) * k),
					f2(x * k),
					f2((pageHeight - (y - ry)) * k),
					'c'
				].join(' '));
			out([
					f2((x - lx) * k),
					f2((pageHeight - (y - ry)) * k),
					f2((x - rx) * k),
					f2((pageHeight - (y - ly)) * k),
					f2((x - rx) * k),
					f2((pageHeight - y) * k),
					'c'
				].join(' '));
			out([
					f2((x - rx) * k),
					f2((pageHeight - (y + ly)) * k),
					f2((x - lx) * k),
					f2((pageHeight - (y + ry)) * k),
					f2(x * k),
					f2((pageHeight - (y + ry)) * k),
					'c'
				].join(' '));
			out([
					f2((x + lx) * k),
					f2((pageHeight - (y + ry)) * k),
					f2((x + rx) * k),
					f2((pageHeight - (y + ly)) * k),
					f2((x + rx) * k),
					f2((pageHeight - y) * k),
					'c'
				].join(' '));

			if (style !== null) {
				out(getStyle(style));
			}

			return this;
		};

		/**
		 * Adds an circle to PDF
		 *
		 * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
		 * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
		 * @param {Number} r Radius (in units declared at inception of PDF document)
		 * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name circle
		 */
		API.circle = function(x, y, r, style) {
			return this.ellipse(x, y, r, r, style);
		};

		/**
		 * Adds a properties to the PDF document
		 *
		 * @param {Object} A property_name-to-property_value object structure.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setProperties
		 */
		API.setProperties = function(properties) {
			// copying only those properties we can render.
			for (var property in documentProperties) {
				if (documentProperties.hasOwnProperty(property) && properties[property]) {
					documentProperties[property] = properties[property];
				}
			}
			return this;
		};

		/**
		 * Sets font size for upcoming text elements.
		 *
		 * @param {Number} size Font size in points.
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setFontSize
		 */
		API.setFontSize = function(size) {
			activeFontSize = size;
			return this;
		};

		/**
		 * Sets text font face, variant for upcoming text elements.
		 * See output of jsPDF.getFontList() for possible font names, styles.
		 *
		 * @param {String} fontName Font name or family. Example: "times"
		 * @param {String} fontStyle Font style or variant. Example: "italic"
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setFont
		 */
		API.setFont = function(fontName, fontStyle) {
			activeFontKey = getFont(fontName, fontStyle);
			// if font is not found, the above line blows up and we never go further
			return this;
		};

		/**
		 * Switches font style or variant for upcoming text elements,
		 * while keeping the font face or family same.
		 * See output of jsPDF.getFontList() for possible font names, styles.
		 *
		 * @param {String} style Font style or variant. Example: "italic"
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setFontStyle
		 */
		API.setFontStyle = API.setFontType = function(style) {
			activeFontKey = getFont(undefined, style);
			// if font is not found, the above line blows up and we never go further
			return this;
		};

		/**
		 * Returns an object - a tree of fontName to fontStyle relationships available to
		 * active PDF document.
		 *
		 * @public
		 * @function
		 * @returns {Object} Like {'times':['normal', 'italic', ... ], 'arial':['normal', 'bold', ... ], ... }
		 * @methodOf jsPDF#
		 * @name getFontList
		 */
		API.getFontList = function() {
			// TODO: iterate over fonts array or return copy of fontmap instead in case more are ever added.
			var list = {},fontName,fontStyle,tmp;

			for (fontName in fontmap) {
				if (fontmap.hasOwnProperty(fontName)) {
					list[fontName] = tmp = [];
					for (fontStyle in fontmap[fontName]) {
						if (fontmap[fontName].hasOwnProperty(fontStyle)) {
							tmp.push(fontStyle);
						}
					}
				}
			}

			return list;
		};

		/**
		 * Sets line width for upcoming lines.
		 *
		 * @param {Number} width Line width (in units declared at inception of PDF document)
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setLineWidth
		 */
		API.setLineWidth = function(width) {
			out((width * k).toFixed(2) + ' w');
			return this;
		};

		/**
		 * Sets the stroke color for upcoming elements.
		 *
		 * Depending on the number of arguments given, Gray, RGB, or CMYK
		 * color space is implied.
		 *
		 * When only ch1 is given, "Gray" color space is implied and it
		 * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
		 * if values are communicated as String types, or in range from 0 (black)
		 * to 255 (white) if communicated as Number type.
		 * The RGB-like 0-255 range is provided for backward compatibility.
		 *
		 * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
		 * value must be in the range from 0.00 (minimum intensity) to to 1.00
		 * (max intensity) if values are communicated as String types, or
		 * from 0 (min intensity) to to 255 (max intensity) if values are communicated
		 * as Number types.
		 * The RGB-like 0-255 range is provided for backward compatibility.
		 *
		 * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
		 * value must be a in the range from 0.00 (0% concentration) to to
		 * 1.00 (100% concentration)
		 *
		 * Because JavaScript treats fixed point numbers badly (rounds to
		 * floating point nearest to binary representation) it is highly advised to
		 * communicate the fractional numbers as String types, not JavaScript Number type.
		 *
		 * @param {Number|String} ch1 Color channel value
		 * @param {Number|String} ch2 Color channel value
		 * @param {Number|String} ch3 Color channel value
		 * @param {Number|String} ch4 Color channel value
		 *
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setDrawColor
		 */
		API.setDrawColor = function(ch1, ch2, ch3, ch4) {
			var color;
			if (ch2 === undefined || (ch4 === undefined && ch1 === ch2 === ch3)) {
				// Gray color space.
				if (typeof ch1 === 'string') {
					color = ch1 + ' G';
				} else {
					color = f2(ch1 / 255) + ' G';
				}
			} else if (ch4 === undefined) {
				// RGB
				if (typeof ch1 === 'string') {
					color = [ch1, ch2, ch3, 'RG'].join(' ');
				} else {
					color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'RG'].join(' ');
				}
			} else {
				// CMYK
				if (typeof ch1 === 'string') {
					color = [ch1, ch2, ch3, ch4, 'K'].join(' ');
				} else {
					color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'K'].join(' ');
				}
			}

			out(color);
			return this;
		};

		/**
		 * Sets the fill color for upcoming elements.
		 *
		 * Depending on the number of arguments given, Gray, RGB, or CMYK
		 * color space is implied.
		 *
		 * When only ch1 is given, "Gray" color space is implied and it
		 * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
		 * if values are communicated as String types, or in range from 0 (black)
		 * to 255 (white) if communicated as Number type.
		 * The RGB-like 0-255 range is provided for backward compatibility.
		 *
		 * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
		 * value must be in the range from 0.00 (minimum intensity) to to 1.00
		 * (max intensity) if values are communicated as String types, or
		 * from 0 (min intensity) to to 255 (max intensity) if values are communicated
		 * as Number types.
		 * The RGB-like 0-255 range is provided for backward compatibility.
		 *
		 * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
		 * value must be a in the range from 0.00 (0% concentration) to to
		 * 1.00 (100% concentration)
		 *
		 * Because JavaScript treats fixed point numbers badly (rounds to
		 * floating point nearest to binary representation) it is highly advised to
		 * communicate the fractional numbers as String types, not JavaScript Number type.
		 *
		 * @param {Number|String} ch1 Color channel value
		 * @param {Number|String} ch2 Color channel value
		 * @param {Number|String} ch3 Color channel value
		 * @param {Number|String} ch4 Color channel value
		 *
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setFillColor
		 */
		API.setFillColor = function(ch1, ch2, ch3, ch4) {
			var color;

			if (ch2 === undefined || (ch4 === undefined && ch1 === ch2 === ch3)) {
				// Gray color space.
				if (typeof ch1 === 'string') {
					color = ch1 + ' g';
				} else {
					color = f2(ch1 / 255) + ' g';
				}
			} else if (ch4 === undefined) {
				// RGB
				if (typeof ch1 === 'string') {
					color = [ch1, ch2, ch3, 'rg'].join(' ');
				} else {
					color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'rg'].join(' ');
				}
			} else {
				// CMYK
				if (typeof ch1 === 'string') {
					color = [ch1, ch2, ch3, ch4, 'k'].join(' ');
				} else {
					color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'k'].join(' ');
				}
			}

			out(color);
			return this;
		};

		/**
		 * Sets the text color for upcoming elements.
		 * If only one, first argument is given,
		 * treats the value as gray-scale color value.
		 *
		 * @param {Number} r Red channel color value in range 0-255 or {String} r color value in hexadecimal, example: '#FFFFFF'
		 * @param {Number} g Green channel color value in range 0-255
		 * @param {Number} b Blue channel color value in range 0-255
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setTextColor
		 */
		API.setTextColor = function(r, g, b) {
			if ((typeof r === 'string') && /^#[0-9A-Fa-f]{6}$/.test(r)) {
				var hex = parseInt(r.substr(1), 16);
				r = (hex >> 16) & 255;
				g = (hex >> 8) & 255;
				b = (hex & 255);
			}

			if ((r === 0 && g === 0 && b === 0) || (typeof g === 'undefined')) {
				textColor = f3(r / 255) + ' g';
			} else {
				textColor = [f3(r / 255), f3(g / 255), f3(b / 255), 'rg'].join(' ');
			}
			return this;
		};

		/**
		 * Is an Object providing a mapping from human-readable to
		 * integer flag values designating the varieties of line cap
		 * and join styles.
		 *
		 * @returns {Object}
		 * @fieldOf jsPDF#
		 * @name CapJoinStyles
		 */
		API.CapJoinStyles = {
			0 : 0,
			'butt' : 0,
			'but' : 0,
			'miter' : 0,
			1 : 1,
			'round' : 1,
			'rounded' : 1,
			'circle' : 1,
			2 : 2,
			'projecting' : 2,
			'project' : 2,
			'square' : 2,
			'bevel' : 2
		};

		/**
		 * Sets the line cap styles
		 * See {jsPDF.CapJoinStyles} for variants
		 *
		 * @param {String|Number} style A string or number identifying the type of line cap
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setLineCap
		 */
		API.setLineCap = function(style) {
			var id = this.CapJoinStyles[style];
			if (id === undefined) {
				throw new Error("Line cap style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
			}
			lineCapID = id;
			out(id + ' J');

			return this;
		};

		/**
		 * Sets the line join styles
		 * See {jsPDF.CapJoinStyles} for variants
		 *
		 * @param {String|Number} style A string or number identifying the type of line join
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name setLineJoin
		 */
		API.setLineJoin = function(style) {
			var id = this.CapJoinStyles[style];
			if (id === undefined) {
				throw new Error("Line join style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
			}
			lineJoinID = id;
			out(id + ' j');

			return this;
		};

		// Output is both an internal (for plugins) and external function
		API.output = output;

		/**
		 * Saves as PDF document. An alias of jsPDF.output('save', 'filename.pdf')
		 * @param  {String} filename The filename including extension.
		 *
		 * @function
		 * @returns {jsPDF}
		 * @methodOf jsPDF#
		 * @name save
		 */
		API.save = function(filename) {
			API.output('save', filename);
		};

		// applying plugins (more methods) ON TOP of built-in API.
		// this is intentional as we allow plugins to override
		// built-ins
		for (var plugin in jsPDF.API) {
			if (jsPDF.API.hasOwnProperty(plugin)) {
				if (plugin === 'events' && jsPDF.API.events.length) {
					(function(events, newEvents) {

						// jsPDF.API.events is a JS Array of Arrays
						// where each Array is a pair of event name, handler
						// Events were added by plugins to the jsPDF instantiator.
						// These are always added to the new instance and some ran
						// during instantiation.
						var eventname,handler_and_args,i;

						for (i = newEvents.length - 1; i !== -1; i--) {
							// subscribe takes 3 args: 'topic', function, runonce_flag
							// if undefined, runonce is false.
							// users can attach callback directly,
							// or they can attach an array with [callback, runonce_flag]
							// that's what the "apply" magic is for below.
							eventname = newEvents[i][0];
							handler_and_args = newEvents[i][1];
							events.subscribe.apply(
								events,
								[eventname].concat(
									typeof handler_and_args === 'function' ?
										[handler_and_args] : handler_and_args));
						}
					}(events, jsPDF.API.events));
				} else {
					API[plugin] = jsPDF.API[plugin];
				}
			}
		}

		//////////////////////////////////////////////////////
		// continuing initialization of jsPDF Document object
		//////////////////////////////////////////////////////
		// Add the first page automatically
		addFonts();
		activeFontKey = 'F1';
		_addPage();

		events.publish('initialized');
		return API;
	}

	/**
	 * jsPDF.API is a STATIC property of jsPDF class.
	 * jsPDF.API is an object you can add methods and properties to.
	 * The methods / properties you add will show up in new jsPDF objects.
	 *
	 * One property is prepopulated. It is the 'events' Object. Plugin authors can add topics,
	 * callbacks to this object. These will be reassigned to all new instances of jsPDF.
	 * Examples:
	 * jsPDF.API.events['initialized'] = function(){ 'this' is API object }
	 * jsPDF.API.events['addFont'] = function(added_font_object){ 'this' is API object }
	 *
	 * @static
	 * @public
	 * @memberOf jsPDF
	 * @name API
	 *
	 * @example
	 * jsPDF.API.mymethod = function(){
	 *   // 'this' will be ref to internal API object. see jsPDF source
	 *   // , so you can refer to built-in methods like so:
	 *   //     this.line(....)
	 *   //     this.text(....)
	 * }
	 * var pdfdoc = new jsPDF()
	 * pdfdoc.mymethod() // <- !!!!!!
	 */
	jsPDF.API = {events:[]};
	jsPDF.version = "1.0.0-trunk";

	if (typeof define === 'function' && define.amd) {
		define('jsPDF', function() {
			return jsPDF;
		});
	} else {
		global.jsPDF = jsPDF;
	}
	return jsPDF;
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this));
/** @preserve
 * jsPDF addImage plugin
 * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
 *               2013 Chris Dowling, https://github.com/gingerchris
 *               2013 Trinh Ho, https://github.com/ineedfat
 *               2013 Edwin Alejandro Perez, https://github.com/eaparango
 *               2013 Norah Smith, https://github.com/burnburnrocket
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 James Robb, https://github.com/jamesbrobb
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

;(function(jsPDFAPI) {
	//'use strict'

	var namespace = 'addImage_',
		supported_image_types = ['jpeg', 'jpg', 'png'];

	// Image functionality ported from pdf.js
	var putImage = function(img) {

		var objectNumber = this.internal.newObject()
		, out = this.internal.write
		, putStream = this.internal.putStream

		img['n'] = objectNumber

		out('<</Type /XObject')
		out('/Subtype /Image')
		out('/Width ' + img['w'])
		out('/Height ' + img['h'])
		if (img['cs'] === this.color_spaces.INDEXED) {
			out('/ColorSpace [/Indexed /DeviceRGB '
					// if an indexed png defines more than one colour with transparency, we've created a smask
					+ (img['pal'].length / 3 - 1) + ' ' + ('smask' in img ? objectNumber + 2 : objectNumber + 1)
					+ ' 0 R]');
		} else {
			out('/ColorSpace /' + img['cs']);
			if (img['cs'] === this.color_spaces.DEVICE_CMYK) {
				out('/Decode [1 0 1 0 1 0 1 0]');
			}
		}
		out('/BitsPerComponent ' + img['bpc']);
		if ('f' in img) {
			out('/Filter /' + img['f']);
		}
		if ('dp' in img) {
			out('/DecodeParms <<' + img['dp'] + '>>');
		}
		if ('trns' in img && img['trns'].constructor == Array) {
			var trns = '',
				i = 0,
				len = img['trns'].length;
			for (; i < len; i++)
				trns += (img['trns'][i] + ' ' + img['trns'][i] + ' ');
			out('/Mask [' + trns + ']');
		}
		if ('smask' in img) {
			out('/SMask ' + (objectNumber + 1) + ' 0 R');
		}
		out('/Length ' + img['data'].length + '>>');

		putStream(img['data']);

		out('endobj');

		// Soft mask
		if ('smask' in img) {
			var dp = '/Predictor 15 /Colors 1 /BitsPerComponent ' + img['bpc'] + ' /Columns ' + img['w'];
			var smask = {'w': img['w'], 'h': img['h'], 'cs': 'DeviceGray', 'bpc': img['bpc'], 'dp': dp, 'data': img['smask']};
			if ('f' in img)
				smask.f = img['f'];
			putImage.call(this, smask);
		}

	    //Palette
		if (img['cs'] === this.color_spaces.INDEXED) {

			this.internal.newObject();
			//out('<< /Filter / ' + img['f'] +' /Length ' + img['pal'].length + '>>');
			//putStream(zlib.compress(img['pal']));
			out('<< /Length ' + img['pal'].length + '>>');
			putStream(this.arrayBufferToBinaryString(new Uint8Array(img['pal'])));
			out('endobj');
		}
	}
	, putResourcesCallback = function() {
		var images = this.internal.collections[namespace + 'images']
		for ( var i in images ) {
			putImage.call(this, images[i])
		}
	}
	, putXObjectsDictCallback = function(){
		var images = this.internal.collections[namespace + 'images']
		, out = this.internal.write
		, image
		for (var i in images) {
			image = images[i]
			out(
				'/I' + image['i']
				, image['n']
				, '0'
				, 'R'
			)
		}
	}
	, checkCompressValue = function(value) {
		if(value && typeof value === 'string')
			value = value.toUpperCase();
		return value in jsPDFAPI.image_compression ? value : jsPDFAPI.image_compression.NONE;
	}
	, getImages = function() {
		var images = this.internal.collections[namespace + 'images'];
		//first run, so initialise stuff
		if(!images) {
			this.internal.collections[namespace + 'images'] = images = {};
			this.internal.events.subscribe('putResources', putResourcesCallback);
			this.internal.events.subscribe('putXobjectDict', putXObjectsDictCallback);
		}

		return images;
	}
	, getImageIndex = function(images) {
		var imageIndex = 0;

		if (images){
			// this is NOT the first time this method is ran on this instance of jsPDF object.
			imageIndex = Object.keys ?
			Object.keys(images).length :
			(function(o){
				var i = 0
				for (var e in o){if(o.hasOwnProperty(e)){ i++ }}
				return i
			})(images)
		}

		return imageIndex;
	}
	, notDefined = function(value) {
		return typeof value === 'undefined' || value === null;
	}
	, generateAliasFromData = function(data) {
		// TODO: Alias dynamic generation from imageData's checksum/hash
		return undefined;
	}
	, doesNotSupportImageType = function(type) {
		return supported_image_types.indexOf(type) === -1;
	}
	, processMethodNotEnabled = function(type) {
		return typeof jsPDFAPI['process' + type.toUpperCase()] !== 'function';
	}
	, isDOMElement = function(object) {
		return typeof object === 'object' && object.nodeType === 1;
	}
	, createDataURIFromElement = function(element, format) {

		//if element is an image which uses data url defintion, just return the dataurl
		if (element.nodeName === 'IMG' && element.hasAttribute('src')) {
			var src = ''+element.getAttribute('src');
			if (src.indexOf('data:image/') === 0) return src;

			// only if the user doesn't care about a format
			if (!format && /\.png(?:[?#].*)?$/i.test(src)) format = 'png';
		}

		if(element.nodeName === 'CANVAS') {
			var canvas = element;
		} else {
			var canvas = document.createElement('canvas');
			canvas.width = element.clientWidth || element.width;
			canvas.height = element.clientHeight || element.height;

			var ctx = canvas.getContext('2d');
			if (!ctx) {
				throw ('addImage requires canvas to be supported by browser.');
			}
			ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
		}

		return canvas.toDataURL((''+format).toLowerCase() == 'png' ? 'image/png' : 'image/jpeg');
	}
	,checkImagesForAlias = function(imageData, images) {
		var cached_info;
		if(images) {
			for(var e in images) {
				if(imageData === images[e].alias) {
					cached_info = images[e];
					break;
				}
			}
		}
		return cached_info;
	}
	,determineWidthAndHeight = function(w, h, info) {
		if (!w && !h) {
			w = -96;
			h = -96;
		}
		if (w < 0) {
			w = (-1) * info['w'] * 72 / w / this.internal.scaleFactor;
		}
		if (h < 0) {
			h = (-1) * info['h'] * 72 / h / this.internal.scaleFactor;
		}
		if (w === 0) {
			w = h * info['w'] / info['h'];
		}
		if (h === 0) {
			h = w * info['h'] / info['w'];
		}

		return [w, h];
	}
	, writeImageToPDF = function(x, y, w, h, info, index, images) {
		var dims = determineWidthAndHeight.call(this, w, h, info),
			coord = this.internal.getCoordinateString,
			vcoord = this.internal.getVerticalCoordinateString;

		w = dims[0];
		h = dims[1];

		images[index] = info;

		this.internal.write(
			'q'
			, coord(w)
			, '0 0'
			, coord(h) // TODO: check if this should be shifted by vcoord
			, coord(x)
			, vcoord(y + h)
			, 'cm /I'+info['i']
			, 'Do Q'
		)
	};

	/**
	 * COLOR SPACES
	 */
	jsPDFAPI.color_spaces = {
		DEVICE_RGB:'DeviceRGB',
		DEVICE_GRAY:'DeviceGray',
		DEVICE_CMYK:'DeviceCMYK',
		CAL_GREY:'CalGray',
		CAL_RGB:'CalRGB',
		LAB:'Lab',
		ICC_BASED:'ICCBased',
		INDEXED:'Indexed',
		PATTERN:'Pattern',
		SEPERATION:'Seperation',
		DEVICE_N:'DeviceN'
	};

	/**
	 * DECODE METHODS
	 */
	jsPDFAPI.decode = {
		DCT_DECODE:'DCTDecode',
		FLATE_DECODE:'FlateDecode',
		LZW_DECODE:'LZWDecode',
		JPX_DECODE:'JPXDecode',
		JBIG2_DECODE:'JBIG2Decode',
		ASCII85_DECODE:'ASCII85Decode',
		ASCII_HEX_DECODE:'ASCIIHexDecode',
		RUN_LENGTH_DECODE:'RunLengthDecode',
		CCITT_FAX_DECODE:'CCITTFaxDecode'
	};

	/**
	 * IMAGE COMPRESSION TYPES
	 */
	jsPDFAPI.image_compression = {
		NONE: 'NONE',
		FAST: 'FAST',
		MEDIUM: 'MEDIUM',
		SLOW: 'SLOW'
	};

	jsPDFAPI.isString = function(object) {
		return typeof object === 'string';
	};

	/**
	 * Strips out and returns info from a valid base64 data URI
	 * @param {String[dataURI]} a valid data URI of format 'data:[<MIME-type>][;base64],<data>'
	 * @returns an Array containing the following
	 * [0] the complete data URI
	 * [1] <MIME-type>
	 * [2] format - the second part of the mime-type i.e 'png' in 'image/png'
	 * [4] <data>
	 */
	jsPDFAPI.extractInfoFromBase64DataURI = function(dataURI) {
		return /^data:([\w]+?\/([\w]+?));base64,(.+?)$/g.exec(dataURI);
	};

	/**
	 * Check to see if ArrayBuffer is supported
	 */
	jsPDFAPI.supportsArrayBuffer = function() {
		return typeof ArrayBuffer !== 'undefined' && typeof Uint8Array !== 'undefined';
	};

	/**
	 * Tests supplied object to determine if ArrayBuffer
	 * @param {Object[object]}
	 */
	jsPDFAPI.isArrayBuffer = function(object) {
		if(!this.supportsArrayBuffer())
	        return false;
		return object instanceof ArrayBuffer;
	};

	/**
	 * Tests supplied object to determine if it implements the ArrayBufferView (TypedArray) interface
	 * @param {Object[object]}
	 */
	jsPDFAPI.isArrayBufferView = function(object) {
		if(!this.supportsArrayBuffer())
	        return false;
		if(typeof Uint32Array === 'undefined')
			return false;
		return (object instanceof Int8Array ||
				object instanceof Uint8Array ||
				(typeof Uint8ClampedArray !== 'undefined' && object instanceof Uint8ClampedArray) ||
				object instanceof Int16Array ||
				object instanceof Uint16Array ||
				object instanceof Int32Array ||
				object instanceof Uint32Array ||
				object instanceof Float32Array ||
				object instanceof Float64Array );
	};

	/**
	 * Exactly what it says on the tin
	 */
	jsPDFAPI.binaryStringToUint8Array = function(binary_string) {
		/*
		 * not sure how efficient this will be will bigger files. Is there a native method?
		 */
		var len = binary_string.length;
	    var bytes = new Uint8Array( len );
	    for (var i = 0; i < len; i++) {
	        bytes[i] = binary_string.charCodeAt(i);
	    }
	    return bytes;
	};

	/**
	 * @see this discussion
	 * http://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
	 *
	 * As stated, i imagine the method below is highly inefficent for large files.
	 *
	 * Also of note from Mozilla,
	 *
	 * "However, this is slow and error-prone, due to the need for multiple conversions (especially if the binary data is not actually byte-format data, but, for example, 32-bit integers or floats)."
	 *
	 * https://developer.mozilla.org/en-US/Add-ons/Code_snippets/StringView
	 *
	 * Although i'm strugglig to see how StringView solves this issue? Doesn't appear to be a direct method for conversion?
	 *
	 * Async method using Blob and FileReader could be best, but i'm not sure how to fit it into the flow?
	 */
	jsPDFAPI.arrayBufferToBinaryString = function(buffer) {
		if(this.isArrayBuffer(buffer))
			buffer = new Uint8Array(buffer);

	    var binary_string = '';
	    var len = buffer.byteLength;
	    for (var i = 0; i < len; i++) {
	        binary_string += String.fromCharCode(buffer[i]);
	    }
	    return binary_string;
	    /*
	     * Another solution is the method below - convert array buffer straight to base64 and then use atob
	     */
		//return atob(this.arrayBufferToBase64(buffer));
	};

	/**
	 * Converts an ArrayBuffer directly to base64
	 *
	 * Taken from here
	 *
	 * http://jsperf.com/encoding-xhr-image-data/31
	 *
	 * Need to test if this is a better solution for larger files
	 *
	 */
	jsPDFAPI.arrayBufferToBase64 = function(arrayBuffer) {
		var base64    = ''
		var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

		var bytes         = new Uint8Array(arrayBuffer)
		var byteLength    = bytes.byteLength
		var byteRemainder = byteLength % 3
		var mainLength    = byteLength - byteRemainder

		var a, b, c, d
		var chunk

		// Main loop deals with bytes in chunks of 3
		for (var i = 0; i < mainLength; i = i + 3) {
			// Combine the three bytes into a single integer
			chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

			// Use bitmasks to extract 6-bit segments from the triplet
			a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
			b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
			c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
			d = chunk & 63               // 63       = 2^6 - 1

			// Convert the raw binary segments to the appropriate ASCII encoding
			base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
		}

		// Deal with the remaining bytes and padding
		if (byteRemainder == 1) {
			chunk = bytes[mainLength]

			a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

			// Set the 4 least significant bits to zero
			b = (chunk & 3)   << 4 // 3   = 2^2 - 1

			base64 += encodings[a] + encodings[b] + '=='
		} else if (byteRemainder == 2) {
			chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

			a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
			b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

			// Set the 2 least significant bits to zero
			c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

			base64 += encodings[a] + encodings[b] + encodings[c] + '='
		}

		return base64
	};

	jsPDFAPI.createImageInfo = function(data, wd, ht, cs, bpc, f, imageIndex, alias, dp, trns, pal, smask) {
		var info = {
				alias:alias,
				w : wd,
				h : ht,
				cs : cs,
				bpc : bpc,
				i : imageIndex,
				data : data
				// n: objectNumber will be added by putImage code
			};

		if(f) info.f = f;
		if(dp) info.dp = dp;
		if(trns) info.trns = trns;
		if(pal) info.pal = pal;
		if(smask) info.smask = smask;

		return info;
	};

	jsPDFAPI.addImage = function(imageData, format, x, y, w, h, alias, compression) {
		'use strict'

		if(typeof format === 'number') {
			var tmp = h;
			h = w;
			w = y;
			y = x;
			x = format;
			format = tmp;
		}

		var images = getImages.call(this),//initalises internals and events on first run
			dataAsBinaryString;

		compression = checkCompressValue(compression);

		if(notDefined(alias))
			alias = generateAliasFromData(imageData);

		if(isDOMElement(imageData))
			imageData = createDataURIFromElement(imageData, format);

		if(this.isString(imageData)) {

			var base64Info = this.extractInfoFromBase64DataURI(imageData);

			if(base64Info) {

				format = base64Info[2];
				imageData = atob(base64Info[3]);//convert to binary string

			} else {

				if (imageData.charCodeAt(0) === 0x89 &&
				    imageData.charCodeAt(1) === 0x50 &&
				    imageData.charCodeAt(2) === 0x4e &&
				    imageData.charCodeAt(3) === 0x47  )  format = 'png';
			}
		}
		format = (format || 'JPEG').toLowerCase();

		if(doesNotSupportImageType(format))
			throw new Error('addImage currently only supports formats ' + supported_image_types + ', not \''+format+'\'');

		if(processMethodNotEnabled(format))
			throw new Error('please ensure that the plugin for \''+format+'\' support is added');

		/*
		 * need to test if it's more efficent to convert all binary strings
		 * to TypedArray - or should we just leave and process as string?
		 */
		if(this.supportsArrayBuffer()) {
			dataAsBinaryString = imageData;
			imageData = this.binaryStringToUint8Array(imageData);
		}

		var imageIndex = getImageIndex(images),
			info = checkImagesForAlias(dataAsBinaryString || imageData, images);

		if(!info)
			info = this['process' + format.toUpperCase()](imageData, imageIndex, alias, compression, dataAsBinaryString);

		if(!info)
			throw new Error('An unkwown error occurred whilst processing the image');

		writeImageToPDF.call(this, x, y, w, h, info, imageIndex, images);

		return this
	};

	/**
	 * JPEG SUPPORT
	 **/

	//takes a string imgData containing the raw bytes of
	//a jpeg image and returns [width, height]
	//Algorithm from: http://www.64lines.com/jpeg-width-height
	var getJpegSize = function(imgData) {
		'use strict'
		var width, height, numcomponents;
		// Verify we have a valid jpeg header 0xff,0xd8,0xff,0xe0,?,?,'J','F','I','F',0x00
		if (!imgData.charCodeAt(0) === 0xff ||
			!imgData.charCodeAt(1) === 0xd8 ||
			!imgData.charCodeAt(2) === 0xff ||
			!imgData.charCodeAt(3) === 0xe0 ||
			!imgData.charCodeAt(6) === 'J'.charCodeAt(0) ||
			!imgData.charCodeAt(7) === 'F'.charCodeAt(0) ||
			!imgData.charCodeAt(8) === 'I'.charCodeAt(0) ||
			!imgData.charCodeAt(9) === 'F'.charCodeAt(0) ||
			!imgData.charCodeAt(10) === 0x00) {
				throw new Error('getJpegSize requires a binary string jpeg file')
		}
		var blockLength = imgData.charCodeAt(4)*256 + imgData.charCodeAt(5);
		var i = 4, len = imgData.length;
		while ( i < len ) {
			i += blockLength;
			if (imgData.charCodeAt(i) !== 0xff) {
				throw new Error('getJpegSize could not find the size of the image');
			}
			if (imgData.charCodeAt(i+1) === 0xc0 || //(SOF) Huffman  - Baseline DCT
			    imgData.charCodeAt(i+1) === 0xc1 || //(SOF) Huffman  - Extended sequential DCT
			    imgData.charCodeAt(i+1) === 0xc2 || // Progressive DCT (SOF2)
			    imgData.charCodeAt(i+1) === 0xc3 || // Spatial (sequential) lossless (SOF3)
			    imgData.charCodeAt(i+1) === 0xc4 || // Differential sequential DCT (SOF5)
			    imgData.charCodeAt(i+1) === 0xc5 || // Differential progressive DCT (SOF6)
			    imgData.charCodeAt(i+1) === 0xc6 || // Differential spatial (SOF7)
			    imgData.charCodeAt(i+1) === 0xc7) {
				height = imgData.charCodeAt(i+5)*256 + imgData.charCodeAt(i+6);
				width = imgData.charCodeAt(i+7)*256 + imgData.charCodeAt(i+8);
                numcomponents = imgData.charCodeAt(i+9);
				return [width, height, numcomponents];
			} else {
				i += 2;
				blockLength = imgData.charCodeAt(i)*256 + imgData.charCodeAt(i+1)
			}
		}
	}
	, getJpegSizeFromBytes = function(data) {

		var hdr = (data[0] << 8) | data[1];

		if(hdr !== 0xFFD8)
			throw new Error('Supplied data is not a JPEG');

		var len = data.length,
			block = (data[4] << 8) + data[5],
			pos = 4,
			bytes, width, height, numcomponents;

		while(pos < len) {
			pos += block;
			bytes = readBytes(data, pos);
			block = (bytes[2] << 8) + bytes[3];
			if((bytes[1] === 0xC0 || bytes[1] === 0xC2) && bytes[0] === 0xFF && block > 7) {
				bytes = readBytes(data, pos + 5);
				width = (bytes[2] << 8) + bytes[3];
				height = (bytes[0] << 8) + bytes[1];
                numcomponents = bytes[4];
				return {width:width, height:height, numcomponents: numcomponents};
			}

			pos+=2;
		}

		throw new Error('getJpegSizeFromBytes could not find the size of the image');
	}
	, readBytes = function(data, offset) {
		return data.subarray(offset, offset+ 5);
	};

	jsPDFAPI.processJPEG = function(data, index, alias, compression, dataAsBinaryString) {
		'use strict'
		var colorSpace = this.color_spaces.DEVICE_RGB,
			filter = this.decode.DCT_DECODE,
			bpc = 8,
			dims;

		if(this.isString(data)) {
			dims = getJpegSize(data);
			return this.createImageInfo(data, dims[0], dims[1], dims[3] == 1 ? this.color_spaces.DEVICE_GRAY:colorSpace, bpc, filter, index, alias);
		}

		if(this.isArrayBuffer(data))
			data = new Uint8Array(data);

		if(this.isArrayBufferView(data)) {

			dims = getJpegSizeFromBytes(data);

			// if we already have a stored binary string rep use that
			data = dataAsBinaryString || this.arrayBufferToBinaryString(data);

			return this.createImageInfo(data, dims.width, dims.height, dims.numcomponents == 1 ? this.color_spaces.DEVICE_GRAY:colorSpace, bpc, filter, index, alias);
		}

		return null;
	};

	jsPDFAPI.processJPG = function(/*data, index, alias, compression, dataAsBinaryString*/) {
		return this.processJPEG.apply(this, arguments);
	}

})(jsPDF.API);
/**@preserve
 *  ==================================================================== 
 * jsPDF PNG PlugIn
 * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

(function(jsPDFAPI) {
'use strict'
	
	/*
	 * @see http://www.w3.org/TR/PNG-Chunks.html
	 * 
	 Color    Allowed      Interpretation
	 Type     Bit Depths
	   
	   0       1,2,4,8,16  Each pixel is a grayscale sample.
	   
	   2       8,16        Each pixel is an R,G,B triple.
	   
	   3       1,2,4,8     Each pixel is a palette index;
	                       a PLTE chunk must appear.
	   
	   4       8,16        Each pixel is a grayscale sample,
	                       followed by an alpha sample.
	   
	   6       8,16        Each pixel is an R,G,B triple,
	                       followed by an alpha sample.
	*/
	
	/*
	 * PNG filter method types
	 * 
	 * @see http://www.w3.org/TR/PNG-Filters.html
	 * @see http://www.libpng.org/pub/png/book/chapter09.html
	 * 
	 * This is what the value 'Predictor' in decode params relates to
	 * 
	 * 15 is "optimal prediction", which means the prediction algorithm can change from line to line.
	 * In that case, you actually have to read the first byte off each line for the prediction algorthim (which should be 0-4, corresponding to PDF 10-14) and select the appropriate unprediction algorithm based on that byte.
	 *
	   0       None
	   1       Sub
	   2       Up
	   3       Average
	   4       Paeth
	 */
	
	var doesNotHavePngJS = function() {
		return typeof PNG !== 'function' || typeof FlateStream !== 'function';
	}
	, canCompress = function(value) {
		return value !== jsPDFAPI.image_compression.NONE && hasCompressionJS();
	}
	, hasCompressionJS = function() {
		var inst = typeof Deflater === 'function';
		if(!inst)
			throw new Error("requires deflate.js for compression")
		return inst;
	}
	, compressBytes = function(bytes, lineLength, colorsPerPixel, compression) {
		
		var level = 5,
			filter_method = filterUp;
		
		switch(compression) {
		
			case jsPDFAPI.image_compression.FAST:
				
				level = 3;
				filter_method = filterSub;
				break;
				
			case jsPDFAPI.image_compression.MEDIUM:
				
				level = 6;
				filter_method = filterAverage;
				break;
				
			case jsPDFAPI.image_compression.SLOW:
				
				level = 9;
				filter_method = filterPaeth;//uses to sum to choose best filter for each line
				break;
		}
		
		bytes = applyPngFilterMethod(bytes, lineLength, colorsPerPixel, filter_method);
		
		var header = new Uint8Array(createZlibHeader(level));
		var checksum = adler32(bytes);
		
		var deflate = new Deflater(level);
		var a = deflate.append(bytes);
		var cBytes = deflate.flush();
		
		var len = header.length + a.length + cBytes.length;
		
		var cmpd = new Uint8Array(len + 4);
		cmpd.set(header);
		cmpd.set(a, header.length);
		cmpd.set(cBytes, header.length + a.length);
		
		cmpd[len++] = (checksum >>> 24) & 0xff;
		cmpd[len++] = (checksum >>> 16) & 0xff;
		cmpd[len++] = (checksum >>> 8) & 0xff;
		cmpd[len++] = checksum & 0xff;
		
		return jsPDFAPI.arrayBufferToBinaryString(cmpd);
	}
	, createZlibHeader = function(bytes, level){
		/*
		 * @see http://www.ietf.org/rfc/rfc1950.txt for zlib header 
		 */
		var cm = 8;
        var cinfo = Math.LOG2E * Math.log(0x8000) - 8;
        var cmf = (cinfo << 4) | cm;
        
        var hdr = cmf << 8;
        var flevel = Math.min(3, ((level - 1) & 0xff) >> 1);
        
        hdr |= (flevel << 6);
        hdr |= 0;//FDICT
        hdr += 31 - (hdr % 31);
        
        return [cmf, (hdr & 0xff) & 0xff];
	}
	, adler32 = function(array, param) {
		var adler = 1;
	    var s1 = adler & 0xffff,
	        s2 = (adler >>> 16) & 0xffff;
	    var len = array.length;
	    var tlen;
	    var i = 0;

	    while (len > 0) {
	      tlen = len > param ? param : len;
	      len -= tlen;
	      do {
	        s1 += array[i++];
	        s2 += s1;
	      } while (--tlen);

	      s1 %= 65521;
	      s2 %= 65521;
	    }

	    return ((s2 << 16) | s1) >>> 0;
	}
	, applyPngFilterMethod = function(bytes, lineLength, colorsPerPixel, filter_method) {
		var lines = bytes.length / lineLength,
			result = new Uint8Array(bytes.length + lines),
			filter_methods = getFilterMethods(),
			i = 0, line, prevLine, offset;
		
		for(; i < lines; i++) {
			offset = i * lineLength;
			line = bytes.subarray(offset, offset + lineLength);
			
			if(filter_method) {
				result.set(filter_method(line, colorsPerPixel, prevLine), offset + i);
				
			}else{
			
				var j = 0,
					len = filter_methods.length,
					results = [];
				
				for(; j < len; j++)
					results[j] = filter_methods[j](line, colorsPerPixel, prevLine);
				
				var ind = getIndexOfSmallestSum(results.concat());
				
				result.set(results[ind], offset + i);
			}
			
			prevLine = line;
		}
		
		return result;
	}
	, filterNone = function(line, colorsPerPixel, prevLine) {
		/*var result = new Uint8Array(line.length + 1);
		result[0] = 0;
		result.set(line, 1);*/
		
		var result = Array.apply([], line);
		result.unshift(0);

		return result;
	}
	, filterSub = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			left;
		
		result[0] = 1;
		
		for(; i < len; i++) {
			left = line[i - colorsPerPixel] || 0;
			result[i + 1] = (line[i] - left + 0x0100) & 0xff;
		}
		
		return result;
	}
	, filterUp = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			up;
		
		result[0] = 2;
		
		for(; i < len; i++) {
			up = prevLine && prevLine[i] || 0;
			result[i + 1] = (line[i] - up + 0x0100) & 0xff;
		}
		
		return result;
	}
	, filterAverage = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			left,
			up;
	
		result[0] = 3;
		
		for(; i < len; i++) {
			left = line[i - colorsPerPixel] || 0;
			up = prevLine && prevLine[i] || 0;
			result[i + 1] = (line[i] + 0x0100 - ((left + up) >>> 1)) & 0xff;
		}
		
		return result;
	}
	, filterPaeth = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			left,
			up,
			upLeft,
			paeth;
		
		result[0] = 4;
		
		for(; i < len; i++) {
			left = line[i - colorsPerPixel] || 0;
			up = prevLine && prevLine[i] || 0;
			upLeft = prevLine && prevLine[i - colorsPerPixel] || 0;
			paeth = paethPredictor(left, up, upLeft);
			result[i + 1] = (line[i] - paeth + 0x0100) & 0xff;
		}
		
		return result;
	}
	,paethPredictor = function(left, up, upLeft) {

		var p = left + up - upLeft,
	        pLeft = Math.abs(p - left),
	        pUp = Math.abs(p - up),
	        pUpLeft = Math.abs(p - upLeft);
		
		return (pLeft <= pUp && pLeft <= pUpLeft) ? left : (pUp <= pUpLeft) ? up : upLeft;
	}
	, getFilterMethods = function() {
		return [filterNone, filterSub, filterUp, filterAverage, filterPaeth];
	}
	,getIndexOfSmallestSum = function(arrays) {
		var i = 0,
			len = arrays.length,
			sum, min, ind;
		
		while(i < len) {
			sum = absSum(arrays[i].slice(1));
			
			if(sum < min || !min) {
				min = sum;
				ind = i;
			}
			
			i++;
		}
		
		return ind;
	}
	, absSum = function(array) {
		var i = 0,
			len = array.length,
			sum = 0;
	
		while(i < len)
			sum += Math.abs(array[i++]);
			
		return sum;
	}
	, logImg = function(img) {
		console.log("width: " + img.width);
		console.log("height: " + img.height);
		console.log("bits: " + img.bits);
		console.log("colorType: " + img.colorType);
		console.log("transparency:");
		console.log(img.transparency);
		console.log("text:");
		console.log(img.text);
		console.log("compressionMethod: " + img.compressionMethod);
		console.log("filterMethod: " + img.filterMethod);
		console.log("interlaceMethod: " + img.interlaceMethod);
		console.log("imgData:");
		console.log(img.imgData);
		console.log("palette:");
		console.log(img.palette);
		console.log("colors: " + img.colors);
		console.log("colorSpace: " + img.colorSpace);
		console.log("pixelBitlength: " + img.pixelBitlength);
		console.log("hasAlphaChannel: " + img.hasAlphaChannel);
	};
	
	
	
	
	jsPDFAPI.processPNG = function(imageData, imageIndex, alias, compression, dataAsBinaryString) {
		'use strict'
		
		var colorSpace = this.color_spaces.DEVICE_RGB,
			decode = this.decode.FLATE_DECODE,
			bpc = 8,
			img, dp, trns,
			colors, pal, smask;
		
	/*	if(this.isString(imageData)) {
			
		}*/
		
		if(this.isArrayBuffer(imageData))
			imageData = new Uint8Array(imageData);
		
		if(this.isArrayBufferView(imageData)) {
			
			if(doesNotHavePngJS())
				throw new Error("PNG support requires png.js and zlib.js");
				
			img = new PNG(imageData);
			imageData = img.imgData;
			bpc = img.bits;
			colorSpace = img.colorSpace;
			colors = img.colors;
			
			//logImg(img);
			
			/*
			 * colorType 6 - Each pixel is an R,G,B triple, followed by an alpha sample.
			 * 
			 * colorType 4 - Each pixel is a grayscale sample, followed by an alpha sample.
			 * 
			 * Extract alpha to create two separate images, using the alpha as a sMask
			 */
			if([4,6].indexOf(img.colorType) !== -1) {
				
				/*
				 * processes 8 bit RGBA and grayscale + alpha images
				 */
				if(img.bits === 8) {
				
					var pixelsArrayType = window['Uint' + img.pixelBitlength + 'Array'],
						pixels = new pixelsArrayType(img.decodePixels().buffer),
						len = pixels.length,
						imgData = new Uint8Array(len * img.colors),
						alphaData = new Uint8Array(len),
						pDiff = img.pixelBitlength - img.bits,
						i = 0, n = 0, pixel, pbl;
				
					for(; i < len; i++) {
						pixel = pixels[i];
						pbl = 0;
						
						while(pbl < pDiff) {
							
							imgData[n++] = ( pixel >>> pbl ) & 0xff;
							pbl = pbl + img.bits;
						}
						
						alphaData[i] = ( pixel >>> pbl ) & 0xff;
					}
				}
				
				/*
				 * processes 16 bit RGBA and grayscale + alpha images
				 */
				if(img.bits === 16) {
					
					var pixels = new Uint32Array(img.decodePixels().buffer),
						len = pixels.length,
						imgData = new Uint8Array((len * (32 / img.pixelBitlength) ) * img.colors),
						alphaData = new Uint8Array(len * (32 / img.pixelBitlength) ),
						hasColors = img.colors > 1,
						i = 0, n = 0, a = 0, pixel;
					
					while(i < len) {
						pixel = pixels[i++];
						
						imgData[n++] = (pixel >>> 0) & 0xFF;
						
						if(hasColors) {
							imgData[n++] = (pixel >>> 16) & 0xFF;
							
							pixel = pixels[i++];
							imgData[n++] = (pixel >>> 0) & 0xFF;
						}
						
						alphaData[a++] = (pixel >>> 16) & 0xFF;
					}
					
					bpc = 8;
				}
				
				if(canCompress(compression)) {
										
					imageData = compressBytes(imgData, img.width * img.colors, img.colors, compression);
					smask = compressBytes(alphaData, img.width, 1, compression);
					
				}else{
					
					imageData = imgData;
					smask = alphaData;
					decode = null;
				}
			}
			
			/*
			 * Indexed png. Each pixel is a palette index.
			 */
			if(img.colorType === 3) {
				
				colorSpace = this.color_spaces.INDEXED;
				pal = img.palette;
				
				if(img.transparency.indexed) {
					
					var trans = img.transparency.indexed;
					
					var total = 0,
						i = 0,
						len = trans.length;

					for(; i<len; ++i)
					    total += trans[i];
					
					total = total / 255;
					
					/*
					 * a single color is specified as 100% transparent (0),
					 * so we set trns to use a /Mask with that index
					 */
					if(total === len - 1 && trans.indexOf(0) !== -1) {
						trns = [trans.indexOf(0)];
					
					/*
					 * there's more than one colour within the palette that specifies
					 * a transparency value less than 255, so we unroll the pixels to create an image sMask
					 */
					}else if(total !== len){
						
						var pixels = img.decodePixels(),
							alphaData = new Uint8Array(pixels.length),
							i = 0,
							len = pixels.length;
						
						for(; i < len; i++)
							alphaData[i] = trans[pixels[i]];
						
						smask = compressBytes(alphaData, img.width, 1);
					}
				}
			}
			
			if(decode === this.decode.FLATE_DECODE)
				dp = '/Predictor 15 /Colors '+ colors +' /BitsPerComponent '+ bpc +' /Columns '+ img.width;
			else
				//remove 'Predictor' as it applies to the type of png filter applied to its IDAT - we only apply with compression
				dp = '/Colors '+ colors +' /BitsPerComponent '+ bpc +' /Columns '+ img.width;
			
			if(this.isArrayBuffer(imageData) || this.isArrayBufferView(imageData))
				imageData = this.arrayBufferToBinaryString(imageData);
			
			if(smask && this.isArrayBuffer(smask) || this.isArrayBufferView(smask))
				smask = this.arrayBufferToBinaryString(smask);
			
			return this.createImageInfo(imageData, img.width, img.height, colorSpace,
										bpc, decode, imageIndex, alias, dp, trns, pal, smask);
		}
		
		throw new Error("Unsupported PNG image data, try using JPEG instead.");
	}

})(jsPDF.API);
/** @preserve
 * jsPDF split_text_to_size plugin - MIT license.
 * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
 *               2014 Diego Casorran, https://github.com/diegocr
 */
/**
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

;(function(API) {
'use strict'

/**
Returns an array of length matching length of the 'word' string, with each
cell ocupied by the width of the char in that position.

@function
@param word {String}
@param widths {Object}
@param kerning {Object}
@returns {Array}
*/
var getCharWidthsArray = API.getCharWidthsArray = function(text, options){

	if (!options) {
		options = {}
	}

	var widths = options.widths ? options.widths : this.internal.getFont().metadata.Unicode.widths
	, widthsFractionOf = widths.fof ? widths.fof : 1
	, kerning = options.kerning ? options.kerning : this.internal.getFont().metadata.Unicode.kerning
	, kerningFractionOf = kerning.fof ? kerning.fof : 1

	// console.log("widths, kergnings", widths, kerning)

	var i, l
	, char_code
	, prior_char_code = 0 // for kerning
	, default_char_width = widths[0] || widthsFractionOf
	, output = []

	for (i = 0, l = text.length; i < l; i++) {
		char_code = text.charCodeAt(i)
		output.push(
			( widths[char_code] || default_char_width ) / widthsFractionOf +
			( kerning[char_code] && kerning[char_code][prior_char_code] || 0 ) / kerningFractionOf
		)
		prior_char_code = char_code
	}

	return output
}
var getArraySum = function(array){
	var i = array.length
	, output = 0
	while(i){
		;i--;
		output += array[i]
	}
	return output
}
/**
Returns a widths of string in a given font, if the font size is set as 1 point.

In other words, this is "proportional" value. For 1 unit of font size, the length
of the string will be that much.

Multiply by font size to get actual width in *points*
Then divide by 72 to get inches or divide by (72/25.6) to get 'mm' etc.

@public
@function
@param
@returns {Type}
*/
var getStringUnitWidth = API.getStringUnitWidth = function(text, options) {
	return getArraySum(getCharWidthsArray.call(this, text, options))
}

/**
returns array of lines
*/
var splitLongWord = function(word, widths_array, firstLineMaxLen, maxLen){
	var answer = []

	// 1st, chop off the piece that can fit on the hanging line.
	var i = 0
	, l = word.length
	, workingLen = 0
	while (i !== l && workingLen + widths_array[i] < firstLineMaxLen){
		workingLen += widths_array[i]
		;i++;
	}
	// this is first line.
	answer.push(word.slice(0, i))

	// 2nd. Split the rest into maxLen pieces.
	var startOfLine = i
	workingLen = 0
	while (i !== l){
		if (workingLen + widths_array[i] > maxLen) {
			answer.push(word.slice(startOfLine, i))
			workingLen = 0
			startOfLine = i
		}
		workingLen += widths_array[i]
		;i++;
	}
	if (startOfLine !== i) {
		answer.push(word.slice(startOfLine, i))
	}

	return answer
}

// Note, all sizing inputs for this function must be in "font measurement units"
// By default, for PDF, it's "point".
var splitParagraphIntoLines = function(text, maxlen, options){
	// at this time works only on Western scripts, ones with space char
	// separating the words. Feel free to expand.

	if (!options) {
		options = {}
	}

	var line = []
	, lines = [line]
	, line_length = options.textIndent || 0
	, separator_length = 0
	, current_word_length = 0
	, word
	, widths_array
	, words = text.split(' ')
	, spaceCharWidth = getCharWidthsArray(' ', options)[0]
	, i, l, tmp, lineIndent

	if(options.lineIndent === -1) {
		lineIndent = words[0].length +2;
	} else {
		lineIndent = options.lineIndent || 0;
	}
	if(lineIndent) {
		var pad = Array(lineIndent).join(" "), wrds = [];
		words.map(function(wrd) {
			wrd = wrd.split(/\s*\n/);
			if(wrd.length > 1) {
				wrds = wrds.concat(wrd.map(function(wrd, idx) {
					return (idx && wrd.length ? "\n":"") + wrd;
				}));
			} else {
				wrds.push(wrd[0]);
			}
		});
		words = wrds;
		lineIndent = getStringUnitWidth(pad, options);
	}

	for (i = 0, l = words.length; i < l; i++) {
		var force = 0;

		word = words[i]
		if(lineIndent && word[0] == "\n") {
			word = word.substr(1);
			force = 1;
		}
		widths_array = getCharWidthsArray(word, options)
		current_word_length = getArraySum(widths_array)

		if (line_length + separator_length + current_word_length > maxlen || force) {
			if (current_word_length > maxlen) {
				// this happens when you have space-less long URLs for example.
				// we just chop these to size. We do NOT insert hiphens
				tmp = splitLongWord(word, widths_array, maxlen - (line_length + separator_length), maxlen)
				// first line we add to existing line object
				line.push(tmp.shift()) // it's ok to have extra space indicator there
				// last line we make into new line object
				line = [tmp.pop()]
				// lines in the middle we apped to lines object as whole lines
				while(tmp.length){
					lines.push([tmp.shift()]) // single fragment occupies whole line
				}
				current_word_length = getArraySum( widths_array.slice(word.length - line[0].length) )
			} else {
				// just put it on a new line
				line = [word]
			}

			// now we attach new line to lines
			lines.push(line)
			line_length = current_word_length + lineIndent
			separator_length = spaceCharWidth

		} else {
			line.push(word)

			line_length += separator_length + current_word_length
			separator_length = spaceCharWidth
		}
	}

	if(lineIndent) {
		var postProcess = function(ln, idx) {
			return (idx ? pad : '') + ln.join(" ");
		};
	} else {
		var postProcess = function(ln) { return ln.join(" ")};
	}

	return lines.map(postProcess);
}

/**
Splits a given string into an array of strings. Uses 'size' value
(in measurement units declared as default for the jsPDF instance)
and the font's "widths" and "Kerning" tables, where availabe, to
determine display length of a given string for a given font.

We use character's 100% of unit size (height) as width when Width
table or other default width is not available.

@public
@function
@param text {String} Unencoded, regular JavaScript (Unicode, UTF-16 / UCS-2) string.
@param size {Number} Nominal number, measured in units default to this instance of jsPDF.
@param options {Object} Optional flags needed for chopper to do the right thing.
@returns {Array} with strings chopped to size.
*/
API.splitTextToSize = function(text, maxlen, options) {
	'use strict'

	if (!options) {
		options = {}
	}

	var fsize = options.fontSize || this.internal.getFontSize()
	, newOptions = (function(options){
		var widths = {0:1}
		, kerning = {}

		if (!options.widths || !options.kerning) {
			var f = this.internal.getFont(options.fontName, options.fontStyle)
			, encoding = 'Unicode'
			// NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE
			// Actual JavaScript-native String's 16bit char codes used.
			// no multi-byte logic here

			if (f.metadata[encoding]) {
				return {
					widths: f.metadata[encoding].widths || widths
					, kerning: f.metadata[encoding].kerning || kerning
				}
			}
		} else {
			return 	{
				widths: options.widths
				, kerning: options.kerning
			}
		}

		// then use default values
		return 	{
			widths: widths
			, kerning: kerning
		}
	}).call(this, options)

	// first we split on end-of-line chars
	var paragraphs
	if(Array.isArray(text)) {
		paragraphs = text;
	} else {
		paragraphs = text.split(/\r?\n/);
	}

	// now we convert size (max length of line) into "font size units"
	// at present time, the "font size unit" is always 'point'
	// 'proportional' means, "in proportion to font size"
	var fontUnit_maxLen = 1.0 * this.internal.scaleFactor * maxlen / fsize
	// at this time, fsize is always in "points" regardless of the default measurement unit of the doc.
	// this may change in the future?
	// until then, proportional_maxlen is likely to be in 'points'

	// If first line is to be indented (shorter or longer) than maxLen
	// we indicate that by using CSS-style "text-indent" option.
	// here it's in font units too (which is likely 'points')
	// it can be negative (which makes the first line longer than maxLen)
	newOptions.textIndent = options.textIndent ?
		options.textIndent * 1.0 * this.internal.scaleFactor / fsize :
		0
	newOptions.lineIndent = options.lineIndent;

	var i, l
	, output = []
	for (i = 0, l = paragraphs.length; i < l; i++) {
		output = output.concat(
			splitParagraphIntoLines(
				paragraphs[i]
				, fontUnit_maxLen
				, newOptions
			)
		)
	}

	return output
}

})(jsPDF.API);


(function (jsPDFAPI) {
	'use strict';
	jsPDFAPI.hex2rgb = function (hexStr){
		// note: hexStr should be #rrggbb
		hexStr = hexStr.toLowerCase();
		var hex = parseInt(hexStr.substring(1), 16);
		var r = (hex & 0xff0000) >> 16;
		var g = (hex & 0x00ff00) >> 8;
		var b = hex & 0x0000ff;
		return [r, g, b];
	};
	jsPDFAPI.rgb2array = function (rgbStr){
		// note: hexStr should be #rrggbb
		rgbStr = rgbStr.toLowerCase().replace(/\s*/gi,"");
		var rs = rgbStr.match(/rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/);
		return [parseInt(rs[1]), parseInt(rs[2]), parseInt(rs[3])];
	};
	jsPDFAPI.addImage2 = function(props){
		props = $.extend({"_top":150,"id":"t121@","borderSize":1,"borderColor":"rgb(200,200,200)","fillColor":"rgb(0,0,0)","width":0,"height":0,"top":100,"left":50,"right":200},props);
		props._fillColor = this.rgb2array(props.fillColor);
		props._borderColor = this.rgb2array(props.borderColor);
		this.setLineWidth(props.borderSize);
		this.setDrawColor(props._borderColor[0],props._borderColor[1],props._borderColor[2]);
		this.setFillColor(props._fillColor[0],props._fillColor[1],props._fillColor[2]);
		//this.setDrawColor(props._borderColor);			
		//var imgData = getBase64Image(imgLogo[0]);
		this.addImage(props.imgData,'PNG',props.left,props._top,props.width,props.height);		
		this.setDrawColor(0);	
		return null;
	};
	jsPDFAPI.addTriangle = function(props){
		props = $.extend({"_top":150,"id":"t121@","borderSize":1,"borderColor":"rgb(200,200,200)","fillColor":"rgb(0,0,0)","width":0,"height":0,"top":100,"left":50,"right":200},props);
		props._fillColor = this.rgb2array(props.fillColor);
		props._borderColor = this.rgb2array(props.borderColor);
		this.setLineWidth(props.borderSize);
		this.setDrawColor(props._borderColor[0],props._borderColor[1],props._borderColor[2]);
		this.setFillColor(props._fillColor[0],props._fillColor[1],props._fillColor[2]);
		//this.setDrawColor(props._borderColor);
		this.triangle(props.left,(props._top+props.height),props.left+(props.width/2),props._top,(props.left+props.width),(props._top+props.height), 'FD');
		//this.triangle(50,150,100,50, 150, 150, 'FD');
		//this.rect(props.left,props._top,props.width,props.height, 'FD'); // filled red square with black borders
		this.setDrawColor(0);
		return null;
	};
	jsPDFAPI.addRect = function(props){
		this.addElement(props);	
		return null;
	};
	jsPDFAPI.addElement = function(props){
		props = $.extend({"_top":0,"id":"ez121@","borderSize":1,"borderColor":"rgb(200,200,200)","fillColor":"rgb(0,0,0)","width":0,"height":0,"top":0,"left":0},props);
		props._fillColor = this.rgb2array(props.fillColor);
		props._borderColor = this.rgb2array(props.borderColor);
		this.setLineWidth(props.borderSize);
		this.setDrawColor(props._borderColor[0],props._borderColor[1],props._borderColor[2]);
		this.setFillColor(props._fillColor[0],props._fillColor[1],props._fillColor[2]);
		//this.setDrawColor(props._borderColor);
		this.rect(props.left,props._top,props.width,props.height, 'FD'); // filled red square with black borders
		this.setDrawColor(0);
		return null;
	};
	jsPDFAPI.addTextElement = function(props){
		props = $.extend({"_top":0,"type":"text","id":"te121@","textHorizontalAlign":"left","textVerticalAlign":"left","fillColor":"rgb(0,0,0)","fontSize":12,"fontColor":"rgb(0,0,0)","width":0,"height":0,"top":0,"left":0,"text":""},props);
		props._fontColor = this.rgb2array(props.fontColor);
		props._text = props._text || props.text;
		this.setFontSize(props.fontSize);
		this.setTextColor(props._fontColor[0],props._fontColor[1],props._fontColor[2]);
		
		
		var topTmp =  parseInt(props._top)+parseInt(props.height)-5;	
		if(props.height > props.fontSize * 2){			
			var splitText = this.splitTextToSize(props._text,props.width*2+100);
			this.text(parseInt(props.left),topTmp-props.height+10 ,splitText);
		}else{
			this.text(parseInt(props.left),topTmp,props._text+"");
		}		
		
		this.setTextColor(0,0,0);
		this.setFontSize(12);
		return null;
	};

	jsPDFAPI.addTextField = function(props){
		props = $.extend({"_top":0,"type":"textField","id":"tfz121@","textHorizontalAlign":"left","textVerticalAlign":"left","fillColor":"rgb(0,0,0)","fontSize":12,"fontColor":"rgb(0,0,0)","width":0,"height":0,"top":0,"left":0,"text":""},props);
		this.addElement(props);
		this.addTextElement(props);
		return null;
	};	
	jsPDFAPI.addText = function(props){
		props = $.extend({"_top":0,"type":"text","id":"tzww","textHorizontalAlign":"left","textVerticalAlign":"left","fillColor":"rgb(0,0,0)","fontSize":12,"fontColor":"rgb(0,0,0)","width":0,"height":0,"top":0,"left":0,"text":""},props);
		this.addElement(props);
		this.addTextElement(props);
		return null;
	};
	jsPDFAPI.printBand = function (p_dtareport,p_band_index){
		var dtaSetVls = p_dtareport.dataSets[0].itens;
		var tmpLengdtaSet = dtaSetVls.length;
		var bandS = p_dtareport.bands[p_band_index];
		if(tmpLengdtaSet > 0 ){
			/*
			bandS["id"] = bandS.top+"_top";
			bandS["fillColor"] = "#22"+p_band_index+""+p_band_index+"22";
			this.addElement(bandS);	
			*/					
			if(bandS.elements){	
				var bandElements = bandS.elements;
				var tmElements = bandElements.length;
				for(var e = 0 ; e < tmElements ;e++){
					bandElements[e]["height"] = parseInt(bandElements[e]["height"]);
					bandElements[e]["top"] = parseInt(bandElements[e]["top"]);
					bandElements[e]["left"] = parseInt(bandElements[e]["left"]);
					bandElements[e]["width"] = parseInt(bandElements[e]["width"]);
				
				
					bandElements[e]["_top"]  = bandElements[e]["top"]+bandS._top;
					bandElements[e]["_left"] =  bandElements[e]["left"]+bandS.left;
					if(bandElements[e].type=="text"){
						this.addText(bandElements[e]);
					}else if(bandElements[e].type=="textField"){
						bandElements[e]["_text"] = "";
						if(bandElements[e]["text"].indexOf("$F") > -1){
							var strvar = bandElements[e]["text"].match(/\$F\{(.*?)\}/);
							bandElements[e]["_text"] = bandElements[e]["text"].replace(strvar[0],dtaSetVls[0][strvar[1]]);
						}else if(bandElements[e]["text"].indexOf("$V") > -1){
							var strvar = bandElements[e]["text"].match(/\$V\{(.*?)\}/);
							bandElements[e]["_text"] = bandElements[e]["text"].replace(strvar[0],p_dtareport.variables[strvar[1]]);						
						}
						this.addTextField(bandElements[e]);
					}else if(bandElements[e].type=="rect"){
						this.addRect(bandElements[e]);
					}else if(bandElements[e].type=="image"){
						this.addImage2(bandElements[e]);
					}else if(bandElements[e].type=="square"){
						this.addRect(bandElements[e]);
					}else if(bandElements[e].type=="triangle"){
						this.addTriangle(bandElements[e]);
					}
				}
			}
		}
		return null;
	};
	
	
	jsPDFAPI.db2json = function(headerArrayObject){
	
		var arrayObjectC = [];
		var incount = 0;
		for(var chave in headerArrayObject){
			var tmlC = headerArrayObject[chave].length;		 
			for(var x = 0;x<tmlC;x++){
				if(arrayObjectC.length == x){
					arrayObjectC[x] = {};
				}			
				arrayObjectC[x][chave] = headerArrayObject[chave][x];
			}	
		}	
		return arrayObjectC;
	};
	
	
	jsPDFAPI.setJereport = function (pdtareport){
		
		
		
		
		
		var dtareport = {"dataSets":[],"bands":[]};
		
		dtareport.bands = this.db2json(pdtareport.bands);
		dtareport.dataSets = pdtareport.dataSets;
		var listaTipos = ["visual_elements","texts","images"];
		for(var z =0;z<3;z++){
			var tmpElements = this.db2json(pdtareport[listaTipos[z]]);
			var tmpL = tmpElements.length;
			for(var x =0;x<tmpL;x++){
				var tmpElement = tmpElements[x];
				var ntm = 0;
				var bandS = dtareport.bands[tmpElement.band];
				if(bandS["elements"]){
					ntm = bandS.elements.length;
				}else{
					bandS.elements = [];
				}
				bandS.elements[ntm] = tmpElement;
			}
		}
		
		
		
		
		
		
		
		
		
		var dtaSetVls = dtareport.dataSets[0].itens;
		var tmpLengdtaSet = dtaSetVls.length;
		var tmbands = dtareport.bands.length;
		var lastItem = 0;
		dtareport.variables = {
						"pageCount":1
						,"pageSum":1
						,"dateTime":0
						,"date":0
						,"rowCount":0
						,"rowSum":tmpLengdtaSet
					};
		dtareport.variables.rowCount = 0;
		dtareport.variables.pageSum = 1;		
		if(tmpLengdtaSet > 0){
			dtareport.bands[0]["_top"] = 0;
			dtareport.bands[0]["left"] = 0;
			dtareport.bands[0]["_left"] = 0;
			dtareport.bands[0]["height"] = parseInt(dtareport.bands[0]["height"]);
			for(var t = 0 ;t<4;t++){
				dtareport.bands[(t+1)]["left"] = 0;
				dtareport.bands[(t+1)]["_left"] = 0;
				dtareport.bands[(t+1)]["_top"] = dtareport.bands[t]["height"]+dtareport.bands[t]["_top"];
				dtareport.bands[(t+1)]["height"] = parseInt(dtareport.bands[(t+1)]["height"]);
			}
			var bandEt = dtareport.bands[2];
			var maxHeight = 0;
			if(bandEt.elements){
			var bandE = bandEt.elements;
			var tmlItens = bandE.length;
				//calcular o a quantidade de paginas
				for(var z = 0;z < tmlItens; z++){
					bandE[z]["height"] = parseInt(bandE[z]["height"]);
					bandE[z]["top"] = parseInt(bandE[z]["top"]);
					bandE[z]["left"] = parseInt(bandE[z]["left"]);
					bandE[z]["width"] = parseInt(bandE[z]["width"]);
					var tmpHeight = bandE[z]["height"]+bandE[z]["top"];
					if(tmpHeight > maxHeight){
						maxHeight = tmpHeight;
					}
				}
			}
			if(maxHeight > 0){
				dtareport.variables.pageSum = parseInt(bandEt.height / maxHeight);
				if(dtareport.variables.pageSum > 0){
					dtareport.variables.pageSum--;
				}
			}		
			
			//dtareport.variables.pageSum = this.internal.getNumberOfPages()+1;	
			//calcular o a quantidade de paginas
			
			
			
			
			
			this.printBand(dtareport,0);
			this.printBand(dtareport,1);
			
			for(var d = lastItem;d < tmpLengdtaSet; d++){
				dtareport.variables.rowCount++;
				for(var x = 0 ; x < tmlItens ;x++){
					if(d < 1){
						bandE[x]["left"] = bandEt.left+bandE[x]["left"];
					}
					if(!bandE[x]["_top"]){
						bandE[x]["_top"]=bandE[x]["top"]+bandEt._top;
					}else{
						bandE[x]["_top"] = parseInt(bandE[x]["_top"])+parseInt(bandE[x]["height"]);
					}
					if((bandE[x]["_top"] + 10) > (bandEt.height+bandEt["_top"]) && bandEt["band"]=="detail"){
					   
						//adicionar summary e footer
						//lastItem = d;
						this.printBand(dtareport,3);
						this.printBand(dtareport,4);
					   
						if(lastItem != d){
							lastItem = d;
							dtareport.variables.pageCount++;
							this.addPage();
							this.printBand(dtareport,0);
							this.printBand(dtareport,1);
						}
						bandE[x]["_top"] = bandE[x]["top"]+bandEt._top;
							//break;
					}//else{
							//if(bandE[x].type=="text" && d < 1){
					if(bandE[x].type=="text"){
						this.addText(bandE[x]);
					}else if(bandE[x].type=="textField"){						
						bandE[x]["_text"] = "";
						if(bandE[x]["text"].indexOf("$F")==0){							
							var strvar = bandE[x]["text"].match(/\$F\{(.*?)\}/);
							bandE[x]["_text"] = bandE[x]["text"].replace(strvar[0],dtaSetVls[d][strvar[1]]);
						}else if(bandE[x]["text"].indexOf("$V")==0){							
							var strvar = bandE[x]["text"].match(/\$V\{(.*?)\}/);
							bandE[x]["_text"] = bandE[x]["text"].replace(strvar[0],dtareport.variables[strvar[1]]);
						}
						this.addTextField(bandE[x]);
					}else if(bandE[x].type=="image"){
						this.addImage2(bandE[x]);
					}else if(bandE[x].type=="rect"){
						this.addRect(bandE[x]);
					}else if(bandE[x].type=="square"){
						this.addRect(bandE[x]);
					}else if(bandE[x].type=="triangle"){
						this.addTriangle(bandE[x]);
					}
					//}
				}
			}				   
			this.printBand(dtareport,3);
			this.printBand(dtareport,4);
			}
		return null;
	}
})(jsPDF.API);








function toPDF(config){
	this.config = $.extend({"data":[],"render":[],"title":"Relatorio","subtitle":"","orientation":"","orderBy":"","plusLines":0}, config);	
	var tmDta = config["data"].length;	
	//var myPDF = new jsPDF('landscape');
	var myPDF = new jsPDF();
	var tmLinha = 6;
	var margin_superior = 22;
	var margem_lateral = 10;
	var poYO = margin_superior+9;
	var poY = poYO;
	var tmLinhaH = 190;
	var limitLinhas = 39;
	var pagA = 1;
	var totalPags = parseInt(tmDta/limitLinhas)+1;
	this.getWidth=function(perc){
		return parseInt(perc*tmLinhaH/100)-margem_lateral;
	};
	function getBase64Image(img) {
		// Create an empty canvas element
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;

		// Copy the image contents to the canvas
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);

		// Get the data-URL formatted image
		// Firefox supports PNG and JPEG. You could check img.src to
		// guess the original format, but be aware the using "image/jpg"
		// will re-encode the image.
		var dataURL = canvas.toDataURL("image/png");

		//console.log(dataURL); //here is where I get 'data:,'       

		//return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		return dataURL;
	}

	this.setHeaderPage=function(altura,showTitleAgain){		
		var hj = new Date();
		var diaS = ""+hj.getDate();
		if(diaS.length<2){
			diaS = "0"+diaS;
		}	
		var totalPs = ""+totalPags;
		if(totalPags<10){
			totalPs = "0"+totalPags;
		}
		var pagAS = ""+pagA;
		if(pagA<10){
			pagAS = "0"+pagA;
		}
		var montS = ""+(hj.getMonth()+1);
		if(montS.length<2){
			montS="0"+montS;
		}
		var dateParsed = diaS+'/'+montS+'/'+hj.getFullYear();
		var imgLogo = $("#logReports");
		var marginLogo = 0;
		if(imgLogo.length > 0){
			var imgData = getBase64Image(imgLogo[0]);
			myPDF.addImage(imgData, 'JPEG', margem_lateral,10, 12,12);
			marginLogo = 13;
		}
		
		if(showTitleAgain){
			myPDF.setFontSize(24);			
			myPDF.text(margem_lateral+marginLogo, 16, config["title"]);		
			myPDF.setFontSize(12);	
			myPDF.text(margem_lateral+marginLogo, 22, config["subtitle"]);
		}		
		myPDF.text(tmLinhaH-11,altura+17,"pag.: " + pagAS + "/" + totalPs);		
		myPDF.text(tmLinhaH-11,altura+22,dateParsed);		
		myPDF.line(margem_lateral,altura+23,tmLinhaH+10,altura+23); // horizontal line	
		
		myPDF.setDrawColor(0);
		myPDF.setFillColor(59,56,63);
		myPDF.rect(margem_lateral,poY-tmLinha, tmLinhaH, tmLinha, 'FD'); // filled red square with black borders
		myPDF.setTextColor(255,255,255);		
		var posiX1 = margem_lateral+1;
		var tmC = config["render"].length; 
		for(var y = 0 ; y< tmC;y++){
			var textI = new String(config["render"][y]["label"]);	
			//alert(textI);				
			myPDF.text(posiX1,poY-2,""+textI);
			posiX1+=this.getWidth(config["render"][y]["width"]);
		}		
		myPDF.setTextColor(0,0,0);
		
	};
	
	this.setHeaderPage(0,true);
		
	
	var xc = 0;//contador de linhas
	for(var x =0;x<tmDta;x++){			
		var r = 255;
		var g = 255;
		var b = 255;			
		if (x % 2 == 0){
			//0xE0DDD7
			r = 223;
			g = 220;
			b = 216;					
		}		
		poY += tmLinha;			
		myPDF.setDrawColor(0);
		myPDF.setFillColor(r,g,b);
		myPDF.rect(margem_lateral,poY-tmLinha, tmLinhaH, tmLinha, 'FD'); // filled red square with black borders
		var posiX = margem_lateral+1;
		var tmC = config["render"].length; 
		for(var z = 0 ; z< tmC;z++){
			var textI = new String(config["data"][x][config["render"][z]["column"]]);
			var widthTMP = this.getWidth(config["render"][z]["width"]);
			textI=textI.substring(0,(parseInt(widthTMP/3)+2));
			myPDF.text(posiX,poY-2,""+textI);
			posiX+=widthTMP;
		}
		xc++;
		if((xc) > limitLinhas){
			pagA++;
			//limitLinhas+=limitLinhas;
			poY = poYO;
			xc = 0;
			myPDF.addPage();				
			//myPDF.setFontSize(12);
			//myPDF.text(tmLinhaH-4,18,"pag.: " + pagA + "/" + totalPags);
			//myPDF.text(tmLinhaH-4,24,dataHJ);		
			//myPDF.line(margem_lateral,25,tmLinhaH+15,25); // horizontal line	
			this.setHeaderPage(0,true);
			//myPDF.setFontSize(14);
		}			
	}		
	poY += tmLinha;
	myPDF.setDrawColor(0);
	myPDF.setFillColor(59,56,63);
	myPDF.rect(margem_lateral,poY-tmLinha, tmLinhaH, tmLinha, 'FD'); // filled red square with black borders
	myPDF.setTextColor(255,255,255);		
	myPDF.text(margem_lateral+1,poY-1,"Total de Registros: "+tmDta);		
	myPDF.setTextColor(0,0,0);		
	//myPDF.save("relatorio_"+dateParsed+".pdf");	
	return myPDF.output('datauristring');
}

	