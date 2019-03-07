/*
 * References :
 * http://stackoverflow.com/questions/14920869/how-to-display-image-on-center-extjs-4
 */
Ext.define('Optima5.LoginForm',{
	extend  :'Ext.form.Panel',
	
	requires: [
		'Ext.form.field.Display'
	],
	
	loginSent: false,
	
	initComponent:function() {
		var me = this ;
		
		Ext.apply(me,{
			//xtype:'form',
			//frame:true,
			bodyPadding: 10,
			bodyCls: 'ux-noframe-bg',
			//region: 'center',
			defaultType: 'textfield',
			fieldDefaults: {
					labelAlign: 'top',
					anchor: '100%',
					margin: '10 0 15 0'
			},
			listeners: {
				afterRender: function(thisForm, options){
					this.keyNav = Ext.create('Ext.util.KeyNav', this.el, {                    
							enter: me.doLogin,
							scope: me
					});
				}
			},
			title: 'Optima5 Login',
			items: [{
				xtype:'displayfield',
				value: '<b>Please enter login information</b>'
			},{
				fieldLabel: 'User @ Domain',
				allowBlank: false,
				msgTarget:'side',
				name: 'user'
			},{
				fieldLabel: 'Password',
				inputType: 'password',
				name: 'password'
			}],
			buttons: [{
				itemId: 'btnEnter',
				text: "Login",
				handler: me.doLogin,
				scope:me
			}]
		});
		
		this.callParent() ;
		
		me.on('beforedestroy',me.onBeforeDestroy,me) ;
	},
	doLogin: function() {
		var me = this ;
		if( me.loginSent ) {
			return ;
		}
		
		me.loginSent=true;
		Ext.getBody().mask('Logging in...') ;
		me.query('#btnEnter')[0].setDisabled(true) ;
		
		var form = me.getForm() ;
		var userStr = form.findField('user').getValue() ;
		var passStr = form.findField('password').getValue() ;
		
		var tarr = (userStr!='') ? userStr.split('@') : []
			, loginDomain, loginUser
			, loginPass = passStr ;
		switch( tarr.length ) {
			case 2 :
				loginUser = tarr[0];
				loginDomain = tarr[1];
				break ;
			case 1 :
				loginUser = 'root' ;
				loginDomain = tarr[0];
				break ;
			default :
				Ext.MessageBox.alert('Login failed', 'Invalid user parameter (user@domain)');
				me.recycle() ;
				return ;
		}
		
		Ext.Ajax.request({
			url: 'server/login.php',
			params: {
				_action: 'login',
				login_domain: loginDomain,
				login_user  : loginUser,
				login_password: loginPass
			},
			success: function(response) {
				if( !Ext.isEmpty(Ext.decode(response.responseText).redirect) ) {
					 window.location.href = Ext.decode(response.responseText).redirect;
					 return ;
				}
				if( Ext.decode(response.responseText).done == false ) {
					Ext.getBody().unmask() ;
					
					if( Ext.decode(response.responseText).errors )
						var mstr = Ext.decode(response.responseText).errors.join('\n') ;
					else
						var mstr = 'Cannot open session. Contact admin.' ;
					/*
					Ext.Msg.alert('Initialization error', mstr,function(){
						window.location.reload() ;
					}) ;
					*/
					me.fireEvent('loginfailed',me, mstr) ;
					return ;
				}
				
				var objLoginData = Ext.decode(response.responseText).login_data ;
				//console.dir( Ext.decode(response.responseText).login_data ) ;
				me.fireEvent('loginsuccess',me, objLoginData['session_id'], objLoginData) ;
				return ;
			},
			scope : me
		});
	},
	recycle: function() {
		var me = this ;
		var form = me.getForm() ;
		form.findField('password').setValue() ;
		me.query('#btnEnter')[0].setDisabled(false) ;
		me.loginSent = false ;
		Ext.getBody().unmask() ;
	},
	
	onBeforeDestroy: function() {
		var me = this,
			docBody = Ext.getBody() ;
		if( docBody.isMasked() ) {
			docBody.unmask() ;
		}
	}
	
});
