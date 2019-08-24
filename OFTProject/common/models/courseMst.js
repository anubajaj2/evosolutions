'use strict';

module.exports = function(CourseMst) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //validations
    CourseMst.validatesPresenceOf('CourseName', {message: 'Course Name Cannot be blank'});
    CourseMst.validatesPresenceOf('CourseFee', {message: 'CourseFee Cannot be blank'});
//     CourseMst.observe("before save",function(ctx,next){
//       if(ctx.instance && ctx.instance.CourseName){
//         CourseMst.findOne({where:{and:[{CourseName:ctx.instance.CourseName}]},limit:1})
//         .then(function(stu){
//           console.log(JSON.stringify(stu));
//           var err = new Error(".Course already exist");
//           err.statusCode = 400;
//           next(err)
//         }
//         else {
//           return next();
//
//       }});
// }
// else{
//   next();
//       }
//     });
};
