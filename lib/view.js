'use strict';

const fs = require('fs');
const ssi = require('jm-ssi');

module.exports = class JmtemplateView {

  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
    this.config = ctx.app.config.ssi;
    this.env = this.getSSIEnv(); // 环境变量 给ssi使用
  }

  async render(filename, locals, viewOptions) {    
    if(!fs.existsSync(filename)) {
      this.body = `${filename} is not exists`;
      this.status = 404;
      return Promise.reject(this.body);
    }
    const config = Object.assign({}, this.config, viewOptions, { cache: null });
    return ssi.parse(filename, {
      root: config.root,
      file: filename,
      data: Object.assign({}, this.env, locals)
    }).then((result) => {
      callback && callback(null, result);
    });
  }

  renderString(tpl, locals, viewOptions) {
    // should disable cache when no filename
    const config = Object.assign({}, this.config, viewOptions, { cache: null });
    try {
      ssi.run(tpl, {
        root: config.root,
        data: Object.assign({}, this.env, locals)
      }).then((result) => {
        callback && callback(null, result);
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }
   // 获取ssi执行常量
  getSSIEnv() {
    const env = {};
    env['HTTP_USER_AGENT'] = this.ctx.request.headers['user-agent'] || '';
    env['REMOTE_ADDR'] = this.ctx.ip;
    env['REMOTE_PORT'] = this.ctx.port;
    env['HTTP_HOST'] = this.ctx.request.hostname;
    env['HTTP_COOKIE'] = this.ctx.req.headers['cookie'] || '';
    env['QUERY_STRING_UNESCAPED'] = this.ctx.req.href;
    env['QUERY_STRING'] = this.ctx.req.querystring;
    env['DOCUMENT_ROOT'] = this.config.root || '';
    env['SERVER_SOFTWARE'] = 'Nginx';
    //<!--#config timefmt="%Y%m%d%H%M%S" --><!--#echo var="DATE_LOCAL"-->
    env['DATE_LOCAL'] = this.formatDate(new Date(), '%Y%MM%dd%hh%mm%ss');
    return env;
  }

  /**
     * 格式化日期为指定的格式
     *
     * @method formatDate
     * @param {Date} date
     * @param {String} format 输出格式, %Y/%M/%d/%h/%m/%s的组合 增加%MM %dd %hh %mm %ss 取二位的方式，可以自由组件 @fefeding
     * @param {Boolean} [isFill:false] 不足两位是否补0
     * @return {String}
     */
   formatDate(srcDate, format, isFill) {
      if(!srcDate) return '';
      var Y = srcDate.getFullYear(),
          M = srcDate.getMonth() + 1,
          d = srcDate.getDate(),
          h = srcDate.getHours(),
          m = srcDate.getMinutes(),
          s = srcDate.getSeconds();

      var MM  = (M < 10) ? ('0' + M) : M,
          dd = (d < 10) ? ('0' + d) : d,
          hh = (h < 10) ? ('0' + h) : h,
          mm = (m < 10) ? ('0' + m) : m,
          ss = (s < 10) ? ('0' + s) : s;
      if (isFill) {
          M = MM;
          d = dd;
          h = hh;
          m = mm;
          s = ss;
      }
      format = format || '%Y-%M-%d %h:%m:%s';

      var destDate = format.replace(/%Y/g, Y).replace(/%MM/g, MM).replace(/%dd/g, dd).replace(/%hh/g, hh).replace(/%mm/g, mm).replace(/%ss/g, ss);
      destDate = destDate.replace(/%M/g, M).replace(/%d/g, d).replace(/%h/g, h).replace(/%m/g, m).replace(/%s/g, s);
      return destDate;
  }
};