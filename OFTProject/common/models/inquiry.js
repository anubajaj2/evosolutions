'use strict';

module.exports = function(Inquiry) {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var app = require('../../server/server');
    // var CourseMst = app.models.CourseMst;
    //validations
    Inquiry.validatesPresenceOf('FatherName', {message: 'Name Cannot be blank'})
    Inquiry.validatesLengthOf('Phone', {is: 10, message: {is: 'The Contact No. Must be exactly 10 digits'}});
    // Inquiry.validatesInclusionOf('CourseName', {
    //     in: ["UI5 and Fiori", "ABAP on HANA", "Launchpad", "HANA XS",  "Hybris C4C",
    //          ,"HANA Cloud Integration (HCI)","SAP Cloud Platform","ABAP", "OOPS ABAP", "Webdynpro", "Workflow", "FPM", "Other"
    //          ,"S4HANA Extension","BRF", "SimpleLogistics","SimpleFinance"], message: 'Course Name is not allowed'
    // });
    //anubhav push from atom
    ///Parse microsoft ISO Date while read : /Date(1540319400000)/
    //jsonDate = "/Date(1540319400000)/"; var date = new Date(parseInt(jsonDate.substr(6)));
    // Inquiry.observe("before save",function(ctx, next){
    //   var app = require('../../server/server');
    //   var AppUser = app.models.AppUser;
    //   var CourseMst = app.models.CourseMst;
    //   //console.log("Context kya hai" + ctx.instance.EmailId  + "   " +   ctx.instance.CourseName);
    //   if(ctx.instance && ctx.instance.EmailId  && ctx.instance.CourseName){
    //
    //     Inquiry.findOne({where: {and: [{EmailId: ctx.instance.EmailId}, {CourseName: ctx.instance.CourseName}]}, limit: 1})
    //       .then(function (inq) {
    //         console.log(ctx.instance.EmailId  + ctx.instance.CourseName );
    //         if (inq) {
    //           //console.log(JSON.stringify(inq));
    //           AppUser.findOne({
    //     					where: {
    //     						and: [{
    //     							TechnicalId: ctx.instance.CreatedBy.toString()
    //     						}]
    //     					},
    //     					limit: 1
    //     				}).then(function(appUser){
    //               if(inq.SoftDelete){
    //               	var err = new Error(".Student already took this course, Singed up on "+ inq.ChangedOn + ' Created by : ' + inq.ChangedBy);
    //               }else{
    //                 ///known limitation: if a student already taken course w/o inquiry the message will be this
    //                 //good practice such student create an inquiry first then create course
    //             	  var err = new Error(".Inquiry already exist, Inquired on " + inq.CreatedOn + ' From Country  : ' +  inq.Country + ' & Created by : ' +  inq.CreatedBy);
    //               }
    //               err.statusCode = 400;
    //               console.log(err);
    //               next(err);
    //             });
    //         }
    //         else {
    //           //do nothing
    //           return next();
    //         }});
    //   }
    //   else{
    //     next();
    //   }
    // });


};
