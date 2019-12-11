sap.ui.define([
	"oft/fiori/controller/BaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"oft/fiori/models/formatter",
	"sap/ui/model/Filter"
], function(Controller, MessageBox, MessageToast, Formatter, Filter) {
	"use strict";
	return Controller.extend("oft.fiori.controller.createLeave", {
		formatter: Formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf oft.fiori.view.View2
		 */
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.herculis, this);
			var dateFrom = new Date();
			this.getModel("local").setProperty("/LeaveStatic/dateValueDRS1",this.startDate);
			this.getModel("local").setProperty("/LeaveStatic/secondDateValueDRS1",this.startDate);
			this.getModel("local").setProperty("/newLeaveRequest/DateFrom", this.formatter.getFormattedDate(0));
//			this.getView().byId("idDPlblday").setDateValue(new Date());
			this.getView().byId("idDPlblday").setVisible(false);
			this.getView().byId("idDatePicker").setVisible(false);
			var dateTo = new Date();
			var currentUser = this.getModel("local").getProperty("/CurrentUser");
				if (currentUser) {
					var loginUser = this.getModel("local").oData.AppUsers[currentUser].UserName;
					this.getView().byId("idUser").setText(loginUser);
				}

	},
	onSelchange: function(oEvent){
		var sel = oEvent.getParameters("selectedItem");
		if (sel.selectedItem.mProperties.key === "Full Day"){
	 	this.getView().byId("idlblday").setVisible(true);
		this.getView().byId("idDate").setVisible(true);
// Set false
		this.getView().byId("idDPlblday").setVisible(false);
		this.getView().byId("idDatePicker").setVisible(false);
		this.getView().getModel("local").setProperty("/newLeaveRequest/Days",0)
		}else{
			this.getView().byId("idDPlblday").setVisible(true);
			this.getView().byId("idDatePicker").setVisible(true)
			this.getView().byId("idlblday").setVisible(false);
			this.getView().byId("idDate").setVisible(false);
			this.getView().getModel("local").setProperty("/newLeaveRequest/Days",0.5)
		}

	},
onBeforeRendering: function(){
},
		onBack: function() {
			this.oRouter.navTo("leaveRequest");
		},
		herculis: function(oEvent) {

			debugger;
		},
		//var oLeaveRequest : {},
		onhandleChange: function (oEvent) {
			debugger;

			var oLeaveRequest={};
			var sfrom = {};
			var sTo = {};
			 sfrom = oEvent.getParameter("from");
			 var nextdate = new Date(new Date(sfrom).getFullYear(),new Date(sfrom).getMonth(),new Date(sfrom).getDate()+1);
			 sTo = oEvent.getParameter("to");

			 var diff = sTo - sfrom;
			 var days =  diff / (1000 * 3600 * 24);

			var currentUser = this.getModel("local").getProperty("/CurrentUser");
			var oDate = new Date();
			var payload = {
				"date":nextdate,
				"EmpId":currentUser
			};

				var that = this;
			var oLeaveRecords=[];


			$.post('/getLeaveValidator',payload).done(function(data,status){

						if (data[0].valueOf()==0) {
							sap.m.MessageToast.show("You have already applied leave for this Date...!Please select another Date");
						}
					// if (data.length) {
					//
					// 	 for (var i = 0; i <data.length; i++) {
					// 	// 	if ((this.dateSelected.getDate() == new Date(data[i].DateFrom).getDate()) && (this.dateSelected.getMonth() == new Date(data[i].DateFrom).getMonth()) && (this.dateSelected.getFullYear() == new Date(data[i].DateFrom).getFullYear()) ){
					// 	// 		sap.m.MessageToast.show("You have already applied leave for this Date,Please select another Date");
					// 	// 	}
					// 	data[i].ApprovedOn= new Date(data[i].ApprovedOn);
					// 	data[i].ChangedOn = new Date(data[i].ChangedOn);
					// 	data[i].DateFrom = new Date(data[i].DateFrom);
					// 	data[i].DateTo = new Date(data[i].DateTo);
					//
					// 	oLeaveRecords[i] = data[i];
					//
					// 	}
					// }


			}).fail(function(xhr,status,error){

				sap.m.MessageBox.console.error("Something is wrong in your Code");

			});


// to get the correct count add 1 to the days
			 days = days + 1;
			 if (days == 0) {
			 	this.getView().getModel("local").setProperty("/newLeaveRequest/Days",1);
			}else {
			 this.getView().getModel("local").setProperty("/newLeaveRequest/Days",days);
		 }
			var bValid = oEvent.getParameter("valid");
			this.getView().getModel("local").setProperty("/newLeaveRequest/DateFrom",sfrom);
			this.getView().getModel("local").setProperty("/newLeaveRequest/DateTo",sTo);
		},
		onDPhandleChange:function(oEvent){
			debugger;
			var oDP = oEvent.getSource();
			var sValue = oEvent.getParameter("value");
			var bValid = oEvent.getParameter("valid");
			this.getView().getModel("local").setProperty("/newLeaveRequest/Days",0.5)
			this.getView().getModel("local").setProperty("/newLeaveRequest/DateFrom",sValue);
			this.getView().getModel("local").setProperty("/newLeaveRequest/DateTo",sValue);
		},

		onCancel:function(oEvent){
			this.getView().getModel("local").setProperty("/newLeaveRequest/DateFrom", this.formatter.getFormattedDate(0));
			this.getView().getModel("local").setProperty("/newLeaveRequest/DateTo", this.formatter.getFormattedDate(0));
			this.getView().getModel("local").setProperty("/newLeaveRequest/Remarks", null)

		},
		onSave:function(oEvent){
			var oLocal = oEvent;
			var that = this;
			var that2 = this;
			that.getView().setBusy(true);
			var currentUser = this.getModel("local").getProperty("/CurrentUser");
			var leadData = this.getView().getModel("local").getProperty("/newLeaveRequest");
			var oStatic = this.getView().getModel("local").getProperty("/LeaveStatic");

			if (leadData.DateFrom >  leadData.DateTo){
			that.getView().setBusy(false);
			sap.m.MessageBox.error("Date From Cannot be greater than Date To");
			return;
			}
			var tdate = new Date(leadData.DateFrom);
			var yearFrom = tdate.getFullYear();
			tdate = new Date(leadData.DateTo);
			var yearTo = tdate.getFullYear();
			if (yearFrom != yearTo) {
				that.getView().setBusy(false);
				sap.m.MessageBox.error("Please do not span leaves over multiple years");
				return;
			}
			if (leadData.Days > oStatic.Available) {
				MessageBox.confirm("You can only apply for" + oStatic.Available +"days.Do you still want to proceed?", function(conf) {
			if (conf == 'OK') {
				var payload ={
					"AppUserId": currentUser,
					 "DateFrom": leadData.DateFrom,
					 "DateTo": leadData.DateTo,
					 "Days": leadData.Days,
					 "LeaveType":leadData.LeaveType,
					 "Status": "Not Approved",
					 "ApproverId": "",
					 "ApprovedOn": new Date(),
					 "RequestedOn": new Date(),
					 "Remarks": leadData.Remarks,
					 "ChangedOn": new Date(),
					 "ChangedBy": currentUser
				};
				var that3 = that2;
				that2.ODataHelper.callOData(that2.getOwnerComponent().getModel(),"/LeaveRequests","POST",{},
					payload, that2)
					.then(function(oData){
						that.getView().setBusy(false);
						sap.m.MessageToast.show("Leave Request send for Approval");

						debugger;
						var userName = that3.getModel("local").getProperty("/UserName");
						var MobileNo = that3.getModel("local").getProperty("/MobileNo");
						var loginPayload = {};
						loginPayload.msgType =  "leaveRequest";
						loginPayload.userName =  userName;
						loginPayload.requested =   payload.Days ;
						loginPayload.balance =  "?";
						loginPayload.Number =  MobileNo;
						$.post('/requestMessage', loginPayload)
							.done(function(data, status) {
								sap.m.MessageToast.show("Message sent successfully");
							})
							.fail(function(xhr, status, error) {
								that.passwords = "";
								sap.m.MessageBox.error(xhr.responseText);
							});

						that.destroyMessagePopover();
					}).catch(function(oError){
						that.getView().setBusy(false);
						var oPopover = that.getErrorMessage(oError);
					});

			}else { that.getView().setBusy(false); }
		},"Confirmation");
		}else{
			var payload ={
				"AppUserId": currentUser,
				 "DateFrom": leadData.DateFrom,
				 "DateTo": leadData.DateTo,
				 "Days": leadData.Days,
				 "LeaveType":leadData.LeaveType,
				 "Status": "Not Approved",
				 "ApproverId": "",
				 "ApprovedOn": new Date(),
				 "RequestedOn": new Date(),
				 "Remarks": leadData.Remarks,
				 "ChangedOn": new Date(),
				 "ChangedBy": currentUser
			};
			this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/LeaveRequests","POST",{},
				payload, this)
				.then(function(oData){
					that.getView().setBusy(false);
					sap.m.MessageToast.show("Leave Request send for Approval");
					var userName = that2.getModel("local").getProperty("/UserName");
					var MobileNo = that2.getModel("local").getProperty("/MobileNo");
					var loginPayload = {};
					loginPayload.msgType =  "leaveRequest";
					loginPayload.userName =  userName;
					loginPayload.requested =   payload.Days ;
					loginPayload.balance =  "?";
					loginPayload.Number =  MobileNo;
					$.post('/requestMessage', loginPayload)
						.done(function(data, status) {
							sap.m.MessageToast.show("Message sent successfully");
						})
						.fail(function(xhr, status, error) {
							that.passwords = "";
							sap.m.MessageBox.error(xhr.responseText);
						});
					that.destroyMessagePopover();
				}).catch(function(oError){
					that.getView().setBusy(false);
					var oPopover = that.getErrorMessage(oError);
				});

			}
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
