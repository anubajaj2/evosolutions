sap.ui.define([
	"oft/fiori/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/routing/RouteMatchedHandler"

], function(Controller, Filter, FilterOperator, Route) {
	"use strict";
	return Controller.extend("oft.fiori.controller.dailyTasks", {

  onInit: function() {
	//Set the default date as todays date
	var oDt = this.getView().byId("idCoDate1");
	 oDt.setDateValue(new Date());

	 var oRouter = this.getOwnerComponent().getRouter();
	 oRouter.attachRoutePatternMatched(this.onDateChanged1, this);
	 //var oDel = this.getView().byId("idRowAction").setVisible(true);
},

//Function to filter data on initial load o page when the date EQ todays date
onDateChanged1: function(oEvent) {
//this.byId("idRowAction").setVisible(false);
	 var dDateStart = new Date();
	 var dDateEnd = new Date(dDateStart);
	 var aFilters = [];

   dDateStart.setMilliseconds(0);
   dDateStart.setSeconds(0);
   dDateStart.setMinutes(0);
   dDateStart.setHours(0);

   // Set second date as end of day
   dDateEnd.setMilliseconds(0);
   dDateEnd.setSeconds(59);
   dDateEnd.setMinutes(59);
   dDateEnd.setHours(23);

   dDateStart.set
   aFilters.push(new Filter({
   path: "CrDate",
   operator: FilterOperator.BT,
   value1: dDateStart,
   value2: dDateEnd
}));

	aFilters.push(new Filter({
		path: "CreatedBy",
		operator: FilterOperator.Contains,
		value1: this.getView().getModel("local").getProperty("/CurrentUser")
	}));
  var odata = this.getView().byId("idCoTable").getBinding("rows").filter(aFilters);
 },

//Function to filter data wrt date selected and disable save button when date NE todays date
 onDateChange: function(oEvent) {
   //If date is changed set the new selected ate
	 if (oEvent.getParameter('newValue')) {
			 this.getView().getModel('local').setProperty('/task/CrDate' ,
			 oEvent.getParameter('newValue'));
			 }
	 //todays date in time format
		 var today = new Date();
		 today.setDate(today.getDate());
		 var dd = today.getDate();
		 var mm = today.getMonth()+1; //January is 0!
		 var yyyy = today.getFullYear();
		 var date =  dd + "/" + mm  + "/" + yyyy;
	 //date selected by user in time format
		 var date1 = oEvent.getSource().getDateValue();
		 date1.setDate(date1.getDate());
		 var dd1 = date1.getDate();
		 var mm1 = date1.getMonth()+1; //January is 0!
		 var yyyy1 = date1.getFullYear();
		 var date1 =  dd1 + "/" + mm1  + "/" + yyyy1;
   //Compare entered date and disable save if it is NE todays date
		 // if(date1 != date)	{
		 // var oBtn = this.byId("idBtn").setEnabled(false);
		 // }else{
		 // var oBtn = this.byId("idBtn").setEnabled(true);
		 // }

   //Filter the data wrt date sekected by the user
		 var dDateStart = oEvent.getSource().getProperty('dateValue');
		 var dDateEnd = new Date(dDateStart);
		 var isValidDate = oEvent.getParameter('valid');
		 var aFilters = [];

		 if( isValidDate ) {
   // Set start date with time 000000
     dDateStart.setMilliseconds(0);
     dDateStart.setSeconds(0);
     dDateStart.setMinutes(0);
     dDateStart.setHours(0);

   // Set End date with time 235959
     dDateEnd.setMilliseconds(0);
     dDateEnd.setSeconds(59);
     dDateEnd.setMinutes(59);
     dDateEnd.setHours(23);

   //dDateStart.set
     aFilters.push(new Filter({
	   path: "CrDate",
	   operator: FilterOperator.BT,
	   value1: dDateStart,
	   value2: dDateEnd
 }));
 debugger;
	 aFilters.push(new Filter({
		 path: "CreatedBy",
		 operator: FilterOperator.Contains,
		 value1: this.getView().getModel("local").getProperty("/CurrentUser")
	 }));
}
//bind the filter to the table rows
    this.getView().byId("idCoTable").getBinding("rows").filter(aFilters);
 },

 onDelete: function(oEvent) {
	var that = this;
	var oPath = oEvent.getSource().getBindingContext().getPath();
 sap.m.MessageBox.confirm("Do you want to delete the selected records?", function(conf) {
	 if (conf == 'OK') 	{
				 that.ODataHelper.callOData(that.getOwnerComponent().getModel(), oPath, "DELETE", {}, {}, that)
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

//Funtion to save the entries in DB on click of save
	onSave: function(oEvent) {
  	var that = this;
	//get the model object for /task
		var myData = this.getView().getModel("local").getProperty("/task");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "yyyy-MM-dd"});

    myData.taskWorkedOn = this.getView().byId("idWOn").getValue();
			if (this.getView().byId("idWH").getValue() <= '8'){
		if (this.getView().byId("idWH").getValue() != '0'){myData.noOfHours = this.getView().byId("idWH").getValue()

		myData.CrDate = this.getView().byId("idCoDate1").getDateValue();
		myData.taskType = this.getView().byId("idTaskType").getSelectedKey();
		myData.link = this.getView().byId("idLink").getValue();
		myData.remarks = "";
		this.ODataHelper.callOData(this.getOwnerComponent().getModel(), "/tasks",
																"POST", {}, myData, this)
		.then(function(oData) {
		that.getView().setBusy(false);
		sap.m.MessageToast.show("Data Saved Successfully");
		}).catch(function(oError) {
		that.getView().setBusy(false);
		var oPopover = that.getErrorMessage(oError);
		});
		;
  	}else{(sap.m.MessageToast.show("Hour with zero value not allowed"))};
	}else{(sap.m.MessageToast.show("Hour greater that 8 value not allowed"))};
	}
});
});
