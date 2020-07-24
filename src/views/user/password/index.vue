<template>
  <d2-container>
    <el-form class="d2-page-cover" ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item
        label="原密码"
        :rules="[
                { required: true, message: '本字段不能为空'}
              ]"
      >
        <el-input type="password" v-model="form.sPsd" placeholder="请输入您原来的密码"></el-input>
      </el-form-item>
      <el-form-item
        label="新密码"
        :rules="[
                { required: true, message: '本字段不能为空'}
              ]"
      >
        <el-input type="password" v-model="form.nPsd" placeholder="请输入新的密码"></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        :rules="[
                { required: true, message: '本字段不能为空'}
              ]"
      >
        <el-input type="password" v-model="form.conPsd" placeholder="请在此输入新的密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="default" @click="changePsd" type="primary" style="width: 100%;">确认更改</el-button>
      </el-form-item>
    </el-form>
  </d2-container>
</template>

<script>
import {} from "@api/monitor";
import Vue from "vue";
import SplitPane from "vue-splitpane";
import XLSX from "xlsx";
import salt from "@/plugin/share";
import bcrypt from "bcryptjs";
import sha512 from "js-sha512";
import { getSalt, ChangePwd } from "@/api/sys.login";
import { mapState, mapActions, mapMutations } from "vuex";
Vue.component("SplitPane", SplitPane);
export default {
  data() {
    return {
      containerType: "full",
      scrollDelay: 10,
      form: {
        sPsd: "",
        nPsd: "",
        conPsd: ""
      },
      rules: {
        sPsd: [
          {
            required: true,
            message: "请输入原密码",
            trigger: "blur"
          },
          {
            min: 5,
            max: 20,
            message: "密码长度应该在5到20位之间"
          }
        ],
        nPsd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 5,
            max: 20,
            message: "密码长度应该在5到20位之间"
          }
        ],
        conPsd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 5,
            max: 20,
            message: "密码长度应该在5到20位之间"
          }
        ]
      }
    };
  },
  computed: {},
  mounted() {},
  methods: {
    ...mapActions("d2admin/account", ["logout"]),
    fetchData() {
      // getMonitorRule({
      // }).then(res => {
      // }).catch(err => {
      // })
    },
    changePsd() {
      console.log(this.form.nPsd)
      if (this.form.nPsd === this.form.conPsd) {
        if (this.form.nPsd === this.form.sPsd) {
          this.$message({
            message: "您输入的确认密码和新密码不一致，请重新输入",
            type: "error"
          });
          return;
        }
        var sPsd = bcrypt.hashSync(sha512(this.form.sPsd), salt);
        var nPas = bcrypt.hashSync(sha512(this.form.nPsd), salt);
        var req = {};
        req.oldPsd = sPsd.substring(sPsd.lastIndexOf("$")+ 1);
        req.newPsd = nPas.substring(nPas.lastIndexOf("$")+ 1);
        ChangePwd({
          ...req
        })
          .then(res => {
            if (res.status == 200) {
              this.$message({
                message: "请重新登录",
                type: "success"
              });
              this.logout();
            }
          })
          .catch(err => {});
      } else {
        this.$message({
          message: "您输入的确认密码和新密码不一致，请重新输入",
          type: "error"
        });
        return;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.d2-page-cover {
  @extend %unable-select;
  margin-top: 100px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  top: 50%;
}
</style>
