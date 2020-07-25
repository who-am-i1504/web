import request from '@/plugin/axios'


export function AllHL7Graph() {
  return request({
      url: '/monitor/hl7_all_graph',
      method: 'get',
  })
}

export function AllDICOMGraph() {
  return request({
      url: '/monitor/dicom_all_graph',
      method: 'get',
  })
}

export function AllASTMGraph() {
  return request({
      url: '/monitor/astm_all_graph',
      method: 'get',
  })
}

export function HL7Graph(data) {
  return request({
      url: '/monitor/hl7_graph',
      method: 'post',
      data
  })
}

export function DICOMGraph(data) {
  return request({
      url: '/monitor/dicom_graph',
      method: 'post',
      data
  })
}

export function ASTMGraph(data) {
  return request({
      url: '/monitor/astm_graph',
      method: 'post',
      data
  })
}

export function monitorCount() {
  return request({
      url: '/monitor/count',
      method: 'get'
  })
}

export function getMonitorRule(data) {
  return request({
    url: '/monitor/rule/get',
    method: 'post',
    data
  })
}

export function addMonitorRule(data) {
  
  return request({
    url: '/monitor/rule/add',
    method: 'post',
    data
  })
}

export function searchMonitorRule(data) {
  
  return request({
    url: '/monitor/rule/get_by_ip',
    method: 'post',
    data
  })
}

export function updateMonitorRule(data) {
  
  return request({
    url: '/monitor/rule/update',
    method: 'post',
    data
  })
}

export function deleteMonitorRule(data) {
  
  return request({
    url: '/monitor/rule/delete',
    method: 'post',
    data
  })
}

export function acitvateFind(data) {
  
  return request({
    url: '/monitor/active_find',
    method: 'post',
    data
  })
}

export function acitvateFindDetails(data) {
  
  return request({
    url: '/monitor/active_find_detail',
    method: 'post',
    data
  })
}

export function getMonitorHL7(data) {
  return request({
    url: '/monitor/result/hl7',
    method: 'post',
    data
  })
}

export function getMonitorDICOM(data) {
  return request({
    url: '/monitor/result/dicom',
    method: 'post',
    data
  })
}

export function getMonitorASTM(data) {
  
  return request({
    url: '/monitor/result/astm',
    method: 'post',
    data
  })
}