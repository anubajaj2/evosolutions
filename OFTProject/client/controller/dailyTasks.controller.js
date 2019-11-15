sap.ui.define([
	"oft/fiori/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/routing/RouteMatchedHandler"

], function(Controller, Filter, FilterOperator, Route) {
	"use strict";
	return Controller.extend("oft.fiori.controller.dailyTasks", {

  onInit: function() {
		debugger;
	//Set the default date as todays date
	var oDt = this.getView().byId("idCoDate1");
	 oDt.setDateValue(new Date());

	 var oRouter = this.getOwnerComponent().getRouter();
	 oRouter.attachRoutePatternMatched(this.herculis, this);
	 var currentUser = this.getModel("local").getProperty("/CurrentUser");
			if (currentUser) {
				var loginUser = this.getModel("local").oData.AppUsers[currentUser].UserName;
				this.getView().byId("idUser").setText(loginUser);
			}
},

herculis:function(){
	this.getView().byId("idCoDate1").setDateValue(new Date());
		// if(oEvent.getParameter("name") !== "dailyTask"){
		// 	return;
		// }
		this.getModel("local").setProperty("/tasks/CrDate", new Date());
		this.currentUser = this.getModel("local").getProperty("/CurrentUser");
		this.fromDate = new Date();
		// this.toDate = new Date(this.fromDate + 1);
		this.toDate = new Date();
		// this.toDate = new Date(this.fromDate);
		this.fromDate.setMilliseconds(0);
		this.fromDate.setSeconds(0);
		this.fromDate.setMinutes(0);
		this.fromDate.setHours(0);

		this.toDate.setMilliseconds(0);
		this.toDate.setSeconds(59);
		this.toDate.setMinutes(59);
		this.toDate.setHours(23);
		this.reloadTasks();
},
reloadTasks: function(oEvent) {
		debugger;
		var role=this.getModel("local").getProperty("/Role");
this.getView().byId("idCoTable").bindItems({
	path:"/tasks",
	template: new sap.m.ColumnListItem({
     cells: [
			 new sap.m.Text({text: "{taskWorkedOn}"}),
			 	new sap.m.Text({text: { path: 'CrDate', type:'sap.ui.model.type.Date', formatOptions:{ pattern:'dd.MM.YYYY' } }}),
				new sap.m.Text({text: {path: 'taskType',
				formatter: '.formatter.getTaskText'}}),
				new sap.m.Text({text: "{noOfHours}"}),
				new sap.m.Link({text: { path: 'link'}}),//, href:'link'
				new sap.m.Button({text: "Delete", icon: "sap-icon://delete", press: [this.onDelete, this]})
		 ]

	})

});


if(role=='Admin'){
	var filters = [new sap.ui.model.Filter(
					 "CrDate",
					 FilterOperator.BT,
					 this.fromDate,
					 this.toDate
				)];
	this.getView().byId("idCoTable").getBinding("items").filter(filters);
}

else {

	var filters = [new sap.ui.model.Filter(
					 'CreatedBy',
					 'EQ',
						"'" + this.currentUser + "'"
				),new sap.ui.model.Filter(
					 "CrDate",
					 FilterOperator.BT,
					 this.fromDate,
					 this.toDate // just example
				)];
				// sap.m.MessageToast.show("Task Reloaded");
	this.getView().byId("idCoTable").getBinding("items").filter(filters);

}
},

onUpdateFinished:function(oEvent){
	debugger;
	var oTable= oEvent.getSource();
	var oTableItem = oTable.getItems();
	var noItems=oTableItem.length;
	var cell;
	    // for(var i=0; i < noItems; i++){
      //   var userId=oTable.getItems()[i].getCells()[1].getText();
			// 	var userData=this.allMasterData.AppUsers[userId];
			// 	oTable.getItems()[i].getCells()[1].setText(userData.UserName);
			// 	}
				 var rows =this.getView().byId("idCoTable").getBinding("items").getLength();
				 var oBinding =this.getView().byId("idCoTable").getBinding("items");
				 var total = 0;
				 for (var i = 0; i < rows; i++) {
					 total = total + parseInt(oBinding.getContexts()[i].oModel.getProperty(oBinding.getContexts()[i].sPath).noOfHours);
				 }
				 this.getView().byId("idTxt").setText("Total number of tasks are " + oBinding.getLength() + " and Total number of hours worked are " + total + "");
},
  // var odata = this.getView().byId("idCoTable").getBinding("rows").filter(aFilters);
	// var oBinding = this.getView().byId("idCoTable").getBinding("rows");
	// var that = this;
	//  oBinding.attachDataReceived(function(sReason) {
	// 	 	debugger;
	// 	 	 var rows = oBinding.getLength();
	// 		 var total = 0;
	// 		 for (var i = 0; i < rows; i++) {
	// 			 total = total + parseInt(oBinding.getContexts()[i].oModel.getProperty(oBinding.getContexts()[i].sPath).noOfHours);
	// 		 }
	// 		 that.getView().byId("idCoTable").setTitle("Today worked on " + oBinding.getLength() + " tasks and " + total + " Hours");
	//  });

//  onDateChange: function(oEvent) {
// 	 	debugger;
//    //If date is changed set the new selected ate
// 	 if (oEvent.getParameter('newValue')) {
// 			 this.getView().getModel('local').setProperty('/task/CrDate' ,
// 			 oEvent.getParameter('newValue'));
// 			 }
// 	 //todays date in time format
// 		 var today = new Date();
// 		 today.setDate(today.getDate());
// 		 var dd = today.getDate();
// 		 var mm = today.getMonth()+1; //January is 0!
// 		 var yyyy = today.getFullYear();
// 		 var date =  dd + "/" + mm  + "/" + yyyy;
// 	 //date selected by user in time format
// 		 var date1 = oEvent.getSource().getDateValue();
// 		 date1.setDate(date1.getDate());
// 		 var dd1 = date1.getDate();
// 		 var mm1 = date1.getMonth()+1; //January is 0!
// 		 var yyyy1 = date1.getFullYear();
// 		 var date1 =  dd1 + "/" + mm1  + "/" + yyyy1;
//    //Compare entered date and disable save if it is NE todays date
// 		 // if(date1 != date)	{
// 		 // var oBtn = this.byId("idBtn").setEnabled(false);
// 		 // }else{
// 		 // var oBtn = this.byId("idBtn").setEnabled(true);
// 		 // }
//
//    //Filter the data wrt date sekected by the user
// 		 var dDateStart = oEvent.getSource().getProperty('dateValue');
// 		 var dDateEnd = new Date(dDateStart);
// 		 var isValidDate = oEvent.getParameter('valid');
// 		 var aFilters = [];
//
// 		 if( isValidDate ) {
//    // Set start date with time 000000
//      dDateStart.setMilliseconds(0);
//      dDateStart.setSeconds(0);
//      dDateStart.setMinutes(0);
//      dDateStart.setHours(0);
//
//    // Set End date with time 235959
//      dDateEnd.setMilliseconds(0);
//      dDateEnd.setSeconds(59);
//      dDateEnd.setMinutes(59);
//      dDateEnd.setHours(23);
//
//    //dDateStart.set
//      aFilters.push(new Filter({
// 	   path: "CrDate",
// 	   operator: FilterOperator.BT,
// 	   value1: dDateStart,
// 	   value2: dDateEnd
//  }));
//  debugger;
// 	 aFilters.push(new Filter({
// 		 path: "CreatedBy",
// 		 operator: FilterOperator.Contains,
// 		 value1: this.getView().getModel("local").getProperty("/CurrentUser")
// 	 }));
// }
// //bind the filter to the table rows
//     this.getView().byId("idCoTable").getBinding("rows").filter(aFilters);
//  },
onDateChange: function(oEvent) {
	var role=this.getModel("local").getProperty("/Role");
	// this.reloadTasks();
	var dDateStart = oEvent.getSource().getProperty('dateValue');
	var dDateEnd = new Date(dDateStart + 1);
	var aFilters = [];
		dDateStart.setMilliseconds(0);
		dDateStart.setSeconds(0);
		dDateStart.setMinutes(0);
		dDateStart.setHours(0);
		dDateEnd.setMilliseconds(0);
		dDateEnd.setSeconds(59);
		dDateEnd.setMinutes(59);
		dDateEnd.setHours(23);
		if(role=='Admin'){
			var oFilter1 = new Filter([
			     new sap.ui.model.Filter("CrDate", sap.ui.model.FilterOperator.BT, dDateStart, dDateEnd)
			], true);
			this.getView().byId("idCoTable").getBinding("items").filter(oFilter1,true);
		}
		else{

		var oFilter1 = new Filter([
		     new sap.ui.model.Filter("CrDate", sap.ui.model.FilterOperator.BT, dDateStart, dDateEnd)
		], true);

		var oFilter2 = new Filter([
		     new sap.ui.model.Filter("CreatedBy", sap.ui.model.FilterOperator.EQ, "'" + this.currentUser + "'")
		]);

		var oFilter = new sap.ui.model.Filter({
			filters: [oFilter1, oFilter2],
			and: true
		});
		this.getView().byId("idCoTable").getBinding("items").filter(oFilter,true);
}

},

 onDelete: function(oEvent) {
	 	debugger;
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

	onSave: function(oEvent) {
			debugger;
  	var that = this;
		var myData = this.getView().getModel("local").getProperty("/task");
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "yyyy-MM-dd"});

    myData.taskWorkedOn = this.getView().byId("idWOn").getValue();
			if (this.getView().byId("idWH").getValue() <= '8'){
		if (this.getView().byId("idWH").getValue() != '0'){
			myData.noOfHours = this.getView().byId("idWH").getValue();
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
  	}else{(sap.m.MessageToast.show("Hour with zero value not allowed"))};
	}else{(sap.m.MessageToast.show("Hour greater that 8 value not allowed"))};
	}
});
});
