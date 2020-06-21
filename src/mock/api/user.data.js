export default [
  {
    path: '/api/user/list',
    method: 'post',
    handle ({ params, Repeat }) {
      let { pageSize, page, uuid, token } = params
    //   console.log(Repeat)
      return {
        status: 200,
        message: 'success',
        data: Repeat(pageSize, {
            'username|1':['admin', 'editor', 'user1'],
            'password|1':['admin', 'editor', 'user1'],
            'uuid':'@guid',
            'name':'@cname',
        }),
        size:100
      }
    }
  },
  {
    path: '/api/user/update',
    method: 'post',
    handle ({ params, Repeat }) {
      let { uuid, name, username, password, token } = params
    //   console.log(Repeat)
      return {
        status: 200,
        message: 'success',
        data: {}
      }
    }
  },
  {
    path: '/api/user/delete',
    method: 'post',
    handle ({ params, Repeat }) {
      let { uuid, name, username, password, token } = params
    //   console.log(Repeat)
      return {
        status: 200,
        message: 'success',
        data: {}
      }
    }
  },
]
  