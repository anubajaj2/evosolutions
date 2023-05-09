sap.ui.define(["oft/fiori/controller/BaseController","sap/m/MessageBox","sap/m/MessageToast","oft/fiori/models/formatter","sap/ui/model/Filter"],function(e,t,a,r,o){"use strict";return e.extend("oft.fiori.controller.leaveRequest",{formatter:r,date:new Date,startDate:new Date((new Date).getFullYear(),0,1),endDate:new Date((new Date).getFullYear(),11,31),onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);this.oRouter.attachRoutePatternMatched(this.herculis,this);var e=this.getModel("local").getProperty("/CurrentUser");if(e){var t=this.getModel("local").oData.AppUsers[e].UserName;this.getView().byId("idUser").setText(t);var a=new Date;var r=new Date(a.getFullYear(),0,1);this.getModel("local").setProperty("/newLeaveRequest/Datefilter",r);this.getModel("local").setProperty("/LeaveStatic/DateFrom",this.getModel("local").getProperty("/JoiningDate"));this.getModel("local").setProperty("/LeaveStatic/DateTo",this.endDate);this.getModel("local").setProperty("/LeaveStatic/TotalQuota",this.getModel("local").getProperty("/LeaveQuota"))}},onBeforeRendering:function(){},onBack:function(){sap.ui.getCore().byId("idApp").to("idView1")},herculis:function(e){if(e.getParameter("name")!=="leaveRequest"){return}var t=this.getModel("local").getProperty("/CurrentUser");if(t){var a=this.getModel("local").oData.AppUsers[t].UserName;var r=new sap.ui.model.Filter("DateFrom","GT",this.startDate);var o=new sap.ui.model.Filter("DateTo","LT",this.endDate);var s=this;var l={};this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/AppUsers('"+t+"')/leaveRequests","GET",{filters:[r,o],and:true},l,this).then(function(e){if(e.results.length!=0){var t="";var a="";var r=0;var o=0;var l=0;var i=0;var n="";var v="";s.getView().getModel("local").setProperty("/LeaveRequests",e.results);var p=s.getView().getModel("local").getProperty("/LeaveRequests");for(var u=0;u<e.results.length;u++){t=p[u].ApproverId;if(t===""){a=s.getView().getModel("local").oData.AppUsers[e.results[0].ApproverId].UserName;p[u].ApproverId=a}else{p[u].ApproverId=" "}n=p[u].Status;v=p[u].LeaveType;if(n==="Approved"){switch(v){case"Full Day":l=l+parseInt(p[u].Days);break;case"Half Day":i=i+parseFloat(p[u].Days);break}}}var g=s.getView().getModel("local");g.setProperty("/LeaveStatic/FullConsumed",l);g.setProperty("/LeaveStatic/HalfConsumed",i);var c=parseInt(s.getModel("local").getProperty("/LeaveQuota"))-(parseFloat(l)+parseFloat(i));g.setProperty("/LeaveStatic/Available",c)}else{}}).catch(function(e){})}},onCreateLeave:function(e){this.oRouter.navTo("createLeave")},indexDel:"",onDelete:function(e){var a=e.getSource().getBindingContext("local").getPath();var r=this;r.indexdel=a;t.confirm("Do you want to delete the selected records?",function(e){if(e=="OK"){var t=r.getView().getModel("local").getProperty(a).id;var o="/LeaveRequests('"+t+"')";r.ODataHelper.callOData(r.getOwnerComponent().getModel(),o,"DELETE",{},{},r).then(function(e){r.getView().setBusy(false);var t=r.indexdel.split("/");var a=t[t.length-1];r.indexDel=null;var o=r.getView().byId("idTable2");var s=o.getModel("local");var l=s.getProperty("/LeaveRequests");var i=l.splice(a,1);s.setProperty("/LeaveRequests",l);var n=0;var v=0;var p=0;var u=0;var g="";var c="";for(var d=0;d<l.length;d++){g=l[d].Status;c=l[d].LeaveType;switch(c){case"Full Day":p=p+parseInt(l[d].Days);break;case"Half Day":u=u+parseFloat(l[d].Days);break}}var h=r.getView().getModel("local");h.setProperty("/LeaveStatic/FullConsumed",p);h.setProperty("/LeaveStatic/HalfConsumed",u);var D=21-(parseFloat(p)+parseFloat(u));h.setProperty("/LeaveStatic/Available",D);sap.m.MessageToast.show("Deleted succesfully")}).catch(function(e){r.getView().setBusy(false);r.oPopover=r.getErrorMessage(e);r.getView().setBusy(false)})}},"Confirmation")},onSend:function(e){var t=e;var a=this;a.getView().setBusy(true);var r=this.getModel("local").getProperty("/CurrentUser");var o=this.getView().getModel("local").getProperty("/newLeaveRequest");if(o.DateFrom>o.DateTo){a.getView().setBusy(false);sap.m.MessageBox.error("Date From Cannot be greater than Date To");return}var s={AppUserId:r,DateFrom:o.DateFrom,DateTo:o.DateTo,Days:1,LeaveType:"Full Day",Status:"Not Approved",ApproverId:"get the id of Approver",ApprovedOn:new Date,RequestedOn:new Date,Remarks:o.Remarks,ChangedOn:new Date,ChangedBy:"get the id of user"};this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/LeaveRequests","POST",{},s,this).then(function(e){a.getView().setBusy(false);sap.m.MessageToast.show("Leave Request send for Approval");a.destroyMessagePopover()}).catch(function(e){a.getView().setBusy(false);var t=a.getErrorMessage(e)})}})});