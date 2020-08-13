import request from '@/plugin/axios'

export function deleteFile(data) {
  return request({
    url: '/construct/delete',
    method: 'post',
    data
  })
}

export function deleteBySessionId(data){
    return request({
        url:'/construct/deleteBySessionId',
        method:'post',
        data
    })
}

export function ConstructPara(data){
  return request({
    url:'/construct/construct_params',
    method:'post',
    data
  })
}
