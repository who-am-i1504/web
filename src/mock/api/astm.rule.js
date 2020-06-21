export default [{
    path: '/api/rule/astm/get',
    method: 'post',
    handle({
      params,
      Repeat
    }) {
      let {
        pageSize
      } = params
      return {
        status: 200,
        message: "success",
        data: Repeat(pageSize, {
          'id|1': [1, 2, 3, 4, 5, 6],
          'value|1': ['\rMSH', '\rPV1', '\rPID', '\rFPS']
        }),
        'size': 100
      }

    }
  },
  {
    path: '/api/rule/astm/update',
    method: 'post',
    handle({
      params,
      Repeat
    }) {
      let {
        id,
        value
      } = params
      return {
        status: 200,
        message: 'success',
        data: []
      }
    }
  },
  {
    path: '/api/rule/astm/delete',
    method: 'post',
    handle({
      params,
      Repeat
    }) {
      let {
        id
      } = params
      return {
        status: 200,
        message: 'success',
        data: []
      }
    }
  },
  {
    path: '/api/rule/astm/add',
    method: 'post',
    handle({
      params,
      Repeat
    }) {
      let {
        value
      } = params
      return {
        status: 200,
        message: 'success',
        data: {
          'id|+1': 15,
          'value': value
        }
      }
    }
  }
]