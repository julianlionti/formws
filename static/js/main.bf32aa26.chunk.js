(this["webpackJsonpformws-example"]=this["webpackJsonpformws-example"]||[]).push([[0],{14:function(e,t,r){e.exports=r(38)},15:function(e,t,r){},37:function(e,t,r){},38:function(e,t,r){"use strict";r.r(t);r(15);var a=r(0),n=r.n(a),o=r(11),s=r.n(o);r(12);function c(){return(c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e}).apply(this,arguments)}"undefined"!==typeof Symbol&&(Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator"))),"undefined"!==typeof Symbol&&(Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")));var u=Object(a.createContext)({dispatch:function(){},state:{}}),l={isLoading:!1,url:""},i=function(e,t){var r=t.key,a=t.data;switch(t.type){case"clean":var n;return c({},e,((n={})[r]=c({},l,{url:e[r].url}),n));case"request":var o,s=!(t.error||t.results);return c({},e,((o={})[r]=c({},e[r],{isLoading:s,data:s&&a?a:t.results||e[r].data,error:s?void 0:t.error||e[r].error}),o))}},f=function(e){var t=e.children,r=e.urls,o=e.headers,s=e.defaultParams,f=e.user,m=e.timeout,d=e.onUser,b=Object.keys(r).reduce((function(e,t){var a;return c({},e,((a={})[t]=c({},l,{url:r[t]}),a))}),{}),y=Object(a.useState)(f),p=y[0],v=y[1];Object(a.useEffect)((function(){d&&(null===p||Object.keys(p).length>0)&&d(p)}),[p]);var h=Object(a.useReducer)(i,b),S=h[0],g=h[1];return n.a.createElement(u.Provider,{value:{state:S,dispatch:g,headers:o,defaultParams:s,timeout:m,user:p,setUser:v}},t)},m=(r(37),r(13),"https://stage.fidus.com.ar/api"),d=("".concat(m,"/v1/branch_offices"),"".concat(m,"/v2/categories"),function(){return n.a.createElement(f,{urls:{get:"sarasa"}},n.a.createElement("div",null,n.a.createElement("button",null,"Cambair estado")))});s.a.render(n.a.createElement(d,null),document.getElementById("root"))}},[[14,1,2]]]);
//# sourceMappingURL=main.bf32aa26.chunk.js.map