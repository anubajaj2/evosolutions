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

		herculis: function(oEvent) {

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
