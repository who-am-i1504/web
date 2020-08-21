import request from '@/plugin/axios'

export function collect(data) {
  return request({
    url: '/collect/get',
    method: 'post',
    data
  })
}

export function getResult(data) {
  return request({
    url: '/collect/result/get_by_page',
    method: 'post',
    data
  })
}

export function startTask(data) {
  return request({
    url: '/collect/start',
    method: 'post',
    data
  })
}

export function getState(params) {
  return request({
    url: '/collect/state',
    method: 'get',
    params
  })
}

export function IPposition(data) {
  return request({
    url: '/collect/result/ip_position',
    method: 'post',
    data
  })
}

export function HL7Collect(data) {
  return request({
    url: '/monitor/hl7_by_page',
    method: 'post',
    data
  })
}

export function HL7Detail(data) {
  return request({
    url: '/collect/hl7/detail',
    method: 'post',
    data
  })
}

export function HL7Search(data) {
  return request({
    url: '/monitor/hl7_search',
    method: 'post',
    data
  })
}

export function HL7Delete(data) {
  return request({
    url: '/monitor/hl7_delete_id',
    method: 'post',
    data
  })
}

export function AstmCollect(data) {
  return request({
    url: '/monitor/astm_by_page',
    method: 'post',
    data
  })
}

export function AstmSearch(data) {
  return request({
    url: '/monitor/astm_search',
    method: 'post',
    data
  })
}


export function AstmDelete(data) {
  return request({
    url: '/monitor/astm_delete_id',
    method: 'post',
    data
  })
}

export function DICOMSearch(data) {
  return request({
    url: '/monitor/dicom_search',
    method: 'post',
    data
  })
}

export function DICOMDelete(data) {
  return request({
    url: '/monitor/dicom_delete_id',
    method: 'post',
    data
  })
}
