<template>
  <div style="cursor: pointer" @click="handleClick">
    <el-link :type="type">{{text}}</el-link>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      require: true,
    },
    // 本行的所有数据，此字段不需要额外配置
    scope: {
      default: null,
    },
    // 通过 component 中 props 字段传过来的数据，此字段需要先在 component 中配置
    myProps: {
      default: null,
    },
  },
  computed: {
    type() {
      return this.value ? "danger" : "success";
    },
    text() {
      return this.scope.row.send_ip_port;
    },
  },
  methods: {
    handleClick(evt) {
      this.$emit("click", evt);
    },
  },
};
</script>