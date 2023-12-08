(() => {
  // app-src/js/common/global.35483d.js
  function getLS() {
    var e = window.localStorage;
    return e || null;
  }
  window.k_utils = { addClass: function(e, t) {
    var o;
    e && t && (o = e.className, t && -1 === o.indexOf(t) && (e.className ? e.className = e.className + " " + t : e.className = t));
  }, removeClass: function(e, t) {
    var o;
    e && t && (-1 < (t = (o = e.className.split(" ")).indexOf(t)) && o.splice(t, 1), e.className = o.join(" "));
  }, removeClasses: function(e, t) {
    if (t && !(t.length <= 0))
      for (var o = 0; o < t.length; o++) {
        var n = t[o];
        this.removeClass(e, n);
      }
  }, startsWith: function(e, t) {
    return !(!e || e.length <= 0) && (!(!t || t.length <= 0) && e.substr(0, t.length) === t);
  }, endsWith: function(e, t) {
    return !(!e || e.length <= 0) && (!(!t || t.length <= 0) && e.substr(e.length - t.length, t.length) === t);
  }, isObjectEmpty: function(e) {
    return !e || "{}" === JSON.stringify(e);
  } };
  var targetRatio = 300;
  function resetViewport() {
    var e = window.screen.width, t = window.screen.height;
    1e3 < e || 1e3 < t ? window.cookie_utils && (document.body.style.zoom = 1, window.cookie_utils.set("wr_scaleRatio", 1)) : (t = document.getElementById("wr_size_detect").getBoundingClientRect()) && (t = e / t.width, targetRatio === t || (t = t / targetRatio) && 1.1 < t && (document.body.style.zoom = t, window.cookie_utils && window.cookie_utils.set("wr_scaleRatio", t)));
  }
  function request(e, t, o, n, r) {
    e = e.toLowerCase();
    var i = new XMLHttpRequest();
    i.onreadystatechange = function() {
      var e2, t2;
      4 === i.readyState && (t2 = "string" == typeof (e2 = i.responseText) && "{" === e2.charAt(0), 200 <= i.status && i.status < 300 || 304 === i.status ? n && n(t2 ? JSON.parse(e2) : e2) : r && r({ status: i.status, response: t2 ? JSON.parse(e2) : e2 }));
    };
    var s = o.data, o = o.body, a = [];
    if (s)
      for (var l in s)
        a.push(encodeURIComponent(l) + "=" + encodeURIComponent(s[l]));
    a.push("platform=desktop"), t = t + "?" + (a = a.join("&")), "get" === e ? (i.open(e, t, true), i.send()) : "post" === e ? (i.open(e, t, true), i.setRequestHeader("Content-Type", "application/json;charset=UTF-8"), i.send(JSON.stringify(o))) : console.log("not support method");
  }
  function reportKv(e) {
    var t, o = 0, n = "";
    window.__NUXT__ && window.__NUXT__.state && ((t = window.__NUXT__.state).basePath && (n = t.basePath), t.user && t.user.vid && (o = t.user.vid));
    e = { vid: o || 0, itemNames: e };
    console.log(n), request("POST", n + "/api/kvlog", { body: e }, function() {
    }, function(e2) {
    });
  }
  function requestClientLog(e) {
    var t, o, n;
    window.__NUXT__ && window.__NUXT__.state && ((n = window.__NUXT__.state) && ("string" != typeof (o = n.basePath) || (t = o + "/api") && e && "string" == typeof e.msg && 0 !== e.msg.length && (o = n.release, n = n.user, window.k_common.request("POST", t + "/clog", { body: { msg: e.msg, sentry: e.sentry || 0, error: e.error, monitor: e.monitor || {}, release: o, user: n } }, function() {
    }, function() {
    }))));
  }
  function safeCaller(t, e, o) {
    if ("function" != typeof e)
      throw new Error("typeof fn is " + typeof e + ", not function");
    return function() {
      try {
        return e.apply(this, arguments);
      } catch (e2) {
        requestClientLog({ msg: "Error(" + t + "_" + o + "): " + e2, sentry: 1, error: { name: e2.name, message: e2.message, stack: e2.stack, module: t }, monitor: { action: "safeCallerError_" + t + "_" + o } });
      }
    };
  }
  function initLogOnDom() {
    var e, t, o, n, r, i, s, a, l;
    window.__NUXT__ && window.__NUXT__.state && (!(n = window.__NUXT__.state) || (e = n.user) && (t = n.basePath || "", o = n.env, n = ["10678", "18898389", "307433796", "273962062"], "/wrwebsimplenjlogic-test" !== t && "/wrwebsimplenjlogic-dev" !== t || n.push("10680"), -1 !== n.indexOf("" + e.vid) && "production" === o && (r = document.getElementById("wr_log")) && (r.style.display = "block", r.onclick = function() {
      r.style.display = "none";
    }, window.logOnDom = function(e2) {
      var t2 = document.createElement("div");
      t2.innerHTML = e2, r.appendChild(t2);
    }, i = document.getElementById("wr_debugger"), s = "\u62A5\u9519", a = function() {
      window.k_common.safeCaller("Debugger", function() {
        throw new TypeError("fake error");
      }, "debugger_Fake_Error")();
    }, (l = document.createElement("div")).className = "wr_debugger_btn", l.innerHTML = s, l.addEventListener("click", function(e2) {
      e2.stopPropagation(), a(e2);
    }), i.appendChild(l), console.log = function() {
      for (var e2 = "", t2 = 0; t2 < arguments.length; t2++) {
        var o2 = arguments[t2];
        "string" == typeof o2 && -1 !== o2.indexOf("[HMR]") || "string" == typeof o2 && -1 !== o2.indexOf("zhoonlog") || (e2 += "object" == typeof o2 ? (JSON && JSON.stringify ? JSON.stringify(o2) : o2) + "<br/>" : o2 + "<br/>");
      }
      window.logOnDom && window.logOnDom("<p>" + e2 + "</p>");
    }, console.log("\u5F53\u524D\u7528\u6237\uFF1A" + JSON.stringify(e)))));
  }
  window.k_localStorage = { setLocalStorage: function(e, t) {
    var o = getLS();
    o && (o.removeItem(e), t && o.setItem(e, JSON.stringify(t)));
  }, getLocalStorage: function(e) {
    var t = getLS();
    if (t) {
      e = t.getItem(e);
      if (!window.k_utils.isObjectEmpty(e))
        return JSON.parse(e);
    }
    return null;
  }, removeLocalStorage: function(e) {
    var t = getLS();
    t && t.removeItem(e);
  } }, window.k_common = { request, reportKv, requestClientLog, safeCaller }, onerror = function(e, t, o, n, r) {
    var i = "Error(Global): ";
    if ("string" == typeof e)
      i += e;
    else if ("object" == typeof e)
      if (e.toString && "[object Event]" === e.toString()) {
        for (var s in i += e + "{", e) {
          var a, l = e[s];
          "function" != typeof l && (a = l + "", "object" == typeof l && l.toString && "[object HTMLScriptElement]" === l.toString() && (a += "{", l.getAttribute && l.getAttribute("src") && (a += "src=" + l.getAttribute("src")), l.innerHTML && (a += "inner=" + l.innerHTML.substr(0, Math.min(20, l.innerHTML.length))), a += "}"), i += s + ":" + a + ",");
        }
        i += "}";
      } else
        i += e;
    i += ", Location: " + window.location.href, window.logOnDom && window.logOnDom("<p>" + i + "</p>"), requestClientLog({ msg: i, sentry: 1, error: r ? { name: r.name, message: r.message, stack: r.stack, module: "global" } : void 0, monitor: { action: "globalUnhandledError_client" } });
  }, window.onload = function() {
    initLogOnDom();
    try {
      resetViewport();
    } catch (e2) {
      console.log(e2);
    }
    if (window.onloadLogics)
      for (var e = 0; e < window.onloadLogics.length; e++)
        window.onloadLogics[e]();
  };

  // app-src/js/common/cookie.0e551c.js
  var cookieConfig = { path: "/", httpOnly: true };
  function getDateFromNowOn(e) {
    var o = /* @__PURE__ */ new Date();
    return o.setTime(o.getTime() + e), o;
  }
  function setCookie(e, o, t) {
    t = { domain: t && t.domain || cookieConfig.domain, path: t && t.path || cookieConfig.path, expires: t && t.expires || getDateFromNowOn(31104e6), secure: t && t.secure }, o = encodeURIComponent(o), e = encodeURIComponent(e), document.cookie = [e, "=", o, t.expires && "; expires=" + t.expires.toUTCString(), t.path && "; path=" + t.path, t.domain && "; domain=" + t.domain, t.secure ? "; secure" : ""].join("");
  }
  function getCookie(e) {
    for (var o = document && document.cookie ? document.cookie.split("; ") : [], t = e ? void 0 : {}, n = 0, i = o.length; n < i; n++)
      try {
        var r = (a = o[n]).split("="), c = decodeURIComponent(r.shift()), a = r.join("=");
        if (a = decodeURIComponent(a), e === c) {
          t = a;
          break;
        }
        e || (t[c] = a);
      } catch (e2) {
        console.log(e2);
      }
    return t;
  }
  function parseCookie(o) {
    var t = "";
    return Object.keys(o).forEach(function(e) {
      t += e + "=" + o[e] + ";";
    }), t;
  }
  window.cookie_utils = { get: getCookie, set: setCookie, parse: parseCookie, expiresIn: getDateFromNowOn };

  // app-src/js/common/services.js
  var commonServices = angular.module("commonServices", []);
  commonServices.factory("storage", [
    "$http",
    "$location",
    "$q",
    function storage($http, $location, $q) {
      const search = $location.search();
      const server = {
        getJson(key, defaultValue) {
          return $http.get(`/dict/${key}`).then(function(res) {
            if (res.data.value) {
              return JSON.parse(res.data.value);
            } else {
              return defaultValue;
            }
          });
        },
        saveJson(key, value) {
          return $http.patch("/dict", {
            key,
            value: JSON.stringify(value)
          });
        },
        getString(key) {
          return $http.get(`/dict/${key}`).then(function(res) {
            return res.data.value;
          });
        },
        saveString(key, value) {
          return $http.patch("/dict", {
            key,
            value
          });
        }
      };
      const local = {
        getJson(key, defaultValue) {
          return $q(function(resolve, reject2) {
            try {
              const json = localStorage.getItem(key);
              if (json) {
                resolve(JSON.parse(json));
              } else {
                resolve(defaultValue);
              }
            } catch (e) {
              reject2(e);
            }
          });
        },
        saveJson(key, value) {
          return $q(function(resolve) {
            try {
              localStorage.setItem(key, JSON.stringify(value));
              resolve();
            } catch (e) {
              reject(e);
            }
          });
        },
        getString(key) {
          return $q(function(resolve, reject2) {
            try {
              resolve(localStorage.getItem(key));
            } catch (e) {
              reject2(e);
            }
          });
        },
        saveString(key, value) {
          return $q(function(resolve, reject2) {
            try {
              resolve(localStorage.setItem(key, value));
            } catch (e) {
              reject2(e);
            }
          });
        }
      };
      const extend = {
        config: null,
        getBook() {
          return this.getJson("readingRecent", {});
        },
        saveBook(book) {
          return this.saveJson("readingRecent", book);
        },
        getReadConfig() {
          return $q((resolve, reject2) => {
            if (this.config) {
              resolve(this.config);
            } else {
              return this.getJson("readConfig", {
                fontLevel: 3
              }).then((config) => {
                this.config = config;
                resolve(config);
              }, reject2);
            }
          });
        },
        saveReadConfig(config) {
          this.config = config;
          return this.saveJson("readConfig", config);
        },
        getBookApiUrl() {
          return this.getString("bookApiUrl").then((url) => {
            if (url && "http" === url.slice(0, 4)) {
              return url;
            } else {
              throw new Error("\u9519\u8BEF\u7684\u5730\u5740");
            }
          });
        },
        saveBookApiUrl(url) {
          return this.saveString("bookApiUrl", url);
        }
      };
      if (search && search["storage"] === "server") {
        return {
          ...server,
          ...extend
        };
      } else {
        return {
          ...local,
          ...extend
        };
      }
    }
  ]);
  commonServices.constant("fonts", [
    { key: "STHeiti", title: "\u9ED1\u4F53", css: "font-family: STHeiti, san-serif;" },
    { key: "STSong", title: "\u5B8B\u4F53", css: "font-family: STSong, serif;" },
    { key: "STKai", title: "\u6977\u4F53", css: "font-family: STKai, serif;" },
    { key: "STYuan", title: "\u5706\u4F53", css: "font-family: STYuan, san-serif;" }
  ]);

  // app-src/js/bookDetail/controller.js
  function getZoom() {
    return parseFloat(window.getComputedStyle(document.body, null).zoom);
  }
  function installController(module) {
    module.controller(
      "BookDetailCtrl",
      [
        "$scope",
        "$http",
        "$location",
        "$document",
        "$timeout",
        "storage",
        "$q",
        "fonts",
        function BookDetailCtrl($scope, $http, $location, $document, $timeout, storage2, $q, fonts) {
          $scope.catalog = [];
          $scope.chapterIndex = 1;
          $scope.content = [];
          $scope.loading = true;
          $scope.renderTop = 0;
          $scope.config = {
            fontLevel: 3,
            fontFamily: fonts[0].key
          };
          $scope.bookItem = {};
          $scope.fonts = fonts;
          $scope.$watch("myfont", function(newValue, oldValue) {
            if (newValue) {
              $("#readerContent").attr("style", newValue.css);
              $scope.config.fontFamily = newValue.key;
              storage2.saveReadConfig($scope.config);
            }
          });
          $scope.myfont = fonts[0];
          let page = 1;
          var maxPageHeight = 1;
          $scope.catalogRenderTop = 0;
          var catalogPage = 1;
          var catalogMaxPageHeight = 1;
          var catalogOffset = 0;
          var baseUrl;
          $q.all([storage2.getBookApiUrl(), storage2.getBook(), storage2.getReadConfig()]).then(function(results) {
            baseUrl = results[0];
            $scope.bookItem = results[1];
            $scope.config = results[2];
            for (let i in fonts) {
              if (fonts[i].key === $scope.config.fontFamily) {
                $scope.myfont = fonts[i];
              }
            }
            init();
          }).catch(function(e) {
            console.log(e);
          });
          var zoom = getZoom() || 1;
          $scope.categoryModal = false;
          $scope.openCategoryModal = function() {
            var header = document.getElementById("readerCatalog_header");
            var list = document.getElementById("readerCatalog_list");
            var top = header.offsetTop + header.clientHeight;
            var current = list.children[$scope.bookItem.durChapterIndex];
            var offsetTop = current.offsetTop + current.offsetHeight - top;
            catalogPage = offsetTop > 0 ? Math.floor(offsetTop / catalogOffset) + 1 : 1;
            $scope.catalogRenderTop = -((catalogPage - 1) * catalogOffset);
            $scope.categoryModal = true;
          };
          $scope.closeCategoryModal = function(e) {
            e && e.stopPropagation();
            $scope.categoryModal = false;
          };
          $scope.fontSettingModal = false;
          $scope.openFontSettingModal = function(e) {
            e && e.stopPropagation();
            $scope.fontSettingModal = true;
          };
          $scope.closeFontSettingModal = function(e) {
            e && e.stopPropagation();
            $scope.fontSettingModal = false;
          };
          $scope.onFontChange = function(e) {
            e && e.stopPropagation();
            var rect = document.getElementById("readerFontSettingBar").getBoundingClientRect();
            var left = rect.left;
            var right = rect.right;
            var x = e.clientX / zoom;
            var p = (right - left) / 4;
            var level = 1;
            if (x >= left) {
              var div = (x - left) / p;
              level = 1 + Math.floor(div) + (div - Math.floor(div) > 0.5 ? 1 : 0);
            }
            $scope.config.fontLevel = level;
            storage2.saveReadConfig($scope.config);
          };
          $scope.toBook = () => {
            $location.path("/");
          };
          $scope.handleRenderPageClick = function(e) {
            var r = e.clientX / zoom;
            var a = e.target.offsetWidth;
            if (r < a / 3) {
              $scope.prevPage();
            } else {
              $scope.nextPage();
            }
          };
          var P, ke, ve;
          P = document.getElementById("readerToolBar"), ve = document.documentElement.clientHeight, ke = window.outerHeight;
          var readerCatalog_tool = document.getElementById("readerCatalog_tool");
          var style = "padding-bottom:" + 1.5 * Math.abs(ke - ve) + "px !important";
          P && (P.style.cssText = style);
          readerCatalog_tool && (readerCatalog_tool.style.cssText = style);
          $scope.nextPage = function(e) {
            if ($scope.loading)
              return;
            var nextOffset = page * (P.offsetTop - P.clientHeight);
            if (nextOffset > maxPageHeight)
              return nextChapter();
            page += 1;
            console.log("nextPage", page);
            $scope.renderTop = -1 * nextOffset;
            console.log("nextPage", $scope.renderTop);
          };
          $scope.prevPage = function(e) {
            if ($scope.loading)
              return;
            if (page === 1)
              return prevChapter();
            page -= 1;
            console.log("prevPage", page);
            $scope.renderTop = Math.min(0, -1 * (page - 1) * (P.offsetTop - P.clientHeight));
            console.log("prevPage", $scope.renderTop);
          };
          function getCatalog(bookUrl) {
            return $http.get(baseUrl + "/getChapterList?url=" + encodeURIComponent(bookUrl));
          }
          $scope.onCatalogPrevPage = function(e) {
            e && e.stopPropagation();
            if (catalogPage === 1)
              return;
            catalogPage -= 1;
            console.log("prevPage", catalogPage);
            $scope.catalogRenderTop = Math.min(0, -1 * (catalogPage - 1) * catalogOffset);
            console.log("renderTop", $scope.catalogRenderTop);
          };
          $scope.onCatalogNextPage = function(e) {
            e && e.stopPropagation();
            var nextOffset = catalogPage * catalogOffset;
            if (nextOffset > catalogMaxPageHeight)
              return;
            catalogPage += 1;
            console.log("nextPage", catalogPage);
            $scope.catalogRenderTop = -1 * nextOffset;
            console.log("renderTop", $scope.catalogRenderTop);
          };
          function setTitle() {
            document.title = $scope.bookItem.name + " | " + $scope.catalog[$scope.bookItem.durChapterIndex || 0].title;
          }
          function saveBookRemoteAndLocal(bookItem) {
            return storage2.saveBook(bookItem).then(function() {
              return $http.post(baseUrl + "/saveBookProgress", {
                ...bookItem,
                durChapterTime: (/* @__PURE__ */ new Date()).getTime(),
                durChapterTitle: $scope.catalog[bookItem.durChapterIndex || 0].title
              });
            });
          }
          function goChapter(durChapterIndex) {
            if ($scope.loading)
              return;
            $scope.loading = true;
            $scope.bookItem.durChapterIndex = durChapterIndex;
            getContent($scope.bookItem.durChapterIndex).then(function(res) {
              $scope.loading = false;
              $scope.renderTop = 0;
              page = 1;
              setTitle();
              return saveBookRemoteAndLocal($scope.bookItem);
            }).catch(function(e) {
              $scope.loading = false;
              console.log(e);
            });
          }
          function nextChapter() {
            if ($scope.loading)
              return;
            return goChapter($scope.bookItem.durChapterIndex + 1);
          }
          function prevChapter() {
            if ($scope.loading)
              return;
            if ($scope.bookItem.durChapterIndex === 1)
              return;
            $scope.loading = true;
            $scope.bookItem.durChapterIndex -= 1;
            getContent($scope.bookItem.durChapterIndex).then(function(res) {
              $scope.loading = false;
              setTitle();
              return saveBookRemoteAndLocal($scope.bookItem);
            });
          }
          function getContent(index) {
            var bookUrl = $scope.bookItem.bookUrl;
            return $http.get(baseUrl + "/getBookContent?url=" + encodeURIComponent(bookUrl) + "&index=" + index).then(function(res) {
              $scope.content = res.data.data.split(/\n+/);
              $timeout(function() {
                var container = document.getElementById("readerContentRenderContainer");
                maxPageHeight = container.lastElementChild.offsetTop + container.lastElementChild.offsetHeight;
                var header = document.getElementById("readerCatalog_header");
                var tool = document.getElementById("readerCatalog_tool");
                var list = document.getElementById("readerCatalog_list");
                var top = header.offsetTop + header.clientHeight;
                var bottom = tool.offsetTop;
                catalogOffset = bottom - top;
                catalogMaxPageHeight = list.lastElementChild.offsetTop + list.lastElementChild.offsetHeight - top;
              }, 0);
            });
          }
          $scope.onChapterClick = function(e, index) {
            e && e.stopPropagation();
            if (index !== $scope.bookItem.durChapterIndex) {
              goChapter(index);
            }
            $scope.closeCategoryModal();
          };
          function init() {
            getCatalog($scope.bookItem.bookUrl).then(function(res) {
              $scope.catalog = res.data.data;
              var index = $scope.bookItem.durChapterIndex || 0;
              getContent(index, true, $scope.bookItem.durChapterPos).then(function() {
                $scope.loading = false;
              });
              setTitle();
            }, function(err) {
              throw err;
            });
          }
        }
      ]
    );
  }

  // app-src/js/bookDetail/index.js
  var bookDetail = angular.module("bookDetail", ["commonServices"]);
  installController(bookDetail);

  // app-src/js/bookList/controller.js
  function installController2(module) {
    module.controller(
      "BookListCtrl",
      [
        "$scope",
        "$http",
        "$location",
        "$timeout",
        "storage",
        function BookListCtrl($scope, $http, $location, $timeout, storage2) {
          var baseUrl;
          storage2.getBookApiUrl().then(function(res) {
            baseUrl = res;
            getBookshelf();
          });
          let page = 1;
          let maxPage = 1;
          var P, ke, ve;
          P = document.getElementById("shelfToolBar"), ve = document.documentElement.clientHeight, ke = window.outerHeight;
          P && (P.style.cssText = "padding-bottom:" + 1.5 * Math.abs(ke - ve) + "px !important");
          $scope.nextPage = () => {
            if (page === maxPage)
              return;
            page += 1;
            $scope.renderTop = -1 * page * P.offsetTop;
          };
          $scope.prevPage = () => {
            if (page === 0)
              return;
            page -= 1;
            $scope.renderTop = Math.min(0, -1 * page * P.offsetTop);
          };
          $scope.setting = function() {
            var b = prompt("\u8BF7\u8F93\u5165\u9605\u8BFB\u7684url\u5730\u5740\uFF0C\u6BD4\u5982http://192.168.1.2:1122", baseUrl);
            if (b && "http" === b.slice(0, 4)) {
              baseUrl = b;
              storage2.saveBookApiUrl(baseUrl);
              getBookshelf();
            } else {
              alert("\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u5730\u5740");
            }
          };
          let shelf = [];
          function getBookshelf() {
            $http.get(baseUrl + "/getBookshelf").then(function(res) {
              $scope.shelfPage = shelf = res.data.data;
              $timeout(function() {
                var container = document.getElementById("shelfTable");
                maxPage = Math.floor((container.lastElementChild.offsetTop + container.lastElementChild.offsetHeight) / P.offsetTop);
              }, 0);
            }).catch(function(e) {
              console.log(e);
            });
          }
          $scope.getCover = (coverUrl) => {
            return /^data:/.test(coverUrl) ? coverUrl : baseUrl + "/cover?path=" + encodeURIComponent(coverUrl);
          };
          $scope.toDetail = function(book) {
            storage2.saveBook(book).then(function() {
              $location.path("/detail");
            });
          };
        }
      ]
    );
  }

  // app-src/js/bookList/index.js
  var bookList2 = angular.module("bookList", ["commonServices"]);
  installController2(bookList2);

  // app-src/js/app.js
  var targetRatio2 = 300;
  function resetViewport2() {
    var e = window.screen.width, t = window.screen.height;
    1e3 < e || 1e3 < t ? window.cookie_utils && (document.body.style.zoom = 1, window.cookie_utils.set("wr_scaleRatio", 1)) : (t = document.getElementById("wr_size_detect").getBoundingClientRect()) && (t = e / t.width, targetRatio2 === t || (t = t / targetRatio2) && 1.1 < t && (document.body.style.zoom = t, window.cookie_utils && window.cookie_utils.set("wr_scaleRatio", t)));
  }
  document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.style.fontSize = 12 * 0.75 + "pt";
    resetViewport2();
  });
  var ireadApp = angular.module("ireadApp", [
    "ngRoute",
    "bookDetail",
    "bookList"
  ]);
  ireadApp.config([
    "$routeProvider",
    function($routeProvider) {
      $routeProvider.when("/", {
        templateUrl: "partials/books.html",
        controller: "BookListCtrl"
      }).when("/detail", {
        templateUrl: "partials/detail.html",
        controller: "BookDetailCtrl"
      }).otherwise({
        redirectTo: "/"
      });
    }
  ]);
})();
