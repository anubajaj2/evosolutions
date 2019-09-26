sap.ui.define([
	"oft/fiori/controller/BaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"oft/fiori/models/formatter",
	"sap/ui/model/Filter"
], function(Controller, MessageBox, MessageToast, Formatter, Filter) {
	"use strict";
	return Controller.extend("oft.fiori.controller.leaveApproval", {

		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.herculis, this);
	},

onBeforeRendering: function(){
},
		onBack: function() {
			sap.ui.getCore().byId("idApp").to("idView1");
		},
		formatDates: function(oDate1,oDate2){
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd.MM.YYYY" });
			var oDate1Ret = dateFormat.format(oDate1);
			var oDate2Ret = dateFormat.format(oDate2);
			return oDate1Ret + " - " + oDate2Ret;
		},
		onApprove: function(oEvent){
			var sPath = oEvent.getSource().getBindingContext().sPath;
			var that = this;
			var payload3 = {
				"Status": "Approved"
			};
			this.ODataHelper.callOData(this.getOwnerComponent().getModel(), sPath, "PUT", {}, payload3, this)
				.then(function(oData) {
					MessageToast.show("The Leave request has been approved");
					that.reloadLeaves();
					///send sms
				}).catch(function(oError) {
					that.getView().setBusy(false);
					var oPopover = that.getErrorMessage(oError);

				});
		},
		onDelete: function(oEvent){
			var that = this;
			var outSider = oEvent;
			var deletePath = oEvent.getSource().getParent().getBindingContextPath();
			MessageBox.confirm("Do you want to delete the selected records?", function(conf) {
				if (conf == 'OK') {
						that.ODataHelper.callOData(that.getOwnerComponent().getModel(), deletePath,
								"DELETE", {}, {}, that)
							.then(function(oData) {
								sap.m.MessageToast.show("Deleted succesfully");
								that.reloadLeaves();
							}).catch(function(oError) {
								that.getView().setBusy(false);
								that.oPopover = that.getErrorMessage(oError);
								that.getView().setBusy(false);
							});
				}
			}, "Confirmation");
		},
		onReject: function(oEvent){
			var sPath = oEvent.getSource().getBindingContext().sPath;
			var that = this;
			var payload3 = {
				"Status": "Rejected"
			};
			this.ODataHelper.callOData(this.getOwnerComponent().getModel(), sPath, "PUT", {}, payload3, this)
				.then(function(oData) {
					MessageToast.show("The Leave request has been Rejected");
					that.reloadLeaves();
					///send sms
				}).catch(function(oError) {
					that.getView().setBusy(false);
					var oPopover = that.getErrorMessage(oError);

				});
		},
		currentUser:"",
		getName: function(userId){
			if(userId){
					return this.getModel("local").oData.AppUsers[userId].UserName;
			}
		},
		herculis: function(oEvent) {
				debugger;
				this.currentUser = this.getModel("local").getProperty("/CurrentUser");
				this.reloadLeaves();
			},
	  reloadLeaves: function(){
			this.getView().byId("pendingLeaveTable").bindItems({
				path: "/LeaveRequests",
				template: new sap.m.ColumnListItem({
					cells: [new sap.m.Text({text: {
										path : 'AppUserId',
										formatter: this.getName.bind(this)
									}}),
									new sap.m.Text({text: {
										parts: [{path: 'DateFrom'},{path: 'DateTo'}],
										formatter: this.formatDates
									}}),
									new sap.m.Text({text: "{Days}"}),
									new sap.m.Button({text: "Approve", press: [this.onApprove, this]}),
									new sap.m.Button({text: "Reject", press: [this.onReject, this]})
								]
				})
			});
			this.getView().byId("pendingLeaveTable").getBinding("items").filter([
				new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'Not Approved'),
				new sap.ui.model.Filter("AppUserId", sap.ui.model.FilterOperator.NE, "'" + this.currentUser + "'")
			]);

			this.getView().byId("approvedLeaveTable").bindItems({
				path: "/LeaveRequests",
				template: new sap.m.ColumnListItem({
					cells: [new sap.m.Text({text: {path : 'AppUserId', formatter: [this.getName, this]}}),
									new sap.m.Text({text: {
										parts: [{path: 'DateFrom'},{path: 'DateTo'}],
										formatter: this.formatDates
									}}),
									new sap.m.Text({text: "{Days}"}),
									new sap.m.Button({text: "Delete", press: [this.onDelete, this]})
								]
				})
			});
			this.getView().byId("approvedLeaveTable").getBinding("items").filter([
				new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'Approved'),
				new sap.ui.model.Filter("AppUserId", sap.ui.model.FilterOperator.NE, "'" + this.currentUser + "'")
			]);
		},
		onSelect: function(oEvent){
			var selectedKey = oEvent.getSource().getSelectedKey();

		},
// onApprove: function(oEvent){
// 	debugger;
//         	var that = this;
// 					//Get the selected item from the table
// 					//Prepare the Payload with Status as Approved
// 					//Call the Odata PUT to update the records
// 					//Call the relaodLeave() to apply the filter Table with updated payload
// 	         var lObject=oEvent.getSource().getBindingContext().getObject();
// 					var lId= lObject.id;
// 					var payload = {
// 						"AppUserId": lObject.AppUserId,
//                 "DateFrom": lObject.DateFrom,
//                 "DateTo": lObject.DateTo,
//                 "Days":lObject.Days,
//                 "LeaveType": lObject.LeaveType,
//                 "Status": "Approved",
//                 "ApproverId": lObject.ApproverId,
//                 "ApprovedOn": lObject.ApprovedOn,
//                 "RequestedOn": lObject.RequestedOn,
//                 "Remarks": lObject.Remarks,
//                 "ChangedOn": lObject.ChangedOn,
//                 "ChangedBy": lObject.ChangedBy,
//                 "id": lObject.id,
// 					};
// 					var sPath1 = "/LeaveRequests";
// 					sPath1 = sPath1 = sPath1 + "(" + "\'" + lId + "\'" + ")";
//
// 						this.ODataHelper.callOData(this.getOwnerComponent().getModel(), sPath1, "PUT", {},
// 							payload, this)
// 						.then(function(oData) {
// 							debugger;
// 							that.getView().setBusy(false);
// 							sap.m.MessageToast.show("Leave Data updated successfully");
// 							that.destroyMessagePopover();
//              this.reloadLeaves();
// 						}).catch(function(oError) {
// 							debugger;
// 							that.getView().setBusy(false);
// 							//sap.m.MessageToast.show(oError.responseText);
// 							var oPopover = that.getErrorMessage(oError);
// 							// var oMultiInput1 = .getView().getElementById("multiInputID");
// 							// oMultiInput1.removeAllTokens();
// 						});
//
//
//
//
//
// 		},
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
			onAfterRendering: function() {

				// var currentUser = this.getModel("local").getProperty("/CurrentUser");
				// if (currentUser) {
				// 	var loginUser = this.getModel("local").oData.AppUsers[currentUser].TechnicalId;
				// 		this.getView().byId("idEmployee").removeItem(loginUser);
				}



		/*
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf oft.fiori.view.View2
		 */
		//	onExit: function() {
		//
		//	}

	});

});
