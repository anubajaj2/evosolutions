sap.ui.define(["jquery.sap.global"],function(e){"use strict";return{callOData:function(r,s,t,a,n,c,o){return new Promise(function(u,f){var i=new Date;if(o===undefined){o=false}var l=c.getModel("local").getProperty("/CurrentUser");if(t==="POST"&&o===false){n.CreatedBy=l;n.ChangedBy=l;n.CreatedOn=i;n.ChangedOn=i}else if(t==="PUT"&&o===false){n.ChangedBy=l;n.ChangedOn=i}if(!(r&&s&&t)){f("Invalid parameters passed")}if(!a){a={}}r.setUseBatch(false);switch(t.toUpperCase()){case"GET":r.read(s,{async:true,filters:a.filters,sorters:a.sorters,urlParameters:a.urlParameters,success:function(e,r){u(e)},error:function(e){f(e)}});break;case"POST":r.create(s,n,{async:true,filters:a.filters,sorters:a.sorters,success:function(e,r){u(e)},error:function(e){f(e)}});break;case"PUT":r.update(s,n,{async:true,filters:a.filters,sorters:a.sorters,success:function(e,r){debugger;u(e)},error:function(e){debugger;f(e)}});break;case"DELETE":r.remove(s,{async:true,filters:a.filters,sorters:a.sorters,success:function(e,r){u(e)},error:function(e){f(e)}});break;default:e.sap.log.error("No case matched");break}})}}});