sap.ui.define(["oft/fiori/controller/BaseController"],function(o){"use strict";return o.extend("oft.fiori.controller.App",{idleLogout:function(){var o;var t=this;window.onbeforeunload=function(){t.logOutApp("X")};window.onload=e;window.onmousemove=e;window.onmousedown=e;window.ontouchstart=e;window.onclick=e;window.onkeypress=e;window.addEventListener("scroll",e,true);function n(){sap.m.MessageBox.alert("Page expired, please login again!");if(window.top.location.href.split("/")[window.top.location.href.split("/").length-1]==="leadDetail"||window.top.location.href.split("/")[window.top.location.href.split("/").length-1]==="leadDetails"){window.top.location.href="/#/leadDetails"}else{window.top.location.href="/"}}function e(){clearTimeout(o);o=setTimeout(n,9e5)}},onLogout:function(){this.logOutApp()},onInit:function(){this.getOwnerComponent().getModel("local").setSizeLimit(600);this.idleLogout()}})});