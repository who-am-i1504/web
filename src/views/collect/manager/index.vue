<template>
  <d2-container :type="containerType" :scroll-delay="scrollDelay" >
    <template slot="header">
      <div style="margin: 0px;">
        <div class="d2-page-cover">
          <p class="d2-page-cover__title">数据采集任务状态</p>
        </div>
        <el-steps :active="active" align-center finish-status="success">
          <el-step title="等待捕获任务" icon="el-icon-switch-button"></el-step>
          <el-step title="数据捕获中" icon="el-icon-loading">
            <el-button>显示</el-button>
          </el-step>
          <el-step title="数据重组" icon="el-icon-menu"></el-step>
        </el-steps>
      </div>
    </template>
    <div class="d2-page-cover">
      <el-form
        :inline="true"
        ref="taskform"
        size="mini"
        label-width="auto"
        :model="taskform"
        class="demo-ruleForm"
      >
        <el-form-item
          label="选择采集协议"
          prop="protocol"
          :rules="[
                { required: true, message: '此字段不能为空'}
              ]"
        >
          <SplitPane style="width: 200px" :min-percent="10" :default-percent="100" split="vertical">
            <el-select slot="paneL" v-model="taskform.protocol" placeholder="协议">
              <el-option
                v-for="item in taskform.protocols"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </SplitPane>
        </el-form-item>

        <el-form-item
          label="采集时间"
          prop="time"
          :rules="[
                { required: true, message: '本字段不能为空'},
                { type: 'number', message: '时间必须为数字值'}
              ]"
        >
          <SplitPane style="width: 200px;" :min-percent="0" :default-percent="100" split="vertical">
            <el-input
              v-model.number="taskform.time"
              slot="paneL"
              size="small"
              placeholder="持续时间(单位：分钟)"
            ></el-input>
          </SplitPane>
        </el-form-item>

        <el-form-item label="特定端口(可选)" prop="port">
          <SplitPane style="width: 200px;" :min-percent="10" :default-percent="80" split="vertical">
            <el-input v-model.number="taskform.port" slot="paneL" size="small" placeholder="端口号"></el-input>
            <el-checkbox
              style="margin: 10px; margin-top: 5px;"
              slot="paneR"
              v-model="taskform.checkbox"
            >{{taskform.radioString}}</el-checkbox>
          </SplitPane>
        </el-form-item>

        <el-form-item>
          <el-button size="small" @click="operateTask('taskform')">
            <d2-icon name="search" />执行采集任务
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-divider content-position="center">采集结果列表</el-divider>
    <d2-crud
      style="margin: -20px;"
      ref="d2Crud"
      selection-row
      :options="options"
      :columns="columns"
      :data="data"
      :loading="loading"
    />
    <el-card style="margin: -10px;" slot="footer">
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
        @next-click="handlePaginationNextClick"
      ></el-pagination>
    </el-card>
  </d2-container>
</template>

<script>
import menu from "@/menu/modules/demo-playground";
import { getState, getResult, startTask } from "@api/collect.data";
import Vue from "vue";
import SplitPane from "vue-splitpane";
Vue.component("SplitPane", SplitPane);
export default {
  data() {
    return {
      taskform: {
        protocol: "",
        protocols: [
          {
            value: "HL7",
            label: "HL7"
          },
          {
            value: "DICOM",
            label: "DICOM"
          },
          {
            value: "ASTM",
            label: "ASTM"
          },
          {
            value: "HL7|DICOM",
            label: "HL7|DICOM"
          },
          {
            value: "DICOM|ASTM",
            label: "DICOM|ASTM"
          },
          {
            value: "HL7|ASTM",
            label: "HL7|ASTM"
          },
          {
            value: "HL7|DICOM|ASTM",
            label: "HL7|DICOM|ASTM"
          }
        ],
        time: "",
        port: "",
        checkbox: false
      },
      active: 0,
      containerType: "full",
      scrollDelay: 50,
      radioString: "",
      timer: "",
      columns: [
        {
          title: "序号",
          key: "order",
          align: "center",
          width: 90,
          showOverflowTooltip: true
        },
        {
          title: "端口",
          key: "port",
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "持续时间（单位：分钟）",
          key: "time",
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "任务提交时间",
          key: "submit",
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "任务开始时间",
          key: "start_time",
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "任务执行结束时间",
          key: "end_time",
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "捕获数据量",
          key: "size",
          align: "center",
          showOverflowTooltip: true
        }
      ],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        pageCount: 9,
        layout: "prev, pager, next, jumper, ->, total, slot"
      },
      options: {
        size: "mini",
        stripe: true
      },
      mid_data: [],
      loading: false,
    };
  },
  computed: {
    data: function() {
      var x;
      var i = 1;
      for (x in this.mid_data) {
        this.mid_data[x]["order"] =
          (this.pagination["page"] - 1) * this.pagination["pageSize"] + i;
        i += 1;
      }
      return this.mid_data;
    }
  },
  mounted() {
    this.timer = setInterval(this.setState, 1000);
    this.fetchData()
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    handleClose(done) {
      done();
    },
    setState() {
      getState({})
        .then(res => {
          if (res.status == 200) {
            this.active = res.data;
          }
        })
        .catch(err => {});
    },
    fetchData() {
      var params = {};
      params["page"] = this.pagination.page;
      params["pageSize"] = this.pagination.pageSize;
      this.loading = true
      getResult({
        ...params
      })
        .then(res => {
          if (res.status === 200) {
            this.mid_data = res.data;
            this.pagination.total = res.size;
          } else {
            this.$message({
              message: "网络连接异常",
              type: "warning"
            });
          }
          this.loading = false
        })
        .catch(err => {
          this.$message({
            message: "网络连接异常",
            type: "warning"
          });
          this.loading = false
        });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.fetchData();
    },
    paginationCurrentChange(val) {
      this.pagination.page = val;
      this.fetchData();
    },
    handlePaginationPrevClick(val) {
      this.pagination.page = val;
      this.fetchData();
    },
    handlePaginationNextClick(val) {
      this.pagination.page = val;
      this.fetchData();
    },
    operateTask(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 相关逻辑
          var data = {}
          data['protocol'] = this.taskform.protocol
          data['time'] = this.taskform.time
          if (this.taskform.port !== ''){
            data['port'] = this.taskform.port
          }
          startTask({
            ...data
          }).then(res => {
            if (res.status === 200){
              
            }else{

            }
          }).catch(res => {

          })
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style  lang="scss" scoped>
.d2-page-cover {
  @extend %unable-select;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  .d2-page-cover__title {
    margin: 20px;
    margin-bottom: 20px;
    font-weight: bold;
    color: $color-text-main;
    font-size: 20px;
  }
  .d2-page-cover__task {
    width: 90%;
  }
}
</style>
