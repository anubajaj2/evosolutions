sap.ui.define(["jquery.sap.global","sap/ui/core/mvc/Controller","sap/ui/core/routing/History","sap/ui/model/json/JSONModel","oft/fiori/dbapi/dbapi","sap/m/MessageBox","sap/m/MessagePopover","sap/m/MessageItem","oft/fiori/models/formatter"],function(jQuery,e,t,o,s,r,i,a,n){"use strict";var l;var u;var p;var g;var c;return e.extend("oft.fiori.controller.BaseController",{ODataHelper:s,secureToken:"",currentUser:"",bUserTestcases:true,oViewModel:undefined,oMasterList:undefined,oMasterPage:undefined,oDetailPage:undefined,oViewTable:undefined,oEditTable:undefined,oEventBus:undefined,oTestcaseListModel:undefined,sUrlTargetSystem:undefined,allMasterData:{courseMst:[],Trainers:[],AppUsers:[],Tasks:[]},onInit:function(){var e=this;this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/AppUsers","GET",null,null,this).then(function(t){for(var o=0;o<t.results.length;o++){e.allMasterData.AppUsers[t.results[o].TechnicalId]=t.results[o]}}).catch(function(t){var o=e.getErrorMessage(t)});debugger;this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/tasks","GET",{},{},this).then(function(t){for(var o=0;o<t.results.length;o++){e.allMasterData.Tasks[t.results[o].id]=t.results[o]}}).catch(function(t){var o=e.getErrorMessage(t)});this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/CoursesMst","GET",{},{},this).then(function(t){for(var o=0;o<t.results.length;o++){e.allMasterData.courseMst[t.results[o].id]=t.results[o]}}).catch(function(t){var o=e.getErrorMessage(t)});this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/Trainers","GET",{},{},this).then(function(t){debugger;for(var o=0;o<t.results.length;o++){e.allMasterData.Trainers[t.results[o].id]=t.results[o]}}).catch(function(t){var o=e.getErrorMessage(t)})},allStudnets:[],loadAllStudents:function(){var e=this;var t=this.getOwnerComponent().getModel();this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/Students","GET",{},{},this).then(function(t,o){for(var s=0;s<t.results.length;s++){e.allStudnets[t.results[s].id]=t.results[s]}})},formatter:n,initAccounts:function(){var e=this.getView().getModel("local");var t=this;this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/Accounts","GET",{},{},this).then(function(e,o){var s=[];e.results=t.formatter.sortByProperty(e.results,"accountName");for(var r=0;r<e.results.length;r++){s.push({key:e.results[r].accountNo,value:e.results[r].accountName+" "+e.results[r].ifsc,deleted:e.results[r].deleted})}t.getView().getModel("local").setProperty("/accountSet",s)})},getAccountBeneficiary:function(e){var t=this.getView().getModel("local").getProperty("/accountSet");for(var o=0;o<t.length;o++){if(t[o].key===e){return t[o].value}}},getRouter:function(){return this.getOwnerComponent().getRouter()},getCurrentUser:function(){return this.currentUser},logOutApp:function(e){var t=this;var o=t.getView().getModel("local").getProperty("/Authorization");if(o){$.post("/api/Users/logout?access_token="+o,{}).done(function(o,s){t.getView().getModel("local").setProperty("/Authorization","");t.getView().getModel().setHeaders({Authorization:""});t.redirectLoginPage("X",e)}).fail(function(e,t,o){sap.m.MessageBox.error("Logout failed")})}else{t.redirectLoginPage("X",e)}},getCustomerPopup:function(){if(!this.searchPopup){this.searchPopup=new sap.ui.xmlfragment("oft.fiori.fragments.popup",this);this.getView().addDependent(this.searchPopup);var e=this.getView().getModel("i18n").getProperty("customer");this.searchPopup.setTitle(e)}this.searchPopup.open()},getDialogPopup:function(){if(!this.oDialogPopup){this.oDialogPopup=new sap.ui.xmlfragment("idDialog","oft.fiori.fragments.Dialog",this);this.getView().addDependent(this.oDialogPopup)}this.oDialogPopup.open()},getReasgnPopup:function(){if(!this.ReasgnPopup){this.ReasgnPopup=new sap.ui.xmlfragment("idReDialog","oft.fiori.fragments.Dialog",this);this.getView().addDependent(this.ReasgnPopup)}this.ReasgnPopup.open()},getFormPopup:function(){if(!this.oFormPopup){this.oFormPopup=new sap.ui.xmlfragment("oft.fiori.fragments.SimpleForm",this);this.getView().addDependent(this.oFormPopup);var e=this.getView().getModel("i18n").getProperty("customer");this.oFormPopup.setTitle(e)}this.oFormPopup.open()},getBatchPopup:function(){if(!this.oSuppPopup){this.oSuppPopup=new sap.ui.xmlfragment("oft.fiori.fragments.popup",this);this.getView().addDependent(this.oSuppPopup);var e=this.getView().getModel("i18n").getProperty("customer");this.searchPopup.setTitle(e)}this.oSuppPopup.open()},getQuery:function(e){var t=e.getParameter("query");if(!t){t=e.getParameter("value")}return t},getSelectedKey:function(e,t,o){var t=e.getParameter("selectedItem").getValue();var o=e.getParameter("selectedItem").getLabel();var s=e.getParameter("selectedItem").getBindingContextPath();var r=this.getView().getModel().getProperty(s).id;return[t,o,r]},getObjListSelectedkey:function(e){debugger;var t=e.getParameter("selectedItem").getTitle();var o=e.getParameter("selectedItem").getIntro();var s=e.getParameter("selectedItem").getNumber();var r=e.getParameter("selectedItem").getBindingContextPath();var i=this.getView().getModel().getProperty(r).id;return[t,o,s,i]},getModel:function(e){return this.getOwnerComponent().getModel(e)},messagePoper:null,createMessagePopover:function(){var e=this;if(!this.messagePoper){this.messagePoper=sap.ui.xmlfragment("oft.fiori.fragments.DependencyChecker",this);this.getView().addDependent(this.messagePoper);this.messagePoper.setModel(this.getOwnerComponent().getModel("local"),"local")}this.messagePoper.open()},destroyMessagePopover:function(){if(this.messagePoper){this.messagePoper.destroy();this.messagePoper=null}},getErrorMessage:function(e){var t=[];var o;var s;if(e.statusText=="Unauthorized"){this.redirectLoginPage()}try{var t=e.responseText.split(".")[1];if(e.responseText.split(".")["length"]>2){t=e.responseText}if(!t){t=e.responseText.split(":")[1]}}catch(o){if(e.message){t=";"+e.message}else{return e.responseText.split(".")[1]}}t=t.split(";");var r=[];for(var i=0;i<t.length;i++){r.push({type:"Error",description:t[i]})}if(r){this.getOwnerComponent().getModel("local").setProperty("/messages",r);this.getOwnerComponent().getModel("local").setProperty("/messagesLength",r.length);this.createMessagePopover()}},handlevalidationDialogClose:function(){this.messagePoper.close();if(this.messagePoper){this.messagePoper.destroy();this.messagePoper=null}},setModel:function(e,t){return this.getView().setModel(e,t)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()},redirectLoginPage:function(e,t){if(e=="X"&&t!="X"){r.alert("Logout Successful")}else if(t!="X"){r.alert("Page expired, please login again")}if(window.top.location.href.split("/")[window.top.location.href.split("/").length-1]==="leadDetail"||window.top.location.href.split("/")[window.top.location.href.split("/").length-1]==="leadDetails"){window.top.location.href="/#/leadDetails"}else{window.top.location.href="/"}},onNavBack:function(){var e=t.getInstance().getPreviousHash(),o=sap.ushell.Container.getService("CrossApplicationNavigation");if(e!==undefined||!o.isInitialNavigation()){history.go(-1)}else{this.getRouter().navTo("master",{},true)}},getEventBus:function(){return sap.ui.getCore().getEventBus()},getViewModel:function(){return new o({busy:false,delay:0,mode:"view",oldRec:"false",extendedMode:false})},clearData:function(){},onSwitchStateChange:function(e){},onAutoLoginCheck:function(e){},onDateFormatted:function(e){var t=e.getDate();var o=e.getMonth()+1;var s=e.getFullYear();if(t<10){t="0"+t}if(o<10){o="0"+o}return t+"."+o+"."+s},copyTextToClipboard:function(e){if(!navigator.clipboard){fallbackCopyTextToClipboard(e);return}navigator.clipboard.writeText(e).then(function(){console.log("Async: Copying to clipboard was successful!")},function(e){console.error("Async: Could not copy text: ",e)})},fallbackCopyTextToClipboard:function(e){var t=document.createElement("textarea");t.value=e;document.body.appendChild(t);t.focus();t.select();try{var o=document.execCommand("copy");var s=o?"successful":"unsuccessful";console.log("Fallback: Copying text command was "+s)}catch(e){console.error("Fallback: Oops, unable to copy",e)}document.body.removeChild(t)},onSystemHelp:function(e){},getCourseMstPopUp:function(){if(!this.searchPopup){this.searchPopup=new sap.ui.xmlfragment("oft.fiori.fragments.popup",this);this.getView().addDependent(this.searchPopup);var e=this.getView().getModel("i18n").getProperty("courseMst");this.searchPopup.setTitle(e)}this.searchPopup.open()}})});
//# sourceMappingURL=BaseController.js.map