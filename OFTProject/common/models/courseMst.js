'use strict';

module.exports = function(Course) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //validations
    CourseMst.validatesPresenceOf('CourseName', {message: 'Course Name Cannot be blank'});
    CourseMst.validatesPresenceOf('CourseFee', {message: 'CourseFee Cannot be blank'});
};
