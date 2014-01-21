L.Polyline.polylineEditor=L.Polyline.extend({_addMethods:function(){var a=this;this._init=function(c,j){if(!("_editablePolylines" in this._map)){this._map._editablePolylines=[]}if(!this._map.getEditablePolylines){this._map.getEditablePolylines=function(){return g._map._editablePolylines}}this._parseOptions(c);this._markers=[];var g=this;var e=this.getLatLngs();var f=e.length;for(var d=0;d<f;d++){var b=this._addMarkers(d,e[d]);b.context=g._contexts==null?{}:j[d];if(b.context&&!("originalPointNo" in b.context)){b.context.originalPointNo=d}if(b.context&&!("originalPolylineNo" in b.context)){b.context.originalPolylineNo=g._map._editablePolylines.length}}var h=this._map;this._map.on("zoomend",function(i){g._showBoundMarkers()});this._map.on("moveend",function(i){g._showBoundMarkers()});this._map._editablePolylines.push(this)};this.isBusy=function(){for(var b=0;b<a._map._editablePolylines.length;b++){if(a._map._editablePolylines[b]._isBusy()){return true}}return false};this._isBusy=function(){return a._busy};this._setBusy=function(b){a._busy=b};this.getPoints=function(){return this._markers};this._parseOptions=function(b){if(!b){b={}}if(!("maxMarkers" in b)){b.maxMarkers=100}this.maxMarkers=b.maxMarkers;if(b.pointIcon){this.pointIcon=b.pointIcon}else{this.pointIcon=L.icon({iconUrl:"editmarker.png",iconSize:[11,11],iconAnchor:[6,6],})}if(b.newPointIcon){this.newPointIcon=b.newPointIcon}else{this.newPointIcon=L.icon({iconUrl:"editmarker2.png",iconSize:[11,11],iconAnchor:[6,6],})}};this._showBoundMarkers=function(){if(a.isBusy()){console.log("Do not show because busy!");return}var e=a._map.getBounds();var f=0;for(var g in a._map._editablePolylines){var c=a._map._editablePolylines[g];for(var d in c._markers){var b=c._markers[d];if(e.contains(b.getLatLng())){f+=1}}}console.log("found="+f);for(var g in a._map._editablePolylines){var c=a._map._editablePolylines[g];for(var d in c._markers){var b=c._markers[d];if(f<a.maxMarkers){a._setMarkerVisible(b,e.contains(b.getLatLng()));a._setMarkerVisible(b.newPointMarker,d>0&&e.contains(b.getLatLng()))}else{a._setMarkerVisible(b,false);a._setMarkerVisible(b.newPointMarker,false)}}}};this._hideAll=function(e){for(var f in a._map._editablePolylines){console.log("hide "+f+" markers");var c=a._map._editablePolylines[f];for(var d in c._markers){var b=c._markers[d];if(e==null||e!=b){c._setMarkerVisible(b,false)}if(e==null||e!=b.newPointMarker){c._setMarkerVisible(b.newPointMarker,false)}}}};this._setMarkerVisible=function(c,b){if(!c){return}var d=this._map;if(b){if(!c._visible){if(!c._map){c.addTo(d)}else{d.addLayer(c)}c._map=d}c._visible=true}else{if(c._visible){d.removeLayer(c)}c._visible=false}};this._reloadPolyline=function(b){a.setLatLngs(a._getMarkerLatLngs());if(b!=null){a._fixNeighbourPositions(b)}a._showBoundMarkers()};this._addMarkers=function(i,h,c){var g=this;var e=this.getLatLngs();var b=L.marker(h,{draggable:true,icon:this.pointIcon});b.context=null;b.newPointMarker=null;b.on("dragstart",function(k){var m=g._getPointNo(k.target);var j=m==null?null:g._markers[m-1].getLatLng();var l=m<g._markers.length-1?g._markers[m+1].getLatLng():null;g._setupDragLines(b,j,l);g._setBusy(true);g._hideAll(b)});b.on("dragend",function(k){var j=k.target;var l=g._getPointNo(k.target);g._setBusy(false);g._reloadPolyline(l)});b.on("contextmenu",function(k){var j=k.target;var l=g._getPointNo(k.target);g._map.removeLayer(j);g._map.removeLayer(f);g._markers.splice(l,1);g._reloadPolyline(l)});b.on("click",function(k){var j=k.target;var l=g._getPointNo(k.target);if(l==0||l==g._markers.length-1){g._prepareForNewPoint(j,l==0?0:l+1)}});var d=e[i==0?i:i-1];var f=L.marker([(h.lat+d.lat)/2,(h.lng+d.lng)/2],{draggable:true,icon:this.newPointIcon});b.newPointMarker=f;f.on("dragstart",function(k){var m=g._getPointNo(k.target);var j=g._markers[m-1].getLatLng();var l=g._markers[m].getLatLng();g._setupDragLines(b.newPointMarker,j,l);g._setBusy(true);g._hideAll(b.newPointMarker)});f.on("dragend",function(k){var j=k.target;var l=g._getPointNo(k.target);g._addMarkers(l,j.getLatLng(),true);g._setBusy(false);g._reloadPolyline()});f.on("contextmenu",function(j){console.log("TODO: split");var o=j.target;var k=g._getPointNo(o);var l=g.getPoints();g._hideAll();var q=g._markers.slice(k,k.length);g._markers.splice(k,g._markers.length-k);g._reloadPolyline();var r=[];var m=[];for(var n=0;n<q.length;n++){var o=q[n];r.push(o.getLatLng());m.push(o.context)}console.log("points:"+r);console.log("contexts:"+m);var p=L.Polyline.PolylineEditor(r,g._options,m).addTo(g._map);g._showBoundMarkers();console.log("Done split, _editablePolylines now:"+g._map._editablePolylines.length)});this._markers.splice(i,0,b);if(c){this._fixNeighbourPositions(i)}return b};this._prepareForNewPoint=function(c,d){a._hideAll();a._setupDragLines(c,c.getLatLng());var b=function(e){a._setBusy(true)};a._map.on("mousemove",b);a._map.once("click",function(e){console.log("dodajemo na "+d+" - "+e.latlng);a._map.off("mousemove",b);a._addMarkers(d,e.latlng,true);a._setBusy(false);a._reloadPolyline()})};this._fixNeighbourPositions=function(e){var d=e==0?null:this._markers[e-1];var b=this._markers[e];var c=e<this._markers.length-1?this._markers[e+1]:null;if(b&&d){b.newPointMarker.setLatLng([(d.getLatLng().lat+b.getLatLng().lat)/2,(d.getLatLng().lng+b.getLatLng().lng)/2])}if(b&&c){c.newPointMarker.setLatLng([(b.getLatLng().lat+c.getLatLng().lat)/2,(b.getLatLng().lng+c.getLatLng().lng)/2])}};this._getPointNo=function(b){for(var c=0;c<this._markers.length;c++){if(b==this._markers[c]||b==this._markers[c].newPointMarker){return c}}return -1};this._getMarkerLatLngs=function(){var b=[];for(var c=0;c<this._markers.length;c++){b.push(this._markers[c].getLatLng())}return b};this._setupDragLines=function(d,f,e){var c=null;var b=null;if(f){c=L.polyline([d.getLatLng(),f],{dasharray:"5,1",weight:1}).addTo(a._map)}if(e){b=L.polyline([d.getLatLng(),f],{dasharray:"5,1",weight:1}).addTo(a._map)}var g=function(i){if(c){c.setLatLngs([i.latlng,f])}if(b){b.setLatLngs([i.latlng,e])}};var h=function(i){a._map.off("mousemove",g);d.off("dragend",h);if(c){a._map.removeLayer(c)}if(b){a._map.removeLayer(b)}console.log("STOPPED");if(i.target!=a._map){a._map.fire("click",i)}};a._map.on("mousemove",g);d.on("dragend",h);a._map.once("click",h);d.once("click",h);if(c){c.once("click",h)}if(b){b.once("click",h)}}}});L.Polyline.polylineEditor.addInitHook(function(){this.originalAddTo=this.addTo;this.addTo=function(a){this.originalAddTo(a);this._map=a;this._addMethods();this._busy=false;this._initialized=false;this._init(this._options,this._contexts);this._initialized=true;return this}});L.Polyline.PolylineEditor=function(b,c,d){var a=new L.Polyline.polylineEditor(b,c);a._options=c;a._contexts=d;return a};