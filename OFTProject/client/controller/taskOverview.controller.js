sap.ui.define([
	"oft/fiori/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/routing/RouteMatchedHandler",
	"sap/ui/table/Table"

], function(Controller, Filter, FilterOperator, Route,Table) {
	"use strict";
	return Controller.extend("oft.fiori.controller.taskOverview", {
   aFilters:[],
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
				var oKey=this.getView().byId("idUser").getValue();
				if(oKey){
				this.getView().byId("idCoTable").getBinding("items").filter([
					new sap.ui.model.Filter("CreatedBy", sap.ui.model.FilterOperator.EQ, "'" + oKey + "'"),
				]);
			}
						 var rows =this.getView().byId("idCoTable").getBinding("items").getLength();
						 var oBinding =this.getView().byId("idCoTable").getBinding("items");
						 var total = 0;
						 for (var i = 0; i < rows; i++) {
							 total = total + parseInt(oBinding.getContexts()[i].oModel.getProperty(oBinding.getContexts()[i].sPath).noOfHours);
						 }
						 this.getView().byId("idTxt").setText("Total number of tasks are " + oBinding.getLength() + " and Total number of hours worked are " + total + "");



},

onDateChange: function(oEvent) {
	debugger;
	var dDateStart = oEvent.getSource().getProperty('dateValue');
	var dDateEnd = new Date(dDateStart);
        var isValidDate = oEvent.getParameter("valid");
	var aFilters = [];

	if( isValidDate ) {
		dDateStart.setMilliseconds(0);
		dDateStart.setSeconds(0);
		dDateStart.setMinutes(0);
		dDateStart.setHours(0);

		dDateEnd.setMilliseconds(0);
		dDateEnd.setSeconds(59);
		dDateEnd.setMinutes(59);
		dDateEnd.setHours(23);

		aFilters.push(new Filter({
		   path: "CrDate",
		   operator: FilterOperator.BT,
		   value1: dDateStart,
		   value2: dDateEnd
		}));
	}

	this.byId("idCoTable").getBinding("items").filter(aFilters);

 }

});
});
