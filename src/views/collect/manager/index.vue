<template>
  <d2-container :type="containerType" :scroll-delay="scrollDelay" better-scroll>
      <template slot="header">
        <div style="margin: -16px;">
          <el-form
            :inline="true"
            ref="form"
            size="mini"
            style="margin-bottom: -30px; width: 100%;">

            <el-form-item>
              <SplitPane style="width: 150px" :min-percent='10' :default-percent='80' split="vertical">
                <el-input v-model="inputStr1" slot="paneL" placeholder="类型" size="small"></el-input>
                <el-checkbox style="margin: 10px; margin-top: 5px;" slot="paneR" v-model="checkbox1" >{{radioString}}</el-checkbox>
              </SplitPane>
            </el-form-item>

            <el-form-item>
              <SplitPane style="width: 150px;" :min-percent='10' :default-percent='80' split="vertical">
                <el-input v-model="inputStr2" slot="paneL" size="small" placeholder="IP地址:端口"></el-input>
                <el-checkbox style="margin: 10px; margin-top: 5px;" slot="paneR" v-model="checkbox2">{{radioString}}</el-checkbox>
              </SplitPane>
            </el-form-item>

            <el-form-item>
              <SplitPane style="width: 150px;" :min-percent='10' :default-percent='80' split="vertical">
                <el-input v-model="inputStr3" slot="paneL" size="small" placeholder="序列号"></el-input>
                <el-checkbox style="margin: 10px; margin-top: 5px;" slot="paneR" v-model="checkbox3" >{{radioString}}</el-checkbox>
              </SplitPane>
            </el-form-item>

            <el-form-item>
              <SplitPane style="width: 150px;" :min-percent='10' :default-percent='80' split="vertical">
                <el-input v-model="inputStr4" slot="paneL" size="small" placeholder="版本号"></el-input>
                <el-checkbox style="margin: 10px; margin-top: 5px;" slot="paneR" v-model="checkbox4">{{radioString}}</el-checkbox>
              </SplitPane>
            </el-form-item>

            <el-form-item style="width: 20%;">
              <el-button
                size="small"
                @click="searchItemInForm">
                <d2-icon name="search"/>
                执行搜索任务
              </el-button>
            </el-form-item>

          </el-form>
        </div>
      </template>
      <d2-crud
        style="margin: -20px;"
        ref="d2Crud"
        selection-row
        :options="options"
        :columns="columns"
        :data="data"
        @selection-change="handleSelectionChange"
        :form-options="formOptions"
        @dialog-cancel="handleDialogCancel"
        @row-dblclick="doubleClick"
        @row-edit="handleRowEdit"
        :loading="loading"/>
       <el-card 
        style="margin: -10px;"
        slot="footer">
          <el-pagination
            @current-page="pagination.page"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            :page-sizes="[20, 50, 100, 500, 1000, 2000, 5000]"
            layout="total, sizes, prev, pager, next, jumper"
            style="margin: -10px;"
            :pager-count="15"
            @size-change="handleSizeChange"
            @current-change="paginationCurrentChange"
            @prev-click="handlePaginationPrevClick"
            @next-click="handlePaginationNextClick">
          </el-pagination>
      </el-card>
  </d2-container>
</template>

<script>
import menu from '@/menu/modules/demo-playground'
import { AstmCollect, AstmDetail, AstmSearch } from '@api/collect.data'
import Vue from 'vue'
import SplitPane from 'vue-splitpane'
Vue.component('SplitPane', SplitPane)
export default {
  data () {
    return {
      inputStr1:'',
      inputStr2:'',
      inputStr3:'',
      inputStr4:'',
      containerType: 'full',
      scrollDelay: 50,
      checkbox1:false,
      checkbox2:false,
      checkbox3:false,
      checkbox4:false,
      radioString:'',
      columns: [
        {
          title: '序号',
          key: 'order',
          align:'center',
          width: 90,
          showOverflowTooltip:true
        },
        {
          title: '类型',
          key: 'type',
          align:'center',
          showOverflowTooltip:true
        },
        {
          title:'发送方IP地址及端口号',
          key:'send_ip_port',
          align:'center',
          showOverflowTooltip:true
        },
        {
          title:'发送方',
          key:'sender',
          align:'center',
          showOverflowTooltip:true
        },
        {
          title:'接收方IP地址及端口号',
          key:'receiver_ip_port',
          align:'center',
          showOverflowTooltip:true
        },
        {
          title:'接收方',
          key:'receiver',
          align:'center',
          showOverflowTooltip:true
        },
        {
          title:'发送时间',
          key:'message_time',
          align:'center',
          showOverflowTooltip:true
        },
        {
          title:'版本号',
          key:'version',
          align:'center',
          showOverflowTooltip:true
        },
        {
          title:'数据大小(byte)',
          key:'size',
          width: 90,
          align:'center',
          showOverflowTooltip:true
        }
      ],
      mid_data: [],
      loading: false,
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        pageCount:9,
        layout:'prev, pager, next, jumper, ->, total, slot'
      },
      options:{
        size:"mini",
        stripe:true
      }
    }
  },
  computed: {
    data: function(){
      var x
      var i = 1
      for (x in this.mid_data){
        this.mid_data[x]['order'] = (this.pagination['page'] - 1) * this.pagination['pageSize'] + i
        i += 1
      }
      return this.mid_data
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    handleClose(done){

      done()

    },
    paginationCurrentChange (page) {
      this.pagination.page = page
      this.fetchData()
    },
    fetchData () {
      this.loading = true
      AstmCollect({
        ...this.pagination
      }).then(res => {
        this.mid_data = res.data
        this.pagination.total = res.size
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    }, 
    handleSizeChange (val) {
      this.pagination.pageSize = val
      this.fetchData()
    },
    paginationCurrentChange(val){
      this.pagination.page = val
      this.fetchData()
    },
    handlePaginationPrevClick(val){
      this.pagination.page = val
      this.fetchData()
    },
    handlePaginationNextClick(val){
      this.pagination.page = val
      this.fetchData()
    },
    doubleClick(row, event){
      this.dialogVisible = true
    },
    handleDialogCancel(done){
      done()
    },
    handleRowEdit({index, row}, done){
      
    },
    searchItemInForm(){

    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  },
}
</script>
