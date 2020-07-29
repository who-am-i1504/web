<template>
  <d2-container :type="containerType" :scroll-delay="scrollDelay" better-scroll>
    <template slot="header">
      <div style="margin: -16px;" class="panel-search">
        <el-input class="panel-search__input" placeholder="IP地址" v-model="inputStr2">
          <el-button @click="searchItemInForm" slot="append">
            <d2-icon name="search" />搜索
          </el-button>
        </el-input>
      </div>
    </template>
    <el-form :inline="true" size="mini">
      <el-form-item :label="`全部数据下载 [ ${pagination.total} ] 条`">
        <el-button-group>
          <el-button
            type="primary"
            size="mini"
            :disabled="pagination.total === 0"
            @click="handleDownloadAllXlsx()"
          >xlsx</el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="pagination.total === 0"
            @click="handleDownloadAllCsv()"
          >csv</el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item :label="`已选数据下载 [ ${multipleSelection.length} ] 条`">
        <el-button-group>
          <el-button
            type="primary"
            size="mini"
            :disabled="multipleSelection.length === 0"
            @click="handleDownloadXlsx(multipleSelection)"
          >xlsx</el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="multipleSelection.length === 0"
            @click="handleDownloadCsv(multipleSelection)"
          >csv</el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item>
        <el-popover
          placement="top-start"
          title="提示"
          width="200"
          trigger="hover"
          content="当下载数据量过大时，下载时间将会过长，甚至将会造成崩溃。建议发生此类情况时，使用选定数据下载。"
        >
          <el-button slot="reference" style="margin-left: 20px; margin-top: 3px;" circle>
            <d2-icon name="question-circle-o" />
          </el-button>
        </el-popover>
      </el-form-item>
    </el-form>
    <d2-crud
      style="margin: -20px;"
      ref="d2Crud"
      selection-row
      expand-row
      :options="options"
      :columns="columns"
      :data="data"
      @selection-change="handleSelectionChange"
      :form-options="formOptions"
      @dialog-cancel="handleDialogCancel"
      @row-dblclick="doubleClick"
      @row-edit="handleRowEdit"
      :loading="loading"
    >
      <template slot="sender_tagSlot" slot-scope="scope">
        <send-cell
          :value="scope.row.sender_tag"
          :scope="scope"
          @click="showGraph(scope.row.send_ip_port, scope.row.sender_tag)"
        ></send-cell>
      </template>
      <template slot="receiver_tagSlot" slot-scope="scope">
        <receiver-cell
          :value="scope.row.receiver_tag"
          :scope="scope"
          @click="showGraph(scope.row.receiver_ip_port, scope.row.receiver_tag)"
        ></receiver-cell>
      </template>
      <template slot="expandSlot" slot-scope="scope">
        <el-input type="textarea" placeholder="内容" :rows="5" v-model="scope.row.content"></el-input>
        <!-- <div> -->
        <!-- <SplitPane :min-percent='10' :default-percent='50' split="vertical"> -->
        <el-form slot="paneL" ref="form" :model="scope.row" :fullscreen="true">
          <el-row>
            <!-- <el-col :span="4"> -->
            <template v-for="(key, index) in list">
              <el-col :span="12">
                <el-form-item :label="list_name[index]">
                  <el-button type="text">{{scope.row[key]}}</el-button>
                </el-form-item>
              </el-col>
            </template>
            <!-- </el-col> -->
            <el-col :span="4">
              <image slot="paneR" :value="scope.row['image_path']" />
            </el-col>
          </el-row>
          <!-- <slot name="FormBodyAppendSlot" :form="scope.row" /> -->
        </el-form>

        <!-- </SplitPane> -->
        <!-- </div> -->
      </template>
    </d2-crud>
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
      <el-dialog
        title="关系网络图"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose"
        v-bind="dialogOptions"
        :class="{'d2-crud-dialog':true}"
      >
        <template slot="title">
        关系网络图
        <slot name="FormHeaderSlot" />
        <button v-if="dialogOptions.fullscreen!=null" type="button"  class="el-dialog__headerbtn fullscreen" @click="dialogOptions.fullscreen = !dialogOptions.fullscreen" ><i class="el-dialog__close el-icon el-icon-full-screen"></i></button>
        </template>

        <div ref="chart" style="width:100%;height:70vh;"></div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </d2-container>
</template>

<script>
// import { AstmCollect, AstmDetail, AstmSearch } from '@api/collect.data'
import { getMonitorHL7, HL7Graph } from "@api/monitor";
import Vue from "vue";
import { mapActions } from "vuex";
import SplitPane from "vue-splitpane";
import sendCell from "./component/sendCell";
import receiverCell from "./component/receiverCell";
Vue.component("SplitPane", SplitPane);
export default {
  data() {
    return {
      dialogOptions:{
        fullscreen:false
      },
      content: "",
      dialogVisible: false,
      currentTableData: [],
      multipleSelection: [],
      inputStr2: "",
      containerType: "full",
      scrollDelay: 50,
      radioString: "",
      addIcon: "el-icon-circle-plus",
      columns: [
        {
          title: "序号",
          key: "order",
          align: "center",
          width: 90,
          showOverflowTooltip: true,
        },
        {
          title: "类型",
          key: "type",
          align: "center",
          showOverflowTooltip: true,
        },
        {
          title: "发送方IP地址及端口号",
          key: "sender_tag",
          align: "center",
          showOverflowTooltip: true,
          // showOverflowTooltip:true,
          // component:{
          //   name:sendCell
          // },
          rowSlot: true,
        },
        {
          title: "接收方IP地址及端口号",
          key: "receiver_tag",
          showOverflowTooltip: true,
          align: "center",
          // showOverflowTooltip:true,
          // component:{
          //   name:receiverCell
          // }
          rowSlot: true,
        },
        // {
        //   title:'序列号',
        //   key:'seqnumber',
        //   align:'center',
        //   showOverflowTooltip:true
        // },
        // {
        //   title:'发送时间',
        //   key:'time',
        //   align:'center',
        //   showOverflowTooltip:true
        // },
        // {
        //   title:'版本号',
        //   key:'version',
        //   align:'center',
        //   showOverflowTooltip:true
        // },
        {
          title: "数据大小",
          key: "size",
          align: "center",
          showOverflowTooltip: true,
        },
      ],
      downloadColumns: [
        { label: "序号", prop: "order" },
        { label: "类型", prop: "type" },
        { label: "发送方IP地址及端口号", prop: "send_ip_port" },
        { label: "接收方IP地址及端口号", prop: "receiver_ip_port" },
        { label: "序列号", prop: "seqnumber" },
        { label: "发送时间", prop: "time" },
        { label: "版本号", prop: "version" },
        { label: "数据大小", prop: "size" },
        { label: "详细内容", prop: "content1" },
        { label: "ID", prop: "id" },
      ],
      mid_data: [],
      loading: false,
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        pageCount: 9,
        layout: "prev, pager, next, jumper, ->, total, slot",
      },
      formOptions: {
        saveButtonIcon: "el-icon-edit",
        saveButtonText: "修改",
        saveLoading: false,
      },
      options: {
        size: "mini",
        stripe: true,
      },
      searching: false,
      searchRequest: {},
      list: ["seqnumber", "type", "size", "version", "time"],
      list_name: ["序列号", "消息类型", "数据大小", "协议版本", "发送时间"],
      webkitDep: {
        type: "force",
        nodes: [],
        links: [],
        categories: [
          {
            name: "正常IP",
            keyword: {},
            base: "HTMLElement",
          },
          {
            name: "可疑IP",
            keyword: {},
            base: "WebGLRenderingContext",
          },
        ],
      },
      nodes: {},
      midCount: 0,
      count: 0,
      nodeSize: {
        1: 50,
        2: 35,
        3: 10,
      },
      myChart: "",
    };
  },
  components: {
    sendCell,
    receiverCell,
  },
  watch: {
    pagination: function (value) {
      this.handleSet("pagination", value);
    },
  },
  computed: {
    data: function () {
      var x;
      var i = 1;
      for (x in this.mid_data) {
        this.mid_data[x]["order"] =
          (this.pagination["page"] - 1) * this.pagination["pageSize"] + i;
        i += 1;
      }
      return this.mid_data;
    },
    whichShow: function () {
      return !this.searching;
    },
    options_graph: function () {
      const webkitDep = this.webkitDep;
      return {
        title: {
            text: 'HL7局部网络结构',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        legend: {
          data: webkitDep.categories,
        },
        series: [
          {
            roam:true,
            type: "graph",
            layout: "force",
            animation: false,
            label: {
              position: "right",
              formatter: "{b}",
            },
            draggable: true,
            data: webkitDep.nodes.map(function (node, idx) {
              // console.log(node)
              return {
                symbolSize: node.size,
                id: idx,
                name: node.name,
                value: node.value,
                category: node.category,
              };
              
            }),
            categories: webkitDep.categories,
            force: {
              edgeLength: 100,
              repulsion: 200,
              // gravity: 0.2,
            },
            edges: webkitDep.links,
          },
        ],
      };
    },
  },
  mounted() {
    this.fetchData();
    // this.initHL7Grapth();
    // this.getHL7Grapth();
  },
  methods: {
    showGraph(ip_port, tag) {
      this.midCount = 0;
      this.count = 0;
      this.dialogVisible = true;
      const ip = ip_port.substring(0, ip_port.lastIndexOf(":"));
      this.webkitDep.nodes = [];
      this.webkitDep.links = [];
      this.nodes = {};
      var x = this.webkitDep.nodes.push({
        fixed:true,
        name: ip,
        value: 1,
        category: tag ? 1 : 0,
        size: this.nodeSize[1],
      });
      this.nodes[ip] = x - 1;
      this.getHL7IP(ip, 2);
    },
    getHL7IP(ip, depth) {
      if (depth > 3) return;
      HL7Graph({
        ip: ip,
      })
        .then((res) => {
          if (res.status === 200) {
            for (var x in res.data) {
              const src = res.data[x].send_ip;
              const dst = res.data[x].receiver_ip;
              if (this.nodes[src] === undefined) {
                var index = this.webkitDep.nodes.push({
                  name: src,
                  value: 1,
                  category: res.data[x].sender_tag,
                  size: this.nodeSize[depth],
                });
                this.nodes[src] = index - 1;
                if (depth == 2){
                  this.count += 1
                }
                this.getHL7IP(src, depth + 1);
              }
              if (this.nodes[dst] === undefined) {
                var index = this.webkitDep.nodes.push({
                  name: dst,
                  value: 1,
                  category: res.data[x].receiver_tag,
                  size: this.nodeSize[depth],
                });
                this.nodes[dst] = index - 1;
                if (depth == 2){
                  this.count += 1
                }
                this.getHL7IP(dst, depth + 1);
              }
              // console.log(this.webkitDep,src, dst)
              this.webkitDep.links.push({
                source: this.nodes[src],
                target: this.nodes[dst],
              });
            }
            if (depth === 2) {
              // this.count = res.data.length;
            } else if (depth === 3) {
              this.midCount += 1;
              if (this.midCount === this.count) {
                this.getHL7Grapth();
              }
            }
            // console.log(200,this.count, this.midCount)
          } else {
            if (depth === 3) {
              this.midCount += 1;
              if (this.midCount === this.count) {
                this.getHL7Grapth();
              }
            }
            //  console.log( 'others',this.count, this.midCount)
          }
        })
        .catch((err) => {
          if (depth === 3) {
            this.midCount += 1;
            if (this.midCount === this.count) {
              this.getHL7Grapth();
            }
          }
          //  console.log('error',this.count, this.midCount)
        });
    },
    getHL7Grapth() {
      // console.log('here')
      // console.log(this.myChart)
      if (this.myChart === "") {
        // this.initHL7Grapth()
      } else {
        this.myChart.dispose();
      }
      this.initHL7Grapth();
      // this.myChart.setOption(this.options_graph)
    },
    initHL7Grapth() {
      // console.log('init')
      const chart = this.$refs.chart;
      if (chart) {
        const myChart = this.$echarts.init(chart);
        myChart.setOption(this.options_graph);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
        this.myChart = myChart;
        // console.log(this.myChart)
      }
      this.$on("hook:destroyed", () => {
        window.removeEventListener("resize", function () {
          myChart.resize();
        });
      });
    },
    handleClose(done) {
      done();
    },
    paginationCurrentChange(page) {
      this.pagination.page = page;
      this.fetchData();
    },
    fetchData() {
      this.loading = true;
      var para = {};
      para["page"] = this.pagination.page;
      para["pageSize"] = this.pagination.pageSize;
      if (this.whichShow) {
      } else {
        for (var x in this.searchRequest) {
          para[x] = this.searchRequest[x];
        }
      }
      getMonitorHL7({
        ...para,
      })
        .then((res) => {
          this.mid_data = res.data;
          this.pagination.total = res.size;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
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
    doubleClick(row, event) {
      // this.$refs.d2Crud.showDialog({
      //   mode:'edit',
      //   rowIndex : row.order - (this.pagination.page - 1)*this.pagination.pageSize  - 1
      // })
      this.content =
        "<strong>" + row.content.replace(/\n/g, "<br><br>") + "</strong>";
      this.dialogVisible = true;
    },
    handleDialogCancel(done) {
      done();
    },
    handleRowEdit({ index, row }, done) {
      this.formOptions.saveLoading = true;
      setTimeout(() => {}, 300);
    },
    searchItemInForm() {
      this.searching = false;
      var newRow = {};
      if (this.inputStr2 === "") {
        this.$message({
          message: "您的IP地址输入框输入为空",
          type: "warning",
        });
        return;
      } else {
        // 此处正则表达式主要匹配以下几种情况 如果格式不正确则返回相关的提示信息
        // 1 ip 127.0.0.1
        // 2 ip:  127.0.0.1:
        // 3 ip:port 127.0.0.1:8080
        let re = new RegExp(
          "(^((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}$)|(^((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}:[0-9]{0,5}$)|(^:[0-9]{1,5}$)"
        );
        if (!re.test(this.inputStr2)) {
          this.$notify({
            title: "IP地址和端口号输入不正确",
            message:
              "<strong>主要有以下几种形式:</strong><br><i>ip    127.0.0.1</i><br><i>ip:     127.0.0.1:</i><br><i>ip:port     127.0.0.1:8080</i><br><i>:port     :8080</i>",
            type: "warining",
            dangerouslyUseHTMLString: true,
          });
          return;
        }
        if (this.inputStr2.indexOf(":") == -1) {
          newRow["ip"] = this.inputStr2;
        } else {
          if (this.inputStr2.indexOf(":") === this.inputStr2.length - 1) {
            newRow["ip"] = this.inputStr2.substring(
              0,
              this.inputStr2.length - 1
            );
          } else if (this.inputStr2.indexOf(":") == 0) {
            value = Number(this.inputStr2.substring(1).trim());
            if (!isNaN(value)) {
              newRow["port"] = value;
            }
            this.$message({
              message: "端口号取整出现问题",
              type: "warning",
            });
            return;
          } else {
            this.$message({
              message: "其他错误",
              type: "warning",
            });
            return;
          }
        }
      }
      this.searchRequest = newRow;
      this.searching = true;
      this.fetchData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    downloadDataTranslate(data) {
      return data.map((row) => ({
        ...row,
      }));
    },
    handleDownloadXlsx(data) {
      this.$export
        .excel({
          title: "Astm部分数据",
          columns: this.downloadColumns,
          data: this.downloadDataTranslate(data),
        })
        .then(() => {
          this.$message("导出表格成功");
        });
    },
    handleDownloadCsv(data) {
      this.$export
        .csv({
          title: "Astm部分数据",
          columns: this.downloadColumns,
          data: this.downloadDataTranslate(data),
        })
        .then(() => {
          this.$message("导出CSV成功");
        });
    },
    downloadAllDataTranslate(data) {
      var num = 0;
      return data.map((row) => ({
        ...row,
        order: (num += 1),
        content1: row.content.replace(/\n/g, " "),
      }));
    },
    exportExecl(execl_columns, execl_data) {
      this.$export
        .excel({
          title: "Astm数据概述",
          columns: execl_columns,
          data: this.downloadAllDataTranslate(execl_data),
        })
        .then(() => {
          this.$message("导出表格成功");
        });
    },
    exportCvs(cvs_columns, cvs_data) {
      this.$export
        .csv({
          title: "Astm数据概述",
          columns: cvs_columns,
          data: this.downloadAllDataTranslate(cvs_data),
        })
        .then(() => {
          this.$message("导出CSV成功");
        });
    },
    handleDownloadAllXlsx() {
      if (this.pagination.total > 10000) {
        this.$notify({
          message: "下载数据量过大，需要一些时间",
        });
      }
      setTimeout(() => {
        if (this.currentTableData.length != this.pagination.total) {
          if (this.whichShow) {
            var params = {};
            params["pageSize"] = this.pagination.total;
            params["page"] = 1;
            getMonitorHL7({
              ...params,
            })
              .then((res) => {
                if (res.status === 200) {
                  this.currentTableData = res.data;
                  this.exportExecl(this.downloadColumns, res.data);
                } else {
                  this.$message({
                    message: res.message,
                    type: "warining",
                  });
                }
              })
              .catch((err) => {
                this.$message({
                  message: "网络错误",
                  type: "error",
                });
              });
          } else {
            var params = this.searchRequest;
            params["pageSize"] = this.pagination.total;
            params["page"] = 1;
            getMonitorHL7({
              ...params,
            })
              .then((res) => {
                if (res.status === 200) {
                  this.currentTableData = res.data;
                  this.exportExecl(this.downloadColumns, res.data);
                } else {
                  this.$message({
                    message: res.message,
                    type: "warining",
                  });
                }
              })
              .catch((err) => {
                this.$message({
                  message: "网络错误",
                  type: "error",
                });
              });
          }
        } else {
          this.exportExecl(this.downloadColumns, this.currentTableData);
        }
      }, 300);
    },
    handleDownloadAllCsv(data) {
      if (this.pagination.total > 10000) {
        this.$notify({
          message: "下载数据量过大，需要一些时间",
        });
      }
      setTimeout(() => {
        if (this.currentTableData.length != this.pagination.total) {
          if (this.whichShow) {
            var params = {
              pageSize: this.pagination.total,
              page: 1,
            };
            getMonitorHL7({
              ...params,
            })
              .then((res) => {
                if (res.status === 200) {
                  this.currentTableData = res.data;
                  this.exportCvs(this.downloadColumns, res.data);
                } else {
                  this.$message({
                    message: res.message,
                    type: "warining",
                  });
                }
              })
              .catch((err) => {
                this.$message({
                  message: "网络错误",
                  type: "error",
                });
              });
          } else {
            var params = this.searchRequest;
            params["pageSize"] = this.pagination.total;
            params["page"] = 1;
            getMonitorHL7({
              ...params,
            })
              .then((res) => {
                this.loading = false;
                if (res.status === 200) {
                  this.currentTableData = res.data;
                  this.exportCvs(this.downloadColumns, res.data);
                } else {
                  this.$message({
                    message: res.message,
                    type: "warning",
                  });
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$message({
                  message: "网络错误",
                  type: "error",
                });
              });
          }
        } else {
          this.exportCvs(this.downloadColumns, this.currentTableData);
        }
      }, 300);
    },
  },
};
</script>
<style lang="scss" scoped>
.panel-search {
  @extend %unable-select;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  .panel-search__input {
    text-align: center;
    width: 800px;
  }
}
.place {
  @extend %unable-select;
  align-items: center;
}
.d2-crud-dialog{
  .el-dialog__headerbtn{
    padding:10px;
    top:12px;
    &.fullscreen {
      right:55px;
    }
  }
  &.d2p-drag-dialog{
    .is-fullscreen{
      left:0px !important;
      top:0px !important;
      .el-dialog__header{
        cursor: auto !important;
      }
    }
  }
}
</style>