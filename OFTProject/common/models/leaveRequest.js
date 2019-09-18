'use strict';
module.exports = function(LeaveRequest) {
LeaveRequest.validatesPresenceOf('AppUserId', {message: 'Requester Cannot be blank'});

LeaveRequest.observe("before save",function(ctx, next){
      if(ctx.instance && ctx.instance.DateFrom){

        LeaveRequest.findOne({where: {and: [{DateFrom: ctx.instance.DateFrom},{DateTo: ctx.instance.DateTo}]}, limit: 1})
          .then(function (lrqst) {
            console.log(ctx.instance.DateFrom );
            if (lrqst) {
              console.log(JSON.stringify(lrqst));
              var err = new Error(".Leave already exist, Added on "+ lrqst.DateFrom.toString());
              err.statusCode = 400;
              //console.log(err.toString());
              next(err);
            }
            else {
              //do nothing
//            Chk for next condition
                LeaveRequest.find({where: {DateFrom: {between:[ctx.instance.DateFrom,ctx.instance.DateTo]}}, limit: 1})
                  .then(function(lrqst){
                    console.log(ctx.instance.DateFrom );
                    if (lrqst) {
                      console.log(JSON.stringify(lrqst));
                      var err = new Error(".Hi Bhai, Added on "+ lrqst.DateFrom.toString());
                      err.statusCode = 400;
                      //console.log(err.toString());
                      next(err);
                    }
                    else {
                      return next();
                    }
                  })  ;



            }});
      }
      else{
        next();
      }
    });



};
// 'use strict';
//
// module.exports = function(LeaveRequest) {
//     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     //validations
//     LeaveRequest.validatesPresenceOf('AppUserId', {message: 'Requester Cannot be blank'});
//     LeaveRequest.observe("before save",function(ctx,next){
//       if(ctx.instance && ctx.instance.DateFrom && ctx.instance.DateTo){
//
//           LeaveRequest.findOne({where:{ and:[
//           {
//             DateFrom:ctx.instance.DateFrom
//           },{
//             DateTo:ctx.instance.DateTo
//           }
//           ]
//         },limit:1})
//         .then(function(leaverequest){
//             console.log(ctx.instance.AppUserId);
//       if(leaverequest){
//           var err = new Error(".Leave for these dates already exists, Added on " +leaverequest.CreatedOn.toString());
//           err.statusCode = 400;
//           next(err);
//         }
//         else{
//           LeaveRequest.findOne({where:{and:[{AppUserId: ctx.instance.AppUserId},{DateFrom:{between:[ctx.instance.DateFrom,ctx.instance.DateTo]}}]}})
//           .then(function (lrqst){
//             if (lrqst) {
//               var err1 =new Error("Daal Di hi");
//               err1.statusCode = 400;
//               next(err);
//             }
//             else{
//               LeaveRequest.findOne({where:{and:[{AppUserId: ctx.instance.AppUserId},{DateTo:{between:[ctx.instance.DateFrom,ctx.instance.DateTo]}}]}})
//               .then(function (lrqst){
//                 if (lrqst) {
//                   var err2 = new Error("Yeh bhi hi");
//                   err2.statusCode = 400;
//                   next(err);
//                 }
//                 else{
//                   return next();
//                 }
//               });
//             }
//           });
//         }
//         });
//         }
//
//         else{
//           next();
//         }
//     });
// };
