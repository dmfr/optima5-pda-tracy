Ext.define('DbsTracyCfgSocModel',{
	extend: 'Ext.data.Model',
	idProperty: 'soc_code',
	fields: [
		{name: 'soc_code', type:'string', useNull:true},
		{name: 'soc_txt', type:'string'},
		{name: 'cfg_adr', type:'auto'}
	]
});

Ext.define('DbsTracyMenuItemModel',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'item_disabled',  type: 'boolean'},
		{name: 'type_header',  type: 'boolean'},
		{name: 'type_separator',   type: 'boolean'},
		{name: 'type_action',   type: 'boolean'},
		{name: 'type_action_blank',   type: 'boolean'},
		{name: 'separator_label',   type: 'string'},
		{name: 'action_iconCls',   type: 'string'},
		{name: 'action_qtip',   type: 'string'},
		{name: 'action_caption',   type: 'string'},
		{name: 'action_sendEvent', type:'string'}
	]
});


Ext.define('Optima5.Modules.Spec.DbsTracy.DbsTracyModuleMobile', {
	extend: 'Optima5.ModuleMobile',
	requires: [
		'Optima5.Modules.Spec.DbsTracy.GunPanel'
	],
	
	moduleParams: null,
	
	initModule: function() {
		var me = this ;
		
		me.setPanel({
			layout:'fit',
			border: false,
			items:[Ext.create('Optima5.Modules.Spec.DbsTracy.GunPanel',{
				optimaModule: me,
				_registerFocus: false
			})]
		}) ;
	},
	postCrmEvent: function( crmEvent, postParams ) {
		var me = this ;
		if( typeof postParams === 'undefined' ) {
			postParams = {} ;
		}
		
		var eventParams = {} ;
		switch( crmEvent ) {
			case 'sign_open' :
				if( !Android || !Android.signatureOpen ) {
					break ;
				}
				Android.signatureOpen() ;
				return true ;
				
			case 'sign_result' :
				Ext.apply( eventParams, {
					imgJpegBase64: postParams.imgJpegBase64
				}) ;
				break ;
			
			case 'scan' :
				Ext.apply( eventParams, {
					scanResult: postParams.scanResult
				}) ;
				break ;
			
			case 'datachange' :
				break ;
			
			default :
				return ;
		}
		me.fireEvent('op5broadcast',crmEvent,eventParams) ;
	}
});
