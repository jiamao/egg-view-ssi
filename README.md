# egg-view-ssi

egg view plugin for [jm-ssi].

## Install

```bash
$ npm i egg-view-ssi --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.ssi = {
  enable: true,
  package: 'egg-view-ssi',
  // root: path.join(appInfo.baseDir, 'app/view')
};

// {app_root}/config/config.default.js
exports.view = {
  mapping: {
    '.shtml': 'ssi',
  },
};
```


#### SSI变量
这里模拟的是nginx环境，支持以下变量：
```js
env['HTTP_USER_AGENT'] = this.ctx.request.headers['user-agent'] || '';
env['REMOTE_ADDR'] = this.ctx.ip;
env['REMOTE_PORT'] = this.ctx.port;
env['HTTP_HOST'] = this.ctx.request.hostname;
env['HTTP_COOKIE'] = this.ctx.req.headers['cookie'] || '';
env['QUERY_STRING_UNESCAPED'] = this.ctx.req.href;
env['QUERY_STRING'] = this.ctx.req.querystring;
env['DOCUMENT_ROOT'] = this.config.root || '';
env['SERVER_SOFTWARE'] = 'Nginx';
env['DATE_LOCAL'] = this.formatDate(new Date(), '%Y%MM%dd%hh%mm%ss');
```
## License

[MIT](LICENSE)

[jm-ssi]: https://github.com/jiamao/jm-ssi
