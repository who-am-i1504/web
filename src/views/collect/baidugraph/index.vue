<template>
  <el-card style="width:400px; height:400px;">
    <div class="inner">
      <ve-bmap
        :settings="chartSettings"
        :after-set-option-once="afterSet"
        :series="chartSeries"
        :tooltip="chartTooltip"
      ></ve-bmap>
    </div>
  </el-card>
</template>

<script>
import list from "@/views/_mixin/list.js";
import { IPposition } from "@api/collect.data";
import { mapActions } from "vuex";
export default {
  mixins: [list],
  props: {
    ip: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      chartSettings: {
        label: "传输规则数目示意图",
        key: "wcUVCqY6U57Dpcw6Lp9GpzxLq0VXtN65",
        bmap: {
          center: [116.404, 39.915],
          zoom: 14,
          roam: true,
          mapStyle: {},
        },
        v: "3.0",
        type: "webgl",
      },
      chartTooltip: { show: true },
      chartSeries: [
        {
          type: "scatter",
          coordinateSystem: "bmap",
          data: [],
        },
      ],
      bmap: "",
      position: {
        ip: "0.0.0.0",
        address: "天安门",
        equipment: "暂无",
        institution: "暂无",
      },
      // ip:''
    };
  },
  created: function () {
    // this.createMap()
  },
  mounted() {},
  watch: {
    // value(val){
    //   this.ip = val
    //   this.getPoint()
    // }
  },
  methods: {
    afterSet(echarts) {
      // console.log(echarts.getModel())
      // console.log(echarts.getModel().getComponent("bmap"))
      var bmap = echarts.getModel().getComponent("bmap").getBMap();

      bmap.addControl(new window.BMap.MapTypeControl());
      var scaleCtrl = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_BOTTOM_LEFT,
        offset: new BMap.Size(10, 40),
      });
      var size = new BMap.Size(10, 20);
      bmap.addControl(
        new BMap.CityListControl({
          anchor: BMAP_ANCHOR_TOP_LEFT,
          offset: size,
        })
      );
      // console.log()
      // var navi3DCtrl = new window.BMap.NavigationControl3D();
      // bmap.addControl(navi3DCtrl)
      bmap.addControl(scaleCtrl);
      this.bmap = bmap;
      this.getPoint();
      // this.getPoint();
    },
    getPoint() {
      let re = new RegExp(
        "((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}"
      );
      if (!re.test(this.ip)) {
        return;
      }
      var ip = {};
      ip["ip"] = this.ip;
      IPposition({
        ...ip,
      })
        .then((res) => {
          if (res.status === 200) {
            this.position = res.data;
            this.updatePoint(
              res.data["country"] +
                res.data["prov"] +
                res.data["city"] +
                res.data["company"]
            );
          }
        })
        .catch((err) => {});
      // console.log(this.chartSettings.bmap.center)
    },
    updatePoint(address) {
      var myGeo = new window.BMap.Geocoder();
      var bmap = this.bmap;
      // console.log(myGeo);
      myGeo.getPoint(
        address,
        function (point) {
          if (point) {
            bmap.centerAndZoom(point, 14);
            let mk = new window.BMap.Marker(point);
            bmap.addOverlay(mk);
            // map.panTo(point);
          }
        },
        "全国"
      );
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
    width: 500px;
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
.bmap-sty {
  .BMap_cpyCtrl {
    display: none;
  }
  .anchorBL {
    display: none;
  }
}
</style>