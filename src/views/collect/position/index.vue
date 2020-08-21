<template>
  <d2-container>
    <div slot="header" class="panel-search">
      <el-input :maxlength="15" class="panel-search__input" placeholder="IP地址" v-model="ip">
        <el-button @click="getPoint" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="inner">
      <!-- <div id="allmap" style="width:100%; height:100%;" /> -->
      <ve-bmap
        :settings="chartSettings"
        width="100%"
        height="100%"
        :after-set-option-once="afterSet"
        :series="chartSeries"
        :tooltip="chartTooltip"
      ></ve-bmap>
    </div>
    <template class="foot" slot="footer">
      <el-button-group class="btnTxt">
        <el-button class="btnTxt" size="mini">IP地址: {{position.ip}}</el-button>
        <el-button type="text" size="mini"></el-button>
      </el-button-group>

      <el-button-group class="btnTxt">
        <el-button class="btnTxt" size="mini">地理地址: {{position.address}}</el-button>
        <el-button type="text" size="mini"></el-button>
      </el-button-group>

      <el-button-group class="btnTxt">
        <el-button class="btnTxt" size="mini">设备: {{position.equipment}}</el-button>
        <el-button type="text" size="mini"></el-button>
      </el-button-group>

      <el-button-group class="btnTxt">
        <el-button class="btnTxt" size="mini">机构: {{position.institution}}</el-button>
        <el-button type="text" size="mini"></el-button>
      </el-button-group>
    </template>
  </d2-container>
</template>

<script>
import list from "@/views/_mixin/list.js";
import { IPposition } from "@api/collect.data";
import { mapActions } from "vuex";
export default {
  mixins: [list],
  data() {
    return {
      ip: "",
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
        type:'webgl'
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
    };
  },
  watch: {
    ip: function (value) {
      this.handleSet("ip", value);
    },
  },
  created:function(){
    // this.createMap()
  },
  mounted() {
    this.load();
    // this.createMap();
    // var map = new BMapGL.Map('allmap')

  },
  methods: {
    ...mapActions("d2admin/db", ["databasePage", "databasePageClear"]),
    async load() {
      const db = await this.databasePage({
        user: true,
      });
      var str = db.value();
      if (str.ip) {
        this.ip = str.ip;
      }
    },
    async handleSet(name, value) {
      if (name === "") {
        return;
      }
      const db = await this.databasePage({
        user: true,
      });
      db.set(name, value).write();
    },
    async handleClear() {
      await this.pageClear({ instance: this, user: true });
    },
    // createMap(){
    //   var bmapgl = new BMapGL.Map('allmap')
    //   var point = new BMapGL.Point(116.403748, 39.915055);
    //   bmapgl.centerAndZoom(point, 17);

    //   var view = new mapvgl.View({
    //     map:bmapgl
    //   })

    //   var layer = new mapvgl.PointLayer({
    //     color:'rgba(50,50,200,1)',
    //     blend:'lighter',
    //     size:2
    //   })
      
    //   view.addLayer(layer)

    //   var data = [{
    //     geometry:{
    //       type:'POINT',
    //       coordinates:[116.403748, 39.915055]
    //     }
    //   }]

    //   layer.setData(data)
    // },
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
      // this.getPoint();
    },
    getPoint() {
      if (this.ip === "") {
        this.$message({
          message: "IP地址不能为空",
          type: "warning",
        });
        return;
      }
      let re = new RegExp(
        "((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}"
      );
      if (!re.test(this.ip)) {
        this.$message({
          message: "IP地址格式不正确",
          type: "warning",
        });
        return;
      }
      var ip = {};
      ip["ip"] = this.ip;
      // var geolocation = new window.BMap.Geolocation();
      // geolocation.enableSDKLocation();
      // var map = this.bmap
      // geolocation.getCurrentPosition(function(r){
      //   if (this.getStatus() == BMAP_STATUS_SUCCESS){
      //     var mk = new window.BMap.Marker(r.point);
      //     map.addOverlay(mk);
      //     map.panTo(r.point)
      //   }
      // })
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

            this.$message({
              message: "定位成功",
              type: "success",
            });
          } else {
            this.$message({
              message: res.message,
              type: "warning",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "网络连接错误",
            type: "error",
          });
        });
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
          } else {
            this.$message({
              message: "获取定位信息时发生错误，请与开发者联系",
              type: "warning",
            });
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