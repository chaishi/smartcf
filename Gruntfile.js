module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
            src: [ "css/"] //每次执行命令 grunt后，先删除文件  css
        },
        less: {
            testLess: {
                files:[
                    {
                        expand: true,
                        cwd: "less/", //源文件基本路径
                        src: ["**/*.less", "!**/_*.less"], //需要编译的源文件
                        dest: "css/", //编译后的文件存放路径
                        ext: ".css" //编译后的文件后缀名
                    }
                ]
            }
        },
        imagemin: {
	        dist: {
                options: {
                    optimizationLevel: 3 //定义png优化水平
                },
                files: [
                    {
                        expand: true,
                        cwd: "imgSrc/"
                        src: ["**/*.jpg", "**/*.png"],
                        dest: "images/"
                    }
                ]
	        }
        },
        watch: {
            less: {
                files: "less/**/*.less",
                tasks: ['default']
            },
            img: {
                files: "imgSrc/**/*.*",
                tasks: ['default']
            }
        }
	});
	
	//加载grunt依赖的任务, 代替很多个 loadNpmTasks();
    require('load-grunt-tasks')(grunt);
    //命令grunt 默认执行的任务
    grunt.registerTask('default', ['clean', 'less', 'imagemin']);
}
