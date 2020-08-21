<template>
    <el-popover placement="right" v-model="visible">
      <graph v-if="visible" :ip="scope.row.receiver_ip_port.substring(0, scope.row.receiver_ip_port.lastIndexOf(':'))" />
      <el-link slot="reference" :type="type" >{{text}}</el-link>
    </el-popover>
</template>

<script>
import graph from '../../baidugraph'
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
  data() {
    return {
      visible:false
    }
  },
  components: {
    graph
  },
  computed: {
    type() {
      return this.value ? "danger" : "success";
    },
    // ip(){
    //   return this.scope.row.receiver_ip_port.substring(0, this.scope.row.receiver_ip_port.lastIndexOf(':'))
    // },
    text() {
      //   if (this.scope.$index === 1) {
      //     return this.myProps
      //   } else if (this.scope.$index === 3) {
      //     return '通过scope拿到了当前行日期：' + this.scope.row.date
      //   }
      //   return this.value ? '是' : '否'
      return this.scope.row.receiver_ip_port;
    },
  },
};
</script>