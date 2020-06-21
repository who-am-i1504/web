<template>
  <d2-container>
    <template slot="header" style="background-color: rgba(#000, .7);">
        <div style="margin: -16px; background-color:rgba(#000, .7);">
          <el-form
            :inline="true"
            :model="userForm"
            ref="form"
            size="mini"
            class="header">
            <el-form-item label="用户名">
              <el-input v-model="userForm.username" placeholder="用户名，不能重复" size="small"></el-input>
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="userForm.name" placeholder="昵称" size="small"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="userForm.password" placeholder="密码" size="small"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button
                size="small"
                @click="addNewUser">
                <d2-icon name="plus"/>
                新增用户
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <d2-crud
        style="margin: -20px; background-color: rgba(#000, .7); color: #FFF;"
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
            :page-sizes="[20, 40, 80, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            style="margin: -10px;"
            @size-change="handleSizeChange"
            @current-change="paginationCurrentChange"
            @prev-click="handlePaginationPrevClick"
            @next-click="handlePaginationNextClick">
          </el-pagination>
      </el-card>
  </d2-container>
</template>

<script>
import { getUserList, UpdateUser, DeleteUser } from '@api/user.data'
import Vue from 'vue'
import util from '@/libs/util.js'
import SplitPane from 'vue-splitpane'
import XLSX from 'xlsx'
Vue.component('SplitPane', SplitPane)
export default {
  data () {
    return {
      userForm:{
        username:'',
        password:'',
        name:''
      },
      loading: false,
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        pageCount:9,
        layout:'prev, pager, next, jumper, ->, total, slot'
      },
      mid_data:[],
      editTemplate:{
        name:{
          title: '昵称',
          value: ''
        },
        password:{
          title: '昵称',
          value: ''
        },
        radio:{
          title:'修改选项：',
          component:{
            name:'el-radio',
            options:[
              {
                label:'修改',
                value:1
              },
              {
                label:'删除',
                value:2
              }
            ]
          }
        }
      },
      columns: [
        {
          title: 'uuid',
          key: 'uuid',
          align:'center',
        },
        {
          title:'昵称',
          key:'name',
          align:'center'
        },
        {
          title: '用户名',
          key: 'username',
          align:'center'
        },
        {
          title:'密码',
          key:'password',
          align:'center'
        },
      ],
      formOptions: {
        saveButtonIcon:'el-icon-edit',
        saveButtonText:'修改',
        saveLoading: false,
        "append-to-body":true,
        "lock-scroll":true,
        'size':'mini'
      },
      radio:1
    }
  },
  computed: {
    data:function(){
      var i = 1
      for (var x in this.mid_data){
        this.mid_data[x]['order'] = (this.pagination['page'] - 1) * this.pagination['pageSize'] + i
        this.mid_data[x]['radio'] = 1
        i += 1
      }
      return this.mid_data
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      getUserList({
        ...this.pagination
      }).then(res => {
        // console.log(res)
        if (res.status === 200){
          this.mid_data = res.data
          this.pagination.total = res.size
        }else{
          this.$message({
            'message':res.message,
            'type':'warning'
          })
        }
        this.loading = false
      }).catch(err => {
        this.$message({
          'message':'网络错误',
          'type':'error'
        })
        this.loading = false
      })
    },
    addNewUser(){
     
    },
    paginationCurrentChange (page) {
      this.pagination.page = page
      this.fetchData()
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
        this.formOptions.saveLoading = true
        var newRow = {}
        newRow['username'] = row.username
        newRow['name'] = row.name
        newRow['password'] = row.password
        newRow['uuid'] = row.password
        newRow['token'] = util.cookies.get('token')
        if (row.radio === 2){
          DeleteUser({
            ...newRow
          }).then(res => {
            if (res.status === 200){
              this.fetchData()
              this.$message({
                message:'删除成功',
                type:'success'
              })
            }else{
              this.fetchData()
              this.$message({
                message:res.message,
                type:'warning'
              })
            }
            done()
            this.formOptions.saveLoading = false
          }).catch(err => {
            this.$message({
              message: '网络错误',
              type: 'warning'
            })
            this.formOptions.saveLoading = false
          })
        }else if (row.radio == 1){
          UpdateUser({
            ...newRow
          }).then(res => {
            if (res.status === 200){
              this.fetchData()
              this.$message({
                message:'更改成功',
                type:'success'
              })
            }else{
              this.fetchData()
              this.$message({
                message:res.message,
                type:'warning'
              })
            }
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
  },
}
</script>

<style lang="scss" scoped>
.header{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: -20px;
  margin-top: 20px;
}
</style>
