sap.ui.define(["oft/fiori/controller/BaseController","sap/m/MessageBox","sap/m/MessageToast","oft/fiori/models/formatter","sap/ui/model/Filter"],function(e,t,a,o,s){"use strict";return e.extend("oft.fiori.controller.newLead",{formatter:o,onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);this.clearForm();e.prototype.onInit.apply(this);this.oRouter.attachRoutePatternMatched(this.herculis,this);var t=this.getModel("local").getProperty("/CurrentUser");if(t){var a=this.getModel("local").oData.AppUsers[t].UserName;this.getView().byId("idUser").setText(a)}},clearForm:function(){},onViewPhoto:function(e){var t=this.getView();var a=this;a.photoPath=e.getSource().getParent().getBindingContextPath();var o=this.getView().getModel("local").getProperty(a.photoPath+"/Photo");if(!a.oViewAndUploadPhoto){a.oViewAndUploadPhoto=sap.ui.core.Fragment.load({id:t.getId(),name:"oft.fiori.fragments.viewAndUploadPhoto",controller:this});a.oViewAndUploadPhoto.then(function(e){t.addDependent(e);e.getContent()[0].getItems()[0].getItems()[0].setSrc(o);e.open()})}else{a.oViewAndUploadPhoto.then(function(e){e.getContent()[0].getItems()[0].getItems()[0].setSrc(o);e.getContent()[0].getItems()[1].getItems()[0].clear();e.open()})}},onUploadPhotoClose:function(){this.oViewAndUploadPhoto.then(function(e){e.getContent()[0].getItems()[1].getItems()[0].clear();e.close()})},onFileUploaderChange:function(e){var t=this;if(e.getParameter("files").length>0){var a=e.getParameter("files")[0];var o=e.getSource().getParent().getParent().getItems()[0].getItems()[0];var s=new FileReader;s.onload=function(e){o.setSrc(e.target.result);t.getView().getModel("local").setProperty(t.photoPath+"/Photo",e.target.result)};s.readAsDataURL(a)}},onClearForm:function(){this.getView().getModel("local").setProperty("/newLead",{EmailId:"",CourseName:" ",Category:" ",Date:new Date,FatherName:"",MotherName:"",City:"Gurgaon",Phone:"",EmailId2:"",Remarks:"",currency:"INR",Address:"",organization:"",custType:"",CreatedOn:"",CreatedBy:"",ChangedBy:"",ChangedOn:"",courseSet:"",HearAbout:"JustDial",EmergencyContactName:"",EmergencyContactNo:"",WardDetails:[]});this.flag=null},passwords:"",onEmail:function(){var e=this;var t=e.getView().byId("idRecent").getSelectedContexts();for(var a=0;a<t["length"];a++){var o=t[a].getModel().getProperty(t[a].getPath());if(this.passwords===""){this.passwords=prompt("Please enter your password","");if(this.passwords===""){sap.m.MessageBox.error("Blank Password not allowed");return}}o.password=this.passwords;o.DollerQuote=this.getView().byId("doller").getSelected();o.courseId=this.getView().byId("idCourse1").getSelectedKey();$.post("/sendInquiryEmail",o).done(function(e,t){sap.m.MessageToast.show("Email sent successfully")}).fail(function(t,a,o){e.passwords="";sap.m.MessageBox.error(t.responseText)})}},onDataExport:function(e){$.ajax({type:"GET",url:"InquiryDownload",success:function(e){sap.m.MessageToast.show("File Downloaded succesfully")},error:function(e,t,a){sap.m.MessageToast.show("error in downloading the excel file")}})},onDelete:function(e){var a=this;t.confirm("Do you want to delete the selected records?",function(e){if(e=="OK"){var t=a.getView().byId("idRecent").getSelectedContexts();for(var o=0;o<t["length"];o++){a.ODataHelper.callOData(a.getOwnerComponent().getModel(),t[o].sPath,"DELETE",{},{},a).then(function(e){sap.m.MessageToast.show("Deleted succesfully")}).catch(function(e){a.getView().setBusy(false);a.oPopover=a.getErrorMessage(e);a.getView().setBusy(false)})}}},"Confirmation")},onBack:function(){sap.ui.getCore().byId("idApp").to("idView1")},onItemSelect:function(e){var t=e.getParameter("listItem").getBindingContextPath();var a=t.split("/")[t.split("/").length-1];this.oRouter.navTo("detail2",{suppId:a})},onPress:function(){sap.m.MessageBox.alert("Button was clicked")},onHover:function(){sap.m.MessageBox.alert("Button was Hovered")},onCourseSelect:function(e){var t=this.getView().byId("country").getSelectedKey();var a=this.getView().byId("course").getSelectedKey();var o=this.getView().getModel("local").getProperty("/courses");if(t==="IN"){for(var s=0;s<o.length;s++){if(o[s].courseName===a){this.getView().getModel("local").setProperty("/newLead/fees",o[s].fee);this.getView().getModel("local").setProperty("/newLead/currency","INR");break}}}else{for(var s=0;s<o.length;s++){if(o[s].courseName===a){this.getView().getModel("local").setProperty("/newLead/fees",o[s].usdFee);this.getView().getModel("local").setProperty("/newLead/currency","USD");break}}}},popupSave:function(){var e=this;debugger;var t={EmailId2:this.getView().getDependents()[0].getContent()[0].getContent()[1].getValue(),Remarks:this.getView().getDependents()[0].getContent()[0].getContent()[3].getValue()};e.ODataHelper.callOData(e.getOwnerComponent().getModel(),this.sPath,"PUT",{},t,e).then(function(t){sap.m.MessageToast.show("The Data has been updated successfully");e.inqChangeDialog.close()}).catch(function(t){e.getView().setBusy(false);var a=e.getErrorMessage(t)})},inqChangeDialog:null,onInqSelect:function(e){var t=this;this.sPath=e.getParameter("listItem").getBindingContextPath();var a=e.getSource().getModel().getProperty(this.sPath);var o=new sap.ui.model.json.JSONModel;o.setData({EmailId2:a.EmailId2,Remarks:a.Remarks});if(!this.inqChangeDialog){this.inqChangeDialog=new sap.m.Dialog({title:"Update Data"});this.inqChangeDialog.addButton(new sap.m.Button({text:"Save",press:[t.popupSave,t]}));this.inqChangeDialog.addButton(new sap.m.Button({text:"Cancel",press:function(){t.inqChangeDialog.close()}}));this.getView().addDependent(this.inqChangeDialog);var s=new sap.ui.layout.form.SimpleForm({content:[new sap.m.Label({text:"Email"}),new sap.m.Input({value:"{/EmailId2}"}),new sap.m.Label({text:"Remarks"}),new sap.m.Input({value:"{/Remarks}"})]});this.inqChangeDialog.addContent(s);this.inqChangeDialog.setModel(o)}else{this.inqChangeDialog.setModel(o)}this.inqChangeDialog.open()},reloadRefresh:function(){var e=this.getView().byId("idRecent");e.getBinding("items").refresh()},herculis:function(e){if(e.getParameter("name")!=="newlead"){return}this.getView().getModel("local").setProperty("/newLead/Date",new Date);this.getView().getModel("local").setProperty("/newLead/country","IN");var t=new Date;t.setHours(0,0,0,0);var a=new sap.ui.model.Sorter("CreatedOn",true);var o=this.getView().byId("idRecent");o.bindAggregation("items",{path:"/Inquries",template:new sap.m.DisplayListItem({type:"Navigation",label:"{EmailId} - {CourseName} - {EmailId2}",value:"{fees} / {CreatedOn} - {CreatedBy}"}),filters:[new s("CreatedOn","GE",t)],sorter:a});o.attachUpdateFinished(this.counter)},counter:function(e){var t=e.getSource();var a=t.getItems().length;t.getHeaderToolbar().getContent()[0].setText("Today : "+a);var o=t.mAggregations.items;var s;var n;var r;for(var i=0;i<o.length;i++){n=o[i].mProperties.value.split("-")[0];r=o[i].mProperties.value.split("-")[1];if(this.getModel("local").getProperty("/AppUsers")[r]){s=this.getModel("local").getProperty("/AppUsers")[r].UserName;t.getItems()[i].setValue(n+" - "+s)}}},onMobileNumber:function(e){if(e.getParameter("value").length>10){e.getSource().setValue(e.getParameter("value").substring(0,10));a.show("The number should not exceed 10 digits")}},onFullScreen:function(e){var t=e.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getParent();var a=t.getMode();if(a==="ShowHideMode"){t.setMode("HideMode");e.getSource().setIcon("sap-icon://exit-full-screen");e.getSource().setText("Exit Fullscreen")}else{t.setMode("ShowHideMode");e.getSource().setIcon("sap-icon://full-screen");e.getSource().setText("Show Fullscreen")}},onParentMode:function(e){if(e.getParameter("state")){this.getView().byId("inqDate").setVisible(false);this.getView().byId("quotedFee").setVisible(false)}else{this.getView().byId("inqDate").setVisible(true);this.getView().byId("quotedFee").setVisible(true)}},onPressSendEmail:function(e){var t=e.getSource().getParent().getParent().getSelectedContextPaths();var a=this.getView().getModel("local").getProperty("/newLead");var o=[];var s=this.getView().getModel("local");t.forEach((e,t)=>{o.push(s.getProperty(e))});for(item in o){payload.FatherName=a.FatherName;payload.Email=a.EmailId;payload.WardName=item.Name;payload.CourseName=item.CourseName;$.post("/sendInquiryEmail",payload).done(function(e,t){sap.m.MessageToast.show("Email sent successfully")}).fail(function(e,t,a){that.passwords="";sap.m.MessageBox.error(e.responseText)})}},onPressAddWard:function(){var e=this.getView().getModel("local").getProperty("/newLead/WardDetails");e.push({RollNo:null,Name:null,Gender:"F",DOB:new Date,Standard:null,SchoolName:null,Weakness:null,MobileNo:null,CourseName:[],Address:null,BloodGroup:null,Photo:null});this.getView().getModel("local").setProperty("/newLead/WardDetails",e)},onPressDeleteRow:function(e){var t=e.getSource().getParent().getParent().getSelectedContextPaths();var a=[];t.forEach(e=>{a.push(parseInt(e.split("/")[3]))});a.sort((e,t)=>t-e);var o=this.getView().getModel("local").getProperty("/newLead/WardDetails");a.forEach(e=>{o.splice(e,1)});this.getView().getModel("local").setProperty("/newLead/WardDetails",o);e.getSource().getParent().getParent().removeSelections()},onEnter:function(e){var o=e.getParameters().value;if(o&&o.toString().length!==10){a.show("Please Enter a Valid Mobile Number");return}var s=this;var n=new sap.ui.model.Filter("Phone","EQ",o);this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/Inquries?$select=id","GET",{filters:[n],urlParameters:{$select:"id,Phone"}},{},this).then(function(e){if(e.results.length>0){s.loadInquiry(e.results[0].id)}else{t.show("No Matching Record Found!",{onClose:function(){s.getView().byId("idParentEmail").focus()}})}}).catch(function(e){a.show(e.responseText)})},onSelectInq:function(e){this.getCustomerPopup();this.flag="inquiry";this.searchPopup.setTitle("Inquiries");this.searchPopup.bindAggregation("items",{path:"/Inquries",template:new sap.m.ObjectListItem({title:"{FatherName}",intro:"{EmailId}",number:"{Phone}",numberUnit:"{=${MotherName}? 'Mother: '+${MotherName} : ${MotherName}}"})})},onConfirm:function(e){var t=e.getParameter("selectedItem").getBindingContextPath();var a=this.getView().getModel().getProperty(t).id;var o=this;var s="Inquries('"+a+"')";var n=this.getView().getModel().oData[s];o.loadInquiry(n.id)},loadInquiry:function(e){this.flag="inquiry";var t=this;var a="Inquries('"+e+"')";t.getView().setBusy(true);t.ODataHelper.callOData(t.getOwnerComponent().getModel(),`/${a}`,"GET",{},{},t).then(function(e){t.getView().getModel("local").setProperty("/newLead",e);t.ODataHelper.callOData(t.getOwnerComponent().getModel(),`/${a}/ToWard`,"GET",{},{},t).then(function(e){t.getView().getModel("local").setProperty("/newLead/WardDetails",e.results);t.getView().setBusy(false)}).catch(function(e){t.getView().setBusy(false)})}).catch(function(e){t.getView().setBusy(false)})},onSearch:function(e){var t=this.getQuery(e);if(t){var a=new sap.ui.model.Filter("FatherName",sap.ui.model.FilterOperator.Contains,t);var o=new sap.ui.model.Filter("MotherName",sap.ui.model.FilterOperator.Contains,t);var s=new sap.ui.model.Filter("Phone",sap.ui.model.FilterOperator.Contains,t);var n=new sap.ui.model.Filter("EmailId",sap.ui.model.FilterOperator.Contains,t);var r=new sap.ui.model.Filter({filters:[a,o,s,n],and:false});var i=[r];this.searchPopup.getBinding("items").filter(i)}else{this.searchPopup.getBinding("items").filter([])}},onCancel:function(){this.flag=null},supplierPopup:null,oInp:null,onPopupConfirm:function(e){var t=e.getParameter("selectedItem");this.oInp.setValue(t.getLabel())},oSuppPopup:null,onFilter:function(){if(!this.oSuppPopup){this.oSuppPopup=new sap.ui.xmlfragment("oft.fiori.fragments.popup",this);this.getView().addDependent(this.oSuppPopup);this.oSuppPopup.setTitle("Suppliers");this.oSuppPopup.bindAggregation("items",{path:"/suppliers",template:new sap.m.DisplayListItem({label:"{name}",value:"{city}"})})}this.oSuppPopup.open()},onRequest:function(e){this.oInp=e.getSource();if(!this.supplierPopup){this.supplierPopup=new sap.ui.xmlfragment("oft.fiori.fragments.popup",this);this.supplierPopup.setTitle("Cities");this.getView().addDependent(this.supplierPopup);this.supplierPopup.bindAggregation("items",{path:"/cities",template:new sap.m.DisplayListItem({label:"{cityName}",value:"{famousFor}"})})}this.supplierPopup.open()},onSave:function(e){var a=e;console.log(this.getView().getModel("local").getProperty("/newLead"));var o=this;var s=this.getView().getModel("local").getProperty("/newLead");if(!this.getView().byId("inqDate").getDateValue()){sap.m.MessageToast.show("Enter a valid Date");return""}if(!s.Phone){sap.m.MessageToast.show("Please Enter Mobile No.");return""}var n={EmailId:s.EmailId.toLowerCase(),RollNo:s.RollNo,FatherName:s.FatherName,MotherName:s.MotherName,EmailId2:s.EmailId2,Date:this.getView().byId("inqDate").getDateValue(),City:s.City,Address:s.Address,EmergencyContactName:s.EmergencyContactName,EmergencyContactNo:s.EmergencyContactNo,Phone:s.Phone,Remarks:s.Remarks,HearAbout:s.HearAbout,SoftDelete:false,CreatedOn:new Date,ChangedOn:new Date,ChangedBy:""};var r=s.WardDetails;if(r.filter(function(e){return!e.Name}).length>0){t.error("Ward Name Can't be Empty!");return}o.getView().setBusy(true);if(this.flag==="inquiry"){this.ODataHelper.callOData(this.getOwnerComponent().getModel(),`/Inquries('${s.id}')`,"PUT",{},n,this).then(function(e){const t=s.id;if(r.length>0){o.saveWard(r,0,t)}else{sap.m.MessageToast.show("Inquiry Saved successfully");o.loadInquiry(t)}}).catch(function(e){t.error(e.responseText);o.getView().setBusy(false)})}else{const e=[];e.push(new Promise((e,a)=>{this.ODataHelper.callOData(this.getOwnerComponent().getModel(),"/Inquries","POST",{},n,this).then(function(e){const t=e.id;if(r.length>0){o.saveWard(r,0,t)}else{sap.m.MessageToast.show("Inquiry Saved successfully");o.loadInquiry(t)}}).catch(function(e){t.error(e.responseText);o.getView().setBusy(false);a(e)})}))}},saveWard:function(e,t,a){var o=this;const s={InquiryId:a,RollNo:e[t].RollNo,Name:e[t].Name,Gender:e[t].Gender,DOB:e[t].DOB,Standard:e[t].Standard,SchoolName:e[t].SchoolName,Weakness:e[t].Weakness,MobileNo:e[t].MobileNo,CourseName:e[t].CourseName,Address:e[t].Address,BloodGroup:e[t].BloodGroup,Photo:e[t].Photo};o.ODataHelper.callOData(o.getOwnerComponent().getModel(),e[t].id?`/Wards('${e[t].id}')`:"/Wards",e[t].id?"PUT":"POST",{},s,o).then(function(s){if(++t<e.length){o.saveWard(e,t,a)}else{sap.m.MessageToast.show("Inquiry Saved successfully");o.loadInquiry(a)}}).catch(function(s){if(++t<e.length){o.saveWard(e,t,a)}else{sap.m.MessageToast.show("Inquiry Saved successfully");o.loadInquiry(a)}})},onApprove:function(){t.confirm("Do you want to approve this fruit",{title:"confirmation",onClose:this.onConfirm.bind(this)})},onGetNext:function(){$.post("/MoveNextAc",{}).done(function(e,t){sap.m.MessageBox.confirm("Bank Name    : "+e.BankName+"\n"+"Account Name : "+e.accountName+"\n"+"Account No   : "+e.accountNo+"\n"+"IFSC Code    : "+e.ifsc+"\n"+"\n"+"Note: Please send the screenshot of payment once done.")}).fail(function(e,t,a){sap.m.MessageBox.error(e.responseText)})},onUpdateFinished:function(e){var t=e.getSource();var a=t.getItems();var o=a.length;for(var s=0;s<o;s++){var n=t.getItems()[s].mBindingInfos.label.binding.aValues[1];var r=a[s].mProperties.label;var i=a[s].mProperties.value.split("/");var l="CoursesMst('"+n.trim()+"')";var u=this.getView().getModel().oData[l];var g=a[s].mProperties.value.split("-")[1].trim();debugger;if(u){var d=a[s].mProperties.label.replace(n.trim(),u.CourseName);if(this.getView().getModel("local").getProperty("/AppUsers")[g]){var p=a[s].mProperties.value.replace(g,this.getView().getModel("local").getProperty("/AppUsers")[g].UserName);t.getItems()[s].setValue(p)}t.getItems()[s].setLabel(d)}}}})});