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
				cwd: '../src/br',
				src: [
					"**/view/assets/**"
				//,"**/model/I[A-Z]*.js"
				],
				dest: 'public/js/br'
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
	  ,typescript: {
		client: {
		  cwd: '.'
		  ,expand: false
		  ,src: [			
		  		"src/**/model/I[A-Z]*.ts"
				,"src/**/view/*.ts"
		  ]
		  ,dest: 'web/js/br/net/underdesk'
		  ,options: {			
			"target": "es5",
			"module": "amd",
			"declaration": false,
			"noImplicitAny": true,
			"removeComments": true,
			"noLib": false,
			"sourceMap": true,
			"experimentalDecorators": true,
			"emitDecoratorMetadata":false,
			"isolatedModules": false,
			"noEmitHelpers": true,
			"noResolve": true,
			"references": [
				"src/lib/jquery2.d.ts",	
				"src/lib/util.d.ts",
				"src/lib/core.d.ts",
				"src/lib/container.d.ts",
				"src/lib/controller.d.ts",				
				"src/lib/net.d.ts"				
			]
		  }
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
	});
	grunt.registerTask('default', ['build-all']);
	grunt.registerTask('build-client', ['clean:client','typescript:client','copy:viewAssets','replace:viewjs']);
	grunt.registerTask('build-all', ['build-client']);	
	grunt.registerTask('build-deploy', ['build-client','uglify:view']);	
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.loadNpmTasks('grunt-contrib-cssmin');
	//grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-typescript');

};
