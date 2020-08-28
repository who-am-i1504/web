import request from '@/plugin/axiosfile'

export function pictureBatchDown(data) {
  return request({
    url: '/picture/downDirectory',
    method: 'post',
    data
  })
}

export function pictureDown(u) {
  return request({
    url: '/picture/download/' + u,
    method: 'post',
  })
}

export function pcapBatchDown(data) {
  return request({
    url: '/construct/downDirectory',
    method: 'post',
    data: data
  })
}

export function pcapDown(data) {
  return request({
    url: '/construct/downfile',
    method: 'post',
    data: data
  })
}

export function logDown() {
  return request({
    url: 'picture/log/download',
    method: 'get'
  })
}
