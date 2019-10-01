sap.ui.define([
	"oft/fiori/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/routing/RouteMatchedHandler",
	"sap/ui/table/Table"

], function(Controller, Filter, FilterOperator, Route,Table) {
	"use strict";
	return Controller.extend("oft.fiori.controller.taskOverview", {

  onInit: function() {

				 },
onUpdateFinished:function(oEvent){
	debugger;
	var oTable= oEvent.getSource();
	var oTableItem = oTable.getItems();
	var noItems=oTableItem.length;
	var cell;
	for(var i=0; i < noItems; i++){
        var userId=oTable.getItems()[i].getCells()[1].getText();
				var userData=this.allMasterData.AppUsers[userId];
				oTable.getItems()[i].getCells()[1].setText(userData.UserName);
				}
				// oTable.getBinding("items").filter([
			 // 	new sap.ui.model.Filter("AppUserId", sap.ui.model.FilterOperator.EQ, "'" + techId + "'"),
			 // 	new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'Not Approved')
			 // ]);
			 // 	var aFilters = [];
			 // var oUser=this.getView().byId("idUser").getValue();
			 // 	aFilters.push(new Filter({
			 // 		path: "CreatedBy",
			 // 		operator: FilterOperator.EQ,
			 // 		value1: oUser
			 // 	}));
			 //
			 // 	 this.getView().byId("idCoTable").getBinding("items").filter(aFilters);
       //   oEvent.getSource().getBinding("items").filter(aFilters);
},

onDateChange: function(oEvent) {
	//If date is changed set the new selected ate
	if (oEvent.getParameter('newValue')) {
			this.getView().getModel('local').setProperty('/task/CrDate' ,
			oEvent.getParameter('newValue'));
			}
		var date1 = oEvent.getSource().getDateValue();
		date1.setDate(date1.getDate());
		var dd1 = date1.getDate();
		var mm1 = date1.getMonth()+1; //January is 0!
		var yyyy1 = date1.getFullYear();
		var date1 =  dd1 + "/" + mm1  + "/" + yyyy1;
		var dDateStart = oEvent.getSource().getProperty('dateValue');
		var dDateEnd = new Date(dDateStart);

		var aFilters = [];
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

// var oUserId=this.getView().byId("idUser").getSelectedKey();
// 	aFilters.push(new Filter({
// 		path: "AppUserId",
// 		operator: FilterOperator.EQ,
// 		value1: oUserId
// 	}));

//bind the filter to the table rows
	 this.getView().byId("idCoTable").getBinding("rows").filter(aFilters);
}

});
});
