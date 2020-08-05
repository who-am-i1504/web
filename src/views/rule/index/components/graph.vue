<template>
  <div ref="rulechart" style="width:100%; height:100%">
    <!-- <div class="inner">
      <ve-pie :data="newChartData" :settings="chartSettings" v-bind="pubSetting"></ve-pie>
    </div> -->
  </div>  
</template>

<script>
import menu from "@/menu/modules/demo-playground";
import list from "@/views/_mixin/list.js";
import { getRule } from "@api/demo.business.table.1";

export default {
  mixins: [list],
  data() {
    // this.chartSettings = {
    //   radius: 150,
    //   offsetY: 250
    // }
    return {
      menu,
      banner: {
        title: "HL7规则管理",
        subTitle: "在这里可以进行HL7规则的添加,删除,更改等功能",
      },
      chartSettings: {
        radius: 150,
        offsetY: 250,
        label: "传输规则数目示意图",
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
      chart:undefined
    };
  },
  computed: {
    newChartData: function () {
      return this.chartData;
    },
    options: function () {
      return {
        title: {
          text: "采集规则",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["HL7", "DICOM", "ASTM"],
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data:this.chartData.rows.map(function (row, idx) {
              return {
                name: row['协议类型'],
                value: row['数量'],
              };
            }),
            // [
            //   { value: 335, name: "直接访问" },
            //   { value: 310, name: "邮件营销" },
            //   { value: 234, name: "联盟广告" },
            //   { value: 135, name: "视频广告" },
            //   { value: 1548, name: "搜索引擎" },
            // ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    getGrapth() {
      const chart = this.$refs.rulechart;
      if (chart) {
        const myChart = this.$echarts.init(chart);
        const option = this.options;
        myChart.setOption(option);
        this.chart = myChart;
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
      getRule({
        ...this.pagination,
      })
        .then((res) => {
          this.chartData.rows = res.data;
          if (this.chart){
            this.chart.dispose();
          }
          this.getGrapth()
          if (res.status != 200) {
            this.$message({
              message: res.message,
              type: "warning",
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