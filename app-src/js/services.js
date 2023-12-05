const ireadServices = angular.module('ireadServices', []);

ireadServices.factory("storage", ["$http", '$location', '$q', 
  function storage($http, $location, $q){
  const search = $location.search()
  const server = {
    getJson(key, defaultValue) {
      return $http.get(`/dict/${key}`).then(function(res){
        if(res.data.value){
          return JSON.parse(res.data.value)
        } else {
          return defaultValue
        }
      })
    },
    saveJson(key, value) {
      return $http.patch("/dict", {
        key: key,
        value: JSON.stringify(value)
      })
    },
    getString(key) {
      return $http.get(`/dict/${key}`).then(function(res){
        return res.data.value
      })
    },
    saveString(key, value) {
      return $http.patch("/dict", { 
        key: key,
        value: value
      })
    },

  }

  const local = {
    getJson(key, defaultValue) {
      return $q(function(resolve, reject){
        try {
          const json = localStorage.getItem(key)
          if(json){
            resolve(JSON.parse())
          } else {
            resolve(defaultValue)
          }
        } catch (e){
          reject(e)
        }
      })
    },
    saveJson(key, value) {
      return $q(function(resolve){
        try {
          localStorage.setItem(key, JSON.stringify(value));
          resolve()
        } catch (e){
          reject(e)
        }
      })
    },
    getString(key) {
      return $q(function(resolve, reject){
        try {
          resolve(localStorage.getItem(key))
        } catch (e){
          reject(e)
        }
      })
    },
    saveString(key, value) {
      return $q(function(resolve, reject){
        try {
          resolve(localStorage.setItem(key, value))
        } catch (e){
          reject(e)
        }
      })
    }
  }

  const extend = {
    config: null,
    getBook() {
      return this.getJson("readingRecent", {})
    },
    saveBook(book) {
      return this.saveJson("readingRecent", book)
    },
    getReadConfig(){
      return $q((resolve, reject) => {
        if(this.config){
          resolve(this.config)
        } else {
          return this.getJson("readConfig", {
            fontLevel: 3
          }).then(config => {
            this.config = config
            resolve(config)
          }, reject)
        }
      })
    },
    saveReadConfig(config){
      this.config = config
      return this.saveJson("readConfig", config)
    },
    getBookApiUrl() {
      return this.getString("bookApiUrl").then(url => {
        if (url && "http" === url.slice(0, 4)) {
          return url;
        } else {
          throw new Error("错误的地址")
        }
      })
    },
    saveBookApiUrl(url) {
      return this.saveString("bookApiUrl", url)
    }
  }
  if(search && search["storage"] === "server"){
    return {
      ...server,
      ...extend,
    }
  } else {
    return {
      ...local,
      ...extend
    }
  }
}])