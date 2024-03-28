import request from '@/util/request'

//登录
export function login(user) {
    return request({
      url: '/account/login',
      method: 'post',
      data:user
    })
  }

//注册
export function register(user) {
  return request({
    url: '/account/register',
    method: 'post',
    data:user
  })
}

//登录
export function resetPassword(user) {
  return request({
    url: '/account/resetPassword',
    method: 'post',
    data:user
  })
}