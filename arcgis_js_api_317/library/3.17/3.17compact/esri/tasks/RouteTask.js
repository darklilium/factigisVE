// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.17/esri/copyright.txt for details.
//>>built
define("esri/tasks/RouteTask","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/has ../kernel ../graphic ../request ../geometry/normalizeUtils ./Task ./RouteResult ./NAMessage ./NAServiceDescription".split(" "),function(e,g,m,n,p,A,q,r,s,B,C,D){e=e([s,D],{declaredClass:"esri.tasks.RouteTask",_eventMap:{"solve-complete":["result"]},constructor:function(a){this._url.orig=this._url.path;this._url.path+="/solve";this._handler=g.hitch(this,this._handler);this.registerConnectEvents()},__msigns:[{n:"solve",
c:3,a:[{i:0,p:["stops.features","barriers.features","polylineBarriers.features","polygonBarriers.features"]}],e:2}],_handler:function(a,e,l,h,k){try{var d=[],b=[],E=a.directions||[],g=a.routes?a.routes.features:[],u=a.stops?a.stops.features:[],n=a.barriers?a.barriers.features:[],p=a.polygonBarriers?a.polygonBarriers.features:[],q=a.polylineBarriers?a.polylineBarriers.features:[],t=a.messages,f=m.forEach,v=m.indexOf,w=!0,c,x,y=a.routes&&a.routes.spatialReference||a.stops&&a.stops.spatialReference||
a.barriers&&a.barriers.spatialReference||a.polygonBarriers&&a.polygonBarriers.spatialReference||a.polylineBarriers&&a.polylineBarriers.spatialReference;this._chk=a.checksum;f(E,function(a){d.push(c=a.routeName);b[c]={directions:a}});f(g,function(a){if(-1===v(d,c=a.attributes.Name))d.push(c),b[c]={};b[c].route=a});f(u,function(a){x=a.attributes;if(-1===v(d,c=x.RouteName||"esri.tasks.RouteTask.NULL_ROUTE_NAME"))d.push(c),b[c]={};"esri.tasks.RouteTask.NULL_ROUTE_NAME"!==c&&(w=!1);void 0===b[c].stops&&
(b[c].stops=[]);b[c].stops.push(a)});0<u.length&&!0===w&&(b[d[0]].stops=b["esri.tasks.RouteTask.NULL_ROUTE_NAME"].stops,delete b["esri.tasks.RouteTask.NULL_ROUTE_NAME"],d.splice(m.indexOf(d,"esri.tasks.RouteTask.NULL_ROUTE_NAME"),1));var z=[];f(d,function(a,c){b[a].routeName="esri.tasks.RouteTask.NULL_ROUTE_NAME"===a?null:a;b[a].spatialReference=y;z.push(new B(b[a]))});a=function(a){f(a,function(b,c){b.geometry&&(b.geometry.spatialReference=y);a[c]=new A(b)});return a};f(t,function(a,b){t[b]=new C(a)});
var r={routeResults:z,barriers:a(n),polygonBarriers:a(p),polylineBarriers:a(q),messages:t};this._successHandler([r],"onSolveComplete",l,k)}catch(s){this._errorHandler(s,h,k)}},solve:function(a,e,l,h){var k=h.assembly;a=this._encode(g.mixin({},this._url.query,{f:"json"},a.toJson(k&&k[0]),this._chk?{checksum:this._chk}:{}));var d=this._handler,b=this._errorHandler;return q({url:this._url.path,content:a,callbackParamName:"callback",load:function(a,b){d(a,b,e,l,h.dfd)},error:function(a){b(a,l,h.dfd)}})},
onSolveComplete:function(){}});r._createWrappers(e);n("extend-esri")&&g.setObject("tasks.RouteTask",e,p);return e});