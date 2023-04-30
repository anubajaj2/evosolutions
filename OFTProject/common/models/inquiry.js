'use strict';

module.exports = function(Inquiry) {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var app = require('../../server/server');
    //validations
    Inquiry.validatesPresenceOf('FatherName', {message: 'FatherName Cannot be blank'});
    Inquiry.validatesLengthOf('Phone', {is: 10, message: {is: 'The Contact No. Must be exactly 10 digits'}});
    // Inquiry.validatesLengthOf('EmergencyContactNo', {is: 10, message: {is: 'The Contact No. Must be exactly 10 digits'}});
    Inquiry.validatesFormatOf('EmailId', {
    with: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    message: 'Please enter a valid email address'
    });
    Inquiry.observe('before save', function validateDuplicates(ctx, next) {
      const instance = ctx.instance || ctx.currentInstance;
      if (instance) {
        Inquiry.find({ where: { Phone: instance.Phone }}, function (err, models) {
          if (err) {
            return next(err);
          }
          if (models.length > 0 && models[0].id.toString() !== (instance.id ? instance.id.toString() : instance.id)) {
            const error = new Error('Instance with same Number already exists');
            error.statusCode = 422;
            next(error);
          } else {
            next();
          }
        });
      } else {
        next();
      }
    });

};
