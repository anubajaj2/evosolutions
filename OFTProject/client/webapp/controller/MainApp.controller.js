sap.ui.define([
	"oft/fiori/controller/BaseController"
], function (Controller) {
	"use strict";

	return Controller.extend("oft.fiori.controller.MainApp", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf oft.fiori.view.App
		 */
		//	onInit: function() {
		//
		//	},
		idleLogout: function () {
			var t;
			var that = this;
			window.onbeforeunload = function () {
				that.logOutApp("X");
			}

			window.onload = resetTimer;
			window.onmousemove = resetTimer;
			window.onmousedown = resetTimer;  // catches touchscreen presses as well
			window.ontouchstart = resetTimer; // catches touchscreen swipes as well
			window.onclick = resetTimer;      // catches touchpad clicks as well
			window.onkeypress = resetTimer;
			window.addEventListener('scroll', resetTimer, true); // improved; see comments

			function yourFunction() {
				// your function for too long inactivity goes here
				// e.g. window.location.href = 'logout.php';
				sap.m.MessageBox.alert("Page expired, please login again!");
				if(window.top.location.href.split("/")[window.top.location.href.split("/").length-1]==="leadDetail" || window.top.location.href.split("/")[window.top.location.href.split("/").length-1]==="leadDetails"){
					window.top.location.href = "/#/leadDetails";
				}
				else{
					window.top.location.href = "/";
				}
			}

			function resetTimer() {
				clearTimeout(t);
				t = setTimeout(yourFunction, 3600000);  // time is in milliseconds
			}
		},
		onLogout: function () {
			this.logOutApp();
		},
		onInit: function () {
			//var oModel = Models.createFruitModel();
			//sap.ui.getCore().setModel(oModel);
			this.idleLogout();
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		},
		onSubmit: function () {
			this.Login();
		},

		onLivePassword: function (oEvent) {
			console.log("Test")
		},

		Login: function () {

			var loginPayload = {
				"email": this.getView().byId("userid").getValue(),
				"password": this.getView().byId("pwd").getValue(),
			};
			var that = this;

			if (!loginPayload.email || !loginPayload.password) {
				sap.m.MessageBox.error("User/password cannot be empty");
				return; //--- Added - Swaroop
			}

			$.post('/api/Users/login', loginPayload)
				.done(function (data, status) {
					// 
					that.getView().getModel("local").setProperty("/Authorization", data.id);
					that.getView().getModel().setHeaders({
						"Authorization": data.id
					});
					that.secureToken = data.id;
					that.getView().getModel("local").setProperty("/CurrentUser", data.userId);
					that.getView().getModel().setUseBatch(false);
					var that2 = that;

					//Check the role and set it after that navigate to App
					//that.oRouter.navTo("newlead");

					var aFilter = [new sap.ui.model.Filter("TechnicalId",
						sap.ui.model.FilterOperator.EQ, data.userId)];
					var oParameters = {
						filters: aFilter
					};
					var found = false;
					var AppUsers = [];
					that.ODataHelper.callOData(that.getOwnerComponent().getModel(),
						"/AppUsers", "GET", {}, {}, that)
						.then(function (oData) {
							var newExcluseUser = [];
							if (oData.results.length != 0) {
								for (var i = 0; i < oData.results.length; i++) {
									AppUsers[oData.results[i].TechnicalId] = oData.results[i];
									if (oData.results[i].TechnicalId === data.userId) {
										that2.getView().getModel("local").setProperty("/Role", oData.results[i].Role);
										that2.getView().getModel("local").setProperty("/UserName", oData.results[i].UserName);
										that2.getView().getModel("local").setProperty("/JoiningDate", oData.results[i].JoiningDate);
										that2.getView().getModel("local").setProperty("/LeaveQuota", oData.results[i].LeaveQuota);
										that2.getView().getModel("local").setProperty("/MobileNo", oData.results[i].MobileNo);
										found = true;
									} else {
										that2.getView().getModel("local").setProperty("/Authorization", "");
										newExcluseUser.push(oData.results[i]);
									}
								}
								if (found === true) {
									that2.getView().getModel("local").setProperty("/AppUsers", AppUsers);
									that2.getView().getModel("local").setProperty("/AppUsersCopy", newExcluseUser);
									that2.oRouter.navTo("newlead");
								} else {
									sap.m.MessageBox.error("The user is not authorized, Contact Anubhav");
								}
							}
						}).catch(function (oError) {

						});

				})
				.fail(function (xhr, status, error) {
					sap.m.MessageBox.error("Login Failed, Please enter correct credentials");
				});

		}


		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf oft.fiori.view.App
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf oft.fiori.view.App
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf oft.fiori.view.App
		 */
		//	onExit: function() {
		//
		//	}

	});

});
