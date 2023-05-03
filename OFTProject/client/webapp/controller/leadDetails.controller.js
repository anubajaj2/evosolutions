sap.ui.define([
    "oft/fiori/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/m/Image"
], function (Controller, MessageToast, Fragment, Image) {
    "use strict";

    return Controller.extend("oft.fiori.controller.leadDetails", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRouteMatched(this._onRouteMatched, this);
            this.emailCount = 0;
            
        },

        _onRouteMatched: function (oEvent) {
            debugger;
            var sRouteName = oEvent.getParameter("name");
            this.getView().getModel('local').setProperty("/onResendOTP", false);
            this.getView().getModel('local').setProperty("/otpVisible", false);
            this.getView().getModel('local').setProperty("/PageVisibility", false);
            this.getView().getModel('local').setProperty("/verifySubmit", false);

            if (sRouteName === "leadDetails") {
                // debugger;
                this.onOpenDialog();

            }
            
        },

        onOpenDialog: function () {

            var oView = this.getView();
            var that = this;
            // Load the fragment file
            if (!this.oDialog) {
                this.oDialog = Fragment.load({
                    id: oView.getId(),
                    name: "oft.fiori.fragments.leadDetails",
                    controller: this
                }).then(function (oDialog) {
                    // Add dialog to view hierarchy
                    oView.addDependent(oDialog);
                    // Open dialog
                    return oDialog;
                }.bind(this));
                this.oDialog.then(function (oDialog) {
                    that.getView().getModel('local').setProperty("/numberVisible", false);
                    that.getView().getModel('local').setProperty("/onResendOTP", false);
                    that.getView().getModel('local').setProperty("/otpVisible", false);
                    that.getView().getModel('local').setProperty("/PageVisibility", false);
                    that.getView().getModel('local').setProperty("/verifySubmit", false);
                    oDialog.open();
                    // var sCaptcha = that.captchaGeneratorMethod();
                    // that.getView().getModel('local').setProperty("/generatedCaptcha", sCaptcha);

// +================================================ At here the canvas creating is not working so working on it =================================================================
                    that.onCaptchaGenerate();
                });
            }
        },
        onCaptchaGenerate:function(){
            var that = this;
            var captchaCode = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    for (var i = 0; i < 6; i++) {
                        captchaCode += possible.charAt(Math.floor(Math.random() * possible.length));
                    }

                    // Create a canvas element and draw the captcha code on it
                    var canvas = document.createElement("canvas");
                    canvas.width = 100;
                    canvas.height = 30;
                    var ctx = canvas.getContext("2d");
                    // Draw the captcha code on the canvas
                    ctx.fillText(captchaCode, 20, 20);
                    debugger;
                    // var captchaImage = this.getView().byId("captchaImage");
                    // captchaImage.setSrc(canvas.toDataURL());
                    // Set the data URL of the canvas as the source of the captcha image
                    var captchaImage = new Image({
                        src: canvas.toDataURL(),
                        width: "150%",
                        height: "150%",
                    });
                    var captchaDialog = that.getView().byId("idLead");
                    captchaDialog.addItem(captchaImage);
                    // Store the captcha code in a property of the controller for later verification
                    this._captchaCode = captchaCode;
// ================================================================= ========================================================
        },

        // mobile number validation 
        numberValidation: function (oEvent) {
            var input = oEvent.getSource();
            var value = input.getValue();

            if (value.length !== 10 || isNaN(value)) {
                input.setValueState("Error");
                input.setValueStateText("Please enter a valid 10 digit mobile number");
            } else {
                input.setValueState("None");
                input.setValueStateText("");
            }
        },
       
        validateCaptcha: function() {
            var sMobileNumber = this.getView().getModel('local').getProperty("/mobileNumber");
            var sEmail = this.getView().getModel('local').getProperty("/Email");
            var InpCaptchaCode = this.getView().getModel('local').getProperty("/captcha");
            var oRegex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
          
            // if (!sMobileNumber && !sEmail) {
            //   MessageToast.show("Please enter your mobile number or email address.");
            //   return;
            // }
            
            if (sEmail && !sEmail.match(oRegex)) {
              MessageToast.show("Please enter a valid email address.");
              return;
            }
          
            if (!InpCaptchaCode || InpCaptchaCode !== this._captchaCode) {
              MessageToast.show("Please enter a valid captcha code.");
              return;
            }
            var that = this;
            var oModel = this.getView().getModel('local');
          debugger;
            // Send AJAX request to backend
            $.ajax({
              type: 'POST',
              url: 'sendOtpViaEmail',
              data: {
                eMail: sEmail
              },
              success: function (data) {
                debugger;
                oModel.setProperty('/otpVisible', true);
                oModel.setProperty('/sendOtp', false);
                oModel.setProperty('/MobileNumber', false);
                that.OtpSend();
                MessageToast.show('OTP Successfully Sent To Your Mail.');
              },
              error: function (xhr, status, error) {
                console.error(error);
                MessageToast.show('Error sending OTP via email');
              }
            });
          },
          

            //   validation of the popup filed and send the otp to the user 
            // validateCaptcha: function() {
            //     var sMobileNumber = this.getView().getModel('local').getProperty("/mobileNumber");
            //     var sEmail = this.getView().getModel('local').getProperty("/Email");
            //     var InpCaptchaCode = this.getView().getModel('local').getProperty("/captcha");
            //     var oRegex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

            //     // if (sMobileNumber == undefined || sEmail == undefined) {
            //     //     MessageToast.show("Please Check the Input Fields");
            //     //     return;
            //     // };
            //     if (sEmail == undefined) {
            //         MessageToast.show("Please Check the Input Fields");
            //         return;
            //     };
            //     if (InpCaptchaCode !== this._captchaCode ) {
            //         MessageToast.show("Your Captha is Not Valid");
            //         return;
            //     };

            //     if (!sEmail.match(oRegex)) {
            //         // MessageToast.show("Email address is valid.");
            //         MessageToast.show("Please enter a valid email address.");
            //         return;
            //     }
            //     this.getView().getModel('local').setProperty("/otpVisible", true);
            //     this.getView().getModel('local').setProperty("/sendOtp", false);
            //     this.getView().getModel('local').setProperty("/MobileNumber", false);
            //     // this.getView().getModel('local').setProperty("/sendOtp",false);
            //     this.OtpSend();

            //     return true;
            // },

            onSubmit: function() {
                // oDialog.close();
                var otpvalue = this.getView().getModel('local').getProperty("/otpValue");
                if(otpvalue !== undefined){
                    // this.oDialog.then(function (oDialog) {
                    //     oDialog.close();
                    // })
                    // this.getView().getModel('local').setProperty("/PageVisibility", true);
                    this.emailCount += 1;
                    this.getRouter().navTo("leadDetail", {}, true);

                }
                else{
                    MessageToast.show("Please Enter Your  OTP",)
                }   
                debugger;
                
                this.numberVisible();
                // this.getView().getModel('local').setProperty("/MobileNumber",false);
                // this.getView().getModel('local').getProperty("/Email");
            },
            numberVisible:function(){
                debugger;
                if(this.emailCount>=2){
                    this.getView().getModel('local').setProperty("/numberVisible",true);
                }else{
                    this.getView().getModel('local').setProperty("/numberVisible",false);
                }
            },

            OtpSend: function() {
                // this.onValidate();
                this.getView().getModel('local').setProperty("/otpVisible", true);
                var that = this;
                var countDownDate = new Date().getTime() + 60000; // 60 seconds from now
                var x = setInterval(function () {
                    var now = new Date().getTime();
                    var distance = countDownDate - now;
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    var timerText = "Resend OTP in " + seconds + "s";

                    // Display the timer
                    that.getView().getModel('local').setProperty("/timerText", timerText);

                    that.getView().getModel('local').setProperty("/verifySubmit", true)
                    // If the timer has expired
                    if (distance < 0) {
                        clearInterval(x);
                        that.getView().getModel('local').setProperty("/timerText", "Resend");
                        that.getView().getModel('local').setProperty("/onResendOTP", true);
                        that.getView().getModel('local').setProperty("/ResendMsg", "If OTP not Received ");
                    }
                }, 1000);

            },

            // generating  the captcha images 
            captchaGeneratorMethod: function() {
                var captchaCode = '';
                var length = 3; // Change the length of the captcha code as needed

                for (var i = 0; i < length; i++) {
                    var rand = Math.random();
                    // Add a random lowercase or uppercase letter
                    captchaCode += String.fromCharCode(rand < 0.5 ? 97 + Math.floor(rand * 26) : 65 + Math.floor(rand * 26));
                    // Add a random digit
                    captchaCode += rand < 0.5 ? Math.floor(rand * 10) : String.fromCharCode(48 + Math.floor(rand * 10));
                }

                return captchaCode;
            },

            // refresh the captcha code
            onRefresh: function(oEvent) {
                var captchaDialog = this.getView().byId("idLead");
                captchaDialog.removeAllItems();
                debugger;
                this.onCaptchaGenerate();
            },


            // // for validation of the captcha
            // onValidate: function() {
            //     // var Input1 = this.byId("generatecaptcha").getValue();
            //     var Input1=   this.getView().getModel("local").getProperty("/captchaValue");
            //     var Input2 = this.getView().getModel("local").getProperty("/generatecaptcha");
            //     // var Input2 = this.byId("captchacheck").getValue();
            //     if (Input2 === "") {
            //         MessageToast.show("Please Enter a valid captcha");
            //         // alert("Please enter the captcha");
            //     } 
            //     else if (Input1 === Input2) {
            //         MessageToast.show("Captcha Validation Success");

            //     var captchaCorrect = this.customMethod();
            //     this.getView().getModel("local").getProperty("/generatecaptcha",captchaCorrect)

            //     this.getView().getModel("local").setProperty("/captchaValue","")
            //     } 
            //     else {
            //         MessageToast.show("Captcha Validation Failure");

            //     var captchaWrong = this.customMethod();
            //     this.getView().getModel("local").getProperty("/generatecaptcha",captchaWrong)

            //     this.getView().getModel("local").setProperty("/captchaValue","")
            //     }
            // },



        });

});

