import vueCookies from 'vue-cookies'

 /*
  * 简单cookies操作 
  */
const currentUserKey = 'current-user'  //key
const expiredTime = "2h" //过期时间

//新增Cookie
export function setCookie(key,value){
  vueCookies.set(key,value,expiredTime)
}
//获取Cookie
export function getCookie(key){
  return vueCookies.get(key)
}
//移除Cookie
export function removeCookie(key){
  vueCookies.remove(key)
}

//获取
export function getCurrentUser() {
  return getCookie(currentUserKey)
}
//设置
export function setCurrentUser(value) {
  setCookie(currentUserKey, value)
}
//移除
export function removeCurrentUser() {
  removeCookie(currentUserKey)
}