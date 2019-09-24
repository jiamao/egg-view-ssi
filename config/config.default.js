const path = require('path');

  module.exports = appInfo => {
    return {
      /**
       * @member Config#ssi
       */
      ssi: {
        root: path.join(appInfo.baseDir, 'app/view'),
        cache: true,
        debug: false
      },
    };
  };