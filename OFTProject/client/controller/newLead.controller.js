sap.ui.define([
	"oft/fiori/controller/BaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"oft/fiori/models/formatter",
	"sap/ui/model/Filter"
], function(Controller, MessageBox, MessageToast, Formatter, Filter) {
	"use strict";

	return Controller.extend("oft.fiori.controller.newLead", {
		formatter: Formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf oft.fiori.view.View2
		 */
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.clearForm();
			Controller.prototype.onInit.apply(this);
			this.oRouter.attachRoutePatternMatched(this.herculis, this);
			var currentUser = this.getModel("local").getProperty("/CurrentUser");
			if (currentUser) {
				var loginUser = this.getModel("local").oData.AppUsers[currentUser].UserName;
				this.getView().byId("idUser").setText(loginUser);
			}
		},
		clearForm: function(){

		},
		onClearForm: function() {
			this.getView().getModel("local").setProperty("/newLead",{
				"EmailId": "",
				"CourseName": " ",
				"Category":" ",
				"Date": new Date(),
				"FatherName": "",
				"MotherName": "",
				"City": "Gurgaon",
				"Phone": "",
				"EmailId2": "",
				"Remarks": "",
				"currency":"INR",
				"Address":"",
				"organization":"",
				"custType":"",
				"CreatedOn":"",
				"CreatedBy":"",
				"ChangedBy":"",
				"ChangedOn":"",
				"courseSet":"",
				"HearAbout":"JustDial",
				"EmergencyContactName":"",
				"EmergencyContactNo":"",
				"WardDetails": []
			});
			this.flag = null;
		},
		passwords: "",
		onEmail: function() {
			var that = this;
			var items = that.getView().byId('idRecent').getSelectedContexts();

			for (var i = 0; i < items["length"]; i++) {
				var loginPayload = items[i].getModel().getProperty(items[i].getPath());
				if (this.passwords === "") {
					this.passwords = prompt("Please enter your password", "");
					if (this.passwords === "") {
						sap.m.MessageBox.error("Blank Password not allowed");
						return;
					}
				}
				loginPayload.password = this.passwords;
				loginPayload.DollerQuote = this.getView().byId("doller").getSelected();
				loginPayload.courseId =  this.getView().byId("idCourse1").getSelectedKey();
				$.post('/sendInquiryEmail', loginPayload)
					.done(function(data, status) {
						sap.m.MessageToast.show("Email sent successfully");
					})
					.fail(function(xhr, status, error) {
						that.passwords = "";
						sap.m.MessageBox.error(xhr.responseText);
					});
			}
		},
		onDataExport: function(oEvent) {
			$.ajax({
				type: 'GET', // added,
				url: 'InquiryDownload',
				success: function(data) {
					sap.m.MessageToast.show("File Downloaded succesfully");
				},
				error: function(xhr, status, error) {
					sap.m.MessageToast.show("error in downloading the excel file");
				}
			});

		},
		onDelete: function(oEvent) {
			var that = this;
			MessageBox.confirm("Do you want to delete the selected records?", function(conf) {
				if (conf == 'OK') {
					var items = that.getView().byId('idRecent').getSelectedContexts();
					for (var i = 0; i < items["length"]; i++) {
						that.ODataHelper.callOData(that.getOwnerComponent().getModel(), items[i].sPath,
								"DELETE", {}, {}, that)
							.then(function(oData) {
								sap.m.MessageToast.show("Deleted succesfully");
							}).catch(function(oError) {
								that.getView().setBusy(false);
								that.oPopover = that.getErrorMessage(oError);
								that.getView().setBusy(false);
							});

					}
				}
			}, "Confirmation");


		},
		onBack: function() {
			sap.ui.getCore().byId("idApp").to("idView1");
		},
		onItemSelect: function(oEvent) {
			var sPath = oEvent.getParameter("listItem").getBindingContextPath();
			var indexSupp = sPath.split("/")[sPath.split("/").length - 1];
			this.oRouter.navTo("detail2", {
				suppId: indexSupp
			});
		},
		onPress: function() {
			sap.m.MessageBox.alert("Button was clicked");
		},
		onHover: function() {
			sap.m.MessageBox.alert("Button was Hovered");
		},
		onCourseSelect: function(oEvent){
			var country = this.getView().byId("country").getSelectedKey();
			var courseName = this.getView().byId("course").getSelectedKey();
			var allCourses = this.getView().getModel("local").getProperty("/courses");
			if(country === "IN"){
				for (var i = 0; i < allCourses.length; i++) {
					if (allCourses[i].courseName === courseName) {
						this.getView().getModel("local").setProperty("/newLead/fees",allCourses[i].fee);
						this.getView().getModel("local").setProperty("/newLead/currency", "INR");
						break;
					}
				}

			}else{
				for (var i = 0; i < allCourses.length; i++) {
					if (allCourses[i].courseName === courseName) {
						this.getView().getModel("local").setProperty("/newLead/fees",allCourses[i].usdFee);
						this.getView().getModel("local").setProperty("/newLead/currency", "USD");
						break;
					}
				}
			}
		},
		popupSave: function() {
			var that = this;
			debugger;
			var payload3 = {
				"EmailId2": this.getView().getDependents()[0].getContent()[0].getContent()[1].getValue(),
				"Remarks": this.getView().getDependents()[0].getContent()[0].getContent()[3].getValue()
			};
			that.ODataHelper.callOData(that.getOwnerComponent().getModel(), this.sPath, "PUT", {}, payload3, that)
				.then(function(oData) {
					sap.m.MessageToast.show("The Data has been updated successfully");
					that.inqChangeDialog.close();
				}).catch(function(oError) {
					that.getView().setBusy(false);
					var oPopover = that.getErrorMessage(oError);

				});

		},
		inqChangeDialog : null,
		onInqSelect: function(oEvent){
			var that = this;
			this.sPath = oEvent.getParameter("listItem").getBindingContextPath();
			var modelData = oEvent.getSource().getModel().getProperty(this.sPath);
			var oPopupModel = new sap.ui.model.json.JSONModel();
			oPopupModel.setData({
				"EmailId2": modelData.EmailId2,
				"Remarks": modelData.Remarks
			});
			if(!this.inqChangeDialog){
				this.inqChangeDialog = new sap.m.Dialog({
					title: "Update Data"
					// contentWidth: auto,
					// contentHeight: auto
				});

				this.inqChangeDialog.addButton(new sap.m.Button({
					text: "Save",
					press: [that.popupSave, that]
				}));
				this.inqChangeDialog.addButton(new sap.m.Button({
					text: "Cancel",
					press: function() {
						that.inqChangeDialog.close();
					}
				}));
				this.getView().addDependent(this.inqChangeDialog);
				var oCarousel = new sap.ui.layout.form.SimpleForm({
					content: [new sap.m.Label({text: "Email"}),
										new sap.m.Input({value:"{/EmailId2}"}),
										new sap.m.Label({text: "Remarks"}),
										new sap.m.Input({value:"{/Remarks}"})
									]
				});
				this.inqChangeDialog.addContent(oCarousel);
				this.inqChangeDialog.setModel(oPopupModel);
			}else{
				this.inqChangeDialog.setModel(oPopupModel);
			}
			this.inqChangeDialog.open();

		},
		reloadRefresh: function(){
			var oList = this.getView().byId("idRecent");
			oList.getBinding("items").refresh();
		},
		herculis: function(oEvent) {
			if(oEvent.getParameter("name") !== "newlead"){
				return;
			}
			//Restore the state of UI by fruitId
			this.getView().getModel("local").setProperty("/newLead/Date", new Date());//this.formatter.getFormattedDate(0)
			this.getView().getModel("local").setProperty("/newLead/country", "IN");
			var newDate = new Date();
			newDate.setHours(0, 0, 0, 0);
			var oSorter = new sap.ui.model.Sorter("CreatedOn", true);
			var oList = this.getView().byId("idRecent");
			oList.bindAggregation("items", {
				path: '/Inquries',
				template: new sap.m.DisplayListItem({
					type: "Navigation",
					label: "{EmailId} - {CourseName} - {EmailId2}",
					value: "{fees} / {CreatedOn} - {CreatedBy}"
				}),
				filters: [new Filter("CreatedOn", "GE", newDate)],
				sorter: oSorter
			});
			oList.attachUpdateFinished(this.counter);

		},
		counter: function(oEvent) {
			var oList = oEvent.getSource();
			var counts = oList.getItems().length;
			oList.getHeaderToolbar().getContent()[0].setText("Today : " + counts);
			var items = oList.mAggregations.items;
			var value2;
			var value1;
			var id;
			for (var i = 0; i < items.length; i++) {
				value1 = items[i].mProperties.value.split("-")[0];
				id = items[i].mProperties.value.split("-")[1];
				if (this.getModel("local").getProperty("/AppUsers")[id]) {
					value2 = this.getModel("local").getProperty("/AppUsers")[id].UserName;
					oList.getItems()[i].setValue(value1 + " - " + value2);
				}
			}
		},
		onFullScreen: function(oEvent) {
			var oSource = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent();
			var oMode = oSource.getMode();
			if (oMode === "ShowHideMode") {
				oSource.setMode("HideMode");
				oEvent.getSource().setIcon("sap-icon://exit-full-screen");
				oEvent.getSource().setText("Exit Fullscreen");
			} else {
				oSource.setMode("ShowHideMode");
				oEvent.getSource().setIcon("sap-icon://full-screen");
				oEvent.getSource().setText("Show Fullscreen");
			}
		},
		onParentMode: function(oEvent){
			// debugger;
			if(oEvent.getParameter('state')){
				this.getView().byId("inqDate").setVisible(false);
				this.getView().byId("quotedFee").setVisible(false);
			}else {
				this.getView().byId("inqDate").setVisible(true);
				this.getView().byId("quotedFee").setVisible(true);
			}
		},
		onPressAddWard: function(){
			var wardDetails = this.getView().getModel("local").getProperty("/newLead/WardDetails");
			wardDetails.push({
				RollNo:null,
				Name: null,
				Gender: "F",
				DOB: new Date(),
				Standard: null,
				SchoolName: null,
				Weakness: null,
				MobileNo: null,
				CourseName: [],
				Address: null,
				BloodGroup: null
			});
			this.getView().getModel("local").setProperty("/newLead/WardDetails", wardDetails);
		},
		onPressDeleteRow: function(oEvent){
			var	selected = oEvent.getSource().getParent().getParent().getSelectedContextPaths();
			var selectedIndex = [];
			selected.forEach(item=>{
				selectedIndex.push(parseInt(item.split('/')[3]));
			});
			selectedIndex.sort((a, b) => b - a);
			var courses = this.getView().getModel("local").getProperty("/newLead/WardDetails");
			selectedIndex.forEach(item=>{
				courses.splice(item,1);
			});
			this.getView().getModel("local").setProperty("/newLead/WardDetails", courses);
			oEvent.getSource().getParent().getParent().removeSelections();
		},
		onSelectInq: function (oEvent) {
			this.getCustomerPopup();
			this.flag = "inquiry";
			// var title = this.getView().getModel("i18n").getProperty("Trainer");
			// this.searchPopup.setTitle(title);
			this.searchPopup.bindAggregation("items", {
				path: "/Inquries",
				template: new sap.m.DisplayListItem({
					label: "{FatherName}",
					value: "{Phone}"
				})
			});

		},
		onConfirm: function (oEvent) {
			var data = this.getSelectedKey(oEvent),
			that = this;
			// debugger;
			if (this.flag === "inquiry") {
				var oTrainer = "Inquries(\'" + data[2] + "\')";
				var oData = this.getView().getModel().oData[oTrainer];
				var oGuid = data[2];
				// debugger;
				this.getView().getModel("local").setProperty("/newLead", oData);
				that.ODataHelper.callOData(that.getOwnerComponent().getModel(), `/${oTrainer}/ToWard`, "GET", {},
						{}, that)
					.then(function(oData) {
						that.getView().getModel("local").setProperty("/newLead/WardDetails", oData.results);
						that.getView().setBusy(false);
					}).catch(function(oError) {
						that.getView().setBusy(false);
					});
			}
		},
		onCancel: function(){
			this.flag = null;
		},
		supplierPopup: null,
		oInp: null,
		onPopupConfirm: function(oEvent) {
			var selectedItem = oEvent.getParameter("selectedItem");
			this.oInp.setValue(selectedItem.getLabel());
		},

		oSuppPopup: null,
		onFilter: function() {

			if (!this.oSuppPopup) {
				this.oSuppPopup = new sap.ui.xmlfragment("oft.fiori.fragments.popup", this);

				this.getView().addDependent(this.oSuppPopup);

				this.oSuppPopup.setTitle("Suppliers");

				this.oSuppPopup.bindAggregation("items", {
					path: "/suppliers",
					template: new sap.m.DisplayListItem({
						label: "{name}",
						value: "{city}"
					})
				});
			}

			this.oSuppPopup.open();
		},

		onRequest: function(oEvent) {

			//Store the object of the input field on which F4 was press
			this.oInp = oEvent.getSource();

			//Step 1: Display a popup cl_gui_alv_grid, set_table_for_first_table
			if (!this.supplierPopup) {
				// this.supplierPopup = new sap.m.SelectDialog({
				// 	title: "Supplier Popup",
				// 	confirm: this.onPopupConfirm.bind(this)
				// });
				this.supplierPopup = new sap.ui.xmlfragment("oft.fiori.fragments.popup", this);

				this.supplierPopup.setTitle("Cities");
				//Will now supply the model set at the view level to its children
				this.getView().addDependent(this.supplierPopup);

				//this.supplierPopup.setTitle("")
				//Step 2: Values to be populated with aggregation binding
				this.supplierPopup.bindAggregation("items", {
					path: "/cities",
					template: new sap.m.DisplayListItem({
						label: "{cityName}",
						value: "{famousFor}"
					})
				});

			}
			//Step 3: Just open same popup once create
			this.supplierPopup.open();

		},
		onSave: function(oEvent) {
			var oLocal = oEvent;
			console.log(this.getView().getModel("local").getProperty("/newLead"));
			var that = this;
			// that.getView().setBusy(true);
			var leadData = this.getView().getModel("local").getProperty("/newLead");
			if (!this.getView().byId("inqDate").getDateValue()) {
				sap.m.MessageToast.show("Enter a valid Date");
				return "";
			}
			//get the Course set here and save the records
			var payload = {
				"EmailId": leadData.EmailId.toLowerCase(),
				// "CourseName": leadData.CourseName,
				// "Category": leadData.Category,
				"RollNo": leadData.RollNo,
				"FatherName": leadData.FatherName,
				"MotherName": leadData.MotherName,
				"EmailId2": leadData.EmailId2 ,
				"Date": this.getView().byId("inqDate").getDateValue(),
				"City": leadData.City,
				"Address": leadData.Address,
				"EmergencyContactName": leadData.EmergencyContactName,
				"EmergencyContactNo": leadData.EmergencyContactNo,
				"Phone": leadData.Phone,
				"Remarks": leadData.Remarks,
				"HearAbout": leadData.HearAbout,
				"SoftDelete": false,
				"CreatedOn": new Date(),
		    "CreatedBy": "",
		    "ChangedOn": new Date(),
		    "ChangedBy": "",
				// "fees": leadData.Fees,
				// "currency": "INR",
				// "CustType": leadData.custType,
				// "Organization": leadData.organization
				// "WardDetails": leadData.WardDetails
			};
			var wardDetails = leadData.WardDetails;
			if(this.flag==='inquiry'){
				this.ODataHelper.callOData(this.getOwnerComponent().getModel(), `/Inquries('${leadData.id}')`, "PUT", {},
						payload, this)
					.then(function(oData) {
						const inquiryId = leadData.id;
						for(var ward of wardDetails){
							if(ward.id){
								that.ODataHelper.callOData(that.getOwnerComponent().getModel(), `/Wards('${ward.id}')`, "PUT", {},
										ward, that)
									.then(function(oData) {
										that.getView().setBusy(false);
										sap.m.MessageToast.show("Ward Saved successfully");
									}).catch(function(oError) {
										that.getView().setBusy(false);
									});
							}else{
								ward.InquiryId = inquiryId;
								that.ODataHelper.callOData(that.getOwnerComponent().getModel(), "/Wards", "POST", {},
										ward, that)
									.then(function(oData) {
										that.getView().setBusy(false);
										sap.m.MessageToast.show("Ward Saved successfully");
									}).catch(function(oError) {
										that.getView().setBusy(false);
									});
							}

						}
						that.getView().setBusy(false);
						sap.m.MessageToast.show("Inquiry Saved successfully");
					}).catch(function(oError) {
						that.getView().setBusy(false);
					});
			}else{
				this.ODataHelper.callOData(this.getOwnerComponent().getModel(), "/Inquries", "POST", {},
						payload, this)
					.then(function(oData) {
						const inquiryId = oData.id;
						for(var ward of wardDetails){
							ward.InquiryId = inquiryId;
							that.ODataHelper.callOData(that.getOwnerComponent().getModel(), "/Wards", "POST", {},
									ward, that)
								.then(function(oData) {
									that.getView().setBusy(false);
									sap.m.MessageToast.show("Ward Saved successfully");
								}).catch(function(oError) {
									that.getView().setBusy(false);
								});
						}
						that.getView().setBusy(false);
						sap.m.MessageToast.show("Inquiry Saved successfully");
					}).catch(function(oError) {
						that.getView().setBusy(false);
					});
			}

		},
		onApprove: function() {

			MessageBox.confirm("Do you want to approve this fruit", {
				title: "confirmation",
				//[this.functionName, this], as a substitute we use .bind(this) method
				onClose: this.onConfirm.bind(this)
			});

		},
		onGetNext: function(){
			$.post('/MoveNextAc', {})
				.done(function(data, status) {
					sap.m.MessageBox.confirm(
						"Bank Name    : " + data.BankName + "\n" +
						"Account Name : " + data.accountName + "\n" +
						"Account No   : " + data.accountNo + "\n" +
						"IFSC Code    : " + data.ifsc + "\n" + "\n" +
						"Note: Please send the screenshot of payment once done."
					);
				})
				.fail(function(xhr, status, error) {
					sap.m.MessageBox.error(xhr.responseText);
				});
		},
		// handleFinish: function(oEvent) {
		// 	var selectedItems = oEvent.getParameter("selectedItem");
		// 	// var courses = ' ';
		// 	// for (var i = 0; i < selectedItems.length; i++) {
		// 	// 	courses += selectedItems[i].getKey();
		// 	// 	if (i != selectedItems.length - 1) {
		// 	// 		courses += ",";
		// 	// 	}
		// 	// }
		// 	this.getView().getModel("local").setProperty("/newLead/courseSet", selectedItems.getKey());
		// },
		onUpdateFinished:function(oEvent){
			// debugger;
			var olist = oEvent.getSource();
			var oItemList = olist.getItems();
			var noOfItems = oItemList.length;
			for(var i = 0; i < noOfItems; i++){
			var course = olist.getItems()[i].mBindingInfos.label.binding.aValues[1];
			var oLbl = oItemList[i].mProperties.label;
			var oValue = oItemList[i].mProperties.value.split("/");
			var courseId = 'CoursesMst(\'' + course.trim() + '\')';
			var courseDtl = this.getView().getModel().oData[courseId];
			var inqBy = oItemList[i].mProperties.value.split("-")[1].trim();
			debugger;
			if (courseDtl) {
			  var oLblName = oItemList[i].mProperties.label.replace(course.trim(), courseDtl.CourseName);
				if(this.getView().getModel("local").getProperty("/AppUsers")[inqBy]){
					var listValue = oItemList[i].mProperties.value.replace(inqBy,
																							this.getView().getModel("local").getProperty("/AppUsers")[inqBy].UserName);
				  olist.getItems()[i].setValue(listValue);
				}

				// var olblArray =  oLbl.split("-");
				// var oLblName = olblArray[0] + '-' + courseDtl.CourseName;
				// var listValue = courseDtl.CourseFee + oValue[1];
				olist.getItems()[i].setLabel(oLblName);

				// oItemList[i].mProperties.label = oLblName;
				// oItemList[i].mProperties.value = listValue;
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
