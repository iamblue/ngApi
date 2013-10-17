'use strict';
angular.module('ngapi',[])
	.factory('apiroutes',['apiurl','$http',function(apiurl, $http){
        if(!!apiurl){
        	return apiurl;
        }else{
        	var routes = {};
        	angular.forEach(apiurl,function(v,i,o){
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
	.service('apitools',function(){
		/* validate method part , you can expand it by apivalidate*/
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
				var _ckspace = /\s/;
				if(_ckspace.test(v)){
					return false;
				}else{
					return true;
				}	
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
		}
	})
	.directive('ngApi',['apiroutes','apicrypto','apicnonce', 'apitools', 'apivalidate', '$http',function(apiroutes, apicrypto, apicnonce, apitools, apivalidate, $http){
		return {
			replace: true,
        	restrict: "AE",
        	link: function (scope, elem, attr) {
        		var _this = scope;
        		var _s = attr.ngApi;
        		_s = _s.replace(' ','');
        		var _d = /(\(.*\))(\(.*\))/; //()()
        		var _dd = /(^\(\(|^\(\w+\(.*)/; // (())
        		var _data = _s.match(_d);

        		elem.bind('click',function(){
        			if(!_d.test(_data[1]) && !_data[1].match(_dd) && !_data[2].match(_dd)){
	        			var _tmpdata = apitools.reg.init(_data[1]);
	        			var _tmpapi = apitools.reg.init(_data[2]);
	        			if(!!_data[3]){
	        				var _tmpvalidateerr = apitools.reg.init(_data[3]);	
	        			}
	        			var _ckapi = /:/;

	        			angular.forEach(_tmpdata,function(v,i,o){
	        				if(apitools.validate[apitools.reg.specColon(v)[1]]){
	        					if(!!!apitools.validate[apitools.reg.specColon(v)[1]](_this[apitools.reg.specColon(v)[0]])){
	        						if(!!_data[3]){
	        							_this[_tmpvalidateerr](apitools.reg.specColon(v)[0]);
	        						}
	        						return false;
	        					}	
	        				}else{
	        					if(!!!apivalidate[apitools.reg.specColon(v)[1]](_this[apitools.reg.specColon(v)[0]])){
	        						if(!!_data[3]){
	        							_this[_tmpvalidateerr](apitools.reg.specColon(v)[0]);
	        						}
	        						return false;
	        					}
	        				}
	        			});

	        			var _m = apitools.reg.specColon(_tmpapi[0])[0] || apiroutes[_tmpapi[0].split('.')[0]][_tmpapi[0].replace(_tmpapi[0].split('.')[0]+'.','')].methods[0];
	        			_m = _m.toLowerCase();
	        			
	        			var _success = attr.apiSuccess;
	        			var _error = attr.apiError;

	        			$http.defaults.useXDomain = true;

	        			switch (_m){
	        				case 'get':
	        					if(_ckapi.test(_tmpapi)){
	        						var _sd = {};
									angular.forEach(_tmpdata,function(v,i,o){
										_sd[v.split(':')[0]]=_this[v.split(':')[0]]
									});
	        						$http.get(apiroutes+apitools.reg.specColon(_tmpapi[0])[1],{params: _sd})
	        						.success(function(data){
	        							if(!!_this[_success]){
	        								return _this[_success](data);	
	        							}else{
	        								return ;
	        							};
	        						})
	        						.error(function(data){
	        							if(!!_this[_error]){
	        								return _this[_error](data);	
	        							}else{
	        								return ;
	        							};
	        						})	
	        					}else{
	        						$http.get(apiroutes[_tmpapi[0].split('.')[0]].url+apiroutes[_tmpapi[0].split('.')[0]][_tmpapi[0].replace(_tmpapi[0].split('.')[0]+'.','')].path)
	        						.success(function(data){
	        							if(!!_this[_success]){
	        								return _this[_success](data);	
	        							}else{
	        								return ;
	        							};
	        						})
	        						.error(function(data){
	        							if(!!_this[_error]){
	        								return _this[_error](data);	
	        							}else{
	        								return ;
	        							};
	        						})
	        					}
								break;
							case 'post':
								var _url = apiroutes+apitools.reg.specColon(_tmpapi[0])[1];
								var _sd = {};
								angular.forEach(_tmpdata,function(v,i,o){
									_sd[v.split(':')[0]]=_this[v.split(':')[0]]
								});
								$http.post(_url,_sd).success(function(data){
						    		if(!!_this[_success]){
        								return _this[_success](data);	
        							}else{
        								return ;
        							};
							    });
								break;
							case 'restfullogin':
								var _nonce = apitools.reg.specColon(_tmpapi[0])[1];
								var _login = _tmpapi[1];
								$http.get(apiroutes+_nonce).success(function (data) {
							      	var password = apicrypto(_this.password);
							      	var hash = apicrypto([password, data.data.nonce, apicnonce].sort().join(''));
								    $http.post(apiroutes+_login,{
								      	login: _this.user,
								      	cnonce: apicnonce, 
								      	hash: hash, 
								      	key: data.data.key
								    }).success(function(data){
								    	//console.log(data);
								    	if(!!_this[_success]){
	        								return _this[_success](data);	
	        							}else{
	        								return ;
	        							};
								    });
							    });
							    break;
						};
	        		}else{
	        			console.log('Your ng-api value is wrong! must be=>(data)(method:apiurl)')
	        		};
        		});	
        	},
		};
	}]);

		
