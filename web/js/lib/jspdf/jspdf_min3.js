var jsPDF=(function(global){var pdfVersion="1.3",pageFormats={a0:[2383.94,3370.39],a1:[1683.78,2383.94],a2:[1190.55,1683.78],a3:[841.89,1190.55],a4:[595.28,841.89],a5:[419.53,595.28],a6:[297.64,419.53],a7:[209.76,297.64],a8:[147.4,209.76],a9:[104.88,147.4],a10:[73.7,104.88],b0:[2834.65,4008.19],b1:[2004.09,2834.65],b2:[1417.32,2004.09],b3:[1000.63,1417.32],b4:[708.66,1000.63],b5:[498.9,708.66],b6:[354.33,498.9],b7:[249.45,354.33],b8:[175.75,249.45],b9:[124.72,175.75],b10:[87.87,124.72],c0:[2599.37,3676.54],c1:[1836.85,2599.37],c2:[1298.27,1836.85],c3:[918.43,1298.27],c4:[649.13,918.43],c5:[459.21,649.13],c6:[323.15,459.21],c7:[229.61,323.15],c8:[161.57,229.61],c9:[113.39,161.57],c10:[79.37,113.39],dl:[311.81,623.62],letter:[612,792],"government-letter":[576,756],legal:[612,1008],"junior-legal":[576,360],ledger:[1224,792],tabloid:[792,1224],"credit-card":[153,243]};function PubSub(context){var topics={};this.subscribe=function(topic,callback,once){if(typeof callback!=="function"){return false;}if(!topics.hasOwnProperty(topic)){topics[topic]={};}var id=Math.random().toString(35);topics[topic][id]=[callback,!!once];return id;};this.unsubscribe=function(token){for(var topic in topics){if(topics[topic][token]){delete topics[topic][token];return true;}}return false;};this.publish=function(topic){if(topics.hasOwnProperty(topic)){var args=Array.prototype.slice.call(arguments,1),idr=[];for(var id in topics[topic]){var sub=topics[topic][id];try{sub[0].apply(context,args);}catch(ex){if(global.console){console.error("jsPDF PubSub Error",ex.message,ex);}}if(sub[1]){idr.push(id);}}if(idr.length){idr.forEach(this.unsubscribe);}}};}function jsPDF(orientation,unit,format,compressPdf){var options={};if(typeof orientation==="object"){options=orientation;orientation=options.orientation;unit=options.unit||unit;format=options.format||format;compressPdf=options.compress||options.compressPdf||compressPdf;}unit=unit||"mm";format=format||"a4";orientation=(""+(orientation||"P")).toLowerCase();var format_as_string=(""+format).toLowerCase(),compress=!!compressPdf&&typeof Uint8Array==="function",textColor=options.textColor||"0 g",drawColor=options.drawColor||"0 G",activeFontSize=options.fontSize||16,lineHeightProportion=options.lineHeight||1.15,lineWidth=options.lineWidth||0.200025,objectNumber=2,outToPages=!1,offsets=[],fonts={},fontmap={},activeFontKey,k,tmp,page=0,pages=[],content=[],lineCapID=0,lineJoinID=0,content_length=0,pageWidth,pageHeight,documentProperties={title:"",subject:"",author:"",keywords:"",creator:""},API={},events=new PubSub(API),f2=function(number){return number.toFixed(2);},f3=function(number){return number.toFixed(3);},padd2=function(number){return("0"+parseInt(number)).slice(-2);},out=function(string){if(outToPages){pages[page].push(string);}else{content_length+=string.length+1;content.push(string);}},newObject=function(){objectNumber++;offsets[objectNumber]=content_length;out(objectNumber+" 0 obj");return objectNumber;},putStream=function(str){out("stream");out(str);out("endstream");},putPages=function(){var n,p,arr,i,deflater,adler32,wPt=pageWidth*k,hPt=pageHeight*k,adler32cs;adler32cs=global.adler32cs||jsPDF.adler32cs;if(compress&&typeof adler32cs==="undefined"){compress=false;}for(n=1;n<=page;n++){newObject();out("<</Type /Page");out("/Parent 1 0 R");out("/Resources 2 0 R");out("/Contents "+(objectNumber+1)+" 0 R>>");out("endobj");p=pages[n].join("\n");newObject();if(compress){arr=[];i=p.length;while(i--){arr[i]=p.charCodeAt(i);}adler32=adler32cs.from(p);deflater=new Deflater(6);deflater.append(new Uint8Array(arr));p=deflater.flush();arr=new Uint8Array(p.length+6);arr.set(new Uint8Array([120,156])),arr.set(p,2);arr.set(new Uint8Array([adler32&255,(adler32>>8)&255,(adler32>>16)&255,(adler32>>24)&255]),p.length+2);p=String.fromCharCode.apply(null,arr);out("<</Length "+p.length+" /Filter [/FlateDecode]>>");}else{out("<</Length "+p.length+">>");}putStream(p);out("endobj");}offsets[1]=content_length;out("1 0 obj");out("<</Type /Pages");var kids="/Kids [";for(i=0;i<page;i++){kids+=(3+2*i)+" 0 R ";}out(kids+"]");out("/Count "+page);out("/MediaBox [0 0 "+f2(wPt)+" "+f2(hPt)+"]");out(">>");out("endobj");},putFont=function(font){font.objectNumber=newObject();out("<</BaseFont/"+font.PostScriptName+"/Type/Font");if(typeof font.encoding==="string"){out("/Encoding/"+font.encoding);}out("/Subtype/Type1>>");out("endobj");},putFonts=function(){for(var fontKey in fonts){if(fonts.hasOwnProperty(fontKey)){putFont(fonts[fontKey]);}}},putXobjectDict=function(){events.publish("putXobjectDict");},putResourceDictionary=function(){out("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]");out("/Font <<");for(var fontKey in fonts){if(fonts.hasOwnProperty(fontKey)){out("/"+fontKey+" "+fonts[fontKey].objectNumber+" 0 R");}}out(">>");out("/XObject <<");putXobjectDict();out(">>");},putResources=function(){putFonts();events.publish("putResources");offsets[2]=content_length;out("2 0 obj");out("<<");putResourceDictionary();out(">>");out("endobj");events.publish("postPutResources");},addToFontDictionary=function(fontKey,fontName,fontStyle){if(!fontmap.hasOwnProperty(fontName)){fontmap[fontName]={};}fontmap[fontName][fontStyle]=fontKey;},addFont=function(PostScriptName,fontName,fontStyle,encoding){var fontKey="F"+(Object.keys(fonts).length+1).toString(10),font=fonts[fontKey]={id:fontKey,PostScriptName:PostScriptName,fontName:fontName,fontStyle:fontStyle,encoding:encoding,metadata:{}};addToFontDictionary(fontKey,fontName,fontStyle);events.publish("addFont",font);return fontKey;},addFonts=function(){var HELVETICA="helvetica",TIMES="times",COURIER="courier",NORMAL="normal",BOLD="bold",ITALIC="italic",BOLD_ITALIC="bolditalic",encoding="StandardEncoding",standardFonts=[["Helvetica",HELVETICA,NORMAL],["Helvetica-Bold",HELVETICA,BOLD],["Helvetica-Oblique",HELVETICA,ITALIC],["Helvetica-BoldOblique",HELVETICA,BOLD_ITALIC],["Courier",COURIER,NORMAL],["Courier-Bold",COURIER,BOLD],["Courier-Oblique",COURIER,ITALIC],["Courier-BoldOblique",COURIER,BOLD_ITALIC],["Times-Roman",TIMES,NORMAL],["Times-Bold",TIMES,BOLD],["Times-Italic",TIMES,ITALIC],["Times-BoldItalic",TIMES,BOLD_ITALIC]];for(var i=0,l=standardFonts.length;i<l;i++){var fontKey=addFont(standardFonts[i][0],standardFonts[i][1],standardFonts[i][2],encoding);var parts=standardFonts[i][0].split("-");addToFontDictionary(fontKey,parts[0],parts[1]||"");}events.publish("addFonts",{fonts:fonts,dictionary:fontmap});},SAFE=function __safeCall(fn){fn.foo=function __safeCallWrapper(){try{return fn.apply(this,arguments);}catch(e){var stack=e.stack||"";if(~stack.indexOf(" at ")){stack=stack.split(" at ")[1];}var m="Error in function "+stack.split("\n")[0].split("<")[0]+": "+e.message;if(global.console){global.console.error(m,e);if(global.alert){alert(m);}}else{throw new Error(m);}}};fn.foo.bar=fn;return fn.foo;},to8bitStream=function(text,flags){var i,l,sourceEncoding,encodingBlock,outputEncoding,newtext,isUnicode,ch,bch;flags=flags||{};sourceEncoding=flags.sourceEncoding||"Unicode";outputEncoding=flags.outputEncoding;if((flags.autoencode||outputEncoding)&&fonts[activeFontKey].metadata&&fonts[activeFontKey].metadata[sourceEncoding]&&fonts[activeFontKey].metadata[sourceEncoding].encoding){encodingBlock=fonts[activeFontKey].metadata[sourceEncoding].encoding;if(!outputEncoding&&fonts[activeFontKey].encoding){outputEncoding=fonts[activeFontKey].encoding;}if(!outputEncoding&&encodingBlock.codePages){outputEncoding=encodingBlock.codePages[0];}if(typeof outputEncoding==="string"){outputEncoding=encodingBlock[outputEncoding];}if(outputEncoding){isUnicode=false;newtext=[];for(i=0,l=text.length;i<l;i++){ch=outputEncoding[text.charCodeAt(i)];if(ch){newtext.push(String.fromCharCode(ch));}else{newtext.push(text[i]);}if(newtext[i].charCodeAt(0)>>8){isUnicode=true;}}text=newtext.join("");}}i=text.length;while(isUnicode===undefined&&i!==0){if(text.charCodeAt(i-1)>>8){isUnicode=true;}i--;}if(!isUnicode){return text;}newtext=flags.noBOM?[]:[254,255];for(i=0,l=text.length;i<l;i++){ch=text.charCodeAt(i);bch=ch>>8;if(bch>>8){throw new Error("Character at position "+i+" of string '"+text+"' exceeds 16bits. Cannot be encoded into UCS-2 BE");}newtext.push(bch);newtext.push(ch-(bch<<8));}return String.fromCharCode.apply(undefined,newtext);},pdfEscape=function(text,flags){return to8bitStream(text,flags).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)");},putInfo=function(){out("/Producer (jsPDF "+jsPDF.version+")");for(var key in documentProperties){if(documentProperties.hasOwnProperty(key)&&documentProperties[key]){out("/"+key.substr(0,1).toUpperCase()+key.substr(1)+" ("+pdfEscape(documentProperties[key])+")");}}var created=new Date();out(["/CreationDate (D:",created.getFullYear(),padd2(created.getMonth()+1),padd2(created.getDate()),padd2(created.getHours()),padd2(created.getMinutes()),padd2(created.getSeconds()),")"].join(""));},putCatalog=function(){out("/Type /Catalog");out("/Pages 1 0 R");out("/OpenAction [3 0 R /FitH null]");out("/PageLayout /OneColumn");events.publish("putCatalog");},putTrailer=function(){out("/Size "+(objectNumber+1));out("/Root "+objectNumber+" 0 R");out("/Info "+(objectNumber-1)+" 0 R");},beginPage=function(){page++;outToPages=true;pages[page]=[];},_addPage=function(){beginPage();out(f2(lineWidth*k)+" w");out(drawColor);if(lineCapID!==0){out(lineCapID+" J");}if(lineJoinID!==0){out(lineJoinID+" j");}events.publish("addPage",{pageNumber:page});},getFont=function(fontName,fontStyle){var key;fontName=fontName!==undefined?fontName:fonts[activeFontKey].fontName;fontStyle=fontStyle!==undefined?fontStyle:fonts[activeFontKey].fontStyle;try{key=fontmap[fontName][fontStyle];}catch(e){}if(!key){throw new Error("Unable to look up font label for font '"+fontName+"', '"+fontStyle+"'. Refer to getFontList() for available fonts.");}return key;},buildDocument=function(){outToPages=false;objectNumber=2;content=[];offsets=[];out("%PDF-"+pdfVersion);putPages();putResources();newObject();out("<<");putInfo();out(">>");out("endobj");newObject();out("<<");putCatalog();out(">>");out("endobj");var o=content_length,i,p="0000000000";out("xref");out("0 "+(objectNumber+1));out(p+" 65535 f ");for(i=1;i<=objectNumber;i++){out((p+offsets[i]).slice(-10)+" 00000 n ");}out("trailer");out("<<");putTrailer();out(">>");out("startxref");out(o);out("%%EOF");outToPages=true;return content.join("\n");},getStyle=function(style){var op="S";if(style==="F"){op="f";}else{if(style==="FD"||style==="DF"){op="B";}else{if(style==="f"||style==="f*"||style==="B"||style==="B*"){op=style;}}}return op;},getArrayBuffer=function(){var data=buildDocument(),len=data.length,ab=new ArrayBuffer(len),u8=new Uint8Array(ab);while(len--){u8[len]=data.charCodeAt(len);}return ab;},getBlob=function(){return new Blob([getArrayBuffer()],{type:"application/pdf"});},output=SAFE(function(type,options){var datauri=(""+type).substr(0,6)==="dataur"?"data:application/pdf;base64,"+btoa(buildDocument()):0;switch(type){case undefined:return buildDocument();case"save":if(navigator.getUserMedia){if(global.URL===undefined||global.URL.createObjectURL===undefined){return API.output("dataurlnewwindow");}}saveAs(getBlob(),options);if(typeof saveAs.unload==="function"){if(global.setTimeout){setTimeout(saveAs.unload,911);}}break;case"arraybuffer":return getArrayBuffer();case"blob":return getBlob();case"bloburi":case"bloburl":return global.URL&&global.URL.createObjectURL(getBlob())||void 0;case"datauristring":case"dataurlstring":return datauri;case"dataurlnewwindow":var nW=global.open(datauri);if(nW||typeof safari==="undefined"){return nW;}case"datauri":case"dataurl":return global.document.location.href=datauri;default:throw new Error('Output type "'+type+'" is not supported.');}});switch(unit){case"pt":k=1;break;case"mm":k=72/25.4;break;case"cm":k=72/2.54;break;case"in":k=72;break;case"px":k=96/72;break;case"pc":k=12;break;case"em":k=12;break;case"ex":k=6;break;default:throw ("Invalid unit: "+unit);}if(pageFormats.hasOwnProperty(format_as_string)){pageHeight=pageFormats[format_as_string][1]/k;pageWidth=pageFormats[format_as_string][0]/k;}else{try{pageHeight=format[1];pageWidth=format[0];}catch(err){throw new Error("Invalid format: "+format);}}if(orientation==="p"||orientation==="portrait"){orientation="p";if(pageWidth>pageHeight){tmp=pageWidth;pageWidth=pageHeight;pageHeight=tmp;}}else{if(orientation==="l"||orientation==="landscape"){orientation="l";if(pageHeight>pageWidth){tmp=pageWidth;pageWidth=pageHeight;pageHeight=tmp;}}else{throw ("Invalid orientation: "+orientation);}}API.internal={pdfEscape:pdfEscape,getStyle:getStyle,getFont:function(){return fonts[getFont.apply(API,arguments)];},getFontSize:function(){return activeFontSize;},getLineHeight:function(){return activeFontSize*lineHeightProportion;},write:function(string1){out(arguments.length===1?string1:Array.prototype.join.call(arguments," "));},getCoordinateString:function(value){return f2(value*k);},getVerticalCoordinateString:function(value){return f2((pageHeight-value)*k);},collections:{},newObject:newObject,putStream:putStream,events:events,scaleFactor:k,pageSize:{width:pageWidth,height:pageHeight},output:function(type,options){return output(type,options);},getNumberOfPages:function(){return pages.length-1;},pages:pages};API.addPage=function(){_addPage();return this;};API.text=function(text,x,y,flags,angle){function ESC(s){s=s.split("\t").join(Array(options.TabLen||9).join(" "));return pdfEscape(s,flags);}if(typeof text==="number"){tmp=y;y=x;x=text;text=tmp;}if(typeof text==="string"&&text.match(/[\n\r]/)){text=text.split(/\r\n|\r|\n/g);}if(typeof flags==="number"){angle=flags;flags=null;}var xtra="",mode="Td";if(angle){angle*=(Math.PI/180);var c=Math.cos(angle),s=Math.sin(angle);xtra=[f2(c),f2(s),f2(s*-1),f2(c),""].join(" ");mode="Tm";}flags=flags||{};if(!("noBOM" in flags)){flags.noBOM=true;}if(!("autoencode" in flags)){flags.autoencode=true;}if(typeof text==="string"){text=ESC(text);}else{if(text instanceof Array){var sa=text.concat(),da=[],len=sa.length;while(len--){da.push(ESC(sa.shift()));}text=da.join(") Tj\nT* (");}else{throw new Error('Type of text must be string or Array. "'+text+'" is not recognized.');}}out("BT\n/"+activeFontKey+" "+activeFontSize+" Tf\n"+(activeFontSize*lineHeightProportion)+" TL\n"+textColor+"\n"+xtra+f2(x*k)+" "+f2((pageHeight-y)*k)+" "+mode+"\n("+text+") Tj\nET");return this;};API.line=function(x1,y1,x2,y2){return this.lines([[x2-x1,y2-y1]],x1,y1);};API.lines=function(lines,x,y,scale,style,closed){var scalex,scaley,i,l,leg,x2,y2,x3,y3,x4,y4;if(typeof lines==="number"){tmp=y;y=x;x=lines;lines=tmp;}scale=scale||[1,1];out(f3(x*k)+" "+f3((pageHeight-y)*k)+" m ");scalex=scale[0];scaley=scale[1];l=lines.length;x4=x;y4=y;for(i=0;i<l;i++){leg=lines[i];if(leg.length===2){x4=leg[0]*scalex+x4;y4=leg[1]*scaley+y4;out(f3(x4*k)+" "+f3((pageHeight-y4)*k)+" l");}else{x2=leg[0]*scalex+x4;y2=leg[1]*scaley+y4;x3=leg[2]*scalex+x4;y3=leg[3]*scaley+y4;x4=leg[4]*scalex+x4;y4=leg[5]*scaley+y4;out(f3(x2*k)+" "+f3((pageHeight-y2)*k)+" "+f3(x3*k)+" "+f3((pageHeight-y3)*k)+" "+f3(x4*k)+" "+f3((pageHeight-y4)*k)+" c");}}if(closed){out(" h");}if(style!==null){out(getStyle(style));}return this;};API.rect=function(x,y,w,h,style){var op=getStyle(style);out([f2(x*k),f2((pageHeight-y)*k),f2(w*k),f2(-h*k),"re"].join(" "));if(style!==null){out(getStyle(style));}return this;};API.triangle=function(x1,y1,x2,y2,x3,y3,style){this.lines([[x2-x1,y2-y1],[x3-x2,y3-y2],[x1-x3,y1-y3]],x1,y1,[1,1],style,true);return this;};API.roundedRect=function(x,y,w,h,rx,ry,style){var MyArc=4/3*(Math.SQRT2-1);this.lines([[(w-2*rx),0],[(rx*MyArc),0,rx,ry-(ry*MyArc),rx,ry],[0,(h-2*ry)],[0,(ry*MyArc),-(rx*MyArc),ry,-rx,ry],[(-w+2*rx),0],[-(rx*MyArc),0,-rx,-(ry*MyArc),-rx,-ry],[0,(-h+2*ry)],[0,-(ry*MyArc),(rx*MyArc),-ry,rx,-ry]],x+rx,y,[1,1],style);return this;};API.ellipse=function(x,y,rx,ry,style){var lx=4/3*(Math.SQRT2-1)*rx,ly=4/3*(Math.SQRT2-1)*ry;out([f2((x+rx)*k),f2((pageHeight-y)*k),"m",f2((x+rx)*k),f2((pageHeight-(y-ly))*k),f2((x+lx)*k),f2((pageHeight-(y-ry))*k),f2(x*k),f2((pageHeight-(y-ry))*k),"c"].join(" "));out([f2((x-lx)*k),f2((pageHeight-(y-ry))*k),f2((x-rx)*k),f2((pageHeight-(y-ly))*k),f2((x-rx)*k),f2((pageHeight-y)*k),"c"].join(" "));out([f2((x-rx)*k),f2((pageHeight-(y+ly))*k),f2((x-lx)*k),f2((pageHeight-(y+ry))*k),f2(x*k),f2((pageHeight-(y+ry))*k),"c"].join(" "));out([f2((x+lx)*k),f2((pageHeight-(y+ry))*k),f2((x+rx)*k),f2((pageHeight-(y+ly))*k),f2((x+rx)*k),f2((pageHeight-y)*k),"c"].join(" "));if(style!==null){out(getStyle(style));}return this;};API.circle=function(x,y,r,style){return this.ellipse(x,y,r,r,style);};API.setProperties=function(properties){for(var property in documentProperties){if(documentProperties.hasOwnProperty(property)&&properties[property]){documentProperties[property]=properties[property];}}return this;};API.setFontSize=function(size){activeFontSize=size;return this;};API.setFont=function(fontName,fontStyle){activeFontKey=getFont(fontName,fontStyle);return this;};API.setFontStyle=API.setFontType=function(style){activeFontKey=getFont(undefined,style);return this;};API.getFontList=function(){var list={},fontName,fontStyle,tmp;for(fontName in fontmap){if(fontmap.hasOwnProperty(fontName)){list[fontName]=tmp=[];for(fontStyle in fontmap[fontName]){if(fontmap[fontName].hasOwnProperty(fontStyle)){tmp.push(fontStyle);}}}}return list;};API.setLineWidth=function(width){out((width*k).toFixed(2)+" w");return this;};API.setDrawColor=function(ch1,ch2,ch3,ch4){var color;if(ch2===undefined||(ch4===undefined&&ch1===ch2===ch3)){if(typeof ch1==="string"){color=ch1+" G";}else{color=f2(ch1/255)+" G";}}else{if(ch4===undefined){if(typeof ch1==="string"){color=[ch1,ch2,ch3,"RG"].join(" ");}else{color=[f2(ch1/255),f2(ch2/255),f2(ch3/255),"RG"].join(" ");}}else{if(typeof ch1==="string"){color=[ch1,ch2,ch3,ch4,"K"].join(" ");}else{color=[f2(ch1),f2(ch2),f2(ch3),f2(ch4),"K"].join(" ");}}}out(color);return this;};API.setFillColor=function(ch1,ch2,ch3,ch4){var color;if(ch2===undefined||(ch4===undefined&&ch1===ch2===ch3)){if(typeof ch1==="string"){color=ch1+" g";}else{color=f2(ch1/255)+" g";}}else{if(ch4===undefined){if(typeof ch1==="string"){color=[ch1,ch2,ch3,"rg"].join(" ");}else{color=[f2(ch1/255),f2(ch2/255),f2(ch3/255),"rg"].join(" ");}}else{if(typeof ch1==="string"){color=[ch1,ch2,ch3,ch4,"k"].join(" ");}else{color=[f2(ch1),f2(ch2),f2(ch3),f2(ch4),"k"].join(" ");}}}out(color);return this;};API.setTextColor=function(r,g,b){if((typeof r==="string")&&/^#[0-9A-Fa-f]{6}$/.test(r)){var hex=parseInt(r.substr(1),16);r=(hex>>16)&255;g=(hex>>8)&255;b=(hex&255);}if((r===0&&g===0&&b===0)||(typeof g==="undefined")){textColor=f3(r/255)+" g";}else{textColor=[f3(r/255),f3(g/255),f3(b/255),"rg"].join(" ");}return this;};API.CapJoinStyles={0:0,butt:0,but:0,miter:0,1:1,round:1,rounded:1,circle:1,2:2,projecting:2,project:2,square:2,bevel:2};API.setLineCap=function(style){var id=this.CapJoinStyles[style];if(id===undefined){throw new Error("Line cap style of '"+style+"' is not recognized. See or extend .CapJoinStyles property for valid styles");}lineCapID=id;out(id+" J");return this;};API.setLineJoin=function(style){var id=this.CapJoinStyles[style];if(id===undefined){throw new Error("Line join style of '"+style+"' is not recognized. See or extend .CapJoinStyles property for valid styles");}lineJoinID=id;out(id+" j");return this;};API.output=output;API.save=function(filename){API.output("save",filename);};for(var plugin in jsPDF.API){if(jsPDF.API.hasOwnProperty(plugin)){if(plugin==="events"&&jsPDF.API.events.length){(function(events,newEvents){var eventname,handler_and_args,i;for(i=newEvents.length-1;i!==-1;i--){eventname=newEvents[i][0];handler_and_args=newEvents[i][1];events.subscribe.apply(events,[eventname].concat(typeof handler_and_args==="function"?[handler_and_args]:handler_and_args));}}(events,jsPDF.API.events));}else{API[plugin]=jsPDF.API[plugin];}}}addFonts();activeFontKey="F1";_addPage();events.publish("initialized");return API;}jsPDF.API={events:[]};jsPDF.version="1.0.0-trunk";if(typeof define==="function"&&define.amd){define("jsPDF",function(){return jsPDF;});}else{global.jsPDF=jsPDF;}return jsPDF;}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this));