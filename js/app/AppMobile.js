Ext.define('OptimaDesktopCfgShortcutParamModel',{
	extend: 'Ext.data.Model',
	idProperty: 'param_code',
	fields: [
		{name: 'param_code',  type:'string'},
		{name: 'param_value',    type:'string'}
	]
});
Ext.define('OptimaDesktopCfgShortcutModel',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'module_id',  type:'string'}
	],
	hasMany: [{
		model: 'OptimaDesktopCfgShortcutParamModel',
		name: 'params',
		associationKey: 'params'
	}]
});
Ext.define('OptimaDesktopCfgSdomainModel',{
	extend: 'Ext.data.Model',
	idProperty: 'sdomain_id',
	fields: [
		{name: 'sdomain_id',  type:'string'},
		{name: 'sdomain_name',    type:'string'},
		{name: 'module_id',    type:'string'},
		{name: 'icon_code',    type:'string'},
		{name: 'auth_has_all', type:'boolean'},
		{name: 'auth_arrOpenActions', type:'auto'},
		{name: 'db_needUpdate', type:'boolean'}
	]
});
Ext.define('OptimaDesktopCfgModel',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'session_id',  type:'string'},
		{name: 'delegate_mode',    type:'boolean'},
		{name: 'dev_mode',    type:'boolean'},
		{name: 'auth_is_admin',    type:'boolean'},
		{name: 'auth_is_root',    type:'boolean'},
		{name: 'login_str',   type: 'boolean'},
		{name: 'login_userId',   type: 'string'},
		{name: 'login_userName',   type: 'string'},
		{name: 'login_domainName', type: 'string'},
		{name: 'wallpaper_id', type: 'int'},
		{name: 'wallpaper_isStretch', type: 'boolean'},
		{name: 'db_needUpdate', type:'boolean'}
	],
	hasMany: [{
		model: 'OptimaDesktopCfgSdomainModel',
		name: 'sdomains',
		associationKey: 'sdomains'
	},{
		model: 'OptimaDesktopCfgShortcutModel',
		name: 'shortcuts',
		associationKey: 'shortcuts'
	}]
});


Ext.define('OptimaDesktopShortcutModel',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'name'},
		{name: 'iconCls'},
		{name: 'execRecord'}
	]
});


Ext.define('Optima5.AppMobile',{
	mixins: {
		observable: 'Ext.util.Observable'
	},
	requires: [
		'Optima5.LoginForm',
		'Ext.layout.container.Fit',
		'Ext.container.Viewport'
	],
	
	useQuickTips: true,
	
	desktopSessionId: null,
	desktopCfgRecord: null,
	
	moduleInstances: null,
	
	isReady: false,
	
	constructor: function(appCfg) {
		var me = this ;
		
		me.mixins.observable.constructor.call(this, appCfg);
		
		this.onReady() ;
		
		return me ;
	},
	
	
	onReady: function() {
		var me = this ;
		/*hide the gear*/
		var el = Ext.get("loading");
		if( el != null ) {
			el.hide();
			el.remove();
		}
		Ext.defer(me.startLogin,100,me) ;
	},
	
	startLogin: function() {
		var me = this ;
		
		
		var existingWin = Ext.getCmp('op5-login-form') ;
		if( existingWin != null ) {
			existingWin.destroy() ;
		}
		
		var loginForm = Ext.create('Ext.container.Viewport',{
			layout: 'fit',
			id:'op5-login-form',
			items: Ext.create('Optima5.LoginForm',{
				listeners: {
					loginfailed: me.onLoginFailed,
					loginsuccess: me.onLoginSuccess,
					scope:me
				}
			})
		});
	},
	onLoginFailed: function(win, errMsg) {
		var me = this ;
		Ext.Msg.alert('Initialization error', errMsg,function(){
			win.recycle() ;
		},me) ;
	},
	onLoginSuccess: function(win, sessionId, loginData) {
		var me = this ;
		//console.log('SessionID is: '+sessionId) ;
		win.close() ;
		me.desktopBoot(sessionId,loginData) ;
	},
	
	desktopGetBackendUrl: function() {
		return 'server/backend.php' ;
	},
	desktopGetSessionId: function() {
		var me = this ;
		return me.desktopSessionId ;
	},
	desktopGetCfgRecord: function() {
		var me = this ;
		return me.desktopCfgRecord ;
	},
	desktopGetCfgIsDev: function() {
		var me = this ;
		if( me.desktopCfgRecord ) {
			return me.desktopCfgRecord.get('dev_mode') ;
		}
		return null ;
	},
	desktopBoot: function(sessionId,loginData) {
		var me = this ;
		
		Ext.getBody().mask('Loading desktop...') ;
		
		/*
		 * Ajax request to retrieve sessionRecord
		 */
		Ext.Ajax.request({
			url: me.desktopGetBackendUrl(),
			params: {
				_sessionId: sessionId,
				_moduleId: 'desktop',
				_action: 'config_getRecord'
			},
			success: function(response) {
				var errorFn = function() {
					Ext.defer(function(){
						Ext.Msg.alert('Initialization error', 'Cannot boot desktop.\nPlease contact support.', function(){
							window.location.reload() ;
						}) ;
					},500);
					return ;
				}
				var responseObj ;
				
				try {
					responseObj = Ext.decode(response.responseText);
				} catch(e) {
					return errorFn() ;
				}
				
				if( responseObj.success==null || responseObj.success != true ) {
					return errorFn() ;
				}
				
				me.desktopSessionId = sessionId ;
				me.desktopLoginData = loginData ;
				
				desktop_mapSdomainModuleId = {} ;
				Ext.Array.each( responseObj.desktop_config.sdomains, function(sdomain) {
					var sdomainId = sdomain['sdomain_id'],
						moduleCode = sdomain['module_id'] ;
					desktop_mapSdomainModuleId[sdomainId] = moduleCode ;
				}) ;
				me.desktop_mapSdomainModuleId = desktop_mapSdomainModuleId ;
				//console.dir(desktop_mapSdomainModuleId) ;
				
				me.desktopCreate() ;
			},
			scope : me
		});
	},
	desktopCreate: function() {
		var me = this ;
		
		/*hide the gear*/
		var el = Ext.get("loading");
		if( el != null ) {
			el.hide();
			el.remove();
		}
		
		if (me.useQuickTips) {
			Ext.QuickTips.init();
		}
		
		me.moduleInstances = new Ext.util.MixedCollection();
		
		me.viewport = new Ext.container.Viewport({
			layout: 'fit',
			items: [],
			//cls: me.desktopCfgRecord.get('dev_mode') ? 'op5-viewport-devborder':''
		});
		
		window.onbeforeunload = this.onUnload ;
		
		/*hide mask (if any)*/
		Ext.defer(function(){
			Ext.getBody().unmask() ;
		},500,me);
		
		me.isReady = true;
		me.fireEvent('ready', me);
		
		//console.dir(me.desktopLoginData) ;
		
		var sdomainId = me.desktopLoginData['delegate_sdomainId'] ;
		if( Ext.isEmpty(sdomainId) ) {
			//Err
		}
		var moduleId = me.desktop_mapSdomainModuleId[sdomainId] ;
		if( Ext.isEmpty(moduleId) ) {
			//Err
		}
		
		var moduleCfg = {
			moduleId: moduleId,
			moduleHeadId: moduleId,
			moduleParams: {
				sdomain_id: sdomainId
			}
		}
		//console.dir(moduleCfg) ;
		me.moduleLaunch(moduleCfg) ;
	},
	getDesktop: function() {
		var me = this ;
		return me.desktop ;
	},
	onUnload : function(e) {
		return "Application running.\nLog out before closing window/page." ;
	},
	
	desktopGetLoginData: function() {
		return this.desktopLoginData ;
	},
	
	moduleLaunch: function( moduleCfg ) {
		var me = this ;
		
		
		// same module already started ?
		var rejectLaunch = false,
			runningModuleInstance = null ;
		me.moduleInstances.each( function( moduleInstance ) {
			if( moduleCfg.moduleId != moduleInstance.moduleId ) {
				return true ;
			}
			if( Ext.encode( moduleCfg.moduleParams || {} ) != Ext.encode( moduleInstance.moduleParams ) ) {
				// parametres différents
				return true ;
			}
			if( Ext.encode( moduleCfg.moduleParams || {} ) == Ext.encode( {} ) ) {
				// parametres vides
				if( Optima5.Helper.getModulesLib().modulesGetById(moduleCfg.moduleId).get('allowMultipleInstances') ) {
					return true ;
				}
			}
			rejectLaunch = true ;
			runningModuleInstance = moduleInstance
			return false ;
		},me) ;
		if( rejectLaunch ) {
			// ERR
			
			return ;
		}
		
		var moduleClass = '' ;
		switch( moduleCfg.moduleId ) {
			case 'spec_dbs_tracy' :
				moduleClass = 'Optima5.Modules.Spec.DbsTracy.DbsTracyModuleMobile' ;
				break ;
		}
		
		Ext.apply(moduleCfg,{
			app:me,
			listeners:{
				modulestart:me.onModuleStart,
				modulestop:me.onModuleStop,
				scope:me
			}
		}) ;
		Ext.create(moduleClass,moduleCfg) ;
	},
	/*
	getModuleByWindow: function( win ) {
		var me = this ;
		
		if( !(win instanceof Ext.window.Window) ) {
			win = win.up('window') ;
		}
		if( typeof win === 'undefined' ) {
			Optima5.Helper.logWarning('App:getModuleByWindow','undefined') ;
			return null ;
		}
		
		if( win.optimaModule != null && (win.optimaModule) instanceof Optima5.Module ) {
			return win.optimaModule ;
		}
		
		return null ;
	},
	*/
	onModuleStart: function( moduleInstance ) {
		var me = this ;
		me.moduleInstances.add(moduleInstance) ;
		//Optima5.Helper.logDebug('App:onModuleStart','Module Started') ;
	},
	onModuleStop: function( moduleInstance ) {
		var me = this ;
		if( me.moduleInstances.remove(moduleInstance) === false ) {
			console.log('App:onModuleStop : module not found ?') ;
		}
		//Optima5.Helper.logDebug('App:onModuleStart','Module Stopped') ;
	},
	eachModuleInstance: function(fn, scope){
		this.moduleInstances.each( fn, scope ) ;
	},
	
	
	onLogout: function() {
		var me = this ;
		Ext.Msg.confirm('Logout', 'Are you sure you want to logout?', function(btn){
			if( btn == 'yes' ){
				me.doLogout() ;
			}
		},me) ;
	},
	onSessionInvalid: function() {
		var me = this ;
		Ext.Msg.alert('Session closed', 'Your session has been terminated',function(){
			me.endStandby(false) ;
		}) ;
	},
	doLogout: function() {
		var me = this ;
		if( me.desktop && !me.forceCloseAllWindows() ) {
			return ;
		}
		Ext.Ajax.request({
			url: 'server/login.php',
			params: {
				_action: 'logout',
				_sessionId: me.desktopGetSessionId()
			},
			success: function(response) {
				if( Ext.decode(response.responseText).done != true ) {
					Ext.Msg.alert('End session','Cannot delete session. Timed out ?') ;
				}
				me.endStandby(true);
			},
			scope : me
		});
	},
	endStandby: function(doAnimate) {
		var me = this,
			animDuration = doAnimate? 500 : 0 ;
		
			me.viewport.removeCls('op5-viewport-devborder');
			me.eachModuleInstance( function(moduleInstance) {
				moduleInstance.setPanel(null) ;
			},me) ;
			me.viewport.destroy() ;
			
			me.delayReboot() ;
		
		window.onbeforeunload = null ;
		
		var el = Ext.get("standby");
		el.setOpacity(0);
		el.show();
		el.animate({
			duration: animDuration,
			to: {
				opacity: 1
			}
		});
	},
	
	delayReboot: function() {
		Ext.defer( function() {
			var el = Ext.get("standby");
			el.hide();
			
			this.startLogin() ;
		},2000,this) ;
	}
});
