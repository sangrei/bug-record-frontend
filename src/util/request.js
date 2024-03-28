import axios from 'axios'
import * as cookies from '@/util/cookies'
import router from '@/router'
import {Message} from 'element-ui'


//创建一个Axios实例
const request = axios.create({
  //最终请求url = baseURL + api中的path
  baseURL: process.env.VUE_APP_BASE_API,
  //请求超时时间,防止请求无限等待
  timeout: 5000 
})

//默认支持跨域调用
request.defaults.withCredentials = true;

request.interceptors.response.use(
  response=>{
    return response
  },
  error=>{
    //后端一共返回非正常的HTTP状态码，分别为401、403和996，前端都在此处处理
    switch(error.response.status){
      case 401:
        //没权限
        cookies.removeCurrentUser()
        router.push('/login')
        break
      case 403:
        Message({
          message:error.response.data.message,
          type:'warning',
        })
        break
      case 996:
        Message({
          message:error.response.data.message,
          type:'warning',
        })
        break
      default:
        Message({
          message:'返回异常：'+error.response.data.message,
          type:'erorr',
        })
        break
    }
    return
  }
)

export default request
