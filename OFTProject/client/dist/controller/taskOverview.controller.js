sap.ui.define(["oft/fiori/controller/BaseController","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/FilterType","sap/m/routing/RouteMatchedHandler","sap/ui/table/Table","oft/fiori/models/formatter"],function(e,t,i,r,s,a,o){"use strict";return e.extend("oft.fiori.controller.taskOverview",{aFilters:[],onInit:function(){debugger;var e=this.getModel("local").getProperty("/CurrentUser");if(e){var t=this.getModel("local").oData.AppUsers[e].UserName;this.getView().byId("idUserl").setText(t)}this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);this.oRouter.attachRoutePatternMatched(this.herculis,this)},herculis:function(e){this.getView().byId("idCoDate1").setDateValue(new Date);if(e.getParameter("name")!=="taskoverview"){return}this.getModel("local").setProperty("/tasks/CrDate",new Date);this.currentUser=this.getModel("local").getProperty("/CurrentUser");this.fromDate=new Date;this.toDate=new Date;this.fromDate.setMilliseconds(0);this.fromDate.setSeconds(0);this.fromDate.setMinutes(0);this.fromDate.setHours(0);this.toDate.setMilliseconds(0);this.toDate.setSeconds(59);this.toDate.setMinutes(59);this.toDate.setHours(23);this.reloadTasks()},reloadTasks:function(){debugger;var e=this.getModel("local").getProperty("/Role");this.getView().byId("idCoTable").bindItems({path:"/tasks",template:new sap.m.ColumnListItem({cells:[new sap.m.Text({text:{path:"CrDate",type:"sap.ui.model.type.Date",formatOptions:{pattern:"dd.MM.YYYY"}}}),new sap.m.Text({text:"{CreatedBy}"}),new sap.m.Text({text:{path:"taskType",formatter:".formatter.getTaskText"}}),new sap.m.Text({text:"{taskWorkedOn}"}),new sap.m.Text({text:"{noOfHours}"})]})});if(e=="Admin"){var t=[new sap.ui.model.Filter("CrDate",i.BT,this.fromDate,this.toDate)];this.getView().byId("idCoTable").getBinding("items").filter(t)}else{this.getView().byId("idUser").setVisible(false);var t=[new sap.ui.model.Filter("CreatedBy","EQ","'"+this.currentUser+"'"),new sap.ui.model.Filter("CrDate",i.BT,this.fromDate,this.toDate)];this.getView().byId("idCoTable").getBinding("items").filter(t)}},onUpdateFinished:function(e){debugger;var t=e.getSource();var i=t.getItems();var r=i.length;var s;for(var a=0;a<r;a++){var o=t.getItems()[a].getCells()[1].getText();var l=this.allMasterData.AppUsers[o];t.getItems()[a].getCells()[1].setText(o)}var n=this.getView().byId("idUser").getValue();var d=this.getView().byId("idCoTable").getBinding("items").getLength();var u=this.getView().byId("idCoTable").getBinding("items");var g=0;debugger;for(var a=0;a<d;a++){g=g+parseFloat(u.getContexts()[a].oModel.getProperty(u.getContexts()[a].sPath).noOfHours)}this.getView().byId("idTxt").setText("Total number of tasks are "+u.getLength()+" and Total number of hours worked are "+g+"")},formatter:a,onSelect:function(e){debugger;var i=e.getSource().getSelectedKey();var r=this.getView().byId("idCoDate1").getDateValue();var s=new Date(r+1);r.setMilliseconds(0);r.setSeconds(0);r.setMinutes(0);r.setHours(0);s.setMilliseconds(0);s.setSeconds(59);s.setMinutes(59);s.setHours(23);var a=new t([new sap.ui.model.Filter("CrDate",sap.ui.model.FilterOperator.BT,r,s)],true);var o=new t([new sap.ui.model.Filter("CreatedBy",sap.ui.model.FilterOperator.EQ,"'"+i+"'")]);var l=new sap.ui.model.Filter({filters:[a,o],and:true});this.getView().byId("idCoTable").getBinding("items").filter(l,true)},onDateChange:function(e){debugger;var i=this.getModel("local").getProperty("/Role");var r=this.getView().byId("idUser").getSelectedKey();var s=e.getSource().getProperty("dateValue");var a=new Date(s+1);var o=e.getParameter("valid");var l=[];var n=null;var d=null;s.setMilliseconds(0);s.setSeconds(0);s.setMinutes(0);s.setHours(0);a.setMilliseconds(0);a.setSeconds(59);a.setMinutes(59);a.setHours(23);if(i=="Admin"){n=new t([new sap.ui.model.Filter("CrDate",sap.ui.model.FilterOperator.BT,s,a)],true);if(!r==""){d=new t([new sap.ui.model.Filter("CreatedBy",sap.ui.model.FilterOperator.EQ,"'"+r+"'")]);l=new sap.ui.model.Filter({filters:[n,d],and:true});this.getView().byId("idCoTable").getBinding("items").filter(l,true)}else{l=new sap.ui.model.Filter({filters:[n]});this.getView().byId("idCoTable").getBinding("items").filter(l,true)}}else{n=new t([new sap.ui.model.Filter("CrDate",sap.ui.model.FilterOperator.BT,s,a)],true);d=new t([new sap.ui.model.Filter("CreatedBy",sap.ui.model.FilterOperator.EQ,"'"+this.currentUser+"'")]);l=new sap.ui.model.Filter({filters:[n,d],and:true});this.getView().byId("idCoTable").getBinding("items").filter(l,true)}}})});
//# sourceMappingURL=taskOverview.controller.js.map