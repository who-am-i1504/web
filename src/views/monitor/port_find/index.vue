<template>
  <d2-container>
    <div
      slot="header"
      class="panel-search">
      <el-input
        class="panel-search__input"
        placeholder="IP地址"
        v-model="ip">
      </el-input>
      <br>
      <el-input
        class="panel-search__input"
        placeholder="端口"
        v-model="port">
      </el-input>
      <br>
      <el-button @click="port_find" slot="append" icon="el-icon-search">端口发现</el-button>
    </div>
    <div class="loading-area">
      <SplitPane v-show="data.length > 0" :min-percent='20' :default-percent='30' split="vertical">
        <template slot="paneL">
          <div >
            <tree-view :data="showMessage" :options="{rootObjectKey: '端口发现数据',modifiable: false}" @change-data="onChangeData"></tree-view>
          </div>
        </template>
        <template slot="paneR">
          <div>
             <d2-crud
              :columns="columns"
              :data="data"
              :options="options"/>
          </div>
        </template>
      </SplitPane>
    </div>
    <!-- <template class="foot" slot="footer">
      <el-button-group class="btnTxt">
        <el-button class="btnTxt" size="mini">IP地址: {{position.ip}}</el-button>
        <el-button type="text" size="mini"></el-button>
      </el-button-group>

      <el-button-group class="btnTxt">
        <el-button class="btnTxt" size="mini">地理地址: {{position.address}}</el-button>
        <el-button type="text" size="mini"></el-button>
      </el-button-group>

      <el-button-group class="btnTxt">
        <el-button class="btnTxt" size="mini">设备: {{position.equipment}}</el-button>
        <el-button type="text" size="mini"></el-button>
      </el-button-group>
      
      <el-button-group class="btnTxt">
        <el-button class="btnTxt" size="mini">机构: {{position.institution}}</el-button>
        <el-button type="text" size="mini"></el-button>
      </el-button-group>
    </template> -->
  </d2-container>
</template>

<script>
import list from '@/views/_mixin/list.js'
import {acitvateFind} from '@api/monitor'
import { mapActions } from 'vuex'
import { Loading } from 'element-ui';
export default {
  mixins: [
    list
  ],
  data () {
    return {
      columns:[
        {
          title:'IP地址',
          key:'ip',
          align:'center',
          width: 150,
          showOverflowTooltip:true
        },
        {
          title:'传输协议',
          key:'protocol',
          align:'center',
          showOverflowTooltip:true
        },
        {
          title:'端口',
          key:'port',
          align:'center',
          showOverflowTooltip:true
        },
        {
          title:'结束时间',
          key:'endtime',
          width: 120,
          align:'center',
          showOverflowTooltip:true
        },
        {
          title:'探测方式',
          key:'reason',
          align:'center',
          showOverflowTooltip:true
        },
        {
          title:'探测时延',
          key:'reason_ttl',
          align:'center',
          showOverflowTooltip:true
        },
        {
          title:'端口服务',
          key:'services',
          align:'center',
          showOverflowTooltip:true
        },
        {
          title:'端口状态',
          key:'state',
          align:'center',
          showOverflowTooltip:true
        }
      ],
      data:[],
      options: {
        border: true,
        spanMethod ({ row, column, rowIndex, columnIndex }) {

          if (columnIndex === 0) {
            if (row['ip_num'] === 0){
              return {
                rowspan:0,
                colspan:0
              }
            }else{
              return {
                rowspan:row['ip_num'],
                colspan:1
              }
            }
          }else if (columnIndex === 1){
            if (row['pro_num'] === 0){
              return {
                rowspan:0,
                colspan:0
              }
            }else{
              return {
                rowspan:row['pro_num'],
                colspan:1
              }
            }
          }
        }
      },
      ip:'',
      port:'',
      chartTooltip:{ show: true },
      chartSeries: [
        {
          type: 'scatter',
          coordinateSystem: 'bmap',
          data: []
        }
      ],
      bmap:'',
      portStatus:{

      },
      ipList:[]
    }
  },
  computed: {
    showMessage:function () {
      this.data = []
      var last_ip = undefined
      for (var ip in this.portStatus){
        var ip_num = 0
        for (var protocol in this.portStatus[ip]){
          var pro_num = 0
          var last_pro = undefined
          for (var port in this.portStatus[ip][protocol]){
            
            var column = JSON.parse(JSON.stringify(this.portStatus[ip][protocol][port]))
            column['ip'] = ip
            column['protocol'] = protocol
            column['port'] = port
            this.data.push(column)
            pro_num += 1
            ip_num += 1
            column['pro_num'] = 0
            column['ip_num'] = 0
            if (last_ip === undefined){
              last_ip = column
            }
            if (last_pro === undefined){
              last_pro = column
            }
          }
          last_pro['pro_num'] = pro_num
          last_pro = undefined
        }
        last_ip['ip_num'] = ip_num
        last_ip = undefined
      }
      return this.portStatus
    }
  },
  watch: {
    showOrNot:function (val, oldVal) {


      
    }
  },
  mounted() {
    // this.port_find()
  },
  methods: {
    onChangeData: function(data) {
      console.log(JSON.stringify(data))
    },
    port_find(){
      if (this.ip === ''){
        this.$message({
          message:'IP地址不能为空',
          type:'warning'
        })
        return;
      }
      let re = new RegExp("((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}")
      if (!re.test(this.ip)){
        this.$message({
          message:'IP地址格式不正确',
          type:'warning'
        })
        return;
      }
      var ip = {}
      ip['hosts'] = this.ip
      if (this.port !== ''){
        ip['ports'] = this.port
      }
      var loading = Loading.service({
        lock: true,
        text: "Loading...",
        target: document.querySelector('.loading-area')//设置加载动画区域
      });
      acitvateFind({
        ...ip
      }).then(res => {
        if (res.status === 200){
          this.portStatus = res.data
        }else{
          this.$message({
            message:res.message,
            type:'warning'
          })
        }
        loading.close()
      }).catch(err => {
        this.$message({
          message:'网络连接错误',
          type:'error'
        })
        loading.close()
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.panel-search {
  @extend %unable-select;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  .panel-search__input{
    text-align:center;
    width: 800px;
  }
}
.inner {
  position: absolute;
  top: 20px;
  right:  20px;
  bottom: 20px;
  left: 20px;
}
.foot{
  margin: 0px;
  margin-bottom: -50px;
}
.btnTxt{
  margin-top: -15px;
  margin-bottom: -20px;
  margin-right: 20px;
  font-weight: bold;
  color: $color-text-main;
  font-size: 10px;
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