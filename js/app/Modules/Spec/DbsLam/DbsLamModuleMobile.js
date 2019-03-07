Ext.define('DbsLamMenuItemModel',{
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



Ext.define('DbsLamTransferLigModel',{
	extend: 'Ext.data.Model',
	idProperty: 'transferlig_filerecord_id',
	fields: [
		{name: 'transfer_filerecord_id', type:'int'},
		{name: 'transferstep_filerecord_id', type:'int'},
		{name: 'transferstep_idx', type:'int'},
		
		{name: 'transferlig_filerecord_id', type:'int'},
		{name: 'cdepick_transfercdeneed_filerecord_id', type:'int'},
		{name: 'cdepack_transfercdelink_filerecord_id', type:'int'},
		{name: 'status', type:'boolean'},
		{name: 'status_is_ok', type:'boolean'},
		{name: 'status_is_reject', type:'boolean'},
		{name: 'step_code', type:'string'},
		{name: 'hidden', type:'boolean'},
		{name: 'tree_id', type:'string'},
		{name: 'tree_adr', type:'string'},
		{name: 'src_stk_filerecord_id', type:'string'},
		{name: 'src_whse', type:'string'},
		{name: 'src_adr', type:'string'},
		{name: 'dst_stk_filerecord_id', type:'string'},
		{name: 'dst_whse', type:'string'},
		{name: 'dst_adr', type:'string'},
		{name: 'container_ref', type:'string'},
		{name: 'stk_prod', type:'string'},
		{name: 'stk_batch', type:'string'},
		{name: 'stk_datelc', type:'string'},
		{name: 'stk_sn', type:'string'},
		{name: 'mvt_qty', type:'number', allowNull:true},
		{name: 'reject_arr', type:'auto'},
		{name: 'flag_allowgroup', type:'boolean'},
		
		{name: 'need_txt', type: 'string'},
		{name: 'need_prod', type: 'string'},
		{name: 'need_qty_remain', type: 'number'},
		{name: 'transfercdeneed_filerecord_id', type:'int'},
		
		{name: '_input_is_on', type:'boolean'}
	]
});

Ext.define('DbsLamTransferStepModel',{
	extend: 'Ext.data.Model',
	idProperty: 'transferstep_filerecord_id',
	fields: [
		{name: 'transfer_filerecord_id', type:'int'},
		
		{name: 'transferstep_filerecord_id', type:'int'},
		{name: 'transferstep_idx', type:'int'},
		{name: 'transferstep_txt', type:'string'},
		{name: 'transferstep_code', type:'string'},
		{name: 'spec_input', type:'boolean'},
		{name: 'spec_cde_picking', type:'boolean'},
		{name: 'spec_cde_packing', type:'boolean'},
		{name: 'whse_src', type:'string'},
		{name: 'whse_dst', type:'string'},
		{name: 'forward_is_on', type:'boolean'},
		{name: 'forward_to_idx', type:'int'}
	],
	hasMany: [{
		model: 'DbsLamTransferLigModel',
		name: 'ligs',
		associationKey: 'ligs'
	}]
});

Ext.define('DbsLamTransferCdeLinkModel',{
	extend: 'Ext.data.Model',
	idProperty: 'transfercdelink_filerecord_id',
	fields: [
		{name: 'transfer_filerecord_id', type:'int'},
		
		{name: 'transfercdelink_filerecord_id', type:'int'},
		{name: 'cdelig_filerecord_id', type:'int'},
		{name: 'cde_filerecord_id', type:'int'},
		{name: 'cde_nr', type: 'string'},
		{name: 'lig_id', type: 'int'},
		{name: 'stk_prod', type: 'string'},
		{name: 'qty_comm', type: 'number'},
		{name: 'qty_cde', type: 'number'}
	]
});

Ext.define('DbsLamTransferOneModel',{
	extend: 'Ext.data.Model',
	idProperty: 'transfer_filerecord_id',
	fields: [
		{name: 'transfer_filerecord_id', type:'int'},
		{name: 'transfer_txt', type:'string'},
		{name: 'transfer_tpl', type:'string'},
		{name: 'transfer_tpltxt', type:'string'},
		{name: 'spec_cde', type:'boolean'},
		{name: 'status_is_on', type:'boolean'},
		{name: 'status_is_ok', type:'boolean'}
	],
	hasMany: [{
		model: 'DbsLamTransferStepModel',
		name: 'steps',
		associationKey: 'steps'
	},{
		model: 'DbsLamTransferCdeLinkModel',
		name: 'cde_links',
		associationKey: 'cde_links'
	}]
});


Ext.define('DbsLamCfgTplTransferStepModel',{
	extend: 'Ext.data.Model',
	idProperty: 'transferstep_tpl',
	fields: [
		{name: 'transferstep_tpl', type:'string'},
		{name: 'transferstep_idx', type:'int'},
		{name: 'transferstep_code', type: 'string'},
		{name: 'transferstep_txt', type:'string'},
		{name: 'spec_input', type:'boolean'},
		{name: 'spec_cde_picking', type:'boolean'},
		{name: 'spec_cde_packing', type:'boolean'},
		{name: 'whse_src', type:'string'},
		{name: 'whse_dst', type:'string'},
		{name: 'forward_is_on', type:'boolean'},
		{name: 'forward_to_idx', type:'int'}
	]
});
Ext.define('DbsLamCfgTplTransferModel',{
	extend: 'Ext.data.Model',
	idProperty: 'transfer_tpl',
	fields: [
		{name: 'transfer_tpl', type:'string'},
		{name: 'transfer_tpltxt', type:'string'},
		{name: 'spec_cde', type:'boolean'}
	],
	hasMany: [{
		model: 'DbsLamCfgTplTransferStepModel',
		name: 'steps',
		associationKey: 'steps'
	}]
});




Ext.define('DbsLamCfgSocAttributeModel',{
	extend: 'Ext.data.Model',
	idProperty: 'atr_code',
	fields: [
		{name: 'atr_code', type:'string', useNull:true},
		{name: 'atr_txt', type:'string'},
		{name: 'is_bible', type:'boolean'},
		{name: 'use_prod', type:'boolean'},
		{name: 'use_prod_multi', type:'boolean'},
		{name: 'use_stock', type:'boolean'},
		{name: 'use_cde', type:'boolean'},
		{name: 'cfg_is_hidden', type:'boolean'},
		{name: 'cfg_is_editable', type:'boolean'},
		{name: 'use_adr', type:'boolean'},
		{name: 'use_adr_multi', type:'boolean'},
		{name: 'adr_is_optional', type:'boolean'},
		{name: 'adr_is_mismatch', type:'boolean'}
	]
});
Ext.define('DbsLamCfgSocModel',{
	extend: 'Ext.data.Model',
	idProperty: 'soc_code',
	fields: [
		{name: 'soc_code', type:'string', useNull:true},
		{name: 'soc_txt', type:'string'},
		{name: 'location_policy_ifexists', type:'string'}
	],
	hasMany: [{
		model: 'DbsLamCfgSocAttributeModel',
		name: 'attributes',
		associationKey: 'attributes'
	}]
});

Ext.define('DbsLamCfgWhseModel',{
	extend: 'Ext.data.Model',
	idProperty: 'whse_code',
	fields: [
		{name: 'whse_code', type:'string', useNull:true},
		{name: 'whse_txt', type:'string'},
		{name: 'is_stock', type:'boolean'},
		{name: 'is_work', type:'boolean'}
	]
});

Ext.define('DbsLamCfgContainerTypeModel',{
	extend: 'Ext.data.Model',
	idProperty: 'container_type',
	fields: [
		{name: 'container_type', type:'string', useNull:true},
		{name: 'container_type_txt', type:'string'}
	]
});


Ext.define('Optima5.Modules.Spec.DbsLam.DbsLamModuleMobile', {
	extend: 'Optima5.ModuleMobile',
	requires: [
		'Optima5.Modules.Spec.DbsLam.GunPanel'
	],
	
	moduleParams: null,
	
	initModule: function() {
		var me = this ;
		
		me.setPanel({
			layout:'fit',
			border: false,
			items:[Ext.create('Optima5.Modules.Spec.DbsLam.GunPanel',{
				optimaModule: me
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
			case 'datachange' :
				break ;
			
			default :
				return ;
		}
		me.fireEvent('op5broadcast',crmEvent,eventParams) ;
	}
});
