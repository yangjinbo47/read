let apiHost = 'http://localhost/read'
let OPENID_KEY = 'session_weixin_openid'
export default {
  apiHost,
  OPENID_KEY,

  getUrlParam : function (name) {
    return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
  },

  fetchFromLocalStorage (key) {
    return window.localStorage.getItem(key)
  },
  saveToLocalStorage (key, value) {
    window.localStorage.setItem(key, value)
  },
  fetchFromSessionStorage (key) {
    return window.sessionStorage.getItem(key)
  },
  saveToSessionStorage (key, value) {
    window.sessionStorage.setItem(key, value)
  }
}
