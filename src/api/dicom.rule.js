import request from '@/plugin/axios'

export function getDICOMRule(data) {
  return request({
    url: '/rule/dicom/get',
    method: 'post',
    data
  })
}

export function updateDICOMRule(data) {
  return request({
    url: '/rule/dicom/update',
    method: 'post',
    data
  })
}

export function deleteDICOMRule(data) {
  return request({
    url: '/rule/dicom/delete',
    method: 'post',
    data
  })
}

export function addDICOMRule(data) {
  return request({
    url: '/rule/dicom/add',
    method: 'post',
    data
  })
}
