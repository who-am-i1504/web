<template>
  <d2-container :type="containerType" :scroll-delay="scrollDelay">
      <template slot="header">
        <div style="margin: -16px;">
          <SplitPane :min-percent='10' :default-percent='25' split="vertical">
            <template slot="paneL">
              <SplitPane :min-percent='10' :default-percent='80' split="vertical">
                <el-input v-model="inputStr1" :disabled="input1" slot="paneL" placeholder="输入字符串值" size="small"></el-input>
                <el-radio style="margin: 10px;" slot="paneR" v-model="radio" :label="1">{{radioString}}</el-radio>
              </SplitPane>
            </template>
            <template slot="paneR">
              <SplitPane :min-percent='10' :default-percent='33' split="vertical">
                <template slot="paneL">
                  <SplitPane :min-percent='10' :default-percent='80' split="vertical">
                  <el-input v-model="inputStr2" :disabled="input2" slot="paneL" size="small" placeholder="输入转义字符串值"></el-input>
                  <el-radio style="margin: 10px;" slot="paneR" v-model="radio" :label="2">{{radioString}}</el-radio>
                  </SplitPane>
                </template>
                <template slot="paneR">
                  <SplitPane :min-percent='10' :default-percent='50' split="vertical">
                    <template slot="paneL">
                      <SplitPane :min-percent='10' :default-percent='80' split="vertical">
                        <el-input v-model="inputStr3" :disabled="input3" slot="paneL" size="small" placeholder="输入字符串ASCII码值"></el-input>
                        <el-radio style="margin: 10px;" slot="paneR" v-model="radio" :label="3">{{radioString}}</el-radio>
                      </SplitPane>
                    </template>
                    <template slot="paneR">
                      <el-button
                        size="small"
                        @click="addItemInForm">
                        <d2-icon name="plus"/>
                        添加
                      </el-button>
                    </template>
                  </SplitPane>
                </template>
              </SplitPane>
            </template>
          </SplitPane>
        </div>
      </template>

      <el-form
        :inline="true"
        size="mini">
        <el-form-item :label="`全部数据下载 [ ${pagination.total} ] 条`">
          <el-button-group>
            <el-button
              type="primary"
              size="mini"
              :disabled="pagination.total === 0"
              @click="handleDownloadAllXlsx()">
              xlsx
            </el-button>
            <el-button
              type="primary"
              size="mini"
              :disabled="pagination.total === 0"
              @click="handleDownloadAllCsv()">
              csv
            </el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item :label="`导入文件添加黑名单`">
          <el-button-group>
            <el-button type="success">
              <el-upload :before-upload="handleUploadCsv" action="default">
                <d2-icon name="file-o"/>
                选择要导入的 .csv 表格
              </el-upload>
            </el-button>
            <el-button type="success">
              <el-upload :before-upload="handleUploadXlsx" action="default">
                <d2-icon name="file-o"/>
                选择要导入的 .xlsx 表格
              </el-upload>
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <d2-crud
        style="margin: -20px;"
        ref="d2Crud"
        :columns="columns"
        :editTemplate="editTemplate"
        :data="data"
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
            :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
            style="margin: -10px;"
            @size-change="handleSizeChange"
            @current-change="paginationCurrentChange"
            @prev-click="handlePaginationPrevClick"
            @next-click="handlePaginationNextClick">
          </el-pagination>
      </el-card>
    <el-dialog
      :append-to-body="true"
      title="添加黑名单信息表格"
      :lock-scroll="true"
      :modal="false"
      :visible.sync="dialogVisible"
      width="60%"
      height="60%"
      :before-close="handleClose">
        <el-container style="height:300px;" better-scroll>
          <el-main>
            <el-table v-bind="table">
              <el-table-column
                v-for="(item, index) in table.columns"
                :key="index"
                :prop="item.prop"
                :label="item.label">
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="batchSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import menu from '@/menu/modules/demo-playground'
import { BusinessTable1List, getHL7Rule, updateHL7Rule, deleteHL7Rule, addHL7Rule } from '@api/demo.business.table.1'
import constant from '../constant/index'
import Vue from 'vue'
import { mapActions } from 'vuex'
import SplitPane from 'vue-splitpane'
Vue.component('SplitPane', SplitPane)
export default {
  data () {
    return {
      dialogVisible:false,
      table: {
        columns: [],
        data: [],
        size: 'mini',
        stripe: true,
        border: true
      },
      currentTableData:[],
      downloadColumns:[
        { label: '序号', prop: 'order' },
        { label: 'ID', prop: 'id' },
        { label: '规则字符串', prop: 'value' }
      ],
      inputStr1:'',
      inputStr2:'',
      inputStr3:'',
      containerType: 'full',
      scrollDelay: 10,
      radio:1,
      radioString:'',
      addIcon:'el-icon-circle-plus',
      // menu,
      banner: {
        title: 'HL7规则管理',
        subTitle: '在这里可以进行HL7规则的添加,删除,更改等功能'
      },
      columns: [
        {
          title: '序号',
          key: 'order',
          align:'center',
          width: 100
        },
        {
          title: '规则字符串',
          key: 'value',
          align:'center'
        },
        {
          title:'规则字符串转义显示',
          key:'char_value',
          align:'center'
        },
        {
          title:'规则字符串ASCII码显示',
          key:'number_value',
          align:'center'
        }
      ],
      mid_data: [],
      loading: false,
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        pageCount:9,
        layout:'prev, pager, next, jumper, ->, total, slot'
      },
      editTemplate:{
        value:{
          title: '字符串',
          value: ''
        },
        char_value:{
          title: '转义字符串',
          value: ''
        },
        number_value:{
          title:'ASCII码十进制值',
          value:''
        },
        radio:{
          title:'修改选项：',
          component:{
            name:'el-radio',
            options:[
              {
                label:'字符串',
                value:1
              },
              {
                label:'转义字符串',
                value:2
              },
              {
                label:'ASCII十进制值',
                value:3
              },
              {
                label:'删除',
                value:4
              }
            ]
          }
        }
      },
      formOptions: {
        saveButtonIcon:'el-icon-edit',
        saveButtonText:'修改',
        saveLoading: false
      }
    }
  },
  computed: {
    data: function(){
      var x
      var i = 1
      for (x in this.mid_data){
        this.mid_data[x]['number_value'] = constant.characterDeal(this.mid_data[x]['value'])
        this.mid_data[x]['char_value'] = constant.charDeal(this.mid_data[x]['value'])
        this.mid_data[x]['order'] = (this.pagination['page'] - 1) * this.pagination['pageSize'] + i
        this.mid_data[x]['radio'] = 1
        i += 1
      }
      return this.mid_data
    },
    input1 : function(){
      
      if (this.radio != 1)
        this.inputStr1 = ''
      return this.radio != 1
    },
    input2: function(){
      if (this.radio != 2)
        this.inputStr2 = ''
      return this.radio != 2
    },
    input3:function(){
      if (this.radio != 3)
      this.inputStr3 = ''
      return this.radio != 3
    }
  },
  mounted() {
    this.load()
    this.fetchData()
  },
  watch: {
    radio:function(value){
      this.handleSet('radio', value)
      if (value === 1){
        this.handleSet('input', this.inputStr1)
      }else if (value === 2){
        this.handleSet('input', this.inputStr2)
      }else if (value === 4){
        this.handleSet('input', this.inputStr3)
      }
    },
    inputStr1:function(now, before){
      if (this.radio != 1)return;
      if (!(now === '') || (!(before==='') && now === '')){
        this.handleSet('input', now)
      }
    },
    inputStr2:function(now, before){
      if (this.radio != 2)return;
      if (!(now === '') || (!(before==='') && now === '')){
        this.handleSet('input', now)
      }
    },
    inputStr3:function(now, before){
      if (this.radio != 3)return;
      if (!(now === '') || (!(before==='') && now === '')){
        this.handleSet('input', now)
      }
    },
    pagination:function(value){
      this.handleSet('pagination', value)
    }
  },
  methods: {
    ...mapActions('d2admin/db', [
      'databasePage',
      'databasePageClear',
      'pageClear'
    ]),
    async load () {
      const db = await this.databasePage({
        user: true
      })
      var str = db.value()
      this.radio = str.radio
      if (str.radio){
        if (str.radio === 1){
          this.inputStr1 = str.input
        }else if (str.radio === 2){
          this.inputStr2 = str.input
        }else if (str.radio === 3){
          this.inputStr3 = str.input
        }
      }
      if (str.pagination){
        this.pagination = str.pagination
      }
    },
    async handleSet (name, value) {
      if (name === '') {
        return
      }
      const db = await this.databasePage({
        user: true
      })
      db
        .set(name, value)
        .write()
    },
    async handleClear () {
      await this.pageClear({ instance: this, user: true })
    },
    batchSubmit(){
      var success = 0
      var faild = 0
      var sum = 0
      for (var i = 0; i < this.table.data.length; i++){
        var row = {}
        row['规则字符串'] = this.table.data[i]['规则字符串']
        addHL7Rule({
          ...row
        }).then(res=>{
          sum ++
          if (res.status === 200){
            success ++
          }else{
            faild ++
          }
          if (sum === this.table.data.length){
            this.$notify({
              title:'批量添加信息',
              message:'失败:'+String(faild) +"成功:" + String(success),
              type:'success'
            })
          }
        }).catch(err => {
          sum ++
          faild ++
          if (sum === this.table.data.length){
            this.$notify({
              title:'批量添加信息',
              message:'失败:'+String(faild) +"成功:" + String(success),
              type:'success'
            })
          }
        })
      }
      this.dialogVisible = false
    },
    handleClose(done){
      this.batchSubmit()
      done()
    },
    handleUploadCsv (file) {
      this.$import.csv(file)
        .then(res => {
          this.table.columns = Object.keys(res.data[0]).map(e => ({
            label: e,
            prop: e
          }))
          this.table.data = res.data
          this.dialogVisible = true
        })
      return false
    },
    handleUploadXlsx (file) {
      this.$import.xlsx(file)
        .then(({ header, results }) => {
          this.table.columns = header.map(e => {
            return {
              label: e,
              prop: e
            }
          })
          this.table.data = results
          this.dialogVisible = true
        })
      return false
    },
    paginationCurrentChange (page) {
      this.pagination.page = page
      this.fetchData()
    },
    fetchData () {
      this.loading = true
      var param = {}
      param['pageSize'] = this.pagination.pageSize
      param['page'] = this.pagination.page
      getHL7Rule({
        ...param
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
      this.$refs.d2Crud.showDialog({
        mode:'edit',
        rowIndex : row.order - (this.pagination.page - 1)*this.pagination.pageSize  - 1
      })
    },
    handleDialogCancel(done){
      done()
    },
    handleRowEdit({index, row}, done){
      this.formOptions.saveLoading = true
      setTimeout(()=>{
        // console.log(index)
        // console.log(row)
        var newRow = {}
        newRow['id'] = row.id
        if (row.radio === 4){
          deleteHL7Rule({
            ...newRow
          }).then(res => {
            this.fetchData()
            this.$message({
              message:'删除成功',
              type:'success'
            })
            done()
            this.formOptions.saveLoading = false
          }).catch(err => {
            this.$message({
              message: '网络错误',
              type: 'warning'
            })
            this.formOptions.saveLoading = false
          })
        }
        else if (row.radio >= 1 && row.radio <= 3){
          newRow['value'] = (row.radio === 1 ? row.value : (row.radio === 2 ? constant.changeString(row.char_value) : constant.changeIntString(row.number_value)))
          updateHL7Rule({
            ...newRow
          }).then(res => {
            this.fetchData()
            this.$message({
              message:'更改成功',
              type:'success'
            })
            done()
            this.formOptions.saveLoading = false
          }).catch(err => {
            // console.log('err', err)
            this.$message({
              message: '网络错误',
              type: 'warning'
            })
            this.formOptions.saveLoading = false
            done()
          })
          
        }
      }, 300)
    },
    addItemInForm(){
      var newRow = {}
      if (this.radio === 1 && this.inputStr1 === ''){
        this.$message({
          message:'您的输入框输入为空',
          type:'warning'
        });
        return;
      }else if (this.radio === 2 && this.inputStr2 === ''){
        this.$message({
          message:'您的输入框输入为空',
          type:'warning'
        });
        return;
      }else if (this.radio === 3 && this.inputStr3 === ''){
        this.$message({
          message:'您的输入框输入为空',
          type:'warning'
        });
        return;
      }
      newRow['value'] = (this.radio === 1 ? this.inputStr1 : (this.radio === 2 ? constant.changeString(this.inputStr2) : constant.changeIntString(this.inputStr3)))
      addHL7Rule({
        ...newRow
      }).then(res => {
        if (res['status'] === 200){
          this.handleClear()
          this.$notify({
            title: 'HL7规则添加成功',
            message: res['data'],
            type: 'success'
          });
          this.inputStr1 = ''
          this.inputStr2 = ''
          this.inputStr3 = ''
        }else{
          this.$notify({
            title: 'HL7添加出现问题',
            message: res['message'],
            type: 'warning'
          });
        }
      }).catch(err => {
        this.$notify.error({
          title: '错误',
          message: '网络连接发生错误'
        });
      })
    },
    downloadAllDataTranslate (data) {
      var num = 0
      return data.map(row => ({
        ...row,
        order: num+=1
      }))
    },
    exportExecl(execl_columns, execl_data){
      this.$export.excel({
        title: 'HL7过滤规则',
        columns: execl_columns,
        data: this.downloadAllDataTranslate(execl_data)
      }).then(() => {
        this.$message('导出表格成功')
      })
    },
    exportCvs(cvs_columns, cvs_data){
      this.$export.csv({
        title: 'HL7过滤规则',
        columns: cvs_columns,
        data: this.downloadAllDataTranslate(cvs_data)
      }).then(() => {
        this.$message('导出CSV成功')
      })
    },
    handleDownloadAllXlsx () {
      if (this.pagination.total > 10000){
        this.$notify({
          'message':'下载数据量过大，需要一些时间'
        })
      }
      setTimeout(()=>{
        if (this.currentTableData.length != this.pagination.total){
          var now = {}
          now['pageSize'] = this.pagination.total
          now['page'] = 1
          this.loading = true
          getHL7Rule({
            ...now
          }).then(res => {
            if (res.status === 200){
              this.currentTableData = res.data
              this.exportExecl(this.downloadColumns, res.data)
            }else{
              this.$message({
                'message':res.message,
                'type':'warning'
              })
            }
            this.loading = false
          }).catch(err => {
            this.loading = false
          })
        }else{
          this.exportExecl(this.downloadColumns, this.currentTableData)
        }
      },300)
    },
    handleDownloadAllCsv (data) {
      if (this.pagination.total > 10000){
        this.$notify({
          'message':'下载数据量过大，需要一些时间'
        })
      }
      setTimeout(()=>{
        if (this.currentTableData.length != this.pagination.total){
          var now = {}
          now['pageSize'] = this.pagination.total
          now['page'] = 1
          this.loading = true
          getHL7Rule({
            ...now
          }).then(res => {
            if (res.status === 200){
              this.currentTableData = res.data
              this.exportCvs(this.downloadColumns, res.data)
            }else{
              this.$message({
                'message':res.message,
                'type':'warning'
              })
            }
            this.loading = false
          }).catch(err => {
            this.loading = false
          })
        }else{
          this.exportCvs(this.downloadColumns, this.currentTableData)
        }
      },300)
    }
    
  },
}
</script>
