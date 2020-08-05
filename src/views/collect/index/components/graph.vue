<template>
  <!-- <d2-container> -->
  <div ref="linechart" style="width:100%; height:100%">
    <!-- <div class="inner">
      <ve-line
        :data-zoom="dataZoom"
        :data="chartData"
        :settings="chartSettings"
        v-bind="pubSetting"
      ></ve-line>
    </div>-->
  </div>
  <!-- </d2-container> -->
</template>

<script>
import menu from "@/menu/modules/demo-playground";
import list from "@/views/_mixin/list.js";
import { collect } from "@api/collect.data";

export default {
  mixins: [list],
  data() {
    // this.chartSettings = {
    //   radius: 150,
    //   offsetY: 250
    // }
    return {
      menu,
      dataZoom: [
        {
          // 这个dataZoom组件，默认控制x轴。
          type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
          start: 10, // 左边在 10% 的位置。
          end: 60, // 右边在 60% 的位置。
        },
      ],
      //   banner: {
      //     title: "HL7规则管理",
      //     subTitle: "在这里可以进行HL7规则的添加,删除,更改等功能",
      //   },
      chartSettings: {
        radius: 150,
        offsetY: 250,
        legendName: "传输规则数目示意图",
        area: true,
      },
      chartData: {
        columns: ["date", "数据量"],
        // columns: ['日期', '访问用户'],
        rows: [],
      },
      chart: undefined,
    };
  },
  computed: {
    newChartData: function () {
      return this.chartData;
    },
    options: function () {
      // console.log(
      //   this.chartData.rows.map(function (row, idx) {
      //     return row["数据量"];
      //   })
      // );
      return {
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.chartData.rows.map(function (row, idx) {
            return row["date"];
          }),
        },
        yAxis: {
          type: "value",
          name: '数据量(MB)',
        },
        dataZoom: [
          {
            show: true,
            start: 30,
            end: 70,
          },
          {
            type: "inside",
            start: 30,
            end: 70,
          },
        ],
        series: [
          {
            data: this.chartData.rows.map(function (row, idx) {
              return row["数据量"] / 8 / 1024 / 1024;
            }),
            type: "line",
            areaStyle: {},
            symbolSize: 8,
            hoverAnimation: false,
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
      const chart = this.$refs.linechart;
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
      collect({})
        .then((res) => {
          this.chartData.rows = res.data;
          if (this.chart) {
            this.chart.dispose();
          }
          this.getGrapth();
          // console.log(res.data)
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