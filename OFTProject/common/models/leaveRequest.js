'use strict';
module.exports = function(LeaveRequest) {
LeaveRequest.validatesPresenceOf('AppUserId', {message: 'Requester Cannot be blank'});

LeaveRequest.observe("before save",function(ctx, next){
  next();
});
// LeaveRequest.observe("before save",function(ctx, next){
//       if(ctx.instance && ctx.instance.DateFrom){
//
//         LeaveRequest.findOne({where: {and: [{DateFrom: ctx.instance.DateFrom},{DateTo: ctx.instance.DateTo}]}, limit: 1})
//           .then(function (lrqst) {
//             console.log(ctx.instance.DateFrom );
//             if (lrqst) {
//               console.log(JSON.stringify(lrqst));
//               var err = new Error(".Leave already exist, Added on "+ lrqst.DateFrom.toString());
//               err.statusCode = 400;
//               //console.log(err.toString());
//               next(err);
//             }
//             else {
//               //do nothing
// //            Chk for next condition
//                 LeaveRequest.find({where: {DateFrom: {between:[ctx.instance.DateFrom,ctx.instance.DateTo]}}, limit: 1})
//                   .then(function(lrqst){
//                     console.log(ctx.instance.DateFrom );
//                     if (lrqst) {
//                       console.log(JSON.stringify(lrqst));
//                       var err = new Error(".Hi Bhai, Added on "+ lrqst.DateFrom.toString());
//                       err.statusCode = 400;
//                       //console.log(err.toString());
//                       next(err);
//                     }
//                     else {
//                       return next();
//                     }
//                   })  ;
//
//
//
//             }});
//       }
//       else{
//         next();
//       }
//     });

};
