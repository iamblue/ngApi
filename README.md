ngApi
=========

An AngularJS module that makes your APIs working in the Angular Way.
You only write html tag , `DON'T NEED TO` write too many Ajax by javascript in your angualr controller!!!!! lol

Example:

```html
<input type="" ng-model="loginname"/>
<input type="" ng-model="loginemail"/>
<input type="" ng-model="loginpassword"/>

<a ng-api="(loginname:string||loginemail:email||loginpassword:nospace)(post:/api/login)" api-success="if you have or not" api-error="if you have or not">send</a>
```

##Description

* (loginname:string...):
    
1. `loginname` means it will retreive loginname (ng-model's data), and `string` means you will validate loginname (ng-model's data) whether be a string.

    In this module, we have four validate methods initailly:
        
        1.email 
        2.number 
        3.string 
        4.nospace
        
    If you want to expand validate methods, [see](https://github.com/iamblue/ngApi#if-you-want-to-expand-validate-libery)

2. `loginname`, `loginemail` , `loginpassword` will be sent by ajax data , look like following:

```javascript 
    data:{
        loginname:loginname,
        loginemail:loginemail,
        loginpassword:loginpassword
    }
```
3. More infomations: [see](https://github.com/iamblue/ngApi#ng-api-style-ng-api--dataapi)



* (post:/api/login): `post` means it will post to `/api/login`.



Install
=======

```bash
bower install ngapi
```

Add following into your Html `<head>`:

```html
<script src="bower_components/ngapi/ngapi.js"></script>
```



Usage
=======

### Require ngapi and Inject the Services

Init:

```javascript
angular.module('yourApp', ['ngapi'])
```

### Setting API constant:

__For example :__

```javascript 
.constant('api', {
    url: {  // must write it!
        routes: 'http://localhost:3000/youmeb/routes.json'
    },
    validate: {  // If you have, write it.
        //Input your setting validate way
    },
    crypto: function(){}, // If you have, write it. 
    cnonce: 'cnonce', // If you have, write it.
})
```

__Explain above api :__

`url`:

* For example: http://127.0.0.1:3000
  
```javascript 
.constant('api',{
    //....
    url: 'http://127.0.0.1:3000'
})
```
  
* If you have all of your api routes (json) from your api server, try that:

```javascript
.constant('api',{
    //...
    url: {
        routes:'http://127.0.0.1:3000/youmeb/routes.json'
        //you can add many routes , ngapi will combine it to a scope.
    }
});
```
==> more info: [see](https://github.com/iamblue/ngApi#ng-api-style-ng-api--dataapi)

`validate`:

==> more info: [see](https://github.com/iamblue/ngApi#expand)

`crypto` && `cnonce`:

==> more info: [see](https://github.com/iamblue/ngApi#if-you-want-to-authentication-login-by-restful-architecture)




### Setting `ng-api` style in yout HTML : ng-api = "(data)(api)" 

1. data : (model_name : validate ||.....)
    
    1. model_name
    2. validate

2. api: 
    
* (request:path): 
    request method: `post` , `get` , `restfullogin`

    For example: post:/api/getnavs , get:/api/getnavs , restfullogin:/api/rest-auth/login ...etc
* (routes.api.getnavs):
    
    if you use:

```javascript
.constant('api',{
    //...
    url: {
        routes:'http://127.0.0.1:3000/youmeb/routes.json'
        //you can add many routes , ngapi will combine it to a scope.
    }
});
```
And the json content like that:

```javascript   
{
    api.getnavs: {
        path: "/api/getnavs",
        methods: [
            "get"
        ]
    }
}
```
You can use (routes.api.getnavs) , it will help you retreive `get` and `/api/getnavs` data.


## After sending api , it response success callback / error callback:

You can use `api-success` or `api-error` to callback it.

```html
<a ng-api="(loginname:string||loginemail:email||loginpassword:nospace)(post:/api/login)" api-success="your scope function" api-error="your scope function">send</a>
    
```


Expand
=======

### If you want to expand validate libery:

```javascript
.constant('api',{
    //....
    validate:{
        date: function(){
        // your new validate method
        }
        //....
    }
});
```

  
### If you want to authentication login by RESTful architecture

On a common REST-authentication architecture, we need browser make a Cnonce constant and crypo your `"password code"+snonce( nonce form server)+c_nonce` and send it back your server.

* Step1: Make a Cnonce : 

```javascript
.constant('api',{
    //....
    cnonce:'cnonce',
})  // 'cnonce' can include a function which will make a new cnonce code 
```

* Step2: Add a apicrypto algo:

```javascript 
.constant('api',{
    //....
    cnonce: 'cnonce',
    crypto: function(){
        //your crypto algo, for example :sha1,md5 ... etc
    }
})
```

###Reference:

About REST-Authentication, I sugguest you to read following paper:

* [Cryptographic nonce](http://en.wikipedia.org/wiki/Cryptographic_nonce)
* [Digest access authentication](http://en.wikipedia.org/wiki/Digest_access_authentication)



