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
      <p class="d2-page-cover__title">采集数据折线图</p>      
    </div>
    </template>
    <div class="inner">
      <ve-line :data-zoom="dataZoom" :data="chartData" :settings="chartSettings" v-bind="pubSetting"></ve-line>
    </div>
  </d2-container>
</template>

<script>
import menu from '@/menu/modules/demo-playground'
import list from '@/views/_mixin/list.js'
import {collect} from '@api/collect.data'

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
      dataZoom: [
        {   // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 10,      // 左边在 10% 的位置。
            end: 60         // 右边在 60% 的位置。
        }
      ],
      banner: {
        title: 'HL7规则管理',
        subTitle: '在这里可以进行HL7规则的添加,删除,更改等功能'
      },
      chartSettings:{
        radius: 150,
        offsetY:250,
        legendName:'传输规则数目示意图',
        area:true
      },
      chartData: {
        columns:['date', '数据量'],
        // columns: ['日期', '访问用户'],
        rows: [
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
      collect({}).then(res => {
        
        this.chartData.rows = res.data
        // console.log(res.data)
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