export default [
  {
    path: '/api/rule/get',
    method: 'post',
    handle({ params, Repeat }) {
      return {
        status: 200,
        message: 'success',
        data: Repeat(3, {
          '协议类型|1': ['HL7', 'DICOM', 'ASTM'],
          '数量|1':[100,500,600,700]
        })
      }
    }
  },
  {
    path: '/api/rule/hl7/get',
    method: 'post',
    handle({ params, Repeat }) {
      let {pageSize} = params
      return {
        status: 200,
        message: "success",
        data: Repeat(pageSize, {
          'id|1': [1,2,3,4,5,6],
          'value|1': ['\rMSH', '\rPV1', '\rPID', '\rFPS']
        }),
        'size': 100
      }
        
    }
  },
  {
    path: '/api/rule/hl7/update',
    method: 'post',
    handle({ params,Repeat}) {
      let { id, value } = params
      return {
        status: 200,
        message: 'success',
        data:[]
      }
    }
  },
  {
    path: '/api/rule/hl7/delete',
    method: 'post',
    handle({ params, Repeat }) {
      let { id } = params
      return {
        status: 200,
        message: 'success',
        data:[]
      }
    }
  },
  {
    path: '/api/rule/hl7/add',
    method: 'post',
    handle({ params, Repeat }) {
      let { value } = params
      return {
        status: 200,
        message: 'success',
        data: {
          'id|+1': 15,
          'value':value
        }
      }
    }
  }
]
