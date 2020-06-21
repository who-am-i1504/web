<template>
  <d2-container>
      <el-form 
        class="d2-page-cover" 
        ref="form"
        :rules="rules" 
        :model="form" 
        label-width="80px">
        <el-form-item label="原密码">
          <el-input type="password" v-model="form.sPsd" placeholder="请输入您原来的密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="form.nPsd" placeholder="请输入新的密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="form.conPsd" placeholder="请在此输入新的密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="default"
            @click="changePsd"
            type="primary"
            style="width: 100%;">
            确认更改
          </el-button>
        </el-form-item>
      </el-form>
  </d2-container>
</template>

<script>
import { } from '@api/monitor'
import Vue from 'vue'
import SplitPane from 'vue-splitpane'
import XLSX from 'xlsx'
Vue.component('SplitPane', SplitPane)
export default {
  data () {
    return {
      containerType: 'full',
      scrollDelay: 10,
      form:{
        sPsd:'',
        nPsd:'',
        conPsd:''
      },
      rules: {
        sPsd: [
          {
            required: true,
            message: '请输入原密码',
            trigger: 'blur'
          },
          {
            min:5,
            max:20,
            message:'密码长度应该在5到20位之间'
          }
        ],
        nPsd: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min:5,
            max:20,
            message:'密码长度应该在5到20位之间'
          }
        ],
        conPsd:[
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min:5,
            max:20,
            message:'密码长度应该在5到20位之间'
          }
        ]
      }
    }
  },
  computed: {
    
  },
  mounted() {
    
  },
  methods: {
    fetchData () {
      
      // getMonitorRule({
        
      // }).then(res => {
        
      // }).catch(err => {
        
      // })
    },
    changePsd(){
      if (this.form.nPsd === this.form.conPsd){

      }else{
        this.$message({
          message:'您输入的确认密码和新密码不一致，请重新输入',
          type:'error'
        })
        return;
      }
    }
    
  },
}
</script>

<style lang="scss" scoped>
.d2-page-cover {
  @extend %unable-select;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  top:50%;
}
</style>
