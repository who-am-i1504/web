<template>
  <d2-container class="page">
    <!-- <d2-page-cover>
      <d2-icon-svg class="logo" name="d2-admin"/>
      <template slot="footer">
        <div class="btn-group">
        </div>
      </template>
    </d2-page-cover>-->
    <div style="height: 100%; margin: -16px;">
      <SplitPane split="vertical">
        <template slot="paneL">
          <SplitPane split="horizontal">
            <template slot="paneL">
              <rule/>
            </template>

            <template slot="paneR">
              <collect/>
            </template>
          </SplitPane>
        </template>
        <template slot="paneR">
          <monitor/>
        </template>
      </SplitPane>
    </div>
  </d2-container>
</template>

</SplitPane>

</div>

  </d2-container>
</template>

<script>
import D2Badge from "./components/d2-badge";
import D2Help from "./components/d2-help";
import D2PageCover from "./components/d2-page-cover";
import rule from "@/views/rule/index/components/graph";
import collect from "@/views/collect/index/components/graph";
import monitor from "@/views/monitor/index/components/graph";
export default {
  components: {
    D2Badge,
    D2Help,
    D2PageCover,
    rule,
    collect,
    monitor,
  },
  data() {
    return {
      filename: __filename,
    };
  },
};
</script>

<style lang="scss" scoped>
.page {
  .logo {
    width: 120px;
  }
  .btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    line-height: 12px;
    margin-top: 0px;
    margin-bottom: 20px;
    .btn-group__btn {
      color: $color-text-sub;
      &:hover {
        color: $color-text-main;
      }
      &.btn-group__btn--link {
        color: $color-primary;
      }
    }
  }
}
</style>
