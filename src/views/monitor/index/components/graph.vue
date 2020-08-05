<template>
  <!-- <d2-container> -->
    <!-- <d2-module-index-banner slot="header" v-bind="banner"/> 
    <d2-module-index-menu :menu="menu"/>-->
    <!-- <template slot="header" style="margin-bottom: 5px">
      <template slot="prepend"></template>
      传输规则数目示意图
      <template slot="append">.com</template>
      <el-button slot="header" style="margin-bottom: 5px">自定义按钮1</el-button>
      <el-button slot="header" type="primary" round style="margin-bottom: 5px">自定义按钮2</el-button>
    </template>-->
    <!-- <template slot="header">
      <div class="d2-page-cover">
        <p class="d2-page-cover__title">疑似医疗数据传输泄露概述</p>
      </div>
    </template> -->

    <div class="page">
      <el-carousel class="d2-page-cover1" height="100%" trigger="click">
        <el-carousel-item>
          <!-- <el-card> -->
          <!-- <div class="inner">
              <ve-ring :data="newChartData" :settings="chartSettings" v-bind="pubSetting"></ve-ring>
          </div>-->
          <!-- </el-card> -->
          <div ref="allchart" style="width:100%;height:100%" />
        </el-carousel-item>
        <el-carousel-item>
          <div ref="hl7chart" style="width:100%; height:100%"></div>
        </el-carousel-item>
        <el-carousel-item>
          <div ref="dicomchart" style="width:100%; height:100%"></div>
        </el-carousel-item>
        <el-carousel-item>
          <div ref="astmchart" style="width:100%; height:100%"></div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- <el-card style="margin: -20px; height:400px">
      
    </el-card>
    <el-card style="margin: -20px; height:400px">
      
    </el-card>
    <el-card style="margin: -20px; height:400px">
      
    </el-card>
    <el-card style="margin: -20px; height:400px">
      
    </el-card>-->
  <!-- </d2-container> -->
</template>

<script>
import menu from "@/menu/modules/demo-playground";
import list from "@/views/_mixin/list.js";
import {
  monitorCount,
  AllHL7Graph,
  AllDICOMGraph,
  AllASTMGraph,
} from "@/api/monitor";

export default {
  mixins: [list],
  data() {
    // this.chartSettings = {
    //   radius: 150,
    //   offsetY: 250
    // }
    return {
      menu,
      // banner: {
      //   title: "HL7规则管理",
      //   subTitle: "在这里可以进行HL7规则的添加,删除,更改等功能",
      // },
      chartSettings: {
        // radius: 150,
        // offsetY:250,
        // label:'传输规则数目示意图'
        // roseType: 'radius'
      },
      chartData: {
        columns: ["协议类型", "数量"],
        // columns: ['日期', '访问用户'],
        rows: [
          // { '日期': '1/1', '访问用户': 1393 },
          // { '日期': '1/2', '访问用户': 3530 },
          // { '日期': '1/3', '访问用户': 2923 },
          // { '日期': '1/4', '访问用户': 1723 },
          // { '日期': '1/5', '访问用户': 3792 },
          // { '日期': '1/6', '访问用户': 4593 }
        ],
      },
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
    };
  },
  computed: {
    newChartData: function () {
      return this.chartData;
    },
    all_options: function () {
      var data = [];
      var columns = [];
      for (var x in this.chartData.rows) {
        data.push({
          value: this.chartData.rows[x]["数量"],
          name: this.chartData.rows[x]["协议类型"],
        });
        columns.push(this.chartData.rows[x]["协议类型"]);
      }
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          // orient: "vertical",
          // top:100,
          // left: 100,
          data: columns,
        },
        series: [
          {
            name: "可疑传输",
            type: "pie",
            radius: ["40%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: data,
          },
        ],
      };
      return option;
    },
  },
  mounted() {
    this.fetchData();
    this.getHL7IP();
    this.getDICOMIP();
    this.getASTMIP();
  },
  methods: {
    options(webkitDep) {
      return {
        title: {
          // subtext: 'Default layout',
          top: "top",
          left: "right",
        },
        legend: {
          data: webkitDep.categories,
          // top: 'bottom',
        },
        series: [
          {
            type: "graph",
            layout: "force",
            animation: false,
            label: {
              position: "right",
              formatter: "{b}",
            },
            draggable: true,
            roam: true,
            focusNodeAdjacency: true,
            edgeSymbol: ['', 'arrow'],
            data: webkitDep.nodes.map(function (node, idx) {
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
              repulsion: 100,
              // gravity: 0.5,
            },
            edges: webkitDep.links,
          },
        ],
      };
    },
    getHL7IP() {
      var webkitDep = {
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
      };
      var nodes = {};
      AllHL7Graph()
        .then((res) => {
          if (res.status === 200) {
            for (var x in res.data) {
              const src = res.data[x].send_ip;
              const dst = res.data[x].receiver_ip;
              if (nodes[src] === undefined) {
                var index = webkitDep.nodes.push({
                  name: src,
                  value: 1,
                  category: res.data[x].sender_tag,
                  size: 20,
                });
                nodes[src] = index - 1;
              }
              if (nodes[dst] === undefined) {
                var index = webkitDep.nodes.push({
                  name: dst,
                  value: 1,
                  category: res.data[x].receiver_tag,
                  size: 20,
                });
                nodes[dst] = index - 1;
              }
              webkitDep.links.push({
                source: nodes[src],
                target: nodes[dst],
              });
            }
            this.getHL7Grapth(webkitDep);
          }
        })
        .catch((err) => {});
    },
    getHL7Grapth(webkitDep) {
      const chart = this.$refs.hl7chart;
      if (chart) {
        const myChart = this.$echarts.init(chart);
        const option = this.options(webkitDep);
        option.title["text"] = "HL7网络拓扑图";
        myChart.setOption(option);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      }
      this.$on("hook:destroyed", () => {
        window.removeEventListener("resize", function () {
          myChart.resize();
        });
      });
    },
    getDICOMIP() {
      var webkitDep = {
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
      };
      var nodes = {};
      AllDICOMGraph()
        .then((res) => {
          if (res.status === 200) {
            for (var x in res.data) {
              const src = res.data[x].send_ip;
              const dst = res.data[x].receiver_ip;
              if (nodes[src] === undefined) {
                var index = webkitDep.nodes.push({
                  name: src,
                  value: 1,
                  category: res.data[x].sender_tag,
                  size: 20,
                });
                nodes[src] = index - 1;
              }
              if (nodes[dst] === undefined) {
                var index = webkitDep.nodes.push({
                  name: dst,
                  value: 1,
                  category: res.data[x].receiver_tag,
                  size: 20,
                });
                nodes[dst] = index - 1;
              }
              webkitDep.links.push({
                source: nodes[src],
                target: nodes[dst],
              });
            }
            this.getDICOMGrapth(webkitDep);
          }
        })
        .catch((err) => {});
    },
    getDICOMGrapth(webkitDep) {
      const chart = this.$refs.dicomchart;
      if (chart) {
        const myChart = this.$echarts.init(chart);
        const option = this.options(webkitDep);
        option.title["text"] = "DICOM网络拓扑图";
        myChart.setOption(option);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      }
      this.$on("hook:destroyed", () => {
        window.removeEventListener("resize", function () {
          myChart.resize();
        });
      });
    },
    getASTMIP() {
      var webkitDep = {
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
      };
      var nodes = {};
      AllASTMGraph()
        .then((res) => {
          if (res.status === 200) {
            for (var x in res.data) {
              const src = res.data[x].send_ip;
              const dst = res.data[x].receiver_ip;
              if (nodes[src] === undefined) {
                var index = webkitDep.nodes.push({
                  name: src,
                  value: 1,
                  category: res.data[x].sender_tag,
                  size: 20,
                });
                nodes[src] = index - 1;
              }
              if (nodes[dst] === undefined) {
                var index = webkitDep.nodes.push({
                  name: dst,
                  value: 1,
                  category: res.data[x].receiver_tag,
                  size: 20,
                });
                nodes[dst] = index - 1;
              }
              webkitDep.links.push({
                source: nodes[src],
                target: nodes[dst],
              });
            }
            this.getASTMGrapth(webkitDep);
          }
        })
        .catch((err) => {});
    },
    getASTMGrapth(webkitDep) {
      const chart = this.$refs.astmchart;
      if (chart) {
        const myChart = this.$echarts.init(chart);
        const option = this.options(webkitDep);
        option.title["text"] = "ASTM网络拓扑图";
        myChart.setOption(option);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      }
      this.$on("hook:destroyed", () => {
        window.removeEventListener("resize", function () {
          myChart.resize();
        });
      });
    },
    fetchData() {
      monitorCount()
        .then((res) => {
          this.chartData.rows = res.data;
          if (res.status != 200) {
            this.$message({
              message: res.message,
              type: "warning",
            });
          } else {
            const chart = this.$refs.allchart;
            if (chart) {
              const myChart = this.$echarts.init(chart);
              const option = this.all_options;
              // option.title["text"] = "";
              myChart.setOption(option);
              window.addEventListener("resize", function () {
                myChart.resize();
              });
            }
            this.$on("hook:destroyed", () => {
              window.removeEventListener("resize", function () {
                myChart.resize();
              });
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "网络错误",
            type: "error",
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.inner {
  position: absolute;
  top: 20px;
  right: 20px;
  bottom: 20px;
  left: 20px;
  height: 100%;
  width: 100%;
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
.page {
  @extend %unable-select;
  // $backgroundColor: #f0f2f5;
  background-color: rgba(white, 0);
  // ---
  // background-color: $backgroundColor;
  height: 100%;
  position: relative;
}
.d2-page-cover1 {
  height: 100%;
  background-color: rgba(white, 0);
  align-items: center;
}
</style>