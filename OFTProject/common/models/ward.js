'use strict';

module.exports = function(Ward) {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var app = require('../../server/server');

    Ward.observe("before save", function (ctx,next) {
      console.log(ctx.instance);
      //Ward.count();
      //count++
      //ctx.instance.rollNo = counter
      next();
    });
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
