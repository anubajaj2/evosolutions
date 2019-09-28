sap.ui.define(["oft/fiori/controller/BaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"oft/fiori/models/formatter",
	"sap/ui/model/Filter"
], function (Controller, MessageBox, MessageToast, Formatter, Filter) {
	"use strict";

	return Controller.extend("oft.fiori.controller.newTrainer", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf oft.fiori.view.View2
		 */
		oSorter: null,
		formatter: Formatter,
		simpleForm: null,
		endDate: null,
		onInit: function () {
			debugger;
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.herculis, this);
			var that = this;

		},
		onBack: function () {
			sap.ui.getCore().byId("idApp").to("idView1");
		},

		onUpdateFinished: function (oEvent) {
			var itemList = this.getView().byId("serverTable").getItems();
			if (itemList[this.selIndex - 1]) {
				var vStudent = itemList[this.selIndex - 1].getCells()[2].getText();
				var oStudentId = 'Students(\'' + vStudent + '\')';
				var vModel = this.getView().getModel().oData[oStudentId];
				itemList[this.selIndex - 1].getCells()[2].setText(vModel.GmailId);
			}
		},

		onSave: function () {
			//TODO: Save to Coustomer Reg. table
			if (this.getView().byId("idFirstName").getValue() === "") {
				sap.m.MessageBox.error("FirstName is mandatory");
				return;
			}
			var serverData = this.getView().getModel("local").getProperty("/newTrainer");
			var today = new Date();
			// var payDate = this.getView().byId("payDate").getDateValue();
			debugger;
			var that = this;

			this.getView().setBusy(true);
			var payload = {
				"FirstName": this.getView().byId("idFirstName").getValue().toLocaleUpperCase().toLocaleUpperCase(),
				"LastName": this.getView().byId("idLastName").getValue(),
				"JoiningDate": this.getView().byId("idJoiningDate").getDateValue(),
				"Address": this.getView().byId("idAddress").getValue(),
				"City": this.getView().byId("idCity").getValue(),
				"Remarks": this.getView().byId("idRemarks").getValue(),
				"ContactNo": this.getView().byId("idContactNo").getValue(),
				"ContactNo1": this.getView().byId("idContactNo1").getValue(),
				"AccountNo": this.getView().byId("idAccountNo").getValue(),
				"AccountName": this.getView().byId("idAccountName").getValue(),
				"IFSCCode": this.getView().byId("idIFSCCode").getValue(),
				// "CreatedOn": new Date(),
				// "CreatedBy": 'Menakshi',SoftDelete
				"AccountType": this.getView().byId("idAccountType").getValue(),
				"PANNo": this.getView().byId("idPANNo").getValue(),

				"SoftDelete": this.getView().byId("idSoftDelete").getValue(),
				"CreatedOn": this.getView().byId("idCreatedOn").getDateValue(),
				"CreatedBy": this.getView().byId("idCreatedBy").getValue(),
				"ChangedOn": this.getView().byId("idChangedOn").getDateValue(),
				"ChangedBy": this.getView().byId("idChangedBy").getValue(),
				"Update": 'C'
			};

			// this.getOwnerComponent().getModel().setUseBatch(false);
			this.ODataHelper.callOData(this.getOwnerComponent().getModel(), "/Trainers", "POST", {},
					payload, this)
				.then(function (oData) {
					sap.m.MessageToast.show("Trainer Saved successfully");
					that.destroyMessagePopover();
					// that.getView().byId("traierTable").getBinding("items").refresh(true);

					that.getView().setBusy(false);

				}).catch(function (oError) {
					that.getView().setBusy(false);
					that.oPopover = that.getErrorMessage(oError);
					that.getView().setBusy(false);
				});


		},
		getAdd8Mon: function (dd) {
			var d = new Date(dd.getValue().substr(6, 4), dd.getValue().substr(3, 2), dd.getValue().substr(0, 2));
			d.setMonth(d.getMonth() + 1);
			var mm = d.getMonth() + 1; //January is 0!
			var yyyy = d.getFullYear();
			if (dd < 10) {
				dd = '0' + dd;
			}
			if (mm < 10) {
				mm = '0' + mm;
			}
			var endDate = dd + '.' + mm + '.' + yyyy;
			return endDate;
		},
		onStartChange: function (oEvent) {

			var dateString = oEvent.getSource().getValue();
			var from = dateString.split(".");
			var dateObject = new Date(from[2], from[1] - 1, from[0]);
			var endDate = this.formatter.getIncrementDate(dateObject, 1);

			if (oEvent.getSource().sId == "idSimpleForm--startDate") {
				sap.ui.getCore().byId("idSimpleForm--endDate").setValue(endDate);
				sap.ui.getCore().byId("idSimpleForm--userEndDate").setValue(endDate);
			} else if (oEvent.getSource().sId == "idSimpleFormRe--startDate") {
				sap.ui.getCore().byId("idSimpleFormRe--endDate").setValue(endDate);
				sap.ui.getCore().byId("idSimpleFormRe--userEndDate").setValue(endDate);
			} else {
				this.getView().byId("endDate").setValue(endDate);
				this.getView().byId("userEndDate").setValue(endDate);
			}

		},
		herculis: function (oEvent) {
			debugger;
			if(oEvent.getParameter("name") !== "newTrainer"){
			return;
			}
			var that = this;

			this.getView().getModel("/Trainers").setProperty("JoiningDate", this.formatter.getFormattedDate(0));
			//this.getView().getModel("local").setProperty("/newTrainer/JoiningDate", this.formatter.getFormattedDate(0));
			//this.getView().getModel("local").setProperty("/newServer/EndDate", this.formatter.getFormattedDate(1));
			//this.getView().getModel("local").setProperty("/newServer/UserEndDate", this.formatter.getFormattedDate(1));

			// var date = new Date();
			// //this.getView().byId("serverTable").getBinding("items").refresh(true);
			// var vFilter1 = new sap.ui.model.Filter("EndDate", "GT", date);
			//
			// var vFilter = new sap.ui.model.Filter({
			// filters: [vFilter1]
			// });
			// var arFilter = [vFilter];
			// this.getView().byId("serverTable").getBinding("items").filter(arFilter);
			// this.getView().byId("accountNo").setSelectedKey("50180025252811");
		},
		searchPopup: null,
		sId: "",
		onSelect: function (oEvent) {
			this.getCustomerPopup();
			var title = this.getView().getModel("i18n").getProperty("Trainer");
			this.searchPopup.setTitle(title);
			this.searchPopup.bindAggregation("items", {
				path: "/Trainers",
				template: new sap.m.DisplayListItem({
					label: "{FirstName}",
					value: "{LastName}"
				})
			});

		},
		onStudenIdChange: function (oEvent) {
			var sPath = oEvent.getSource().oPropagatedProperties.oBindingContexts.undefined.sPath;
			sPath = sPath.split("/")[1];
			var oStudentId = this.getView().getModel().oData[sPath].StudentId;
			oStudentId = 'Students(\'' + oStudentId + '\')';
			var oModel = this.getView().getModel().oData[oStudentId];
			if (oModel) {
				var GmailId = oModel.GmailId;
				oEvent.getSource().setText(GmailId);
			}
		},

		onCustomerIdChange: function (oEvent) {
			var sPath = oEvent.getSource().oParent.oParent.oParent.oParent.mObjectBindingInfos.undefined.path;
			sPath = sPath.split("/")[1];
			var oStudentId = this.getView().getModel().oData[sPath].StudentId;
			oStudentId = 'Students(\'' + oStudentId + '\')';
			var oModel = this.getView().getModel().oData[oStudentId];
			if (oModel) {
				if (oEvent.getSource().sId == "idSimpleForm--customerId") {
					sap.ui.getCore().byId("idSimpleForm--customerId").setValue(oModel.GmailId);
					sap.ui.getCore().byId("idSimpleForm--name").setText(oModel.Name);
				} else {
					sap.ui.getCore().byId("idSimpleFormRe--customerId").setValue(oModel.GmailId);
					sap.ui.getCore().byId("idSimpleFormRe--name").setText(oModel.Name);
				}
			}
		},
		onReassign: function (oEvent) {
			this.oDialogPopup.close();
			this.getReasgnPopup();
			var title = this.getView().getModel("i18n").getProperty("serverUpdate");
			this.ReasgnPopup.setTitle(title);
			if (!this.oSimpleFormRe) {
				this.oSimpleFormRe = sap.ui.xmlfragment("idSimpleFormRe", "oft.fiori.fragments.ServerSimpleForm", this);
				// connect dialog to view (models, lifecycle)
				this.getView().addDependent(this.oSimpleFormRe);
				this.ReasgnPopup.addButton(new sap.m.Button({
					text: "Update",
					type: "Accept",
					press: [this.onReUpdate, this]
				}));
				this.ReasgnPopup.addButton(new sap.m.Button({
					text: "Close",
					type: "Reject",
					press: [this.onReClose, this]
				}));
			}

			var oView = this.getView();

			var sPath = oEvent.getSource().getParent().getContent()[0].getBindingContext().sPath;
			this.oSimpleFormRe.bindElement(sPath);
			sap.ui.getCore().byId("idSimpleFormRe--payDate").bindProperty("value", {
				path: 'PaymentDate',
				type: 'sap.ui.model.type.Date',
				formatOptions: {
					pattern: 'dd.MM.YYYY'
				}
			});
			sap.ui.getCore().byId("idSimpleFormRe--serverUId").bindProperty("value", "User");
			// sap.ui.getCore().byId("idSimpleForm--customerId").bindProperty("value","StudentId");
			sap.ui.getCore().byId("idSimpleFormRe--startDate").bindProperty("value", {
				path: 'StartDate',
				type: 'sap.ui.model.type.Date',
				formatOptions: {
					pattern: 'dd.MM.YYYY'
				}
			});
			sap.ui.getCore().byId("idSimpleFormRe--endDate").bindProperty("value", {
				path: 'EndDate',
				type: 'sap.ui.model.type.Date',
				formatOptions: {
					pattern: 'dd.MM.YYYY'
				}
			});
			sap.ui.getCore().byId("idSimpleFormRe--userEndDate").bindProperty("value", {
				path: 'UserEndDate',
				type: 'sap.ui.model.type.Date',
				formatOptions: {
					pattern: 'dd.MM.YYYY'
				}
			});
			sap.ui.getCore().byId("idSimpleFormRe--rdpPass").bindProperty("value", "PassRDP");
			sap.ui.getCore().byId("idSimpleFormRe--passGui").bindProperty("value", "PassSAP");
			sap.ui.getCore().byId("idSimpleFormRe--amount").bindProperty("value", "Amount");
			sap.ui.getCore().byId("idSimpleFormRe--usage").bindProperty("value", "Usage");
			sap.ui.getCore().byId("idSimpleFormRe--freeAccess").bindProperty("selected", "FreeAccess");
			sap.ui.getCore().byId("idSimpleFormRe--extended").bindProperty("selected", "Extended");
			sap.ui.getCore().byId("idSimpleFormRe--Remarks").bindProperty("value", "Remarks");
			sap.ui.getCore().byId("idSimpleFormRe--cid").bindProperty("value", "StudentId");

			sap.ui.getCore().byId("idSimpleFormRe--customerId").attachModelContextChange(this.onCustomerIdChange, this);
			this.ReasgnPopup.addContent(this.oSimpleFormRe);

		},

		onItemPress: function (oEvent) {

			// var sPath = oEvent.getSource().getBindingContextPath();
			// this.getRouter().navTo("serverDetails");
			this.getDialogPopup();
			var title = this.getView().getModel("i18n").getProperty("serverUpdate");
			this.oDialogPopup.setTitle(title);
			if (!this.oSimpleForm) {
				this.oSimpleForm = sap.ui.xmlfragment("idSimpleForm", "oft.fiori.fragments.ServerSimpleForm", this);
				// connect dialog to view (models, lifecycle)
				this.getView().addDependent(this.oSimpleForm);
				this.oDialogPopup.addButton(new sap.m.Button({
					text: "Re-Assign",
					type: "Accept",
					press: [this.onReassign, this]
				}));
				this.oDialogPopup.addButton(new sap.m.Button({
					text: "Update",
					type: "Accept",
					press: [this.onUpdate, this]
				}));
				this.oDialogPopup.addButton(new sap.m.Button({
					text: "Close",
					type: "Reject",
					press: [this.onClose, this]
				}));
			}

			var oView = this.getView();

			this.sPath = oEvent.getSource().getBindingContextPath();
			this.selIndex = oEvent.getSource().getParent().getItemNavigation().iFocusedIndex;
			this.oSimpleForm.bindElement(this.sPath);
			sap.ui.getCore().byId("idSimpleForm--payDate").bindProperty("value", {
				path: 'PaymentDate',
				type: 'sap.ui.model.type.Date',
				formatOptions: {
					pattern: 'dd.MM.YYYY'
				}
			});
			sap.ui.getCore().byId("idSimpleForm--serverUId").bindProperty("value", "User");
			// sap.ui.getCore().byId("idSimpleForm--customerId").bindProperty("value","StudentId");
			sap.ui.getCore().byId("idSimpleForm--startDate").bindProperty("value", {
				path: 'StartDate',
				type: 'sap.ui.model.type.Date',
				formatOptions: {
					pattern: 'dd.MM.YYYY'
				}
			});
			sap.ui.getCore().byId("idSimpleForm--endDate").bindProperty("value", {
				path: 'EndDate',
				type: 'sap.ui.model.type.Date',
				formatOptions: {
					pattern: 'dd.MM.YYYY'
				}
			});
			sap.ui.getCore().byId("idSimpleForm--userEndDate").bindProperty("value", {
				path: 'UserEndDate',
				type: 'sap.ui.model.type.Date',
				formatOptions: {
					pattern: 'dd.MM.YYYY'
				}
			});
			sap.ui.getCore().byId("idSimpleForm--rdpPass").bindProperty("value", "PassRDP");
			sap.ui.getCore().byId("idSimpleForm--passGui").bindProperty("value", "PassSAP");
			sap.ui.getCore().byId("idSimpleForm--amount").bindProperty("value", "Amount");
			sap.ui.getCore().byId("idSimpleForm--usage").bindProperty("value", "Usage");
			sap.ui.getCore().byId("idSimpleForm--freeAccess").bindProperty("selected", "FreeAccess");
			sap.ui.getCore().byId("idSimpleForm--extended").bindProperty("selected", "Extended");
			sap.ui.getCore().byId("idSimpleForm--Remarks").bindProperty("value", "Remarks");
			sap.ui.getCore().byId("idSimpleForm--cid").bindProperty("value", "StudentId");

			sap.ui.getCore().byId("idSimpleForm--payDate").setProperty("editable", false);
			sap.ui.getCore().byId("idSimpleForm--serverUId").setProperty("editable", false);
			sap.ui.getCore().byId("idSimpleForm--customerId").setProperty("editable", false);

			sap.ui.getCore().byId("idSimpleForm--customerId").attachModelContextChange(this.onCustomerIdChange, this);
			this.oDialogPopup.addContent(this.oSimpleForm);

		},
		onReUpdate: function (oEvent) {

			var sPath = oEvent.getSource().getParent().mAggregations.content[0].getBindingContext().sPath;
			var Servers = this.getView().getModel().oData[sPath.split("/")[1]];

			var that = this;
			this.getView().setBusy(true);

			var payloadRe = {
				"User": sap.ui.getCore().byId("idSimpleFormRe--serverUId").getValue().toLocaleUpperCase(),
				"StudentId": sap.ui.getCore().byId("idSimpleFormRe--cid").getValue(),
				"PaymentDate": sap.ui.getCore().byId("idSimpleFormRe--payDate").getDateValue(),
				"StartDate": sap.ui.getCore().byId("idSimpleFormRe--startDate").getDateValue(),
				"EndDate": sap.ui.getCore().byId("idSimpleFormRe--endDate").getDateValue(),
				"UserEndDate": sap.ui.getCore().byId("idSimpleFormRe--userEndDate").getDateValue(),
				"Amount": sap.ui.getCore().byId("idSimpleFormRe--amount").getValue(),
				"Usage": sap.ui.getCore().byId("idSimpleFormRe--usage").getValue(),
				"FreeAccess": "" + sap.ui.getCore().byId("idSimpleFormRe--freeAccess").getSelected() + "",
				"Extended": "" + sap.ui.getCore().byId("idSimpleFormRe--extended").getSelected() + "",
				"PassRDP": sap.ui.getCore().byId("idSimpleFormRe--rdpPass").getValue(),
				"PassSAP": sap.ui.getCore().byId("idSimpleFormRe--passGui").getValue(),
				"ReassignStd": sap.ui.getCore().byId("idSimpleFormRe--Rid").getValue(),
				// "ChangedOn":new Date(),
				// "ChangedBy": 'Menakshi',
				"id": sPath.split("(")[1].split("'")[1],
				"Remarks": sap.ui.getCore().byId("idSimpleFormRe--Remarks").getValue(),
				"Update": 'R'
			};

			this.ODataHelper.callOData(this.getOwnerComponent().getModel(), sPath, "PUT", {},
					payloadRe, this)
				.then(function (oData) {
					sap.m.MessageToast.show("Server Updated successfully");

					that.getView().byId("serverTable").getBinding("items").refresh(true);
					that.onReClose();
					that.getView().setBusy(false);

				}).catch(function (oError) {
					that.getView().setBusy(false);
					that.oPopover = that.getErrorMessage(oError);
					that.getView().setBusy(false);
				});
		},
		onUpdate: function (oEvent) {

			var sPath = oEvent.getSource().getParent().mAggregations.content[0].getBindingContext().sPath;
			var Servers = this.getView().getModel().oData[sPath.split("/")[1]];

			var that = this;
			this.getView().setBusy(true);

			var payload1 = {
				"User": sap.ui.getCore().byId("idSimpleForm--serverUId").getValue().toLocaleUpperCase(),
				"StudentId": sap.ui.getCore().byId("idSimpleForm--cid").getValue(),
				"PaymentDate": sap.ui.getCore().byId("idSimpleForm--payDate").getDateValue(),
				"StartDate": sap.ui.getCore().byId("idSimpleForm--startDate").getDateValue(),
				"EndDate": sap.ui.getCore().byId("idSimpleForm--endDate").getDateValue(),
				"UserEndDate": sap.ui.getCore().byId("idSimpleForm--userEndDate").getDateValue(),
				"Amount": sap.ui.getCore().byId("idSimpleForm--amount").getValue(),
				"Usage": sap.ui.getCore().byId("idSimpleForm--usage").getValue(),
				"FreeAccess": "" + sap.ui.getCore().byId("idSimpleForm--freeAccess").getSelected() + "",
				"Extended": "" + sap.ui.getCore().byId("idSimpleForm--extended").getSelected() + "",
				"PassRDP": sap.ui.getCore().byId("idSimpleForm--rdpPass").getValue(),
				"PassSAP": sap.ui.getCore().byId("idSimpleForm--passGui").getValue(),
				"ChangedOn": new Date(),
				"ChangedBy": 'Menakshi',
				"id": sPath.split("(")[1].split("'")[1],
				"Remarks": sap.ui.getCore().byId("idSimpleForm--Remarks").getValue(),
				"Update": 'U'
			};

			this.ODataHelper.callOData(this.getOwnerComponent().getModel(), sPath, "PUT", {},
					payload1, this)
				.then(function (oData) {
					sap.m.MessageToast.show("Server Updated successfully");
					that.getView().setBusy(false);
					that.onClose();

				}).catch(function (oError) {
					that.getView().setBusy(false);
					that.oPopover = that.getErrorMessage(oError);
					that.getView().setBusy(false);
				});
		},
		onClose: function () {
			this.oDialogPopup.close();
		},
		onReClose: function () {
			this.ReasgnPopup.close();
		},
		onSearch: function (oEvent) {
			var queryString = this.getQuery(oEvent);

			if (queryString) {
				var oFilter1 = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, queryString);
				var oFilter2 = new sap.ui.model.Filter("GmailId", sap.ui.model.FilterOperator.Contains, queryString);

				var oFilter = new sap.ui.model.Filter({
					filters: [oFilter1, oFilter2],
					and: false
				});
				var aFilter = [oFilter];
				this.searchPopup.getBinding("items").filter(aFilter);
			} else {
				this.searchPopup.bindAggregation("items", {
					path: "/Students",
					template: new sap.m.DisplayListItem({
						label: "{Name}",
						value: "{GmailId}"
					})

				});
				this.searchPopup.getBinding("items").filter([]);
			}
		},

		onConfirm: function (oEvent) {
			var data = this.getSelectedKey(oEvent);
			if (oEvent.getSource().getParent().oController.ReasgnPopup) {
				sap.ui.getCore().byId("idSimpleFormRe--customerId").setValue(data[0]);
				sap.ui.getCore().byId("idSimpleFormRe--name").setText(data[1]);
				sap.ui.getCore().byId("idSimpleFormRe--cid").setValue(data[2]);

				this.getView().byId("customerId").setValue(data[0]);
				this.getView().byId("name").setText(data[1]);
				this.getView().byId("cid").setValue(data[2]);
			} else {
				this.getView().byId("customerId").setValue(data[0]);
				this.getView().byId("name").setText(data[1]);
				this.getView().byId("cid").setValue(data[2]);
			}
		},

		onWaiver: function (oEvent) {
			var selected = oEvent.getParameter("selected");
			if (oEvent.getSource().sId == "__component0---idserver--freeAccess") {
				if (selected === true) {
					this.getView().byId("amount").setValue(0);
				} else {
					this.getView().byId("amount").setValue(2500);
				}
			} else if ((oEvent.getSource().sId == "idSimpleFormRe--freeAccess")) {
				if (selected === true) {
					sap.ui.getCore().byId("idSimpleFormRe--amount").setValue(0);
				} else {
					sap.ui.getCore().byId("idSimpleFormRe--amount").setValue(2500);
				}
			} else {
				if (selected === true) {
					sap.ui.getCore().byId("idSimpleForm--amount").setValue(0);
				} else {
					sap.ui.getCore().byId("idSimpleForm--amount").setValue(2500);
				}
			}

		},

		onTabSearch: function (oEvent) {
			var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			var queryString = this.getQuery(oEvent);
			if (queryString) {
				var oFilter1;
				var oFilter2;
				if (regEx.test(queryString)) {

					var that = this;
					var payload = {};
					var Filter1 = new sap.ui.model.Filter("GmailId", "EQ", queryString);

					this.ODataHelper.callOData(this.getOwnerComponent().getModel(), "/Students", "GET", {
							filters: [Filter1]
						}, payload, this)
						.then(function (oData) {

							var aFilter = [new sap.ui.model.Filter("StudentId", "EQ", "'" + oData.results[0].id + "'")];

							that.getView().byId("serverTable").getBinding("items").filter(aFilter);

						}).catch(function (oError) {

						});

				} else {
					//oFilter1 = new sap.ui.model.Filter("StudentId", sap.ui.model.FilterOperator.Contains, queryString);
					oFilter1 = new sap.ui.model.Filter("User", sap.ui.model.FilterOperator.EQ, queryString);
					var oFilter = new sap.ui.model.Filter({
						filters: [oFilter1],
						and: false
					});
					var aFilter = [oFilter];
					this.getView().byId("serverTable").getBinding("items").filter(aFilter);
				}
			} else {
				this.getView().byId("serverTable").getBinding("items").filter([]);
			}

		},


		onClearScreen: function () {
			this.getView().getModel("local").setProperty("/newServer/User", null);
			// this.getView().getModel("local").setProperty("/newServer/Amount", null);
			this.getView().getModel("local").setProperty("/newServer/PassSAP", null);
			this.getView().getModel("local").setProperty("/newServer/PassRDP", null);
		},
		onDelete: function (oEvent) {
			var that = this;
			MessageBox.confirm("Do you want to delete the selected records?", function (conf) {
				if (conf == 'OK') {
					var items = that.getView().byId('serverTable').getSelectedContexts();
					for (var i = 0; i < items["length"]; i++) {
						that.ODataHelper.callOData(that.getOwnerComponent().getModel(), items[i].sPath, "DELETE", {}, {}, that)
							.then(function (oData) {
								sap.m.MessageToast.show("Deleted succesfully");
							}).catch(function (oError) {
								that.getView().setBusy(false);
								that.oPopover = that.getErrorMessage(oError);
								that.getView().setBusy(false);
							});

					}
				}
			}, "Confirmation");

		},
		onSwitchToggle: function (oEvent) {

			var oSwitch = oEvent.getSource().getState();
			var date = new Date();
			var queryString = this.getQuery(oEvent);
			if (oSwitch === true) {
				this.getView().byId("serverTable").getBinding("items").filter(null);
			} else {
				var vFilter1 = new sap.ui.model.Filter("EndDate", "GT", date);

				var vFilter = new sap.ui.model.Filter({
					filters: [vFilter1]
				});
				var arFilter = [vFilter];
				this.getView().byId("serverTable").getBinding("items").filter(arFilter);

			}

		},
		passwords: "",
		onEmail: function () {
			var that = this;
			var items = that.getView().byId('serverTable').getSelectedContexts();
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
				$.post('/sendServerEmail', loginPayload)
					.done(function (data, status) {
						sap.m.MessageToast.show("Email sent successfully");
					})
					.fail(function (xhr, status, error) {
						that.passwords = "";
						sap.m.MessageBox.error(xhr.responseText);
					});
			}
		},
		onDataExport: function (oEvent) {
			var state = this.getView().byId("idSwitch").getState();

			if (state == true) {
				$.ajax({
					type: 'GET', // added,
					url: 'ServerDownload',
					success: function (data) {
						sap.m.MessageToast.show("File Downloaded succesfully");
					},
					error: function (xhr, status, error) {
						sap.m.MessageToast.show("error in downloading the excel file");
					}
				});

			} else {
				$.ajax({
					type: 'GET', // added,
					url: 'ServerDownloadAct',
					success: function (data) {
						sap.m.MessageToast.show("File Downloaded succesfully");
					},
					error: function (xhr, status, error) {
						sap.m.MessageToast.show("error in downloading the excel file");
					}
				});
			}
		}

	});
});
