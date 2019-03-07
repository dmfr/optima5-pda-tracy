Ext.Loader.setConfig({
	enabled: true,
	disableCaching: true,
	paths: {
		'Ext': './extjs/src', 
		'Op5Mlam' : './js/app'
		}
});
Ext.require('Ext.*') ;
Ext.require('Op5Mlam.App');
//Ext.require('Optima5.Modules.All');

var op5desktop, op5session ;
Ext.onReady(function () {
	/*
	 * Désactiver le drag&drop file=>browser(open)
	 */
	window.ondragenter = function(e) {
		e.dataTransfer.dropEffect = 'none';
		e.preventDefault();
		return false;
	};
	window.ondragover = function(e) {
		e.preventDefault();
		return false;
	};
	window.ondrop = function(e) {
		return false;
	};
	window.ondragleave = function(e) {
		return false;
	};
	
	/*
	Désactiver le click droit
	*/
	Ext.getDoc().on('contextmenu', function(e){
		e.preventDefault() ;
	}) ;
	Ext.getDoc().on('keydown', function(e){
		if( e.getKey() == e.BACKSPACE && !Ext.Array.contains(['text','password','textarea'], e.getTarget().type) ) {
			e.preventDefault();
		}
	}) ;
	
	// onReady : bootstrap Optima app.
	Ext.create('Op5Mlam.App',{}) ;
});
