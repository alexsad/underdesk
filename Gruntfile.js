module.exports = function(grunt) {
	grunt.initConfig({		
		replace: {
			viewjs:{
				expand: true,
				src: ['web/js/br/**/*.js'],             // source files array (supports minimatch)
				overwrite: true,             // destination directory or file
				replacements: [{
					  from: /..\/..\/..\/..\/..\/lib\//g,                   // string replacement
					  to: ''
					}
				]
		  }
		}		
		,copy: {
			view:{
				expand: true,
				cwd: './app/br',
				src: [
				"**/view/*.js"
				//,"**/model/I[A-Z]*.js"
				],
				dest: 'public/js/br'
			}		
			,viewAssets:{
				expand: true,
				cwd: 'src/br',
				src: [
					"**/view/assets/**"
				//,"**/model/I[A-Z]*.js"
				],
				dest: 'web/js/br'
			}		
		}
		,clean: {
			client: {
				src: 'web/js/br'
			}
		}
		,concat: {
			options: {
				separator: ';'
			}
		}
	,uglify: {
		view: {
			files: [{
				expand: true
				,cwd: './web/js/br'
				,src: "**/view/*.js"
				,dest: 'web/js/br'
			}]
		}
		,libs:{
			files: [{
				expand: true
				,cwd: './public/js/lib'
				,src: "*.js"
				,dest: 'public/js/lib'
			}]
		}
	}	 
	,ts: {
		view : {
			tsconfig:"tsconfig.json"
		    }
		}
	});
	
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	
	grunt.registerTask('build-view-pos', function(){
		grunt.file.recurse("web/js/br/", function(abspath, rootdir, subdir, filename){
			//console.log(abspath+":"+rootdir+":"+filename);
			if(filename.indexOf(".js")>-1){
				var contentFile = grunt.file.read(abspath);
				if(contentFile.indexOf("})(container_1.ModWindow);")){
					contentFile = contentFile.replace(/(_super\.call\(this,.*)/,"$1 this.setUrlModule('"+abspath.replace("web/","").replace(/\//g,".").replace(".js","")+"');");
					grunt.file.write(abspath, contentFile);
					grunt.log.writeln('File "' + abspath + '" modified.');
				}
			};
		});
	});
	
	 
	grunt.registerTask('default', ['build-view-dev']);
	grunt.registerTask('build-view-dev', ['clean:client','ts:view','copy:viewAssets','replace:viewjs','build-view-pos']);
	grunt.registerTask('build-deploy', ['build-view-dev','uglify:view']);	
	


};
