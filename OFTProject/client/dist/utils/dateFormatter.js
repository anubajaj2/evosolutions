sap.ui.define([],function(){return{getFirstDateOfMonth:function(t){var e=new Date(t.getFullYear(),t.getMonth(),1);return e},getLastDateOfMonth:function(t){var e=new Date(t.getFullYear(),t.getMonth()+1,0);return e},getNextDate:function(t,e){var n=new Date(t.getFullYear(),t.getMonth(),e);return n},getNumberOfDaysInMonth:function(t){var e=t.getFullYear();var n=t.getMonth();return new Date(e,n,0).getDate()}}});
//# sourceMappingURL=dateFormatter.js.map