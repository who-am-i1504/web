import request from '@/plugin/axios'

export function getUserList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

export function getRoles(data) {
  return request({
    url: '/user/roles',
    method: 'post',
    data
  })
}

export function AddUser(data){
  return request({
    url:'/user/add',
    method:'post',
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

export function UpdateUserName(data){
  return request({
    url:'/user/updateUserName',
    method:'post',
    data
  })
}

export function UpdateUserAuthority(data){
  return request({
    url:'/user/updateAuthority',
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