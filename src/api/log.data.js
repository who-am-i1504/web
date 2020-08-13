import request from '@/plugin/axios'

export function getLog(data) {
  return request({
    url: '/log/get',
    method: 'post',
    data
  })
}

export function getLogByUUID(data){
    return request({
        url:'/log/getByUUID',
        method:'post',
        data
    })
}

export function getLogByName(data){
    return request({
        url:'/log/getByUserName',
        method:'post',
        data
    })
}

export function deleteLog(data){
    return request({
        url:'/log/delete',
        method:'post',
        data
    })
}