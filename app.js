'use strict';

module.exports = app => {
  app.view.use('ssi', require('./lib/view'));
};