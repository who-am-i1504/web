<template>
  <d2-container>
    <template slot="header" style="background-color: rgba(#000, .7);">
      <div style="margin: -16px; background-color:rgba(#000, .7);">
        <el-form :inline="true" :model="userForm" ref="form" size="mini" class="header">
          <el-form-item
            label="权限选择"
            :rules="[
                { required: true, message: '本字段不能为空'}
              ]"
          >
            <el-popover placement="right" trigger="hover">
              <el-transfer
                size="mini"
                v-model="authority"
                :data="transfer_data"
                :titles="['可分配权限', '已分配权限']"
              ></el-transfer>
              <el-button type="text" slot="reference">{{selectRoles}}</el-button>
            </el-popover>
            <!-- <el-select v-model="userForm.name" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item
            label="用户名"
            :rules="[
                { required: true, message: '本字段不能为空'}
              ]"
          >
            <el-input v-model="userForm.username" placeholder="用户名，不能重复" size="small"></el-input>
          </el-form-item>

          <el-form-item
            label="密码"
            :rules="[
                { required: true, message: '本字段不能为空'}
              ]"
          >
            <el-input v-model="userForm.password" placeholder="密码" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="addNewUser">
              <d2-icon name="plus" />新增用户
            </el-button>
          </el-form-item>
          <el-form-item v-if="info.authority && ((info.authority & (info.roles['Admin'] | info.roles['SuperAdmin'])) > 0)">
            <el-button type="danger" @click="batchDelete">
              <d2-icon name="warning" />批量删除
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <d2-crud
      v-if="info.authority && ((info.authority & (info.roles['Admin'] | info.roles['SuperAdmin'])) > 0)"
      style="margin: -20px; background-color: rgba(#000, .7); color: #FFF;"
      ref="d2Crud"
      selection-row
      edit-title="修改"
      :selectionRow="selectionRow"
      size="mini"
      :edit-template="editTemplate"
      :columns="columns"
      :options="options"
      :data="data"
      :form-options="formOptions"
      @dialog-cancel="handleDialogCancel"
      @row-edit="handleRowEdit"
      @row-dblclick="doubleClick"
      @selection-change="handleSelectionChange"
      :loading="loading"
    >

      <template style="width: 200px;" slot="usernameFormSlot" slot-scope="scope">
        <!-- <el-button @click="test(scope)">{{scope.row}}</el-button> -->
        <el-input clearable v-model="scope.form['username']" placeholder="请输入内容"></el-input>
      </template>

      <template slot="rolesFormSlot" slot-scope="scope">
        <!-- <el-button @click="test(scope)">{{scope.row}}</el-button> -->
        <el-transfer
          size="mini"
          :span="24"
          v-model="scope.form['cAuthority']"
          :data="transfer_data"
        ></el-transfer>
      </template>
    </d2-crud>
    <d2-crud
      v-else
      style="margin: -20px; background-color: rgba(#000, .7); color: #FFF;"
      ref="d2Crud"
      edit-title="修改"
      size="mini"
      :edit-template="editTemplate"
      :columns="columns"
      :options="options"
      :data="data"
      :form-options="formOptions"
      @dialog-cancel="handleDialogCancel"
      @row-edit="handleRowEdit"
      @row-dblclick="doubleClick"
      :loading="loading"
    >
      <template slot="usernameFormSlot" slot-scope="scope">
        <!-- <el-button @click="test(scope)">{{scope.row}}</el-button> -->
        <el-input style="width: 200px;" :disabled="true" v-model="scope.form['username']" placeholder="请输入内容"></el-input>
      </template>
      <template slot="rolesFormSlot" slot-scope="scope">
        <!-- <el-button @click="test(scope)">{{scope.row}}</el-button> -->
        <el-transfer
          size="mini"
          :span="24"
          v-model="scope.form['cAuthority']"
          :data="transfer_data"
        ></el-transfer>
      </template>
    </d2-crud>
    <el-card style="margin: -10px;" slot="footer">
      <el-pagination
        @current-page="pagination.page"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[20, 40, 80, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin: -10px;"
        @size-change="handleSizeChange"
        @current-change="paginationCurrentChange"
        @prev-click="handlePaginationPrevClick"
        @next-click="handlePaginationNextClick"
      ></el-pagination>
    </el-card>
  </d2-container>
</template>

<script>
import {
  getUserList,
  AddUser,
  DeleteUser,
  getRoles,
  UpdateUserName,
  UpdateUserAuthority,
} from "@api/user.data";
import Vue from "vue";
import util from "@/libs/util.js";
import SplitPane from "vue-splitpane";
import XLSX from "xlsx";
import salt from "@/plugin/share";
import bcrypt from "bcryptjs";
import sha512 from "js-sha512";
import { d2CrudPlus } from "d2-crud-plus";
import { mapState } from 'vuex'
Vue.component("SplitPane", SplitPane);
export default {
  // mixins: [d2CrudPlus.crud],
  data() {
    return {
      options: {
        size: "mini",
        stripe: true,
      },
      selectionRow: {
        align: "center",
        width: 90,
      },
      transfer: {},
      authority: [],
      userForm: {
        username: "",
        password: "",
        authority: 0,
      },
      loading: false,
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        pageCount: 9,
        layout: "prev, pager, next, jumper, ->, total, slot",
      },
      mid_data: [],
      Selection: [],
      columns: [
        {
          title: "序号",
          key: "order",
          align: "center",
          width: 90,
        },
        {
          title: "uuid",
          key: "uuid",
          align: "center",
        },
        {
          title: "角色",
          key: "roles",
          align: "center",
          type: "text-area",
          form: {
            slot: true,
          },
        },
        {
          title: "用户名",
          key: "username",
          align: "center",
        },
        // {
        //   title:"权限选择",
        //   type:"transfer",
        //   key:
        // }
      ],
      formOptions: {
        saveButtonIcon: "el-icon-edit",
        saveButtonText: "修改",
        saveLoading: false,
        "append-to-body": true,
        "lock-scroll": true,
        size: "mini",
      },
      radio: 1,
      editTemplate: {
        username: {
          title: "用户名",
          slot:true
          // component: {
          //   // name:"el-input",
          //   span: 12,
          // },
        },
        roles: {
          title: "更改权限",
          slot: true,
          value: "",
          // form:{
          //   solt:true
          // }
          // component:{
          // name:'el-transfer',

          // }
        },
        cAuthority: {
          slot: true,
          show: false,
          disabled: true,
          component: {
            name: "el-date-picker",
          },
          value: "",
        },
      },
    };
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ]),
    data: function () {
      var i = 1;
      for (var x in this.mid_data) {
        this.mid_data[x]["order"] =
          (this.pagination["page"] - 1) * this.pagination["pageSize"] + i;
        this.mid_data[x]["radio"] = 1;
        var roles = "";
        this.mid_data[x]["cAuthority"] = [];
        for (var role in this.transfer) {
          if ((this.transfer[role] & this.mid_data[x]["authority"]) > 0) {
            this.mid_data[x]["cAuthority"].push(this.transfer[role]);
            if (roles === "") {
              roles += role;
            } else {
              roles += ", " + role;
            }
          }
        }
        // console.log(this.mid_data[x]['cAuthority'])
        if (roles === "")roles = '无';
        this.mid_data[x]["roles"] = roles;
        i += 1;
      }
      // console.log(this.mid_data);
      return this.mid_data;
    },
    transfer_data: function () {
      var result = [];
      for (var key in this.transfer) {
        if (key === "SuperAdmin") continue;
        if (key === "Admin") {
          if (this.transfer["SuperAdmin"] === undefined) {
            continue;
          }
        } else if (key === "ReaderAdmin" || key === "EditorAdmin") {
          if (this.transfer["Admin"] === undefined) {
            continue;
          }
        } else if (key === "Reader") {
          if (this.transfer["ReaderAdmin"] === undefined) {
            continue;
          }
        } else if (key === "Editor") {
          if (this.transfer["EditorAdmin"] === undefined) {
            continue;
          }
        }
        result.push({
          key: this.transfer[key],
          label: key,
          disabled: false,
        });
      }
      // console.log(result)
      return result;
    },
    selectRoles: function () {
      var result = "";

      for (var x in this.authority) {
        if (x > 0) {
          result += ", ";
        }
        for (var key in this.transfer) {
          if (this.transfer[key] === this.authority[x]) {
            result += key;
            break;
          }
        }
      }
      if (result !== "") return result;
      return "无";
    },
  },
  mounted() {
    this.fetchData();
    this.fetchRoles();
    // console.log(this.info)
  },
  methods: {
    // test(scope) {
    //   console.log(scope);
    // },
    getCrudOptions() {
      return {
        column: this.column,
        options: this.options,
      };
    },
    updateRequest(row) {
      return getUserList({
        ...this.pagination,
      });
    },
    batchDelete() {
      var length = this.Selection.length;
      var count = 0;
      var error = 0;
      var success = 0;
      for (var x in this.Selection) {
        var newRow = {};
        newRow["uuid"] = this.Selection[x]["uuid"];
        DeleteUser({
          ...newRow,
        })
          .then((res) => {
            if (res.status === 200) {
              success += 1;
            } else {
              error += 1;
            }
            count += 1;
            if (count === length) {
              this.$message({
                message:
                  "删除成功" +
                  String(success) +
                  "条; 删除失败" +
                  String(error) +
                  "条。",
                type: "success",
              });
              this.fetchData();
            }
          })
          .catch((err) => {
            error += 1;
            count += 1;
            if (count === length) {
              this.$message({
                message:
                  "删除成功" +
                  String(success) +
                  "条; 删除失败" +
                  String(error) +
                  "条。",
                type: "success",
              });
              this.fetchData();
            }
          });
      }
      // var length = this.Selection.length;
      // var count = 0;
      // for (var x in this.Selection) {
      // }
    },
    handleSelectionChange(val) {
      this.Selection = val;
    },
    fetchRoles() {
      getRoles()
        .then((res) => {
          if (res.status === 200) {
            this.transfer = res.data;
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
    },
    doubleClick(row, event) {
      this.$refs.d2Crud.showDialog({
        mode: "edit",
        rowIndex:
          row.order - (this.pagination.page - 1) * this.pagination.pageSize - 1,
      });
    },
    fetchData() {
      this.loading = true;
      getUserList({
        ...this.pagination,
      })
        .then((res) => {
          // console.log(res)
          if (res.status === 200) {
            this.mid_data = res.data;
            this.pagination.total = res.size;
          } else {
            this.$message({
              message: res.message,
              type: "warning",
            });
          }
          this.loading = false;
        })
        .catch((err) => {
          this.$message({
            message: "网络错误",
            type: "error",
          });
          this.loading = false;
        });
    },
    addNewUser() {
      var user = {};
      user["username"] = this.userForm.username;
      var auth = 0;
      for (var x in this.authority) {
        auth |= this.authority[x];
      }
      user["authority"] = auth;
      var mid = bcrypt.hashSync(sha512(this.userForm.password), salt);
      user["psd"] = mid.substring(mid.lastIndexOf("$") + 1);
      AddUser({
        ...user,
      })
        .then((res) => {
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type: "success",
            });
            this.fetchData();
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
    },
    paginationCurrentChange(page) {
      this.pagination.page = page;
      this.fetchData();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.fetchData();
    },
    paginationCurrentChange(val) {
      this.pagination.page = val;
      this.fetchData();
    },
    handlePaginationPrevClick(val) {
      this.pagination.page = val;
      this.fetchData();
    },
    handlePaginationNextClick(val) {
      this.pagination.page = val;
      this.fetchData();
    },
    doubleClick(row, event) {
      this.$refs.d2Crud.showDialog({
        mode: "edit",
        rowIndex:
          row.order - (this.pagination.page - 1) * this.pagination.pageSize - 1,
      });
    },
    handleDialogCancel(done) {
      done();
    },
    handleRowEdit({ index, row }, done) {
      // console.log(row);
      this.formOptions.saveLoading = true;
      setTimeout(() => {
        this.formOptions.saveLoading = true;
        var newRow = {};
        newRow["uuid"] = row.uuid;
        var a = 0;
        for (var x in row.cAuthority) {
          a |= row.cAuthority[x];
        }
        newRow["authority"] = a;
        newRow["username"] = row.username;

        var count = 0;
        UpdateUserAuthority({
          ...newRow,
        })
          .then((res) => {
            count += 1;
            if (count === 2) {
              this.fetchData();
              this.formOptions.saveLoading = false;
              done();
            }
          })
          .catch((err) => {
            count++;
            if (count === 2) {
              this.fetchData();
              this.formOptions.saveLoading = false;
              done();
            }
          });
        UpdateUserName({
          ...newRow,
        })
          .then((res) => {
            count++;
            if (count === 2) {
              this.fetchData();
              this.formOptions.saveLoading = false;
              done();
            }
          })
          .catch((err) => {
            // console.log('err', err)
            count++;
            if (count === 2) {
              this.fetchData();
              this.formOptions.saveLoading = false;
              done();
            }
          });
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: -20px;
  margin-top: 20px;
}
</style>
