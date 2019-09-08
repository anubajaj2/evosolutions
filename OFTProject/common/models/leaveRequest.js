'use strict';

module.exports = function(LeaveRequest) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //validations
    LeaveRequest.validatesPresenceOf('TechnicalId', {message: 'Requester Name Cannot be blank'});
};
