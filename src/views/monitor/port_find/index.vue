<template>
  <d2-container>
    <div slot="header" class="panel-search">
      <SplitPane
        class="panel-search__input"
        :min-percent="20"
        :default-percent="80"
        split="vertical"
      >
        <el-input slot="paneL" placeholder="IP地址" v-model="ip"></el-input>
        <el-button @click="port_find" slot="paneR" icon="el-icon-search">端口粗略发现</el-button>
      </SplitPane>
      <br />
      <br />
      <br />
      <SplitPane
        class="panel-search__input"
        :min-percent="20"
        :default-percent="80"
        split="vertical"
      >
        <el-input slot="paneL" placeholder="端口" v-model="port"></el-input>
        <el-button @click="detail_find" slot="paneR" icon="el-icon-search">端口详细发现</el-button>
      </SplitPane>
    </div>
    <el-switch v-model="table" active-text="表格" inactive-text="Json 树" />
    <div class="loading-area"/>
    <div v-show="data.length > 0" class="loading-area1">
      <el-divider content-position="center">masscan端口发现结果</el-divider>
      <div v-show="!table">
        <tree-view
          :data="showMessage"
          :options="{rootObjectKey: '端口发现数据',modifiable: false}"
          @change-data="onChangeData"
        ></tree-view>
      </div>
      <div v-show="table">
        <d2-crud :columns="columns" :data="data" :options="options" />
      </div>
    </div>
    <div v-show="dataDetail.length > 0" class="loading-area2">
      <el-divider content-position="center">nmap端口发现结果</el-divider>
      <div v-show="!table">
        <tree-view
          :data="showDetailMessage"
          :options="{rootObjectKey: '端口发现详细数据',modifiable: false}"
          @change-data="onChangeData"
        ></tree-view>
      </div>
      <div v-show="table">
        <d2-crud :columns="columns_details" :data="dataDetail" :options="options_detail" />
      </div>
    </div>
  </d2-container>
</template>

<script>
import list from "@/views/_mixin/list.js";
import { acitvateFind, acitvateFindDetails } from "@api/monitor";
import { mapActions } from "vuex";
import { Loading } from "element-ui";
export default {
  mixins: [list],
  data() {
    return {
      table: true,
      columns: [
        {
          title: "IP地址",
          key: "ip",
          align: "center",
          width: 150,
          showOverflowTooltip: true
        },
        {
          title: "传输协议",
          key: "protocol",
          width: 50,
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "端口",
          key: "port",
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "结束时间",
          key: "endtime",
          width: 120,
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "探测方式",
          key: "reason",
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "探测时延(单位：ms)",
          key: "reason_ttl",
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "端口服务",
          key: "services",
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "端口状态",
          key: "state",
          align: "center",
          showOverflowTooltip: true
        }
      ],
      data: [],
      options: {
        border: true,
        spanMethod({ row, column, rowIndex, columnIndex }) {
          if (columnIndex === 0) {
            if (row["ip_num"] === 0) {
              return {
                rowspan: 0,
                colspan: 0
              };
            } else {
              return {
                rowspan: row["ip_num"],
                colspan: 1
              };
            }
          } else if (columnIndex === 1) {
            if (row["pro_num"] === 0) {
              return {
                rowspan: 0,
                colspan: 0
              };
            } else {
              return {
                rowspan: row["pro_num"],
                colspan: 1
              };
            }
          }
        }
      },
      ip: "",
      port: "",
      dataDetail: [],
      portStatus: {},
      ipList: [],
      portDetailStatus: {},
      columns_details: [
        {
          title: "IP地址",
          key: "ip",
          align: "center",
          width: 150,
          showOverflowTooltip: true,
        },
        {
          title: "mac地址",
          key: "mac",
          align: "center",
          width: 150,
          showOverflowTooltip: true
        },
        {
          title: "网卡设备",
          key: "mac_device",
          align: "center",
          width: 150,
          showOverflowTooltip: true
        },
        {
          title: "操作系统信息",
          key: "cpe",
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "传输协议",
          key: "protocol",
          width: 50,
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "端口",
          key: "port",
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "探测方式",
          key: "reason",
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "端口服务",
          key: "name",
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "端口状态",
          key: "state",
          align: "center",
          showOverflowTooltip: true
        },
        {
          title: "额外信息",
          key: "extrainfo",
          align: "center",
          showOverflowTooltip: true
        }
      ],
      options_detail: {
        size:"mini",
        border: true,
        spanMethod({ row, column, rowIndex, columnIndex }) {
          if (columnIndex < 4) {
            if (row["ip_num"] === 0) {
              return {
                rowspan: 0,
                colspan: 0
              };
            } else {
              return {
                rowspan: row["ip_num"],
                colspan: 1
              };
            }
          } else if (columnIndex === 4) {
            if (row["pro_num"] === 0) {
              return {
                rowspan: 0,
                colspan: 0
              };
            } else {
              return {
                rowspan: row["pro_num"],
                colspan: 1
              };
            }
          }
        }
      }
    };
  },
  computed: {
    showMessage: function() {
      this.data = [];
      var last_ip = undefined;
      for (var ip in this.portStatus) {
        var ip_num = 0;
        for (var protocol in this.portStatus[ip]) {
          var pro_num = 0;
          var last_pro = undefined;
          for (var port in this.portStatus[ip][protocol]) {
            var column = JSON.parse(
              JSON.stringify(this.portStatus[ip][protocol][port])
            );
            for (var x in column) {
              if (column[x] === "" || (typeof column[x] === Array && column[x].length == 0) || (typeof column[x] === Object && Object.getOwnPropertyNames(column[x]).length === 0)) {
                column[x] = "无";
              }
            }
            column["ip"] = ip;
            column["protocol"] = protocol;
            column["port"] = port;
            this.data.push(column);
            pro_num += 1;
            ip_num += 1;
            column["pro_num"] = 0;
            column["ip_num"] = 0;
            if (last_ip === undefined) {
              last_ip = column;
            }
            if (last_pro === undefined) {
              last_pro = column;
            }
          }
          last_pro["pro_num"] = pro_num;
          last_pro = undefined;
        }
        last_ip["ip_num"] = ip_num;
        last_ip = undefined;
      }
      return this.portStatus;
    },
    showDetailMessage: function() {
      this.dataDetail = [];
      var last_ip = undefined;
      var protocols = ["tcp", "udp"];
      for (var ip in this.portDetailStatus) {
        var ip_num = 0;
        var mac = this.portDetailStatus[ip]["addresses"]["mac"];
        var mac_device = this.portDetailStatus[ip]["vendor"][mac];
        var hostname = this.portDetailStatus[ip]["hostnames"][0]["name"];
        var hostnametype = this.portDetailStatus[ip]["hostnames"][0]["type"];
        for (var protocol in protocols) {
          protocol = protocols[protocol];
          if (this.portDetailStatus[ip][protocol] === undefined) continue;
          var pro_num = 0;
          var last_pro = undefined;
          for (var port in this.portDetailStatus[ip][protocol]) {
            var column = JSON.parse(
              JSON.stringify(this.portDetailStatus[ip][protocol][port])
            );
            for (var x in column) {
              if (column[x] === "") {
                column[x] = "无";
              }
            }
            column["ip"] = ip;
            column['mac'] = mac;
            column['mac_device'] = mac_device
            column["hostname"] = hostname;
            column["hostnametype"] = hostnametype;
            column["protocol"] = protocol;
            column["port"] = port;
            this.dataDetail.push(column);
            pro_num += 1;
            // console.log(ip_num)
            ip_num += 1;
            column["pro_num"] = 0;
            column["ip_num"] = 0;
            if (last_ip === undefined) {
              last_ip = column;
            }
            if (last_pro === undefined) {
              last_pro = column;
            }
          }
          last_pro["pro_num"] = pro_num;
          last_pro = undefined;
        }
        last_ip["ip_num"] = ip_num;
        last_ip = undefined;
      }
      return this.portDetailStatus;
    }
  },
  watch: {
    showOrNot: function(val, oldVal) {}
  },
  mounted() {
  },
  methods: {
    onChangeData: function(data) {
    },
    valid() {
      if (this.ip === "") {
        this.$message({
          message: "IP地址不能为空",
          type: "warning"
        });
        return -1;
      }
      let re = new RegExp(
        "((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}"
      );
      if (!re.test(this.ip)) {
        this.$message({
          message: "IP地址格式不正确",
          type: "warning"
        });
        return -1;
      }
      return 0;
    },
    port_find() {
      if (this.valid() == -1) return;
      var ip = {};
      this.portStatus = []
      ip["hosts"] = this.ip;
      if (this.port !== "") {
        ip["ports"] = this.port;
      }
      var loading = Loading.service({
        lock: true,
        text: "Loading...",
        target: document.querySelector(".loading-area") //设置加载动画区域
      });
      acitvateFind({
        ...ip
      })
        .then(res => {
          if (res.status === 200) {
            this.portStatus = res.data;
            if (res.data.length == 0) {
              this.$notify({
                title: "提示",
                dangerouslyUseHTMLString: true,
                message: "没有探测到任何端口",
                type: "success"
              });
            } else {
              this.$notify({
                title: "提示",
                dangerouslyUseHTMLString: true,
                message: "探测成功",
                type: "success"
              });
            }
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
          loading.close();
        })
        .catch(err => {
          this.$message({
            message: "网络连接错误",
            type: "error"
          });
          loading.close();
        });
    },
    detail_find() {
      if (this.valid() == -1) return;
      var ip = {};
      this.portDetailStatus = []
      ip["hosts"] = this.ip;
      if (this.port !== "") {
        ip["ports"] = this.port;
      }
      var loading = Loading.service({
        lock: true,
        text: "Loading...",
        target: document.querySelector(".loading-area") //设置加载动画区域
      });
      acitvateFindDetails({
        ...ip
      })
        .then(res => {
          if (res.status === 200) {
            this.portDetailStatus = res.data;
            if (res.data.length == 0) {
              this.$notify({
                title: "端口详细发现",
                dangerouslyUseHTMLString: true,
                message: "没有探测到任何端口",
                type: "success"
              });
            } else {
              this.$notify({
                title: "端口详细发现",
                dangerouslyUseHTMLString: true,
                message: "探测成功",
                type: "success"
              });
            }
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
          loading.close();
        })
        .catch(err => {
          this.$message({
            message: "网络连接错误",
            type: "error"
          });
          loading.close();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.panel-search {
  @extend %unable-select;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  margin: 30px;
  .panel-search__input {
    text-align: center;
    width: 800px;
  }
}
.inner {
  position: absolute;
  top: 20px;
  right: 20px;
  bottom: 20px;
  left: 20px;
}
.foot {
  margin: 0px;
  margin-bottom: -50px;
}
.btnTxt {
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
.el-table .cell {
  white-space: pre-line;
}
</style>