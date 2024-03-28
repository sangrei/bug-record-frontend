import request from '@/util/request'

//查询列表
export function query(search) {
  return request({
    url: '/version/',
    method: 'get',
    params:search
  })
}
//查询所有
export function queryAll(){
  return request({
      url:'/version/queryAll',
      method:'get'
  })
}
//根据id获取数据
export function getById(id) {
    return request({
      url: '/version/' + id,
      method: 'get'
    })
  }
//创建
export function create(version) {
  return request({
    url: '/version/',
    method: 'post',
    data:version
  })
}
//修改
export function modify(version) {
    return request({
      url: '/version/',
      method: 'put',
      data:version
    })
  }
//删除
export function remove(id) {
  return request({
    url: '/version/'+id,
    method: 'delete'
  })
}