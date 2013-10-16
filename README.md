ngApi
=========

An AngularJS module that makes your APIs working in the Angular Way.
You only write html tag , `DON'T NEED TO` write too many Ajax by javascript.

Example:

```html
<input type="" ng-model="loginname"/>
<input type="" ng-model="loginemail"/>
<input type="" ng-model="loginpassword"/>

<a ng-api="(loginname:string||loginemail:email||loginpassword:nospace)(post:/api/login)">send</a>
```

Description:

* (loginname:string...):
    
1. `loginname` means it may fetch loginname ng-model's data, and `string` means you will validate loginname ng-model's data whether be a string.

    In this module, we only have four validate methods:
        
        1.email 
        2.number 
        3.string 
        4.nospace
        
    If you want to expand validate methods, see that: [click me](https://github.com/iamblue/ngApi#Expand)

2. `loginname`, `loginemail` , `loginpassword` will be sent by ajax data , look like following:

```javascript 
    data:{
        loginname:loginname,
        loginemail:loginemail,
        loginpassword:loginpassword
    }
```

* (post:/api/login): `post` means it may post to `/api/login`.



Install
=======

```bash
bower install ngapi
```

Add following into your Html `<head>`:

```
<script src="bower_components/ngapi/ngapi.js"></script>
```



Usage
=======

### Require ngapi and Inject the Services

Init:

```javascript
angular.module('yourApp', ['ngapi'])
```

Setting API url: 

* For example: http://127.0.0.1:3000
  
```javascript 
  .constant('apiurl','http://127.0.0.1:3000')
```
  
* If your api server can sent all of your api routes (json), try that:

```javascript
.constant('apiurl',{
  routes:'http://127.0.0.1:3000/youmeb/routes.json',
  //you can make many routes , ngapi will combine it to a scope.
});
```

Expand
=======

### If you want to expand validate libery:

```javascript
.constant('apivalidate',{
    date:function(v){
        // your new validate method
    }
});
```

  
### If you want to authentication login by RESTful architecture

On common authentication RESTful architecture, we need browser make a Cnonce constant and crypo your `"password code"+snonce( nonce form server)+c_nonce` and send it back to your server.

* Step1: Make a Cnonce : 

```javascript
.constant('apicnonce','cnonce')  // 'cnonce' can include a function which will make a new cnonce code 
```

* Step2: Add a apicrypto algo:

```javascript 
.constant('apicrypto',function(){
    //your crypto algo, for example :sha1,md5 ... etc
})

```

###Reference:

About RESTful Authentication, I sugguest you to read follow paper:

* [Cryptographic nonce](http://en.wikipedia.org/wiki/Cryptographic_nonce)
* [Digest access authentication](http://en.wikipedia.org/wiki/Digest_access_authentication)



