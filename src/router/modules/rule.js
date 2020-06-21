import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = {
  auth: true
}

export default {
  path: '/transfer',
  name: 'demo-playground',
  meta,
  redirect: {
    name: 'transfer-rule'
  },
  component: layoutHeaderAside,
  children: (pre => [{
      path: 'index',
      name: `${pre}index`,
      component: _import('rule/index'),
      meta: {
        ...meta,
        cache: true,
        title: '传输规则管理'
      }
    },
    {
      path: 'hl7',
      name: `${pre}hl7`,
      component: _import('rule/hl7'),
      meta: {
        ...meta,
        cache: true,
        title: 'HL7规则管理'
      }
    },
    {
      path: 'dicom',
      name: `${pre}dicom`,
      component: _import('rule/dicom'),
      meta: {
        ...meta,
        cache: true,
        title: 'DICOM规则管理'
      }
    },
    {
      path: 'astm',
      name: `${pre}astm`,
      cache: true,
      component: _import('rule/astm'),
      meta: {
        ...meta,
        cache: true,
        title: 'ASTM规则管理'
      }
    }
  ])('rule-')
}
