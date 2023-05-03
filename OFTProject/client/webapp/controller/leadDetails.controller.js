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
                    that.onCaptchaGenerate();
                });
            }
        },
        onCaptchaGenerate: function () {
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
        },


// ==================================== mobile number validation  =========================

        numberValidation: function (sMobileNumber) {
            var value = sMobileNumber;

            if (value.length !== 10 || isNaN(value)) {
                MessageToast.show("Invalid Mobile Number")
                return false;
            } else {
                return true;
            }
        },

 // ================== Function validate the input field for the email and as well as send OTP  ===================== 

        validateCaptcha: function () {

            var sEmail = this.getView().getModel('local').getProperty("/Email");
            this.sEmail = this.getView().getModel('local').getProperty("/Email");
            var InpCaptchaCode = this.getView().getModel('local').getProperty("/captcha");
            var oRegex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

            if (!sEmail) {
                MessageToast.show("Please enter a valid email address.");
                return;
            };

            if (sEmail && !sEmail.match(oRegex)) {
                MessageToast.show("Please enter a valid email address.");
                return;
            };

            if (!InpCaptchaCode || InpCaptchaCode !== this._captchaCode) {
                MessageToast.show("Please enter a valid captcha code.");
                return;
            };

            var that = this;
            var oModel = this.getView().getModel('local');
            // debugger;
            // Send AJAX request to backend
            var that = this;
            var oModel = this.getView().getModel('local');
            $.ajax({
                type: 'POST',
                url: 'sendOtpViaEmail',
                data: {
                    eMail: sEmail
                },
                success: function (data) {
                    // debugger;
                    if(data=="email sent"){
                        oModel.setProperty('/sendOtpDisabled', false);
                    }
                    oModel.setProperty('/otpVisible', true);
                    oModel.setProperty('/sendOtp', false);
                    MessageToast.show('OTP Successfully Sent To Your Mail.');
                },
                error: function (xhr, status, error) {
                    console.error(error);
                    MessageToast.show('Error sending OTP via email');
                }
            });
            this.OtpSend();

        },

 // =========================== Function validate the input field for the Mobile Number As Well as send =========================

        onNumberOTPPress: function () {
            var that = this;
            var sMobileNumber = this.getView().getModel('local').getProperty("/mobileNumber");
            if (sMobileNumber) {
                var sValidated = this.numberValidation(sMobileNumber);
                if (sValidated) {
                    this.getView().getModel('local').setProperty('/MobileNumber', false);
                    $.ajax({
                        type: 'POST',
                        url: 'requestMessage',
                        data: {
                            Number: sMobileNumber,
                            msgType: "OTP"
                        },
                        success: function (data) {
                            debugger;
                            that.getView().getModel('local').setProperty('/otpVisible', true);
                            //   that.getView().getModel('local').setProperty('/sendOtp', false);
                            MessageToast.show('OTP Successfully Sent');
                            this.sEmail = sMobileNumber;

                        },
                        error: function (xhr, status, error) {
                            console.error(error);
                            MessageToast.show('Error sending OTP via email');
                        }
                    });
                }
            }
        },

// ============================== OnSubmit Validaing the otp which comes from the backend ==================

onSubmit: function () {
            var that =this;
            this.emailCount += 1;
            var oModel = this.getView().getModel('local');
            var otpvalue = oModel.getProperty("/otpValue");

            if (otpvalue !== undefined) {
                $.ajax({
                    type: 'GET',
                    url: 'validateOtp',
                    data: {
                        email: this.sEmail,
                        OTP: otpvalue
                    },
                    success: function (data) {
                        debugger;
                        if (data === false) {
                            MessageToast.show('Error in Verification');
                            oModel.setProperty('/otpValue', "");
                            that.onRefresh();
                            oModel.setProperty('/captcha', "");
                        } else {
                            MessageToast.show('Verification Successful');
                            // this below code is working for close the dialog and navigate to the view
                            that.oDialog.then(function(oDialog){
                                oDialog.close();
                            })

                            // that.getView().getModel('local').setProperty("/PageVisibility",true);
                              that.getRouter().navTo("leadDetail", {}, true);
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error(error);
                        MessageToast.show('Error in Verification');
                    }
                });
            }
            else {
                MessageToast.show("Please Enter Your  OTP",)
            }
            debugger;

            this.numberVisible();
            // this.getView().getModel('local').setProperty("/MobileNumber",false);
            // this.getView().getModel('local').getProperty("/Email");
        },

// ===================== This function will enalbe the mobile number filed after 2 attempts =====================
        numberVisible: function () {
            debugger;
            if (this.emailCount >= 2) {
                this.getView().getModel('local').setProperty("/numberVisible", true);
            } else {
                this.getView().getModel('local').setProperty("/numberVisible", false);
            }
        },

// ============ this fucntion will shows the resend info and timer below to the otp input filed ================ 

        OtpSend: function () {
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

// =============== this funciton will refresh the generated capthcha =============================

        // refresh the captcha code
        onRefresh: function (oEvent) {
            var captchaDialog = this.getView().byId("idLead");
            captchaDialog.removeAllItems();
            debugger;
            this.onCaptchaGenerate();
        },
        
    });
    
});
// // generating  the captcha images 
// captchaGeneratorMethod: function () {
//     var captchaCode = '';
//     var length = 3; // Change the length of the captcha code as needed

//     for (var i = 0; i < length; i++) {
//         var rand = Math.random();
//         // Add a random lowercase or uppercase letter
//         captchaCode += String.fromCharCode(rand < 0.5 ? 97 + Math.floor(rand * 26) : 65 + Math.floor(rand * 26));
//         // Add a random digit
//         captchaCode += rand < 0.5 ? Math.floor(rand * 10) : String.fromCharCode(48 + Math.floor(rand * 10));
//     }

//     return captchaCode;
// },



  
        //   sendOTP:function(){
        //     var that = this;
        //     $.ajax({
        //         type: 'POST',
        //         url: 'sendOtpViaEmail',
        //         data: {
        //           eMail: this.sEmail
        //         },
        //         success: function (data) {
        //           debugger;
        //           that.getView().getModel('local').setProperty('/otpVisible', true);
        //           that.getView().getModel('local').setProperty('/sendOtp', false);
        //           // oModel.setProperty('/MobileNumber', false);

        //           MessageToast.show('OTP Successfully Sent');
        //         },
        //         error: function (xhr, status, error) {
        //           console.error(error);
        //           MessageToast.show('Error sending OTP via email');
        //         }
        //       });
        //   },