sap.ui.define([],function(){return{checkEmpty:function(e){if(e.getValue()===""){e.setValueState("Error");return false}else{e.setValueState("None");return true}},checkEmail:function(e){var t=e.getValue();var r=/^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;if(!t.match(r)){e.setValueState("Error");return false}else{e.setValueState("None");return true}},convertDate:function(e,t){var r=new Date;var a=r.getDate();var u=r.getMonth()+1;var n=r.getFullYear();if(a<10){a="0"+a}if(u<10){u="0"+u}var r=n+"/"+u+"/"+a;if(t>r){e.setValueState("Error");return false}else{e.setValueState("None");return true}},checkMore:function(e,t,r){if(r>t){e.setValueState("Error");return false}else{e.setValueState("None");return true}}}});
//# sourceMappingURL=Validator.js.map