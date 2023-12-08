import { bookList } from ".";

function getZoom() {
  return parseFloat(window.getComputedStyle(document.body, null).zoom)
}

/**
 * 
 * @param {import("angular").IModule} module 
 */
export function installController(module){
  module.controller("BookListCtrl", [
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
}