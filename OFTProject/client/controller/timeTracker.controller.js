sap.ui.define([
	"oft/fiori/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/routing/RouteMatchedHandler",
	"sap/ui/table/Table",
	"oft/fiori/models/formatter",
	"oft/fiori/utils/dateFormatter"

], function(Controller, Filter, FilterOperator, Route,Table, Formatter,FilterType,DateFormatter) {
	"use strict";
	return Controller.extend("oft.fiori.controller.timeTracker", {
   aFilters:[],
  onInit: function() {
		debugger;
		var currentUser = this.getModel("local").getProperty("/CurrentUser");
		var role=this.getModel("local").getProperty("/Role");
			if (currentUser) {
				var loginUser = this.getModel("local").oData.AppUsers[currentUser].UserName;
				this.getView().byId("idUserl").setText(loginUser);
			}
			if (role =="Admin") {
					this.getView().byId("idUser").setVisible(true);

			}else {
				this.getView().byId("idUser").setVisible(false);
			}
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.herculis, this);

},
herculis: function(oEvent) {
//	this.getView().byId("idCoDate1").setDateValue(new Date());
		if(oEvent.getParameter("name") !== "timeTracker"){
			return;
		}
		//this.getModel("local").setProperty("/tasks/CrDate", new Date());
		this.currentUser = this.getModel("local").getProperty("/CurrentUser");
		var today = new Date();
		this.fromDate = DateFormatter.getFirstDateOfMonth(today);
		this.toDate =   DateFormatter.getLastDateOfMonth(today);
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
	reloadTasks: function(){
	debugger;
	var role=this.getModel("local").getProperty("/Role");

		if(role=='Admin'){
			var filters = [new sap.ui.model.Filter(
							 "CrDate",
							 FilterOperator.BT,
							 this.fromDate,
							 this.toDate
						)];



			this.getView().byId("idCalendar").getBinding("dependents").filter(filters);
		}
		else {
			this.getView().byId("idUser").setVisible(false);
			var filters = [new sap.ui.model.Filter(
							 'CreatedBy',
							 'EQ',
							  "'" + this.currentUser + "'"
						),new sap.ui.model.Filter(
							 "CrDate",
							 FilterOperator.BT,
							 this.fromDate,
							 this.toDate
						)];
			this.getView().byId("idCalendar").getBinding("dependents").filter(filters);
		}
	},
	onSelect:function(oEvent){
		debugger;
		var techId=oEvent.getSource().getSelectedKey();
		var dDateStart=this.getView().byId("idCoDate1").getDateValue();
		var dDateEnd = new Date(dDateStart + 1);
		dDateStart.setMilliseconds(0);
		dDateStart.setSeconds(0);
		dDateStart.setMinutes(0);
		dDateStart.setHours(0);

		dDateEnd.setMilliseconds(0);
		dDateEnd.setSeconds(59);
		dDateEnd.setMinutes(59);
		dDateEnd.setHours(23);

		 // this.reloadTasks();


		 var oFilter1 = new Filter([
					new sap.ui.model.Filter("CrDate", sap.ui.model.FilterOperator.BT, dDateStart,dDateEnd)
		 ], true);

	 var oFilter2 = new Filter([
	 		 new sap.ui.model.Filter("CreatedBy", sap.ui.model.FilterOperator.EQ, "'" + techId + "'")
	 ]);

	 var oFilter = new sap.ui.model.Filter({
	 	filters: [oFilter1, oFilter2],
	 	and: true
	 });
	 this.getView().byId("idCoTable").getBinding("items").filter(oFilter,true);


	},


	onStartDateChange:function(oEvent){
	//		var currentUser = this.getModel("local").getProperty("/CurrentUser");
		debugger;
		var role=this.getModel("local").getProperty("/Role");
		var oVal=this.getView().byId("idUser").getValue();
	//	var oVal=this.getView().byId("idUser").getSelectedKey();
//	var dDateStart = oEvent.getSource().getProperty('dateValue');
		var startDate = oEvent.getSource().getStartDate();
	var dDateStart = DateFormatter.getFirstDateOfMonth(startDate);
	var dMonthEnd = DateFormatter.getLastDateOfMonth(startDate);
	var dMonthDays = DateFormatter.getNumberOfDaysInMonth(startDate);
//  var isValidDate = oEvent.getParameter("valid");
	var oFilter = [];
	var oFilter1 = null;
	var oFilter2 = null;

	// if( isValidDate ) {
		dDateStart.setMilliseconds(0);
		dDateStart.setSeconds(0);
		dDateStart.setMinutes(0);
		dDateStart.setHours(0);

		dMonthEnd.setMilliseconds(0);
		dMonthEnd.setSeconds(59);
		dMonthEnd.setMinutes(59);
		dMonthEnd.setHours(23);

		// aFilters.push(new Filter({
		//    path: "CrDate",
		//    operator: FilterOperator.BT,
		//    value1: dDateStart,
		//    value2: dDateEnd

if(role=='Admin'){

		oFilter1 = new Filter([
				 new sap.ui.model.Filter("CrDate", sap.ui.model.FilterOperator.BT, dDateStart, dMonthEnd)
		], true);

		//var myData = oEvent.getSource().getModel().getProperty("/tasks");

	//	oEvent.getSource().getModel().oData["tasks('5dbbd119a74bc333846f6853')"].CreatedBy;
	//	oEvent.getSource().getModel().oData["tasks('5dbbd119a74bc333846f6853')"].CrDate;
	//	oEvent.getSource().getModel().oData["tasks('5dbbd119a74bc333846f6853')"].noOfHours;
	//	oEvent.getSource().getDependents().length;
	//	oEvent.getSource().getDependents("/tasks");

			 for (var i = 0; i < dMonthDays; i++) {
						// if (oEvent.getSource().getModel().oData[oEvent.getSource().getModel().aBindings[i].getContext().sPath].noOfHours;)
												//oEvent.getSource().getDependents()[1].oBindingContexts.undefined.sPath;
			var oContext = oEvent.getSource().getDependents()[i].oBindingContexts.undefined.sPath.split("/")[1];
			var nHours = oEvent.getSource().getModel().oData[oContext].noOfHours;
			var CrDate = oEvent.getSource().getModel().oData[oContext].CrDate;
			 //	if (oEvent.getSource().getDependents()[i].mProperties.text >= 8) {
			 	if(nHours == 8){
						oEvent.getSource()._oSelectedMonth._oItemNavigation.aItemDomRefs[i].style.backgroundColor="#9acd32";
			 	}else {
					debugger;
								oEvent.getSource()._oSelectedMonth._oItemNavigation.aItemDomRefs[i].style.backgroundColor="#ff4d4d";
}
				 }


		//	oEvent.getSource()._getVisibleDays()[2].getDate()
				if(!oVal == "" ){
							 			oFilter2 = new Filter([
									 	new sap.ui.model.Filter("CreatedBy",
										sap.ui.model.FilterOperator.EQ, "'" + this.currentUser + "'")
										]);
										 oFilter = new sap.ui.model.Filter({
											filters: [oFilter1, oFilter2],
											and: true
										});
												this.getView().byId("idCalendar").getBinding("dependents").filter(oFilter,true);
								}
					else {
										 oFilter = new sap.ui.model.Filter({
											filters: [oFilter1]

										});
										this.getView().byId("idCalendar").getBinding("dependents").filter(oFilter,true);
								}
		}

else{

 oFilter1 = new Filter([
		 new sap.ui.model.Filter("CrDate", sap.ui.model.FilterOperator.BT, dDateStart, dMonthEnd)
], true);

 oFilter2 = new Filter([
		 new sap.ui.model.Filter("CreatedBy", sap.ui.model.FilterOperator.EQ, "'" + this.currentUser + "'")
]);

 oFilter = new sap.ui.model.Filter({
	filters: [oFilter1, oFilter2],
	and: true
});
this.getView().byId("idCalendar").getBinding("dependents").filter(oFilter,true);
}

}

});

});
