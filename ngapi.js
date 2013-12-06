'use strict';
angular.module('ngapi',[])
	.factory('apiroutes',['api','$http',function(api, $http){
		if(typeof api.url == 'string'){
			return api.url;
		}else if (typeof api.url == 'object'){
			var routes = {};
			angular.forEach(api.url,function(v,i,o){
				var h = /http:/;
				$http.get(v).success(function(data){
					routes[i] = data;
					if(h.test(v)){
						routes[i].url = 'http://'+v.replace('http://','').split('/')[0]; 
					};
				});
			})
			return routes;
		};
	}])
	.service('apitools',function($http){
		this.apiroutes = {},
		this.status = [],
		/* validate method part , you can expand it by apivalidate*/
		/* if false , it can't pass this api */
		this.validate = {
			email:function(v){
				var _ckEmail = /.+\@.+\..+/;
				return _ckEmail.test(v);
			},
			number:function(v){
				var _cknumber = /[0-9]/g;
				return _cknumber.test(v);	
			},
			string:function(v){
				var _chspec = /\w+/;
				if(v.match(_chspec)[0] == v){
					return true;
				}else{
					return false;
				}
			},
			nospace:function(v){
				var _ckspace = /\s/g;
				return !_ckspace.test(v);
			}
		},
		/* reg parse method */
		this.reg = {
			init:function(v){
				return v.split(/^\(/)[1].split(/\)$/)[0].split('||');
			},
			specColon:function(v){
				var _v = /:/;
				if(_v.test(v)){
					return v.split(/:/);	
				}else{
					return false;
				}
			}
		},		
		this.api = {
			scope : {},
			validatedata :(function(data,_this,apivalidate){
				this.status.length = 0;
				var _c = this.reg.specColon; 
				var validate = this.validate;
				angular.forEach(data,function(v,i,o){
					if(validate[_c(v)[1]]){
					//Following is use apitools to validate.
						if(!!!validate[_c(v)[1]](_this[_c(v)[0]])){
							this.status.push(false);
						}
					}else{
					//Following is use user setting to validate.
						if(!!!apivalidate[_c(v)[1]](_this[_c(v)[0]])){
							this.status.push(false);
						}
					}
				});
			}).bind(this),			
			typeofapi:function(){
				return typeof apiroutes
			},
			//if pass validate
			passcheck: (function(api){
				return this.reg.specColon(api[0])[0] || this.apiroutes[api[0].split('.')[0]][api[0].replace(api[0].split('.')[0]+'.','')].methods[0].toLowerCase();
			}).bind(this),
			//
			http:(function (method,url,data,success,err){
				var _http = $http;
				_http[method](url,data)
				.success(function(d,s,h,c){
					if(!!success){
						return success.apply(success,[d,s,h,c]);
					}
				})
				.error(function(d,s,h,c){
					if(!!err){
						return err.apply(err,[d,s,h,c]);	
					}
				});
			}).bind(this),
			get:(function(){
				return{
					url:(function(type,api){
						switch(type){
							case 'string':
								return this.apiroutes+this.reg.specColon(api[0])[1]
								break;
							case 'object':
								return this.apiroutes[api[0].split('.')[0]].url+this.apiroutes[api[0].split('.')[0]][api[0].replace(api[0].split('.')[0]+'.','')].path;
								break;
						}
					}).bind(this),
					data:(function(){
						//
					}).bind(this)
				}
			}).bind(this),
			sentapi:function(methods,api,data,success,err){
				var get = this.get();
				var _this = this.scope;
				var $_http = this.http;
				switch (methods){
						case 'get':
							if(this.typeofapi == 'string'){
								var url = get.url('string',api);
								var _sd = {};
								angular.forEach(data,function(v,i,o){
									_sd[v.split(':')[0]]=_this[v.split(':')[0]]
								});
								return $_http('get',url,{params: _sd});	
							}else{
								var url = get.url('object',api);
								return $_http('get', url, '', _this[success], _this[err]);
							}
							break;
						case 'post':
							if (this.typeofapi == 'string'){
								var url = get.url('string',api);
							}else{
								var url = get.url('object',api); 
							}
							var _sd = {};
							angular.forEach(data,function(v,i,o){
								_sd[v.split(':')[0]]=_this[v.split(':')[0]];
							});
							return $_http('post', url, _sd, _this[success], _this[err]);
							break;
						case 'restfullogin':
							// var _nonce = this.reg.specColon(api[0])[1];
							// var _login = api[1];
							// $http.get(apiroutes+_nonce).success(function (data) {
							// 	var password = apicrypto(_this.password);
							// 	var hash = apicrypto([password, data.data.nonce, apicnonce].sort().join(''));
							// 	return 
							// 		$_http('post',apiroutes+_login,{
							// 			login: _this.user,
							// 			cnonce: apicnonce, 
							// 			hash: hash, 
							// 			key: data.data.key
							// 		});
							// });
						break;
					};
			},
			//if type has some error
			error:{
				typeError: function(){
					throw new SyntaxError('Your ng-api value is wrong! must be=>(data)(method:apiurl)');
				}
			}
		};
	})
	.directive('ngApi',['apiroutes', 'apitools', 'api', '$http',function(apiroutes, apitools, api, $http){
		return {
			replace: true,
			restrict: "AE",
			link: function (scope, elem, attr) {
				//Setting cross domain
				$http.defaults.useXDomain = true;

				var apicnonce = api.cnonce || '';
				var apicrypto = api.crypto || '';
				var apivalidate = api.validate || {};

				var _s = attr.ngApi.replace(' ','');
				var _d = /(\(.*\))(\(.*\))/; //()()
				var _dd = /(^\(\(|^\(\w+\(.*)/; // (())
				
				var _data = _s.match(_d);

				var s = apitools.api; 
				apitools.apiroutes = apiroutes;
				var _this =scope;
				elem.bind('click',function(){
					s.scope = _this;
					if(!_d.test(_data[1]) && !_data[1].match(_dd) && !_data[2].match(_dd)){
						//(data...)(api...)
						var data = apitools.reg.init(_data[1]);//show data
						var api = apitools.reg.init(_data[2]); //show api
						s.validatedata(data,_this,apivalidate);
						var methods = s.passcheck(api);
						if (status.length==0){
							return s.sentapi(methods, api, data, attr.apiSuccess, attr.apiError);
						};
					}else{
						if(){
							
						}
						else{
							return s.error.typeError();
						}
					};
				});	
			},
		};
	}]);
