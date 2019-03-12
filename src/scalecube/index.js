parcelRequire = (function(e, r, n, t) {
  var i = 'function' == typeof parcelRequire && parcelRequire,
    o = 'function' == typeof require && require;
  function u(n, t) {
    if (!r[n]) {
      if (!e[n]) {
        var f = 'function' == typeof parcelRequire && parcelRequire;
        if (!t && f) return f(n, !0);
        if (i) return i(n, !0);
        if (o && 'string' == typeof n) return o(n);
        var c = new Error("Cannot find module '" + n + "'");
        throw ((c.code = 'MODULE_NOT_FOUND'), c);
      }
      (p.resolve = function(r) {
        return e[n][1][r] || r;
      }),
        (p.cache = {});
      var l = (r[n] = new u.Module(n));
      e[n][0].call(l.exports, p, l, l.exports, this);
    }
    return r[n].exports;
    function p(e) {
      return u(p.resolve(e));
    }
  }
  (u.isParcelRequire = !0),
    (u.Module = function(e) {
      (this.id = e), (this.bundle = u), (this.exports = {});
    }),
    (u.modules = e),
    (u.cache = r),
    (u.parent = i),
    (u.register = function(r, n) {
      e[r] = [
        function(e, r) {
          r.exports = n;
        },
        {},
      ];
    });
  for (var f = 0; f < n.length; f++) u(n[f]);
  if (n.length) {
    var c = u(n[n.length - 1]);
    'object' == typeof exports && 'undefined' != typeof module
      ? (module.exports = c)
      : 'function' == typeof define && define.amd
      ? define(function() {
          return c;
        })
      : t && (this[t] = c);
  }
  return u;
})(
  {
    '5s/S': [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }), (exports.generateProxy = void 0);
        var e = require('rxjs'),
          t = function(t, r, n) {
            return e.Observable.create(function(e) {
              var o = function() {
                t(r).subscribe(
                  function(t) {
                    return e.next(t);
                  },
                  function(t) {
                    return t.message === n ? setTimeout(o, 10) : e.error(t);
                  },
                  function() {
                    return e.complete();
                  }
                );
              };
              o();
            });
          },
          r = function(e, t, r) {
            return new Promise(function(n, o) {
              var u = function() {
                e(t)
                  .then(function(e) {
                    return n(e);
                  })
                  .catch(function(e) {
                    return e.message === r ? setTimeout(u, 10) : o(e);
                  });
              };
              u();
            });
          },
          n = function(e, n) {
            return Object.keys(n.meta.methods).reduce(function(o, u) {
              var c = e
                  .proxy()
                  .api(n)
                  .create()[u],
                i = 'Service not found error: ' + n.meta.name + '.' + u;
              return (
                'Observable' === n.meta.methods[u].type &&
                  (o[u] = function(e) {
                    return t(c, e, i);
                  }),
                'Promise' === n.meta.methods[u].type &&
                  (o[u] = function(e) {
                    return r(c, e, i);
                  }),
                o
              );
            }, {});
          };
        exports.generateProxy = n;
      },
      {},
    ],
    '2X4v': [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }), (exports.namespace = void 0);
        var e = document.currentScript && document.currentScript.src && document.currentScript.src.split('?')[1],
          r = 'scInst' + e || '';
        exports.namespace = r;
      },
      {},
    ],
    '7QCb': [
      function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, '__esModule', { value: !0 }),
          Object.defineProperty(exports, 'generateProxy', {
            enumerable: !0,
            get: function() {
              return r.generateProxy;
            },
          }),
          (exports.scalecube = void 0);
        var e = require('@scalecube/scalecube-services/es/services'),
          r = require('./generateProxy'),
          i = require('./namespace'),
          n = (window[i.namespace] = window[i.namespace] || []),
          s = function(e, r) {
            for (var i in r.services)
              for (var n = 0; n < r.services[i].length; n += 1) if (r.services[i][n] === e) return !0;
            return !1;
          },
          t = function(e, r) {
            for (var i in r.serviceRegistery.services)
              for (var n = r.serviceRegistery.services[i], t = 0; t < n.length; t += 1) {
                var c = n[t];
                s(c, e.serviceRegistery) || e.serviceRegistery.register(c);
              }
          },
          c = function() {
            for (var e = n[n.length - 1], r = 0; r < n.length - 1; r += 1) {
              var i = n[r];
              t(i, e), t(e, i);
            }
          },
          u = function() {
            var r = e.Microservices.builder();
            return new Proxy(r, {
              get: function(e, r) {
                if ('build' === r) {
                  var i = e.build();
                  return (
                    n.push(i),
                    c(),
                    function() {
                      return i;
                    }
                  );
                }
                return e[r];
              },
            });
          },
          o = {
            builder: function() {
              return u();
            },
          };
        exports.scalecube = o;
      },
      { './generateProxy': '5s/S', './namespace': '2X4v' },
    ],
  },
  {},
  ['7QCb'],
  null
);
