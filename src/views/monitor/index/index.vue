<template>
  <d2-container>
    <!-- <d2-module-index-banner slot="header" v-bind="banner"/> 
    <d2-module-index-menu :menu="menu"/>-->
    <!-- <template slot="header" style="margin-bottom: 5px">
      <template slot="prepend"></template>
      传输规则数目示意图
      <template slot="append">.com</template>
      <el-button slot="header" style="margin-bottom: 5px">自定义按钮1</el-button>
      <el-button slot="header" type="primary" round style="margin-bottom: 5px">自定义按钮2</el-button>
    </template>-->
    <template slot="header">
      <div class="d2-page-cover">
        <p class="d2-page-cover__title">疑似医疗数据传输泄露概述</p>
      </div>
    </template>
    <graph/>
  </d2-container>
</template>

<script>
import menu from "@/menu/modules/demo-playground";
import list from "@/views/_mixin/list.js";
import graph from './components/graph'
import {
  monitorCount,
  AllHL7Graph,
  AllDICOMGraph,
  AllASTMGraph,
} from "@/api/monitor";

export default {
  mixins: [list],
  components: {
    graph
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