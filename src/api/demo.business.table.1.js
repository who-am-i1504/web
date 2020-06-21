import request from '@/plugin/axios'

export function getRule(data) {
  return request({
    url: '/rule/get',
    method: 'post',
    data
  })
}

export function getHL7Rule(data) {
  return request({
    url: '/rule/hl7/get',
    method: 'post',
    data
  })
}

export function updateHL7Rule(data) {
  return request({
    url: '/rule/hl7/update',
    method: 'post',
    data
  })
}

export function deleteHL7Rule(data) {
  return request({
    url: '/rule/hl7/delete',
    method: 'post',
    data
  })
}

export function addHL7Rule(data) {
  return request({
    url: '/rule/hl7/add',
    method: 'post',
    data
  })
}
