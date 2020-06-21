import request from '@/plugin/axios'

export function getUserList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

export function UpdateUser(data){
  return request({
    url:'/user/update',
    method:'post',
    data
  })
}

export function DeleteUser(data){
  return request({
    url:'/user/delete',
    method:'post',
    data
  })
}