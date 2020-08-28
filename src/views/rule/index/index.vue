<template>
  <d2-container>
    <template slot="header">
      <div class="d2-page-cover">
        <p class="d2-page-cover__title">传输规则数量饼形图</p>
      </div>
    </template>
    <graph />
  </d2-container>
</template>

<script>
import menu from "@/menu/modules/demo-playground";
import list from "@/views/_mixin/list.js";
import { getRule } from "@api/demo.business.table.1";
import graph from "./components/graph";

export default {
  mixins: [list],
  components: {
    graph,
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