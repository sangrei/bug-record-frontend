import request from '@/util/request'

//查询列表
export function query(search) {
  return request({
    url: '/bug/',
    method: 'get',
    params:search
  })
}
//查询所有数据
export function queryAll(){
  return request({
      url:'/bug/',
      method:'get'
  })
}
//根据id获取数据
export function getById(id) {
    return request({
      url: '/bug/' + id,
      method: 'get'
    })
  }
//创建
export function create(user) {
  return request({
    url: '/bug/',
    method: 'post',
    data:user
  })
}
//修改
export function modify(user) {
    return request({
      url: '/bug/',
      method: 'put',
      data:user
    })
  }
//删除
export function remove(id) {
  return request({
    url: '/bug/'+id,
    method: 'delete'
  })
}