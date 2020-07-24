import request from '@/plugin/axios'

export function AccountLogin (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getSalt(){
  return request({
    url:'/salt',
    method:'get'
  })
}

export function AccountLogOut(data){

  return request({
    url:'/logout',
    method:'post',
    data
  })

}

export function ChangePwd(data){

  return request({
    url:'/changePwd',
    method:'post',
    data
  })

}
