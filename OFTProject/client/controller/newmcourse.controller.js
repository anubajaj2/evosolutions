//var courseGUID;
//var Updatecourse;
sap.ui.define([
	"oft/fiori/controller/BaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"oft/fiori/models/formatter",
	"sap/ui/model/Filter"
], function(Controller, MessageBox, MessageToast, Formatter, Filter) {
	"use strict";

	return Controller.extend("oft.fiori.controller.newmcourse", {
		formatter: Formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf oft.fiori.view.View2
		 */

		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this.clearForm();
			this.oRouter.attachRoutePatternMatched(this.herculis, this);
			// var currentUser = this.getModel("local").getProperty("/CurrentUser");
			// if (currentUser) {
			// 	var loginUser = this.getModel("local").oData.AppUsers[currentUser].UserName;
			// 	this.getView().byId("idUser").setText(loginUser);
			// }
		},
		//Declaration of global variable to control update and Save
	//	Updatecourse = false,
		clearForm: function() {
			// this.getView().getModel("local").setProperty("/newLead",{
			// 	"emailId": "",
			// 	"course": " ",
			// 	"date": "",
			// 	"FirstName": "",
			// 	"LastName": "",
			// 	"country": "",
			// 	"phone": "",
			// 	"subject": "",
			// 	"message": ""
			// });
		},

		// onBack: function() {
		// 	sap.ui.getCore().byId("idApp").to("idView1");
		// },
		// onPress: function() {
		// 	sap.m.MessageBox.alert("Button was clicked");
		// },
		// onHover: function() {
		// 	sap.m.MessageBox.alert("Button was Hovered");
		// },
		onBack: function() {
			sap.ui.getCore().getView().byId("idApp").to("idView1");
		},
		herculis: function(oEvent) {
			if(oEvent.getParameter("name") !== "newmcourse"){
				return;
			}

		},
			onSave: function(oEvent) {
				debugger;
				var oLocal = oEvent;
				console.log(this.getView().getModel("local").getProperty("/newmcourse"));
				var that = this;
				that.getView().setBusy(true);
				var leadData = this.getView().getModel("local").getProperty("/newmcourse");
				var payload = {
					 "CourseName":leadData.CourseName.toUpperCase(),
					 "CourseFee":leadData.CourseFee,
					 "MinFees":leadData.MinFees,
						"CreatedOn": new Date(),
						"CreatedBy": "Pooja",
					// "SoftDelete": false
				};
				this.ODataHelper.callOData(this.getOwnerComponent().getModel(), "/CoursesMst", "POST", {},
						payload, this)
						.then(function(oData) {

						that.getView().setBusy(false);
						//that.subsciptionSaved = "true";
						sap.m.MessageToast.show("New Course Saved successfully");
						that.destroyMessagePopover();
					}).catch(function(oError) {

						that.getView().setBusy(false);
						//that.subsciptionSaved = "false";
						var oPopover = that.getErrorMessage(oError);
					});
		},
		onSelect:function(oEvent){
		this.sId = oEvent.getSource().getId();
		var sTitle = "",
			sPath = "";
 		if (this.sId.indexOf("idCourse") !== -1) {
				this.getCourseMstPopUp();
				var title = this.getView().getModel("i18n").getProperty("courseMst");
				this.searchPopup.setTitle(title);
				this.searchPopup.bindAggregation("items", {
					path: "/CoursesMst",
					template: new sap.m.DisplayListItem({
						label: "{CourseName}",
						value: "{CourseFee}"
					})
				});
			}
		},
		onConfirm:function(oEvent) {
			debugger;
			if (this.sId.indexOf("idCourse") !== -1){
				var oItem = oEvent.getParameter("selectedItem");
				var oContext = oItem.getBindingContext();
				if (oContext) {
					var that = this;
					var payload = {};
				  var oFilter = new sap.ui.model.Filter("CourseName","EQ",oContext.getObject().CourseName);
					this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/CoursesMst","GET",{
						filters:[oFilter]
					},payload,this)
					.then(function(oData){
							if(oData.results.length != 0){
							that.getView().byId("idCourse").setValue(oData.results[0].CourseName);
							that.getView().byId("idCourseFee").setValue(oData.results[0].CourseFee);
							if (oData.results[0].MinFees) {
							that.getView().byId("idMinFees").setValue(oData.results[0].MinFees);
						}
						else
						{
							that.getView().byId("idMinFees").setValue(0);
						}
						that.getView().byId("idCreate").setText("Update");
						//that.Updatecourse = true;
						//that.courseGUID = odata.results[0].id;
							}
					}).catch(function(oError){
						that.getView().byId("idCreate").setText("Create");
						//that.Updatecourse = false;
					});
				}

			}
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
