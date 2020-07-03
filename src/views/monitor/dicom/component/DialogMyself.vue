<template>
  <div style="cursor: pointer">
    <el-dialog
      v-if="isDialogShow"
      title="详情"
      :visible.sync="isDialogShow"
      :before-close="handleDialogCancel"
      :lock-scroll="true"
      :modal="false"
      width="100%"
      height="60%"
    >
    <el-container style="height:300px;">
      <el-form
        ref="form"
        :model="formData"
      >
        <!-- <el-row > -->
          <div v-for="(value, key, index) in formData" :key="index">
            <!-- <el-col
              v-if="handleFormTemplateMode(key) === undefine ? false:true"
              :span="handleFormTemplateMode(key).component.span === undefine ? 24 : handleFormTemplateMode(key).component.span"
            > -->
              <el-form-item
                v-if="handleFormTemplateMode(key) === undefine ? false:true"
                :label="handleFormTemplateMode(key).title"
                :prop="key"
              >
                <!-- <render-custom-component
                  v-if="handleFormTemplateMode(key).component.name"
                  v-model="formData[key]"
                  :component-name="handleFormTemplateMode(key).component.name"
                  :props="handleFormTemplateMode(key).component.props == undefine? null : handleFormTemplateMode(key).component.props"
                >
                </render-custom-component> -->
                  <!-- v-else-if="handleFormTemplateMode(key).component.render" -->
                <render-component
                  :render-function="handleFormTemplateMode(key).component.render"
                  :scope="formData[key]"
                >
                </render-component>
              </el-form-item>
            <!-- </el-col> -->
          </div>
        <!-- </el-row> -->
      </el-form>
    </el-container>
      <div slot="footer">
        <el-button >
        确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import renderComponent from './renderComponent'
import renderCustomComponent from './renderCustomComponent'
export default {
  props: {
    isDialogShow: {
      type: Boolean,
      require: true
    },
    // 本行的所有数据，此字段不需要额外配置
    formTemplate: {
      default: null
    },
    columns:{
      type:Array,
      default:null
    },
    // formData:{
    //     default:null
    // },
    // 通过 component 中 props 字段传过来的数据，此字段需要先在 component 中配置
    myProps: {
      default: null
    }
  },
  data() {
      return {
          formData:{}
      }
  },
  watch: {
    // isDialogShow(val){
    //   return val
    // }
  },
  components: {
    renderComponent,
    renderCustomComponent
    // d2Column
  },
  computed: {
  },
  methods: {
      handleFormTemplateMode(key){
        console.log(this.formTemplate[key])
          return this.formTemplate[key]
      },
      handleFormData(data){
          this.formData = data
      },
      handleDialogCancel(done){
        done()
      }
  },
}
</script>
<style>
.image {
    width: 100%;
    display: block;
}
</style>