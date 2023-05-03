sap.ui.define(["oft/fiori/controller/BaseController","sap/m/MessageToast","sap/ui/core/Fragment","sap/m/Image"],function(e,t,r,o){"use strict";return e.extend("oft.fiori.controller.leadDetails",{onInit:function(){var e=this.getOwnerComponent().getRouter();e.attachRouteMatched(this._onRouteMatched,this);this.emailCount=0},_onRouteMatched:function(e){debugger;var t=e.getParameter("name");this.getView().getModel("local").setProperty("/onResendOTP",false);this.getView().getModel("local").setProperty("/otpVisible",false);this.getView().getModel("local").setProperty("/PageVisibility",false);this.getView().getModel("local").setProperty("/verifySubmit",false);if(t==="leadDetails"){this.onOpenDialog()}},onOpenDialog:function(){var e=this.getView();var t=this;if(!this.oDialog){this.oDialog=r.load({id:e.getId(),name:"oft.fiori.fragments.leadDetails",controller:this}).then(function(t){e.addDependent(t);return t}.bind(this));this.oDialog.then(function(e){t.getView().getModel("local").setProperty("/numberVisible",false);t.getView().getModel("local").setProperty("/onResendOTP",false);t.getView().getModel("local").setProperty("/otpVisible",false);t.getView().getModel("local").setProperty("/PageVisibility",false);t.getView().getModel("local").setProperty("/verifySubmit",false);e.open();t.onCaptchaGenerate()})}},onCaptchaGenerate:function(){var e=this;var t="";var r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(var i=0;i<6;i++){t+=r.charAt(Math.floor(Math.random()*r.length))}var a=document.createElement("canvas");a.width=100;a.height=30;var l=a.getContext("2d");l.fillText(t,20,20);debugger;var s=new o({src:a.toDataURL(),width:"150%",height:"150%"});var n=e.getView().byId("idLead");n.addItem(s);this._captchaCode=t},numberValidation:function(e){var r=e;if(r.length!==10||isNaN(r)){t.show("Invalid Mobile Number");return false}else{return true}},validateCaptcha:function(){var e=this.getView().getModel("local").getProperty("/Email");this.sEmail=this.getView().getModel("local").getProperty("/Email");var r=this.getView().getModel("local").getProperty("/captcha");var o=/^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;if(!e){t.show("Please enter a valid email address.");return}else{this.getView().getModel("local").setProperty("/email",false)}if(e&&!e.match(o)){t.show("Please enter a valid email address.");return}if(!r||r!==this._captchaCode){t.show("Please enter a valid captcha code.");return}var i=this;var a=this.getView().getModel("local");var i=this;var a=this.getView().getModel("local");$.ajax({type:"POST",url:"sendOtpViaEmail",data:{eMail:e},success:function(e){if(e=="email sent"){a.setProperty("/sendOtpDisabled",false)}a.setProperty("/otpVisible",true);a.setProperty("/sendOtp",false);t.show("OTP Successfully Sent To Your Mail.")},error:function(e,r,o){console.error(o);t.show("Error sending OTP via email")}});this.OtpSend()},onNumberOTPPress:function(){var e=this;var r=this.getView().getModel("local").getProperty("/mobileNumber");if(r){var o=this.numberValidation(r);if(o){this.getView().getModel("local").setProperty("/MobileNumber",false);$.ajax({type:"POST",url:"requestMessage",data:{Number:r,msgType:"OTP"},success:function(o){debugger;e.getView().getModel("local").setProperty("/otpVisible",true);t.show("OTP Successfully Sent");this.sEmail=r},error:function(e,r,o){console.error(o);t.show("Error sending OTP via email")}})}}},onSubmit:function(){var e=this;this.emailCount+=1;var r=this.getView().getModel("local");var o=r.getProperty("/otpValue");if(o!==undefined){var e=this;$.ajax({type:"GET",url:"validateOtp",data:{email:this.sEmail,OTP:o},success:function(o){debugger;if(o===false){t.show("Error in Verification");r.setProperty("/otpValue","");e.onRefresh();r.setProperty("/captcha","")}else{e.getView().getModel("local").setProperty("/Authorization",o.id);e.getView().getModel().setHeaders({Authorization:o.id});e.secureToken=o.id;e.getView().getModel("local").setProperty("/CurrentUser",o.userId);e.getView().getModel().setUseBatch(false);var i=e;var a=[new sap.ui.model.Filter("TechnicalId",sap.ui.model.FilterOperator.EQ,o.userId)];var l={filters:a};var s=false;var n=[];e.ODataHelper.callOData(e.getOwnerComponent().getModel(),"/AppUsers","GET",{},{},e).then(function(e){var t=[];if(e.results.length!=0){for(var r=0;r<e.results.length;r++){n[e.results[r].TechnicalId]=e.results[r];if(e.results[r].TechnicalId===o.userId){i.getView().getModel("local").setProperty("/Role",e.results[r].Role);i.getView().getModel("local").setProperty("/UserName",e.results[r].UserName);i.getView().getModel("local").setProperty("/JoiningDate",e.results[r].JoiningDate);i.getView().getModel("local").setProperty("/LeaveQuota",e.results[r].LeaveQuota);i.getView().getModel("local").setProperty("/MobileNo",e.results[r].MobileNo);s=true}else{i.getView().getModel("local").setProperty("/Authorization","");t.push(e.results[r])}}if(s===true){i.getView().getModel("local").setProperty("/AppUsers",n);i.getView().getModel("local").setProperty("/AppUsersCopy",t);i.oDialog.then(function(e){e.close()});i.getRouter().navTo("leadDetail")}else{sap.m.MessageBox.error("The user is not authorized, Contact Anubhav")}}}).catch(function(e){debugger;t.show("Error While Login")})}},error:function(e,r,o){console.error(o);debugger;t.show("Error in Verification")}})}else{t.show("Please Enter Your  OTP")}debugger;this.numberVisible()},numberVisible:function(){debugger;if(this.emailCount>=2){this.getView().getModel("local").setProperty("/numberVisible",true)}else{this.getView().getModel("local").setProperty("/numberVisible",false)}},OtpSend:function(){this.emailCount+=1;this.getView().getModel("local").setProperty("/otpVisible",true);var e=this;var t=(new Date).getTime()+6e4;var r=setInterval(function(){var o=(new Date).getTime();var i=t-o;var a=Math.floor(i%(1e3*60*60)/(1e3*60));var l=Math.floor(i%(1e3*60)/1e3);var s="Resend OTP in "+l+"s";e.getView().getModel("local").setProperty("/timerText",s);e.getView().getModel("local").setProperty("/verifySubmit",true);if(i<0){clearInterval(r);e.getView().getModel("local").setProperty("/timerText","Resend");e.getView().getModel("local").setProperty("/onResendOTP",true);e.getView().getModel("local").setProperty("/ResendMsg","If OTP not Received ")}},1e3)},onRefresh:function(e){var t=this.getView().byId("idLead");t.removeAllItems();debugger;this.onCaptchaGenerate()}})});