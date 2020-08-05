<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info.username ? `${info.username}` : '未登录'}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>
        注销
      </el-dropdown-item>
      <el-dropdown-item @click.native="ChangePassword">
        <d2-icon-svg name="password-change" style="width: 12px; height: 12px;"/>
        更改密码
      </el-dropdown-item>
      <el-dropdown-item v-if="info.authority && (info.authority & (info.roles['SuperAdmin'] | info.roles['Admin'] | info.roles['ReaderAdmin'] | info.roles['EditorAdmin'] )) > 0" @click.native="ManagerUser">
        <d2-icon name="plus" class="d2-mr-5"/>
        用户管理
      </el-dropdown-item>
      <el-dropdown-item v-if="info.authority && (info.authority & (info.roles['SuperAdmin'] | info.roles['Admin'] | info.roles['ReaderAdmin'] | info.roles['EditorAdmin'] )) > 0" @click.native="logReader">
        <d2-icon name="dot-circle-o" class="d2-mr-5"/>
        用户日志
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { cloneDeep } from 'lodash'
import { frameInRoutes } from '@/router/routes'
import layoutHeaderAside from '@/layout/header-aside'
export default {
  data() {
    return {
      setting: [
        { title: '更改密码', name: 'user-password', path: 'password', component: 'password' },
        { title: '管理其他用户', name: 'user-manager', path: 'manager', component: 'manager' },
        { title: '用户日志', name: 'user-log', path: 'log', component: 'userlog' }
      ]
    }
  },
  mounted() {
    
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ]),
    ...mapState('d2admin/menu', [
      'header',
      'asider'
    ]),
    // asiders:function(){
    //   if (this.info.authority && this.info.authority === 1){
    //     return {
    //       path: '/user',
    //       title: '用户管理',
    //       icon: 'flask',
    //       children: (pre => [{
    //           path: `${pre}password`,
    //           title: '更改密码',
    //           icon: 'home'
    //         },
    //         {
    //           path: `${pre}log`,
    //           title: '查看日志',
    //           icon: 'home'
    //         },
    //         {
    //           path: `${pre}manager`,
    //           title: '管理其他用户',
    //           icon: 'home'
    //         }
    //       ])('/user/')
    //     }
    //   }
    //   return {
    //       path: '/user',
    //       title: '用户管理',
    //       icon: 'flask',
    //       children: (pre => [{
    //           path: `${pre}password`,
    //           title: '更改密码',
    //           icon: 'home'
    //         }
    //       ])('/user/')
    //     }
    // }
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    ...mapMutations({
      pageInit: 'd2admin/page/init',
      headerSet: 'd2admin/menu/headerSet',
      asideSet:'d2admin/menu/asideSet'
    }),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    },
    ChangePassword(){
      this.onClick(this.setting[0])
    },
    ManagerUser(){
      this.onClick(this.setting[1])
    },
    logReader(){
      this.onClick(this.setting[2])
    },
    onClick ({ title, name, path, component }) {
      // vue router 的设计暂时不能支持在路由示例上访问动态添加的路由
      // 目前可行的解决方法是自行维护一个存储路由数据的位置
      // https://github.com/vuejs/vue-router/issues/1234
      // https://github.com/vuejs/vue-router/issues/1859
      // https://github.com/vuejs/vue-router/issues/1955
      // https://github.com/vuejs/vue-router/issues/2454
      // https://github.com/vuejs/vue-router/issues/2280
      // 所以暂时先不做对路由已经存在的判断
      const route = [
        {
          path: '/user/',
          component: layoutHeaderAside,
          children: [
            {
              path,
              name,
              component: () => import(`@/views/user/${component}`),
              meta: {
                title
              }
            }
          ]
        }
      ]
      this.$router.addRoutes(route)
      // 更新标签页池
      this.pageInit([
        ...frameInRoutes,
        ...route
      ])
      // 演示更新菜单
      // let menuGroup = {
      //   title: '临时菜单',
      //   icon: 'plus-square',
      //   children: []
      // }
      // const menu = {
      //   path: `/demo/playground/${path}`,
      //   title,
      //   icon: 'file-o'
      // }
      // let header = cloneDeep(this.header)
      // const menuGroupIndex = header.findIndex(e => e.title === menuGroup.title)
      // // 如果顶栏菜单已经有这个组，就在组里添加项目，反之新建一个菜单组
      // if (menuGroupIndex >= 0) {
      //   header[menuGroupIndex].children.push(menu)
      // } else {
      //   menuGroup.children.push(menu)
      //   header.push(menuGroup)
      // }
      // this.headerSet(header)
      // 跳转
      // let asider = cloneDeep(this.asider)
      // console.log(asider)
      // const menuIndex = asider.findIndex(e => e.title === this.asiders.title)
      // if (menuIndex < 0){
      //   asider.push()
      // }
      this.$router.push({ name })
      // this.asideSet([this.asiders])
      
    }

  }
}
</script>
