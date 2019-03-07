#/bin/sh
sencha -sdk extjs compile -classpath=js/app,app.js -debug=false page --compress -input-file=index-dev.html -out=build/index.html
