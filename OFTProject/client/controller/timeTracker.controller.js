sap.ui.define([
	"oft/fiori/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/routing/RouteMatchedHandler",
	"sap/ui/table/Table",
	"oft/fiori/models/formatter",
	"oft/fiori/utils/dateFormatter",
	"sap/m/MessageToast"

], function(Controller, Filter, FilterOperator, Route,Table, Formatter,FilterType,DateFormatter,MessageToast) {
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

		if(oEvent.getParameter("name") !== "timeTracker"){
			return;
		}

		this.currentUser = this.getModel("local").getProperty("/CurrentUser");
		var today = new Date();

		this.reloadTasks();

	},
	reloadTasks: function(){
	debugger;
	//var nInteractiveDates = this.getView().byId("idCalendar")._$interactiveDates.length;
	var role=this.getModel("local").getProperty("/Role");
	var userId = this.getModel("local").getProperty("/CurrentUser");
	var currentMonth = new Date();
	this.getView().byId("idCalendar").setCurrentDate(currentMonth);

	var payload = {
		"Month":currentMonth,
		"EmpId":this.currentUser
	};


		if(role=='Admin'){

			$.post('/getTimeTracker',payload).done(function(data,status){

					if (data.length) {
						var calDateLength = document.getElementsByClassName("sapMeCalendarMonthDay").length;
								for (var i = 7; i <= calDateLength; i++) {

										var calDate = parseInt(document.getElementsByClassName("sapMeCalendarMonthDay")[i].id.split("--")[2].split("idCalendar-")[1].split("-")[2]);
										var empDate = parseInt(data[1].date.split("-")[2].split("T")[0]);


											if(empDate === calDate){

												for (var j = 1; j < data.length; j++) {

												if (data[j].hours === 8) {
													//	console.log("Green--" + data[j].hours);Green
														document.getElementsByClassName("sapMeCalendarMonthDay")[i].style.backgroundColor="#99e699";
														i++;
												}
												else if (data[j].hours === "Holiday") {
													//console.log("Yellow--" + data[j].hours );gray
													document.getElementsByClassName("sapMeCalendarMonthDay")[i].style.backgroundColor="#666699";
													i++;
												}else if (data[j].hours < 8 ) {
													//console.log("Red--"+ data[j].hours);red
													document.getElementsByClassName("sapMeCalendarMonthDay")[i].style.backgroundColor="#ff3333";
													i++;
												}else if (data[j].hours === 'LEAVE') {
													//console.log("Blue--" + data[j].hours);blue
													document.getElementsByClassName("sapMeCalendarMonthDay")[i].style.backgroundColor="#4d79ff";
													i++;
												}else if (data[j].hours >8) {
													//console.log("Pink--" + data[j].hours);
													document.getElementsByClassName("sapMeCalendarMonthDay")[i].style.backgroundColor="#99e699";
													i++;
												}

												}
												break;
											}

												}

					}else {
						sap.m.MessageToast.show("You Don't hava Data recorded for this Month");
					}
				debugger;
				//document.getElementsByClassName("sapMeCalendarMonthDay")[7].id.split("--")[2].split("idCalendar-")[1];

			}).fail(function(xhr,status,error){
				
				sap.m.MessageBox.console.error("Something is wrong in your Code");

			});


		}
		else {
			$.post('/getTimeTracker',payload).done(function(data,status){

					if (data.length) {
						var calDateLength = document.getElementsByClassName("sapMeCalendarMonthDay").length;
								for (var i = 7; i <= calDateLength; i++) {

										var calDate = parseInt(document.getElementsByClassName("sapMeCalendarMonthDay")[i].id.split("--")[2].split("idCalendar-")[1].split("-")[2]);
										var empDate = parseInt(data[1].date.split("-")[2].split("T")[0]);


											if(empDate === calDate){

												for (var j = 1; j < data.length; j++) {

												if (data[j].hours === 8) {
													//	console.log("Green--" + data[j].hours);Green
														document.getElementsByClassName("sapMeCalendarMonthDay")[i].style.backgroundColor="#99e699";
														i++;
												}
												else if (data[j].hours === "Holiday") {
													//console.log("Yellow--" + data[j].hours );gray
													document.getElementsByClassName("sapMeCalendarMonthDay")[i].style.backgroundColor="#666699";
													i++;
												}else if (data[j].hours < 8 ) {
													//console.log("Red--"+ data[j].hours);red
													document.getElementsByClassName("sapMeCalendarMonthDay")[i].style.backgroundColor="#ff3333";
													i++;
												}else if (data[j].hours === 'LEAVE') {
													//console.log("Blue--" + data[j].hours);blue
													document.getElementsByClassName("sapMeCalendarMonthDay")[i].style.backgroundColor="#4d79ff";
													i++;
												}else if (data[j].hours >8) {
													//console.log("Pink--" + data[j].hours);
													document.getElementsByClassName("sapMeCalendarMonthDay")[i].style.backgroundColor="#99e699";
													i++;
												}

												}
												break;
											}

												}

					}else {
						sap.m.MessageToast.show("You Don't hava Data recorded for this Month");
					}
				debugger;
				//document.getElementsByClassName("sapMeCalendarMonthDay")[7].id.split("--")[2].split("idCalendar-")[1];

			}).fail(function(xhr,status,error){
				sap.m.MessageBox.console.error("Something is wrong in your Code");

			});
		}
	},
	onSelect:function(oEvent){
		debugger;
		var techId=oEvent.getSource().getSelectedKey();
		this.currentUser = techId;


		this.reloadTasks();
	},

	onChangeCurrentDate:function(oEvent){
		debugger;
		var role=this.getModel("local").getProperty("/Role");
		var oVal=this.getView().byId("idUser").getValue();

if(role=='Admin'){
	setTimeout(this.afterCalChange.bind(this), 1000);

	}
else{
	setTimeout(this.afterCalChange.bind(this), 1000);

}
},
afterCalChange: function() {
		debugger;

		var userId = this.getModel("local").getProperty("/CurrentUser");
		var currentMonth = new Date(this.getView().byId("idCalendar").getCurrentDate());
		var payload = {
			"Month":currentMonth,
			"EmpId":this.currentUser
		};

		$.post('/getTimeTracker',payload).done(function(data,status){

			//document.getElementsByClassName("sapMeCalendarMonthDay")[7].id.split("--")[2].split("idCalendar-")[1];
			if (data.length) {
				var calDateLength = document.getElementsByClassName("sapMeCalendarMonthDay").length;
						for (var i = 7; i <= calDateLength; i++) {

								var calDate = parseInt(document.getElementsByClassName("sapMeCalendarMonthDay")[i].id.split("--")[2].split("idCalendar-")[1].split("-")[2]);
								var empDate = parseInt(data[1].date.split("-")[2].split("T")[0]);

									if(empDate === calDate){

										for ( var j = 1; j < data.length; j++) {

											if (data[j].hours === 8 ) {
											//	console.log("Green--" + data[i].hours);Green
												document.getElementsByClassName("sapMeCalendarMonthDay")[i].style.backgroundColor="#99e699";
												i++;
										}
										else if (data[j].hours === "Holiday") {
											//console.log("Yellow--" + data[j].hours );DimGray
											document.getElementsByClassName("sapMeCalendarMonthDay")[i].style.backgroundColor="#666699";
											i++;
										}else if (data[j].hours < 8 ) {
											//console.log("Red--"+ data[j].hours);Red
											document.getElementsByClassName("sapMeCalendarMonthDay")[i].style.backgroundColor="#ff3333";
											i++;
										}else if (data[j].hours === 'LEAVE') {
											//console.log("Blue--" + data[j].hours);SlateBlue
											document.getElementsByClassName("sapMeCalendarMonthDay")[i].style.backgroundColor="#4d79ff";
											i++;
										}else if (data[j].hours > 8) {
											//console.log("Pink--" + data[j].hours);
											document.getElementsByClassName("sapMeCalendarMonthDay")[i].style.backgroundColor="#99e699";
											i++;
										}

										}
										break;
									}

								}

			}else {
				sap.m.MessageToast.show("You Don't have Data recorded for this month");
			}


		}).fail(function(xhr,status,error){
			sap.m.MessageBox.console.error("Something is wrong in your Code");

		});

	console.log(document.getElementsByClassName("sapMeCalendarMonthDay"));
}

});

});
