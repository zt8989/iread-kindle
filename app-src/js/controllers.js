var ireadControllers = angular.module('ireadControllers', []);

ireadControllers.controller("BookListCtrl", ['$scope', '$http', '$location', function BookListCtrl($scope, $http, $location){
  const baseUrl = `${process.env.VUE_APP_BASE_URL}:${process.env.VUE_APP_PORT}`
      $http.get(baseUrl +"/getBookshelf")
          .then(res => {
              $scope.shelf = res.data.data
              $scope.shelfPage = $scope.shelf.slice(0, 3)
          })

      $scope.getCover = (coverUrl) => {
          return /^data:/.test(coverUrl)
            ? coverUrl
            : `${process.env.VUE_APP_BASE_URL}:${process.env.VUE_APP_PORT}` +
             '/cover?path=' +
                encodeURIComponent(coverUrl);
        }

      $scope.toDetail = (book) => {
          const { bookUrl, bookName, bookAuthor, chapterIndex, chapterPos } = book
          sessionStorage.setItem("bookUrl", bookUrl);
          sessionStorage.setItem("bookName", bookName);
          sessionStorage.setItem("bookAuthor", bookAuthor);
          sessionStorage.setItem("chapterIndex", chapterIndex);
          sessionStorage.setItem("chapterPos", chapterPos);
          const readingRecent = {
            name: bookName,
            author: bookAuthor,
            url: bookUrl,
            chapterIndex: chapterIndex,
            chapterPos: chapterPos,
          };
          localStorage.setItem("readingRecent", JSON.stringify(readingRecent));
          $location.path("/detail")
        }
  }]
)

ireadControllers.controller("BookDetailCtrl", ['$scope', '$http', '$location',function BookDetailCtrl($scope, $http, $location){
  const baseUrl = `${process.env.VUE_APP_BASE_URL}:${process.env.VUE_APP_PORT}`
  function getCatalog(bookUrl) {
      return $http.get(baseUrl + "/getChapterList?url=" + encodeURIComponent(bookUrl));
    }

    $scope.chapterIndex = 1
    $scope.content = []
  function getContent(index, reloadChapter = true, chapterPos = 0) {
      let bookUrl = sessionStorage.getItem("bookUrl");
      $http
        .get(
          baseUrl + "/getBookContent?url=" +
            encodeURIComponent(bookUrl) +
            "&index=" +
            $scope.chapterIndex
        )
        .then(
          (res) => {
            $scope.content = res.data.data.split(/\n+/);
            console.log($scope.content)
          }
        );
    }

    //获取书籍数据
    const that = this;
    let bookUrl = sessionStorage.getItem("bookUrl");
    let bookName = sessionStorage.getItem("bookName");
    let bookAuthor = sessionStorage.getItem("bookAuthor");
    let chapterIndex = Number(sessionStorage.getItem("chapterIndex") || 0);
    let chapterPos = Number(sessionStorage.getItem("chapterPos") || 0);
    var book = JSON.parse(localStorage.getItem(bookUrl));
    if (
      book == null ||
      chapterIndex != book.index ||
      chapterPos != book.chapterPos
    ) {
      book = {
        bookName: bookName,
        bookAuthor: bookAuthor,
        bookUrl: bookUrl,
        index: chapterIndex,
        chapterPos: chapterPos,
      };
      localStorage.setItem(bookUrl, JSON.stringify(book));
    }

    getCatalog(bookUrl).then(
      (res) => {
        let catalog = res.data.data;
        $scope.setReadingBook = book
        $scope.setCatalog = catalog
        var index = $scope.chapterIndex;
        getContent(index, true, chapterPos);
        //第二次点击同一本书 页面标题不会变化
        document.title = null;
        document.title = bookName + " | " + catalog[index].title;
      },
      (err) => {
        throw err;
      }
    );
      

      $scope.toBook = () => {
          $location.path("/")
      }
  }]
)