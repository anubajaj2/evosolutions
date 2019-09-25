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
		onApprove: function(oEvent){},
		onDelete: function(oEvent){
			var that = this;
			MessageBox.confirm("Do you want to delete the selected records?", function(conf) {
				if (conf == 'OK') {
						that.ODataHelper.callOData(that.getOwnerComponent().getModel(), oEvent.getParameter("selectedItem").getBindingContextPath(),
								"DELETE", {}, {}, that)
							.then(function(oData) {
								sap.m.MessageToast.show("Deleted succesfully");
							}).catch(function(oError) {
								that.getView().setBusy(false);
								that.oPopover = that.getErrorMessage(oError);
								that.getView().setBusy(false);
							});
				}
			}, "Confirmation");
		},
		onReject: function(oEvent){},
		currentUser:"",
		herculis: function(oEvent) {
				debugger;
				this.currentUser = this.getModel("local").getProperty("/CurrentUser");
				this.reloadLeaves();
			},
	  reloadLeaves: function(){
			this.getView().byId("pendingLeaveTable").bindItems({
				path: "/LeaveRequests",
				template: new sap.m.ColumnListItem({
					cells: [new sap.m.Text({text: "{AppUserId}"}),
									new sap.m.Text({text: {
										parts: [{path: 'DateFrom'},{path: 'DateTo'}],
										formatter: this.formatDates
									}}),
									new sap.m.Text({text: "{Days}"}),
									new sap.m.Button({text: "Approve", press: this.onApprove}),
									new sap.m.Button({text: "Reject", press: this.onReject})
								]
				})
			});
			this.getView().byId("pendingLeaveTable").getBinding("items").filter([
				new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'Not Approved'),
				new sap.ui.model.Filter("AppUserId", sap.ui.model.FilterOperator.NE, "'" + currentUser + "'")
			]);

			this.getView().byId("approvedLeaveTable").bindItems({
				path: "/LeaveRequests",
				template: new sap.m.ColumnListItem({
					cells: [new sap.m.Text({text: "{AppUserId}"}),
									new sap.m.Text({text: {
										parts: [{path: 'DateFrom'},{path: 'DateTo'}],
										formatter: this.formatDates
									}}),
									new sap.m.Text({text: "{Days}"}),
									new sap.m.Button({text: "Delete", press: this.onDelete})
								]
				})
			});
			this.getView().byId("approvedLeaveTable").getBinding("items").filter([
				new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'Approved'),
				new sap.ui.model.Filter("AppUserId", sap.ui.model.FilterOperator.NE, "'" + currentUser + "'")
			]);
		},
		onSelect: function(oEvent){
			var selectedKey = oEvent.getSource().getSelectedKey();

		},
onApprove: function(){
				this.oFragmentLeave = new sap.ui.xmlfragment("oft.fiori.fragments.approvedLeaveTable");
				this.getView().addDependent(this.oFragmentSupplier);
			MessageBox.confirm("Do you want to approve?",{
				title: "Approval"
			});
		},
		onDelete: function(){
			this.oFragmentLeave = new sap.ui.xmlfragment("oft.fiori.fragments.pendingLeaveTable");
			this.getView().addDependent(this.oFragmentSupplier);
					MessageBox.confirm("Do you want to delete?",{
						title: "Delete"
					});
				},







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
