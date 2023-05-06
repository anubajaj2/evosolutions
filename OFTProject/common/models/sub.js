'use strict';
module.exports = function(Sub) {
	//validations
	Sub.validatesPresenceOf('StudentId', {
		message: 'Customer ID cannot be blank'
	});
	Sub.validatesPresenceOf('CourseId', {
		message: 'Batch cannot be blank'
	});
	Sub.validatesPresenceOf('PaymentDate', {
		message: 'PaymentDate cannot be blank'
	});
	Sub.observe("before save", function(ctx, next) {
		// console.log("Context kya hai" + ctx.instance.EmailId  + "   " +  ctx.instance.CourseName);
		if (ctx.instance && ctx.instance.StudentId && ctx.instance.CourseId) {
			Sub.findOne({
					where: {
						and: [{
							StudentId: ctx.instance.StudentId
						}, {
							CourseId: ctx.instance.CourseId
						}]
					},
					limit: 1
				})
				.then(function(subs) {
					//console.log(ctx.instance.EmailId  + ctx.instance.CourseName );
					if (subs) {
						if ((ctx.instance.PendingAmount === 0) || (!ctx.instance.PendingAmount)) {
							ctx.instance.PartialPayment = false; //payment completed
						} else {
							ctx.instance.PartialPayment = true;
						}
						if (ctx.instance.UpdatePayment === false) {
							//console.log(JSON.stringify(subs));
							var err = new Error(".Subscription already exist, Added on " + subs.CreatedOn.toString() + ' Created by : ' + subs.CreatedBy.toString());
							err.statusCode = 400;
							//console.log(err.toString());
							next(err);
						} else {
							//do nothing
							return next();
						}
					} else {
						//do nothing
						return next();
					}
				});
		} else {
			next();
		}
	});

};
