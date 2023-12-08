function getZoom() {
  return parseFloat(window.getComputedStyle(document.body, null).zoom)
}

/**
 * 
 * @param {import("angular").IModule} module 
 */
export function installController(module){
  module.controller("BookDetailCtrl", 
  ['$scope', '$http', '$location', '$document', '$timeout', 'storage', '$q',
    'fonts',
  function BookDetailCtrl($scope, $http, $location, $document, $timeout, 
    storage, $q, fonts) {
    $scope.catalog = []
    $scope.chapterIndex = 1
    $scope.content = []
    $scope.loading = true
    $scope.renderTop = 0
    $scope.config = {
      fontLevel: 3,
      fontFamily: fonts[0].key
    }
    $scope.bookItem = {}
    $scope.fonts = fonts
  
    $scope.$watch("myfont", function(newValue, oldValue){
      if(newValue){
        $("#readerContent").attr("style", newValue.css)
        $scope.config.fontFamily = newValue.key
        storage.saveReadConfig($scope.config)
      }
    })
  
    $scope.myfont = fonts[0]
  
  
  
    let page = 1
    var maxPageHeight = 1;
  
    $scope.catalogRenderTop = 0;
    var catalogPage = 1;
    var catalogMaxPageHeight = 1;
    var catalogOffset = 0;
  
    var baseUrl;
    $q.all([storage.getBookApiUrl(), storage.getBook(), storage.getReadConfig()])
    .then(function(results){
      baseUrl = results[0]
      $scope.bookItem = results[1]
      $scope.config = results[2]
      
      for(let i in fonts){
        if(fonts[i].key === $scope.config.fontFamily){
          $scope.myfont = fonts[i]
        }
      }
      init()
    }).catch(function(e){
      console.log(e)
    })
    var zoom = getZoom() || 1
  
    // 目录
    $scope.categoryModal = false
    $scope.openCategoryModal = function () {
      var header = document.getElementById("readerCatalog_header")
      var list = document.getElementById("readerCatalog_list")
      var top = header.offsetTop + header.clientHeight
      var current = list.children[$scope.bookItem.durChapterIndex]
      var offsetTop = current.offsetTop + current.offsetHeight - top
      catalogPage = offsetTop > 0 ? (Math.floor(offsetTop / catalogOffset) + 1) : 1
      $scope.catalogRenderTop = -((catalogPage - 1) * catalogOffset)
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
      e && e.stopPropagation()
      $scope.fontSettingModal = false;
    };
    $scope.onFontChange = function(e) {
      e && e.stopPropagation()
      var rect = document.getElementById("readerFontSettingBar").getBoundingClientRect()
      var left = rect.left
      var right = rect.right
      var x = e.clientX / zoom
      var p = (right - left) / 4
      var level = 1
      if (x >= left){
        var div = (x - left) / p
        level = 1 + Math.floor(div) + ((div - Math.floor(div)) > 0.5 ? 1 : 0)
      }
      $scope.config.fontLevel = level
      storage.saveReadConfig($scope.config)
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
  
    $scope.nextPage = function (e) {
      // e && e.stopPropagation()
      if ($scope.loading) return;
      var nextOffset = page * (P.offsetTop - P.clientHeight)
      if (nextOffset > maxPageHeight) return nextChapter();
      page += 1;
      console.log("nextPage", page)
      $scope.renderTop = -1 * nextOffset;
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
  
    $scope.onCatalogPrevPage = function(e){
      e && e.stopPropagation()
      if (catalogPage === 1) return
      catalogPage -= 1;
      console.log("prevPage", catalogPage)
      $scope.catalogRenderTop = Math.min(0, -1 * (catalogPage - 1) * catalogOffset);
      console.log("renderTop", $scope.catalogRenderTop)
    }
  
    $scope.onCatalogNextPage = function(e){
      e && e.stopPropagation()
      var nextOffset = catalogPage * catalogOffset
      if (nextOffset > catalogMaxPageHeight) return
      catalogPage += 1;
      console.log("nextPage", catalogPage)
      $scope.catalogRenderTop = -1 * nextOffset;
      console.log("renderTop", $scope.catalogRenderTop)
    }
  
    function setTitle() {
      document.title = $scope.bookItem.name + " | " + $scope.catalog[$scope.bookItem.durChapterIndex || 0].title;
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
    function goChapter(durChapterIndex) {
      if ($scope.loading) return;
      $scope.loading = true;
      $scope.bookItem.durChapterIndex = durChapterIndex;
      getContent($scope.bookItem.durChapterIndex).then(function (res) {
        $scope.loading = false;
        $scope.renderTop = 0;
        page = 1
        setTitle();
        return saveBookRemoteAndLocal($scope.bookItem);
      }).catch(function(e) {
        $scope.loading = false;
        console.log(e)
      });
    }
  
    function nextChapter() {
      if ($scope.loading) return;
      return goChapter($scope.bookItem.durChapterIndex + 1)
    }
  
    function prevChapter() {
      if ($scope.loading) return;
      if($scope.bookItem.durChapterIndex === 1) return
      $scope.loading = true;
      $scope.bookItem.durChapterIndex -= 1;
      getContent($scope.bookItem.durChapterIndex).then(function (res) {
        $scope.loading = false;
        setTitle();
        return saveBookRemoteAndLocal($scope.bookItem);
      });
    }
  
    function getContent(index) {
      var bookUrl = $scope.bookItem.bookUrl;
      return $http.get(baseUrl + "/getBookContent?url=" + encodeURIComponent(bookUrl) + "&index=" + index).then(function (res) {
        $scope.content = res.data.data.split(/\n+/);
        $timeout(function () {
          var container = document.getElementById("readerContentRenderContainer");
          maxPageHeight = container.lastElementChild.offsetTop + container.lastElementChild.offsetHeight
  
          var header = document.getElementById("readerCatalog_header")
          var tool = document.getElementById("readerCatalog_tool")
          var list = document.getElementById("readerCatalog_list")
          var top = header.offsetTop + header.clientHeight
          var bottom = tool.offsetTop
          catalogOffset = bottom - top 
          catalogMaxPageHeight = list.lastElementChild.offsetTop 
            + list.lastElementChild.offsetHeight
            - top
        }, 0);
      });
    }
  
    $scope.onChapterClick = function(e, index){
      e && e.stopPropagation()
      if(index !== $scope.bookItem.durChapterIndex){
        goChapter(index)
      }
      $scope.closeCategoryModal()
    }
  
    function init(){
      getCatalog($scope.bookItem.bookUrl).then(function (res) {
        $scope.catalog = res.data.data;
        var index = $scope.bookItem.durChapterIndex || 0;
        getContent(index, true, $scope.bookItem.durChapterPos).then(function () {
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
}
