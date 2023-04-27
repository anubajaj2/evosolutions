sap.ui.define([
	"oft/fiori/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
], function(Controller,MessageToast,Fragment) {
	"use strict";

	return Controller.extend("oft.fiori.controller.leadDetails", {

		onInit: function() {
            var oRouter = this.getOwnerComponent().getRouter();
			oRouter.attachRouteMatched(this._onRouteMatched, this);
            
            
		},
        _onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name");
            ;
			if (sRouteName === "leadDetails") {
                // debugger;
                this.onOpenDialog();
                // this.byId("idLead").open();
			}
		},
        onOpenDialog: function() {
            var oView = this.getView();
            var that = this;
            // Load the fragment file
            Fragment.load({
                id: oView.getId(),
                name: "oft.fiori.fragments.leadDetails",
                controller: this
            }).then(function (oDialog) {
                // Add dialog to view hierarchy
                oView.addDependent(oDialog);
        
                // Open dialog
                oDialog.open();

                var sCaptcha = that.customMethod();		
                that.getView().getModel('local').setProperty("/generatecaptcha",sCaptcha);
                that.getView().getModel('local').setProperty("/otpVisible",false);
            });
        },
        
        // mobile number validation 
        numberValidation: function(oEvent) {
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
          
        // generating  the captcha images 
        customMethod: function() {
            var alpha = new Array("A", "B", "C", "D", "E", "F", "G","H", "I", "J", 
                                  "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", 
                                  "U", "V", "W","X", "Y", "Z", "a", "b", "c", "d", 
                                  "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
                                  "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
                          "y", "z");
                        var i;
            for (i = 0; i < 6; i++) {
                var a = alpha[Math.floor(Math.random() * alpha.length)];
                    var b = Math.ceil(Math.random() * 10) + "";
                var c = alpha[Math.floor(Math.random() * alpha.length)];
                var d = alpha[Math.floor(Math.random() * alpha.length)];
                var e = Math.ceil(Math.random() * 10) + "";
                var f = alpha[Math.floor(Math.random() * alpha.length)];
                var g = alpha[Math.floor(Math.random() * alpha.length)];
            }
            var code = a + " " + b + " " + " " + c + " " + d + " " + e + " " + f + " " + g;
            var bCode = code.split(" ").join("");
            return bCode;
        },
        // refresh the captcha code
        onRefresh: function() {
            // var that = this;
            var rCaptcha = this.customMethod();
            that.getView().getModel('local').setProperty("/generatecaptcha",rCaptcha);
        },
        // for validation of the captcha
        onValidate: function() {
            // var Input1 = this.byId("generatecaptcha").getValue();
            var Input1=   this.getView().getModel("local").getProperty("/captchaValue");
            var Input2 = this.getView().getModel("local").getProperty("/generatecaptcha");
            // var Input2 = this.byId("captchacheck").getValue();
            if (Input2 === "") {
                MessageToast.show("Please Enter a valid captcha");
                // alert("Please enter the captcha");
            } 
            else if (Input1 === Input2) {
                MessageToast.show("Captcha Validation Success");
           
            var captchaCorrect = this.customMethod();
            this.getView().getModel("local").getProperty("/generatecaptcha",captchaCorrect)

            this.getView().getModel("local").setProperty("/captchaValue","")
            } 
            else {
                MessageToast.show("Captcha Validation Failure");
            
            var captchaWrong = this.customMethod();
            this.getView().getModel("local").getProperty("/generatecaptcha",captchaWrong)
     
            this.getView().getModel("local").setProperty("/captchaValue","")
            }
        },


            OtpSend: function() {
                this.onValidate();
                this.getView().getModel('local').setProperty("/otpVisible",true);
                var that = this;
                var countDownDate = new Date().getTime() + 60000; // 60 seconds from now
                var x = setInterval(function() {
                    var now = new Date().getTime();
                    var distance = countDownDate - now;
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    var timerText = "Resend OTP in " + seconds + "s";
            
                    // Display the timer
                    that.getView().getModel('local').setProperty("/timerText", timerText);
            
                    // If the timer has expired
                    if (distance < 0) {
                        clearInterval(x);
                        that.getView().getModel('local').setProperty("/timerText", "Resend OTP");
                    }
                }, 1000);
            
              }
              



	});

});

