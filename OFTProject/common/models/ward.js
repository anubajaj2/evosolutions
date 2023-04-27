'use strict';

module.exports = function(Ward) {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var app = require('../../server/server');

    Ward.observe("before save", function (ctx,next) {
      if(ctx.instance){
        Ward.count(function(err, count) {
          if (err) {
            // handle error
          }else{
            if(!ctx.instance.RollNo){
              ctx.instance.RollNo = (count+1);
            }
          }
          next();
        });
      }else{
        next();
      }
    });

};
