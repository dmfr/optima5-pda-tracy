Ext.define('Optima5.ModuleMobile',{
	mixins: {
		observable: 'Ext.util.Observable'
	},
	requires: [
		'Optima5.Ajax.Connection',
		'Optima5.Ajax.Proxy'
	],
	
	app: null,
	
	moduleId : '',
	backendModuleId : '',
	sdomainId : null,
	moduleParams : null,
	
	windows: null,
	
	constructor: function( moduleCfg ) {
		var me = this;
		me.mixins.observable.constructor.call(this, moduleCfg);
		
		if( moduleCfg.app == null || !(moduleCfg.app instanceof Optima5.AppMobile) ) {
			console.log('Module:constructor : missing/invalid App reference') ;
			return null ;
		}
		
		/*
		if( moduleCfg.moduleId == null ) {
			console.log('Module:constructor : no moduleId ?') ;
			return null ;
		}
		
		var moduleDescRecord = Optima5.Helper.getModulesLib().modulesGetById(moduleCfg.moduleId) ;
		if( moduleDescRecord == null ) {
			console.log('Module:constructor : unknown moduleId') ;
			return null ;
		}
		*/
		
		/*
		var moduleParams = moduleCfg.moduleParams || {} ;
		switch( moduleDescRecord.get('moduleType') ) {
			case 'sdomain' :
				if( moduleParams == null || moduleParams.sdomain_id == null || moduleParams.sdomain_id == '' ) {
					console.log('Module:constructor : sdomain_id missing') ;
				} else {
					me.sdomainId = moduleParams.sdomain_id ;
				}
				break ;
		}
		*/
		
		me.app = moduleCfg.app ;
		me.moduleId = moduleCfg.moduleId ;
		me.moduleHeadId = moduleCfg.moduleHeadId ;
		me.sdomainId = moduleCfg.moduleParams.sdomain_id ;
		
		me.moduleParams = moduleCfg.moduleParams ;
		
		me.windows = new Ext.util.MixedCollection();
		
		me.initModule( moduleCfg ) ;
		
		return me ;
	},
	initModule: function() {
		// To override
	},
	
	setPanel: function(config) {
		var me = this ;
		
		if( !config ) {
			var fullscreenViewport = Ext.ComponentQuery.query('viewport')[0] ;
			fullscreenViewport.items.each( function(cmp) {
				cmp.destroy() ;
			}) ;
			return ;
		}
		
		//console.dir( me.app.desktopGetLoginData() ) ;
		var desktopGetLoginData = me.app.desktopGetLoginData(),
			delegate_userId = desktopGetLoginData['delegate_userId'],
			delegate_sdomainTxt = desktopGetLoginData['delegate_sdomainId'],
			login_domainName = desktopGetLoginData['login_domain'] ;
		
		var titleTxt = [
			'User : '+delegate_userId,
			'App : '+delegate_sdomainTxt,
			'Domain : '+login_domainName
		];
		titleTxt = titleTxt.join('&#160;&#160;/&#160;&#160;') ;
		
		if( !config ) {
			config = {} ;
		}
		Ext.apply( config, {
			optimaModule: me,
			isMainWindow: true,
			//title: me.getWindowTitle( config.title )
		}) ;
		
		var fullscreenViewport = Ext.ComponentQuery.query('viewport')[0] ;
		var panel, cfg = Ext.apply(config || {}, {
			width: null,
			height: null,
			icon: '',
			//iconCls: iconCls,
			border: false,
			resizable: false,
			title: titleTxt,
			tools: [{
				type: 'close',
				handler: function(e, t, p) {
					me.app.onLogout();
				},
				scope: this
			}]
		});
		cls = Ext.panel.Panel;
		panel = fullscreenViewport.add(new cls(cfg));
		
		me.fireEvent('modulestart',me) ;
		
		me.windows.add(panel) ; // HACK
		return ;
		
	},
	
	createWindow: function(config, cls) {
		var me = this ;
		var moduleDescRecord = Optima5.Helper.getModulesLib().modulesGetById(me.moduleId) ;
		
		var iconCls ;
		switch( moduleDescRecord.get('moduleType') ) {
			case 'sdomain' :
				iconCls = Optima5.Helper.getIconsLib().iconGetCls16(me.app.desktopGetCfgRecord().sdomains().getById(me.sdomainId).get('icon_code')) ;
				break ;
			default :
				iconCls = Optima5.Helper.getIconsLib().iconGetCls16(moduleDescRecord.get('iconCode')) ;
				break ;
		}
		
		if( !config ) {
			config = {} ;
		}
		Ext.apply( config, {
			optimaModule: me,
			isMainWindow: (me.windows.getCount() == 0),
			title: me.getWindowTitle( config.title )
		}) ;
		Ext.applyIf( config,{
			width:800,
			height:600,
			layout: {
				type: 'fit',
				align: 'stretch'
			},
			iconCls: iconCls
		}) ;
		
		if( me.app.getDesktop() == null ) {
			// standalone / fullscreen mode (delegate)
			var desktopGetCfgRecord = me.app.desktopGetCfgRecord(),
				login_userId = desktopGetCfgRecord.get('login_userId'),
				delegate_userId = login_userId.split(':')[0],
				delegate_sdomainTxt = desktopGetCfgRecord.sdomains().getById(me.sdomainId).get('sdomain_name'),
				login_domainName = desktopGetCfgRecord.get('login_domainName') ;
			
			var titleTxt = [
				'User : '+delegate_userId,
				'App : '+delegate_sdomainTxt,
				'Domain : '+login_domainName
			];
			titleTxt = titleTxt.join('&#160;&#160;/&#160;&#160;') ;
			
			var fullscreenViewport = Ext.ComponentQuery.query('viewport')[0] ;
			if( fullscreenViewport.items.getCount() == 0 ) {
			} else {
				var win, cfg = Ext.applyIf(config || {}, {
					stateful: false,
					isWindow: true,
					constrainHeader: true
				});
				cls = cls || Ext.window.Window;
				win = fullscreenViewport.add(new cls(cfg));
			}
		} else {
			var win = me.app.getDesktop().createWindow(config,cls) ;
			win.on('boxready',function(twin) {
				me.app.alignNewWindow(twin) ;
			},me,{single:true}) ;
		}
		
		var fireStart = false ;
		if( me.windows.getCount() == 0 ) {
			fireStart = true ;
		}
		me.windows.add(win) ;
		if( fireStart ) {
			me.fireEvent('modulestart',me) ;
		}
		win.fireEvent('windowattach',win) ;
		
		win.on({
			beforeclose: me.onWindowClose,
			destroy: me.onWindowDestroy,
			scope: me
		});
		
		win.show();
		
		return win ;
	},
	
	getApp: function() {
		var me = this ;
		return me.app ;
	},
	getSdomainRecord: function() {
		var me = this ;
		return me.getApp().desktopGetCfgRecord().sdomains().getById(me.sdomainId) ;
	},
	getModuleDescRecord: function() {
		var me = this ;
		return Optima5.Helper.getModulesLib().modulesGetById(me.moduleHeadId||me.moduleId) ;
	},
	
	getConfiguredAjaxParams: function() {
		var me = this,
			obj = {
				_sessionId: me.app.desktopGetSessionId(),
				_moduleId: ( ( me.backendModuleId != null && me.backendModuleId != '' ) ? me.backendModuleId : me.moduleId )
			} ;
		if( me.sdomainId != null ) {
			obj['_sdomainId'] = me.sdomainId
		}
		return obj ;
	},
	getConfiguredAjaxConnection: function() {
		var me = this ;
		return Ext.create('Optima5.Ajax.Connection',{
			optUrl: me.app.desktopGetBackendUrl(),
			optParams: me.getConfiguredAjaxParams()
		}) ;
	},
	getConfiguredAjaxProxy: function(config) {
		var me = this ;
		Ext.apply(config,{
			optUrl: me.app.desktopGetBackendUrl(),
			optParams: me.getConfiguredAjaxParams()
		}) ;
		return Ext.create('Optima5.Ajax.Proxy',config) ;
	},
	
	
	getViewport: function() {
		return Ext.ComponentQuery.query('viewport')[0] ;
	},
	
	
	selfDestroy: function() {
		var me = this ;
		delete me.app ;
		me.fireEvent('modulestop',me) ;
	},
	
	postCrmEvent: function( crmEvent, postParams ) {}
});
