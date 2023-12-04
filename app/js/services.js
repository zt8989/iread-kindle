var ireadServices = angular.module('ireadServices', []);
ireadServices.factory("storage", ["$http", '$location', '$q', function storage($http, $location, $q) {
  var search = $location.search();
  var server = {
    getBook: function getBook() {
      return $http.get("/dict/readingRecent").then(function (res) {
        if (res.data.value) {
          return JSON.parse(res.data.value);
        } else {
          throw new Error("没有书本数据");
        }
      });
    },
    saveBook: function saveBook(book) {
      return $http.patch("/dict", {
        key: "readingRecent",
        value: JSON.stringify(book)
      });
    },
    getBookApiUrl: function getBookApiUrl() {
      return $http.get("/dict/bookApiUrl").then(function (res) {
        var url = res.data.value;
        if (url && "http" === url.slice(0, 4)) {
          this.bookApiUrl = url;
          return url;
        } else {
          throw new Error("错误的地址");
        }
      });
    },
    saveBookApiUrl: function saveBookApiUrl(url) {
      return $http.patch("/dict", {
        key: "bookApiUrl",
        value: url
      });
    }
  };
  var local = {
    getBook: function getBook() {
      return $q(function (resolve) {
        resolve(JSON.parse(localStorage.getItem("readingRecent")));
      });
    },
    saveBook: function saveBook(book) {
      return $q(function (resolve) {
        localStorage.setItem("readingRecent", JSON.stringify(book));
        resolve();
      });
    },
    getBookApiUrl: function getBookApiUrl() {
      return $q(function (resolve, reject) {
        var url = localStorage.getItem("bookApiUrl");
        if (url && "http" === url.slice(0, 4)) {
          resolve(url);
        } else {
          reject("错误的地址");
        }
      });
    },
    saveBookApiUrl: function saveBookApiUrl(url) {
      return $q(function (resolve, reject) {
        localStorage.setItem("bookApiUrl", url);
        resolve();
      });
    }
  };
  if (search && search["storage"] === "server") {
    return server;
  } else {
    return local;
  }
}]);