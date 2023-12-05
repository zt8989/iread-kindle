var ireadControllers = angular.module('ireadControllers', ['ireadServices']);

function getZoom() {
  return parseFloat(window.getComputedStyle(document.body, null).zoom)
}

ireadControllers.controller("BookListCtrl", [
  '$scope', '$http', '$location', '$timeout', 'storage',
  function BookListCtrl($scope, $http, $location, $timeout, storage) {
    var baseUrl; 
    storage.getBookApiUrl().then(function(res){
      baseUrl = res
      getBookshelf()
    });
    let page = 1
    let maxPage = 1

    var P, ke, ve;
    P = document.getElementById("shelfToolBar"),
    ve = document.documentElement.clientHeight,
    ke = window.outerHeight
    P && (P.style.cssText = "padding-bottom:" + 1.5 * Math.abs(ke - ve) + "px !important")

    $scope.nextPage = () => {
      if (page === maxPage) return
      page += 1
      $scope.renderTop = -1 * page *　(P.offsetTop)
    }

    $scope.prevPage = () => {
      if(page === 0) return
      page -= 1
      $scope.renderTop = Math.min(0, -1 * page * (P.offsetTop))
    }

    $scope.setting = function () {
      var b = prompt("请输入阅读的url地址，比如http://192.168.1.2:1122", baseUrl);
      if (b && "http" === b.slice(0, 4)) {
        baseUrl = b
        storage.saveBookApiUrl(baseUrl);
        getBookshelf();
      } else {
        alert("请输入正确的地址");
      }
    };


    let shelf = []

    function getBookshelf() {
      $http.get(baseUrl + "/getBookshelf").then(function (res) {
        $scope.shelfPage = shelf = res.data.data;
        $timeout(function () {
          var container = document.getElementById("shelfTable");
          maxPage = Math.floor((container.lastElementChild.offsetTop + container.lastElementChild.offsetHeight) / P.offsetTop);
        }, 0);
      }).catch(function(e){
        console.log(e)
      });
    }

    $scope.getCover = (coverUrl) => {
        return /^data:/.test(coverUrl)
          ? coverUrl
          : baseUrl +
            '/cover?path=' +
              encodeURIComponent(coverUrl);
    }

    $scope.toDetail = function (book) {
      storage.saveBook(book).then(function(){
        $location.path("/detail");
      })
    };
  }]
)

ireadControllers.controller("BookDetailCtrl", 
['$scope', '$http', '$location', '$document', '$timeout', 'storage', '$q',
function BookDetailCtrl($scope, $http, $location, $document, $timeout, storage, $q) {
  $scope.catalog = []
  $scope.chapterIndex = 1
  $scope.content = []
  $scope.loading = true
  $scope.renderTop = 0
  $scope.config = {
    fontLevel: 3
  }

  let page = 1
  var maxPage = 1;

  var baseUrl;
  var bookItem
  $q.all([storage.getBookApiUrl(), storage.getBook(), storage.getReadConfig()])
  .then(function(results){
    baseUrl = results[0]
    bookItem = results[1]
    $scope.config = results[2]
    init()
  })
  var zoom = getZoom() || 1

  // 目录
  $scope.categoryModal = false
  $scope.openCategoryModal = function (e) {
    e && e.stopPropagation()
    $scope.categoryModal = true;
  };
  $scope.closeCategoryModal = function (e) {
    e && e.stopPropagation()
    $scope.categoryModal = false;
  };

  // 字体
  $scope.fontSettingModal = false
  $scope.openFontSettingModal = function (e) {
    e && e.stopPropagation()
    $scope.fontSettingModal = true;
  };
  $scope.closeFontSettingModal = function (e) {
    console.log(e)
    e && e.stopPropagation()
    $scope.fontSettingModal = false;
  };

  
  $scope.onFontLevelChange = (e) => {
    e.stopPropagation();
    var t = parseInt(_.fontSizeLevel) || 0
      , o = e.clientX / xe
      , n = e.clientY / xe
      , e = J.getBoundingClientRect();
    n < e.top || n > e.bottom || e.left - o > e.width / 10 || o - e.right > e.width / 10 || (e = (o = Math.max(0, o - e.left)) < (e = e.width / 4) / 2 ? 1 : e / 2 <= o && o < e / 2 * 3 ? 2 : e / 2 * 3 <= o && o < e / 2 * 5 ? 3 : e / 2 * 5 <= o && o < e / 2 * 7 ? 4 : 5) !== t && (Me(Be.recordManualRedirect, "recordManualRedirect")(),
    window.k_localStorage.setLocalStorage("logReaderFontChange", {
        isInc: t < e ? 1 : 0
    }),
  }

  $scope.toBook = () => {
    $location.path("/")
  }
    
  $scope.handleRenderPageClick = function (e) {
    var r = e.clientX / zoom
    var a = e.target.offsetWidth
    if(r < a / 3){
      $scope.prevPage()
    } else {
      $scope.nextPage()
    }
  }

  var P, ke, ve;
  P = document.getElementById("readerToolBar"),
  ve = document.documentElement.clientHeight,
  ke = window.outerHeight
  P && (P.style.cssText = "padding-bottom:" + 1.5 * Math.abs(ke - ve) + "px !important")

  $scope.nextPage = function (e) {
    // e && e.stopPropagation()
    if ($scope.loading) return;
    if (page === maxPage) return nextChapter();
    page += 1;
    console.log("nextPage", page)
    $scope.renderTop = -1 * (page - 1) * (P.offsetTop - P.clientHeight);
    console.log("nextPage", $scope.renderTop)
  };
  $scope.prevPage = function (e) {
    // e && e.stopPropagation()
    if ($scope.loading) return;
    if (page === 1) return prevChapter();
    page -= 1;
    console.log("prevPage", page)
    $scope.renderTop = Math.min(0, -1 * (page - 1) * (P.offsetTop - P.clientHeight));
    console.log("prevPage", $scope.renderTop)
  };

  function getCatalog(bookUrl) {
      return $http.get(baseUrl + "/getChapterList?url=" + encodeURIComponent(bookUrl));
  }

  function setTitle(){
    $scope.chapterIndex = bookItem.durChapterIndex
    document.title = bookItem.name + " | " + $scope.catalog[bookItem.durChapterIndex || 0].title;
  }

  function saveBookRemoteAndLocal(bookItem) {
    return storage.saveBook(bookItem).then(function(){
      return $http.post(baseUrl + "/saveBookProgress", {
        ...bookItem,
        durChapterTime: new Date().getTime(),
        durChapterTitle: $scope.catalog[bookItem.durChapterIndex || 0].title
      })
    })
  }
  function nextChapter() {
    if ($scope.loading) return;
    $scope.loading = true;
    bookItem.durChapterIndex += 1;
    getContent(bookItem.durChapterIndex).then(function (res) {
      $scope.loading = false;
      $scope.renderTop = 0;
      page = 1
      setTitle();
      return saveBookRemoteAndLocal(bookItem);
    });
  }
  function prevChapter() {
    if ($scope.loading) return;
    if(bookItem.durChapterIndex === 1) return
    $scope.loading = true;
    bookItem.durChapterIndex -= 1;
    getContent(bookItem.durChapterIndex).then(function (res) {
      $scope.loading = false;
      setTitle();
      return saveBookRemoteAndLocal(bookItem);
    });
  }

  function getContent(index) {
      let bookUrl = bookItem.bookUrl
      return $http
        .get(
          baseUrl + "/getBookContent?url=" +
            encodeURIComponent(bookUrl) +
            "&index=" +
            index
        )
        .then(
          (res) => {
            $scope.content = res.data.data.split(/\n+/);
            $timeout(() => {
              const container = document.getElementById("readerContentRenderContainer")
              maxPage = Math.floor(
                (container.lastElementChild.offsetTop + container.lastElementChild.offsetHeight) / P.offsetTop
              )
            }, 0)
          }
        );
    }

    function init(){
      getCatalog(bookItem.bookUrl).then(function (res) {
        $scope.catalog = res.data.data;
        var index = bookItem.durChapterIndex || 0;
        getContent(index, true, bookItem.durChapterPos).then(function () {
          $scope.loading = false;
        });
        //第二次点击同一本书 页面标题不会变化
        setTitle();
      }, function (err) {
        throw err;
      });
    }
      
  }]
)