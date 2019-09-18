'use strict';

module.exports = function(TraierPayment) {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var app = require('../../server/server');
    // var CourseMst = app.models.CourseMst;
    //validations

    // Inquiry.validatesInclusionOf('CourseName', {
    //     in: ["UI5 and Fiori", "ABAP on HANA", "Launchpad", "HANA XS",  "Hybris C4C",
    //          ,"HANA Cloud Integration (HCI)","SAP Cloud Platform","ABAP", "OOPS ABAP", "Webdynpro", "Workflow", "FPM", "Other"
    //          ,"S4HANA Extension","BRF", "SimpleLogistics","SimpleFinance"], message: 'Course Name is not allowed'
    // });
    //anubhav push from atom
    ///Parse microsoft ISO Date while read : /Date(1540319400000)/
    //jsonDate = "/Date(1540319400000)/"; var date = new Date(parseInt(jsonDate.substr(6)));
    TraierPayment.observe("before save",function(ctx, next){

    });


};
