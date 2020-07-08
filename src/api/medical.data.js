import request from '@/plugin/axios'


export function getAstmDataById(data) {
  return request({
    url: '/monitor/astm_by_id',
    method: 'post',
    data
  })
}


export function getDICOMByPage(data) {
  return request({
    url: '/monitor/dicom_by_page',
    method: 'post',
    data
  })
}