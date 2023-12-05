function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var ireadServices = angular.module('ireadServices', []);
ireadServices.factory("storage", ["$http", '$location', '$q', function storage($http, $location, $q) {
  var search = $location.search();
  var server = {
    getJson: function getJson(key, defaultValue) {
      return $http.get("/dict/".concat(key)).then(function (res) {
        if (res.data.value) {
          return JSON.parse(res.data.value);
        } else {
          return defaultValue;
        }
      });
    },
    saveJson: function saveJson(key, value) {
      return $http.patch("/dict", {
        key: key,
        value: JSON.stringify(value)
      });
    },
    getString: function getString(key) {
      return $http.get("/dict/".concat(key)).then(function (res) {
        return res.data.value;
      });
    },
    saveString: function saveString(key, value) {
      return $http.patch("/dict", {
        key: key,
        value: value
      });
    }
  };
  var local = {
    getJson: function getJson(key, defaultValue) {
      return $q(function (resolve, reject) {
        try {
          var json = localStorage.getItem(key);
          if (json) {
            resolve(JSON.parse(json));
          } else {
            resolve(defaultValue);
          }
        } catch (e) {
          reject(e);
        }
      });
    },
    saveJson: function saveJson(key, value) {
      return $q(function (resolve) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    },
    getString: function getString(key) {
      return $q(function (resolve, reject) {
        try {
          resolve(localStorage.getItem(key));
        } catch (e) {
          reject(e);
        }
      });
    },
    saveString: function saveString(key, value) {
      return $q(function (resolve, reject) {
        try {
          resolve(localStorage.setItem(key, value));
        } catch (e) {
          reject(e);
        }
      });
    }
  };
  var extend = {
    config: null,
    getBook: function getBook() {
      return this.getJson("readingRecent", {});
    },
    saveBook: function saveBook(book) {
      return this.saveJson("readingRecent", book);
    },
    getReadConfig: function getReadConfig() {
      var _this = this;
      return $q(function (resolve, reject) {
        if (_this.config) {
          resolve(_this.config);
        } else {
          return _this.getJson("readConfig", {
            fontLevel: 3
          }).then(function (config) {
            _this.config = config;
            resolve(config);
          }, reject);
        }
      });
    },
    saveReadConfig: function saveReadConfig(config) {
      this.config = config;
      return this.saveJson("readConfig", config);
    },
    getBookApiUrl: function getBookApiUrl() {
      return this.getString("bookApiUrl").then(function (url) {
        if (url && "http" === url.slice(0, 4)) {
          return url;
        } else {
          throw new Error("错误的地址");
        }
      });
    },
    saveBookApiUrl: function saveBookApiUrl(url) {
      return this.saveString("bookApiUrl", url);
    }
  };
  if (search && search["storage"] === "server") {
    return _objectSpread(_objectSpread({}, server), extend);
  } else {
    return _objectSpread(_objectSpread({}, local), extend);
  }
}]);
ireadServices.constant("fonts", [{
  key: "STHeiti",
  title: "黑体",
  css: "font-family: STHeiti, san-serif;"
}, {
  key: "STSong",
  title: "宋体",
  css: "font-family: STSong, serif;"
}, {
  key: "STKai",
  title: "楷体",
  css: "font-family: STKai, serif;"
}, {
  key: "STYuan",
  title: "圆体",
  css: "font-family: STYuan, san-serif;"
}]);