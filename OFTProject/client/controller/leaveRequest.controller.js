sap.ui.define([
	"oft/fiori/controller/BaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"oft/fiori/models/formatter",
	"sap/ui/model/Filter"
], function(Controller, MessageBox, MessageToast, Formatter, Filter) {
	"use strict";

	return Controller.extend("oft.fiori.controller.leaveRequest", {
		formatter: Formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf oft.fiori.view.View2
		 */
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.herculis, this);
			var currentUser = this.getModel("local").getProperty("/CurrentUser");
			if (currentUser) {
				var loginUser = this.getModel("local").oData.AppUsers[currentUser].UserName;
//				this.getView().byId("idUser").setText(loginUser);
			}
		},




		onBack: function() {
			sap.ui.getCore().byId("idApp").to("idView1");
		},

		herculis: function(oEvent) {
			if(oEvent.getParameter("name") !== "newlead"){
				return;
			}



		},
		onSend:function(oEvent){
			var oLocal = oEvent;
			var that = this;
			that.getView().setBusy(true);
			var leadData = this.getView().getModel("local").getProperty("/newLeaveRequest");
			if (leadData.DateFrom >  leadData.DateTo){
			that.getView().setBusy(false);
			sap.m.MessageBox.error("Date From Cannot be greater than Date To");
			return;
			}
			var payload ={
				"TechnicalId": "Get the id of logged user here",
				 "DateFrom": leadData.DateFrom,
				 "DateTo": leadData.DateTo,
				 "Days": 1,
				 "LeaveType":"Full Day",
				 "Status": "Not Approved",
				 "ApproverId": "get the id of Approver",
				 "ApprovedOn": new Date(),
				 "RequestedOn": new Date(),
				 "Remarks": leadData.Remarks,
				 "ChangedOn": new Date(),
				 "ChangedBy": "get the id of user"
			};
			this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/LeaveRequests","Post",{},
				payload, this)
				.then(function(oData){
					that.getView().setBusy(false);
					sap.m.MessageToast.show("Leave Request send for Approval");
					that.destroyMessagePopover();
				}).catch(function(oError){
					that.getView().setBusy(false);
					var oPopover = that.getErrorMessage(oError);
				});


		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf oft.fiori.view.View2
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf oft.fiori.view.View2
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/*
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf oft.fiori.view.View2
		 */
		//	onExit: function() {
		//
		//	}

	});

});
