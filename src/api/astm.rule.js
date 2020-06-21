import request from '@/plugin/axios'

export function getASTMRule(data) {
  return request({
    url: '/rule/astm/get',
    method: 'post',
    data
  })
}

export function updateASTMRule(data) {
  return request({
    url: '/rule/astm/update',
    method: 'post',
    data
  })
}

export function deleteASTMRule(data) {
  return request({
    url: '/rule/astm/delete',
    method: 'post',
    data
  })
}

export function addASTMRule(data) {
  return request({
    url: '/rule/astm/add',
    method: 'post',
    data
  })
}
