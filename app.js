Ext.Loader.setConfig({
	enabled: true,
	disableCaching: true,
	paths: {
		'Ext': './extjs/src', 
		'Optima5' : './js/app'
		}
});

Ext.require('Optima5.AppMobile');
Ext.require('Optima5.Modules.Spec.DbsTracy.DbsTracyModuleMobile');

var op5desktop, op5session ;
Ext.onReady(function () {
	
	/*
	 * From Ext 5.1.1, Floating inside other ELs seem to mess with Ext.dom.GarbageCollector
	 * Guess: Ext.util.Floating tries to reuse shadows cleared/invalidated by garbageCollector before ???
	 */
	Ext.util.Floating.override({
		//shadow: false
	}) ;
	Ext.dom.Underlay.override({
		hide: function() {
			this.callOverridden(arguments) ;
			this.getPool().reset() ;
		}
	}) ;
	
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
	Ext.create('Optima5.AppMobile',{}) ;
	
});
