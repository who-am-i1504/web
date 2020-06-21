<template>
  <div style="cursor: pointer">
    <el-card :body-style="{ padding: '0px' }" shadow="always">
      <img :src="path" class="image">
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      require: true
    },
    // 本行的所有数据，此字段不需要额外配置
    scope: {
      default: null
    },
    // 通过 component 中 props 字段传过来的数据，此字段需要先在 component 中配置
    myProps: {
      default: null
    }
  },
  computed: {
    path () {
      return '/picture/show/' + this.value
    }
  }
}
</script>
<style>
.image {
    width: 100%;
    display: block;
}
</style>