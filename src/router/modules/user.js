import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = {
  auth: true,
}

export default {
  path: '/user',
  name: 'user',
  meta,
  redirect: {
    name: 'user-password'
  },
  component: layoutHeaderAside,
  children: (pre => [{
      path: 'password',
      name: `${pre}password`,
      component: _import('user/password'),
      meta: {
        ...meta,
        cache: true,
        title: '更改密码'
      }
    },
    {
      path: 'manager',
      name: `${pre}manager`,
      component: _import('user/manager'),
      meta: {
        ...meta,
        cache: true,
        title: '用户管理'
      }
    },
    {
      path: 'log',
      name: `${pre}log`,
      component: _import('user/log'),
      meta: {
        ...meta,
        cache: true,
        title: '用户日志'
      }
    }
  ])('user-')
}
