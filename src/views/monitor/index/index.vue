<template>
  <d2-container>
    <!-- <d2-module-index-banner slot="header" v-bind="banner"/> 
    <d2-module-index-menu :menu="menu"/> -->
    <!-- <template slot="header" style="margin-bottom: 5px">
      <template slot="prepend"></template>
      传输规则数目示意图
      <template slot="append">.com</template>
      <el-button slot="header" style="margin-bottom: 5px">自定义按钮1</el-button>
      <el-button slot="header" type="primary" round style="margin-bottom: 5px">自定义按钮2</el-button>
    </template> -->
    <template slot="header">
    <div class="d2-page-cover">
      <p class="d2-page-cover__title">疑似医疗数据传输泄露情况</p>      
    </div>
    </template>
    <div class="inner">
      <ve-ring :data="newChartData" :settings="chartSettings" v-bind="pubSetting"></ve-ring>
    </div>
    <div ref="chart" style="width:100%;height:376px"></div>
  </d2-container>
</template>

<script>
import menu from '@/menu/modules/demo-playground'
import list from '@/views/_mixin/list.js'
import {monitorCount} from '@/api/monitor'

export default {
  mixins: [
    list
  ],
  data () {
    // this.chartSettings = {
    //   radius: 150,
    //   offsetY: 250
    // }
    return {
      menu,
      banner: {
        title: 'HL7规则管理',
        subTitle: '在这里可以进行HL7规则的添加,删除,更改等功能'
      },
      chartSettings:{
        // radius: 150,
        // offsetY:250,
        // label:'传输规则数目示意图'
        // roseType: 'radius'
      },
      chartData: {
        columns:['协议类型', '数量'],
        // columns: ['日期', '访问用户'],
        rows: [
          // { '日期': '1/1', '访问用户': 1393 },
          // { '日期': '1/2', '访问用户': 3530 },
          // { '日期': '1/3', '访问用户': 2923 },
          // { '日期': '1/4', '访问用户': 1723 },
          // { '日期': '1/5', '访问用户': 3792 },
          // { '日期': '1/6', '访问用户': 4593 }
        ]
      }
    }
  },
  computed: {
    newChartData: function(){
      return this.chartData
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData () {
      monitorCount().then(res => {
        
        this.chartData.rows = res.data
        if (res.status != 200){
          this.$message({
            message:res.message,
            type:'warning'
          })
        }
      }).catch(err => {
        this.$message({
          message:'网络错误',
          type:'error'
        })
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.inner {
  position: absolute;
  top: 20px;
  right:  20px;
  bottom: 20px;
  left: 20px;
}
.d2-page-cover {
  @extend %unable-select;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  .d2-page-cover__title {
    margin: 0px;
    margin-bottom: 20px;
    font-weight: bold;
    color: $color-text-main;
    font-size: 30px;
  }
}
</style>