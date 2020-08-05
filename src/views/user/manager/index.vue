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
          <el-form-item
            v-if="info.authority && ((info.authority & (info.roles['Admin'] | info.roles['SuperAdmin'])) > 0)"
          >
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
      :rowHandle="rowHandle"
      @custom-emit-2="information"
      @custom-emit-1="changePsd"
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
      :rowHandle="rowHandle"
      ref="d2Crud"
      edit-title="修改"
      size="mini"
      :edit-template="editTemplate"
      :columns="columns"
      :options="options"
      :data="data"
      @custom-emit-2="information"
      @custom-emit-1="changePsd"
      :form-options="formOptions"
      @dialog-cancel="handleDialogCancel"
      @row-edit="handleRowEdit"
      @row-dblclick="doubleClick"
      :loading="loading"
    >
      <template slot="usernameFormSlot" slot-scope="scope">
        <!-- <el-button @click="test(scope)">{{scope.row}}</el-button> -->
        <el-input
          style="width: 200px;"
          :disabled="true"
          v-model="scope.form['username']"
          placeholder="请输入内容"
        ></el-input>
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
      <el-dialog
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose"
        v-bind="dialogOptions"
        :class="{'d2-crud-dialog':true}"
      >
        <template slot="title">
          <slot name="FormHeaderSlot" />
          <button
            v-if="dialogOptions.fullscreen!=null"
            type="button"
            class="el-dialog__headerbtn fullscreen"
            @click="dialogOptions.fullscreen = !dialogOptions.fullscreen"
          >
            <i class="el-dialog__close el-icon el-icon-full-screen"></i>
          </button>
        </template>

        <div ref="chart" style="width:100%;height:60vh;"></div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="更改密码" :visible.sync="dialogPsd" width="50%" :before-close="handleClose">
        <el-form
          :model="ruleForm"
          status-icon
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            label="密码"
            prop="pass"
            :rules="[
                { required: true, message: '本字段不能为空'}
              ]"
          >
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="确认密码"
            prop="checkPass"
            :rules="[
                { required: true, message: '本字段不能为空'}
              ]"
          >
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogPsd = false">取消</el-button>
          <el-button type="primary" @click="changePsdSub()">确 定</el-button>
        </span>
      </el-dialog>
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
  changePwd,
  getUserLog,
} from "@api/user.data";
import Vue from "vue";
import util from "@/libs/util.js";
import SplitPane from "vue-splitpane";
import XLSX from "xlsx";
import salt from "@/plugin/share";
import bcrypt from "bcryptjs";
import sha512 from "js-sha512";
import { d2CrudPlus } from "d2-crud-plus";
import { mapState } from "vuex";
Vue.component("SplitPane", SplitPane);
export default {
  // mixins: [d2CrudPlus.crud],
  data() {
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
      },
      dialogOptions: {
        fullscreen: false,
      },
      dialogVisible: false,
      dialogPsd: false,
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
      rowHandle: {
        custom: [
          {
            icon: "el-icon-edit",
            text: "详情",
            size: "small",
            fixed: "right",
            emit: "custom-emit-2",
          },
          {
            icon: "el-icon-edit",
            text: "更改密码",
            size: "small",
            fixed: "right",
            emit: "custom-emit-1",
          },
        ],
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
        stripe: true,
      },
      radio: 1,
      editTemplate: {
        username: {
          title: "用户名",
          slot: true,
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
      y_label: [
        ["权限", "R", "Reader"],
        ["权限", "E", "Editor"],
        ["权限", "RA", "ReaderAdmin"],
        ["权限", "EA", "EditorAdmin"],
        ["权限", "UA", "Admin"],
        ["权限", "SA", "SuperAdmin"],
        ["用户名", "UName", "UserName"],
        ["密码", "Psd", "Password"],
      ],
      y_index: {
        Reader: 0,
        Editor: 1,
        ReaderAdmin: 2,
        EditorAdmin: 3,
        Admin: 4,
        SuperAdmin: 5,
        UserName: 6,
        Password: 7,
      },
      graph_data: {
        Reader: [],
        Editor: [],
        ReaderAdmin: [],
        EditorAdmin: [],
        Admin: [],
        SuperAdmin: [],
        UserName: [],
        Password: [],
      },
      unametag: false,
      upsdtag: false,
      graph_chart: undefined,
      current_user: undefined,
    };
  },
  computed: {
    ...mapState("d2admin/user", ["info"]),
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
        if (roles === "") roles = "无";
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
    options_graph: function () {
      var index = this.y_index;
      var HEIGHT_RATIO = 0.6;
      var DIM_CATEGORY_INDEX = 0;
      var DIM_TIME_ARRIVAL = 2;
      var DIM_TIME_DEPARTURE = 3;
      var DATA_ZOOM_AUTO_MOVE_THROTTLE = 30;
      var DATA_ZOOM_X_INSIDE_INDEX = 1;
      var DATA_ZOOM_Y_INSIDE_INDEX = 3;
      var DATA_ZOOM_AUTO_MOVE_SPEED = 0.2;
      var DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH = 30;

      var _cartesianXBounds = [];
      var _cartesianYBounds = [];
      var _rawData = [];
      for (var x in this.graph_data) {
        _rawData = _rawData.concat(this.graph_data[x]);
      }
      // console.log(_rawData)
      var _autoDataZoomAnimator;

      const echarts = this.$echarts;
      const y_label = this.y_label;
      function makeOption() {
        return {
          tooltip: {},
          animation: false,
          title: {
            text: "用户信息变化图",
            left: "center",
          },
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: "none",
              },
              restore: {},
              saveAsImage: {},
            },
          },
          dataZoom: [
            {
              type: "slider",
              xAxisIndex: 0,
              filterMode: "weakFilter",
              height: 20,
              bottom: 0,
              start: 0,
              end: 26,
              handleIcon:
                "M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
              handleSize: "80%",
              showDetail: false,
            },
            // {
            //   type: "inside",
            //   id: "insideX",
            //   xAxisIndex: 0,
            //   filterMode: "weakFilter",
            //   start: 0,
            //   end: 26,
            //   zoomOnMouseWheel: false,
            //   moveOnMouseMove: true,
            // },
            // {
            //   type: "inside",
            //   id: "insideY",
            //   yAxisIndex: 0,
            //   start: 95,
            //   end: 100,
            //   zoomOnMouseWheel: false,
            //   moveOnMouseMove: true,
            //   moveOnMouseWheel: true,
            // },
          ],
          grid: {
            show: true,
            top: 70,
            bottom: 20,
            left: 100,
            right: 20,
            backgroundColor: "#fff",
            borderWidth: 0,
          },
          xAxis: {
            type: "time",
            position: "top",
            splitLine: {
              lineStyle: {
                color: ["#E9EDFF"],
              },
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              lineStyle: {
                color: "#929ABA",
              },
            },
            axisLabel: {
              color: "#929ABA",
              inside: false,
              align: "center",
            },
          },
          yAxis: {
            axisTick: { show: false },
            splitLine: { show: false },
            axisLine: { show: false },
            axisLabel: { show: false },
            min: 0,
            max: y_label.length, //_rawData.parkingApron.data.length,
          },
          series: [
            {
              id: "flightData",
              type: "custom",
              renderItem: renderGanttItem,
              dimensions: ["类别", "名称", "开始时间", "结束时间"],
              encode: {
                x: [DIM_TIME_ARRIVAL, DIM_TIME_DEPARTURE],
                y: 0,
                tooltip: [1, DIM_TIME_ARRIVAL, DIM_TIME_DEPARTURE],
              },
              data: _rawData,
            },
            {
              type: "custom",
              renderItem: renderAxisLabelItem,
              dimensions: ["Value", "类别", "简写", "名称"],
              encode: {
                x: -1, // Then this series will not controlled by x.
                y: 0,
                tooltip: [1, 2, 3, 4],
              },
              data: echarts.util.map(y_label, function (item, index) {
                return [index].concat(item);
              }),
            },
          ],
        };
      }

      function renderGanttItem(params, api) {
        var categoryIndex = api.value(DIM_CATEGORY_INDEX);
        var timeArrival = api.coord([
          api.value(DIM_TIME_ARRIVAL),
          categoryIndex,
        ]);
        var timeDeparture = api.coord([
          api.value(DIM_TIME_DEPARTURE),
          categoryIndex,
        ]);
        // console.log(timeArrival, timeDeparture, categoryIndex)

        var coordSys = params.coordSys;
        _cartesianXBounds[0] = coordSys.x;
        _cartesianXBounds[1] = coordSys.x + coordSys.width;
        _cartesianYBounds[0] = coordSys.y;
        _cartesianYBounds[1] = coordSys.y + coordSys.height;

        var barLength = timeDeparture[0] - timeArrival[0];
        // Get the heigth corresponds to length 1 on y axis.
        var barHeight = api.size([0, 1])[1] * HEIGHT_RATIO;
        var x = timeArrival[0];
        var y = timeArrival[1] - barHeight;

        var flightNumber = api.value(1) + "";
        var flightNumberWidth = echarts.format.getTextRect(flightNumber).width;
        var text =
          barLength > flightNumberWidth + 40 && x + barLength >= 180
            ? flightNumber
            : "";

        var rectNormal = clipRectByRect(params, {
          x: x,
          y: y,
          width: barLength,
          height: barHeight,
        });
        // var rectVIP = clipRectByRect(params, {
        //   x: x,
        //   y: y,
        //   width: barLength / 2,
        //   height: barHeight,
        // });
        var rectText = clipRectByRect(params, {
          x: x,
          y: y,
          width: barLength,
          height: barHeight,
        });
        // console.log(categoryIndex, index["UserName"])

        if (categoryIndex === index["UserName"]) {
          const uname = api.value(4);
          // console.log(uname)
          if (uname) {
            return {
              type: "group",
              children: [
                {
                  type: "rect",
                  ignore: !rectNormal,
                  shape: rectNormal,
                  style: api.style(),
                },
                {
                  type: "rect",
                  ignore: !rectText,
                  shape: rectText,
                  style: api.style({
                    fill: "transparent",
                    stroke: "transparent",
                    text: text,
                    textFill: "#fff",
                  }),
                },
              ],
            };
          } else {
            return {
              type: "group",
              children: [
                {
                  type: "rect",
                  ignore: !rectNormal,
                  shape: rectNormal,
                  style: api.style({ fill: "#ddb30b" }),
                },
                {
                  type: "rect",
                  ignore: !rectText,
                  shape: rectText,
                  style: api.style({
                    fill: "transparent",
                    stroke: "transparent",
                    text: text,
                    textFill: "#fff",
                  }),
                },
              ],
            };
          }
        } else if (categoryIndex === index["Password"]) {
          var upsd = api.value(4);
          if (upsd) {
            return {
              type: "group",
              children: [
                {
                  type: "rect",
                  ignore: !rectNormal,
                  shape: rectNormal,
                  style: api.style(),
                },
                {
                  type: "rect",
                  ignore: !rectText,
                  shape: rectText,
                  style: api.style({
                    fill: "transparent",
                    stroke: "transparent",
                    text: text,
                    textFill: "#fff",
                  }),
                },
              ],
            };
          } else {
            return {
              type: "group",
              children: [
                {
                  type: "rect",
                  ignore: !rectNormal,
                  shape: rectNormal,
                  style: api.style({ fill: "#ddb30b" }),
                },
                {
                  type: "rect",
                  ignore: !rectText,
                  shape: rectText,
                  style: api.style({
                    fill: "transparent",
                    stroke: "transparent",
                    text: text,
                    textFill: "#fff",
                  }),
                },
              ],
            };
          }
        }
        return {
          type: "group",
          children: [
            {
              type: "rect",
              ignore: !rectNormal,
              shape: rectNormal,
              style: api.style({ fill: "#ddb30b" }), //api.style(),
            },
            // {
            //   type: "rect",
            //   ignore: !rectVIP && !api.value(4),
            //   shape: rectVIP,
            //   style: api.style({ fill: "#ddb30b" }),
            // },
            {
              type: "rect",
              ignore: !rectText,
              shape: rectText,
              style: api.style({
                fill: "transparent",
                stroke: "transparent",
                text: text,
                textFill: "#fff",
              }),
            },
          ],
        };
      }

      function renderAxisLabelItem(params, api) {
        var y = api.coord([0, api.value(0)])[1];
        if (y < params.coordSys.y + 5) {
          return;
        }
        return {
          type: "group",
          position: [10, y],
          children: [
            {
              type: "path",
              shape: {
                d: "M0,0 L0,-20 L30,-20 C42,-20 38,-1 50,-1 L70,-1 L70,0 Z",
                x: 0,
                y: -20,
                width: 90,
                height: 20,
                layout: "cover",
              },
              style: {
                fill: "#368c6c",
              },
            },
            {
              type: "text",
              style: {
                x: 24,
                y: -3,
                text: api.value(1),
                textVerticalAlign: "bottom",
                textAlign: "center",
                textFill: "#fff",
              },
            },
            {
              type: "text",
              style: {
                x: 75,
                y: -2,
                textVerticalAlign: "bottom",
                textAlign: "center",
                text: api.value(2),
                textFill: "#000",
              },
            },
          ],
        };
      }

      function clipRectByRect(params, rect) {
        return echarts.graphic.clipRectByRect(rect, {
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height,
        });
      }
      var res = makeOption();
      // console.log(res)
      return res;
    },
  },
  mounted() {
    this.fetchData();
    this.fetchRoles();
    // console.log(this.info)
  },
  methods: {
    changePsd({ index, row }) {
      this.dialogPsd = true;
      this.current_user = row.uuid;
      this.ruleForm.pass = ''
      this.ruleForm.checkPass = ''
    },
    changePsdSub() {
      this.dialogPsd = false;
      if (this.ruleForm.pass === this.ruleForm.checkPass) {
        var row = {};
        row["uuid"] = this.current_user;
        var sPsd = bcrypt.hashSync(sha512(this.ruleForm.pass), salt);
        row["psd"] = sPsd.substring(sPsd.lastIndexOf("$") + 1);
        changePwd({
          ...row,
        }).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "更改密码成功",
              type: "success",
            });
          } else {
            this.$message({
              message: res.message,
              type: "warning",
            });
          }
        });
      }
    },
    dealAuthority(authority, time, now) {
      var data = this.graph_data;
      var items = [
        "Reader",
        "Editor",
        "ReaderAdmin",
        "EditorAdmin",
        "Admin",
        "SuperAdmin",
      ];
      if (authority === undefined) {
        for (var x in items) {
          x = items[x];
          if (data[x].length > 0) {
            var pos = data[x].length - 1;
            if (data[x][pos].length == 3) {
              data[x][pos].push(now);
              data[x][pos].push(true);
            }
          }
        }
      } else {
        for (var item in this.transfer) {
          if ((this.transfer[item] & authority) === 0) {
            if (data[item].length > 0) {
              var pos = data[item].length - 1;
              if (data[item][pos].length === 3) {
                data[item][pos].push(time);
                data[item][pos].push(true);
              }
            } else {
              continue;
            }
          } else {
            var pos = data[item].length - 1;
            if (data[item].length === 0 || data[item][pos].length === 5) {
              data[item].push([this.y_index[item], item, time]);
            } else {
              continue;
            }
          }
        }
      }
      // console.log(data, this.graph_data)
    },
    dealUserName(username, time, now) {
      var data = this.graph_data;
      if (username === undefined) {
        if (data["UserName"].length > 0) {
          var pos = data["UserName"].length - 1;
          if (data["UserName"][pos].length === 3) {
            data["UserName"][pos].push(now);
            data["UserName"][pos].push(this.unametag ? true : false);
          }
        }
      } else {
        var pos = data["UserName"].length - 1;
        // console.log('here', pos)
        if (data["UserName"].length > 0 && data["UserName"][pos].length === 3) {
          // console.log(data['UserName'][pos])
          data["UserName"][pos].push(time);
          data["UserName"][pos].push(this.unametag ? true : false);
        }
        data["UserName"].push([this.y_index["UserName"], username, time]);
      }
      // console.log(this.unametag)
      this.unametag = !this.unametag;
      // console.log(this.unametag)
    },
    dealPsd(password, time, now) {
      var data = this.graph_data;
      if (password === undefined) {
        if (data["Password"].length > 0) {
          var pos = data["Password"].length - 1;
          if (data["Password"][pos].length === 3) {
            data["Password"][pos].push(now);
            data["Password"][pos].push(this.upsdtag ? true : false);
          }
        }
      } else {
        var pos = data["Password"].length - 1;
        if (data["Password"].length > 0 && data["Password"][pos].length === 3) {
          data["Password"][pos].push(time);
          data["Password"][pos].push(this.upsdtag ? true : false);
        }
        data["Password"].push([this.y_index["Password"], password, time]);
      }
      this.upsdtag = !this.upsdtag;
    },
    information({ index, row }) {
      this.unametag = false
      this.upsdtag = false
      var item = {
        uuid: row.uuid,
      };
      getUserLog({
        ...item,
      }).then((res) => {
        if (res.status === 200) {
          for (var item in this.graph_data) {
            this.graph_data[item] = [];
          }
          // console.log(res.data)
          for (var x in res.data) {
            x = res.data[x];
            if (x["opreation"] === "new") {
              this.dealAuthority(x["value"]["authority"], x["time"], undefined);
              this.dealUserName(x["value"]["username"], x["time"], undefined);
              this.dealPsd(x["value"]["password"], x["time"], undefined);
            } else if (x["opreation"] === "upsd" || x["opreation"] === "apsd") {
              this.dealPsd(x["value"], x["time"], undefined);
            } else if (x["opreation"] === "cauth") {
              this.dealAuthority(x["value"], x["time"], undefined);
            } else if (x["opreation"] === "cname") {
              this.dealUserName(x["value"], x["time"], undefined);
            }
          }
          this.dealAuthority(undefined, undefined, res.now);
          this.dealUserName(undefined, undefined, res.now);
          this.dealPsd(undefined, undefined, res.now);
          if (this.graph_chart) {
            this.graph_chart.dispose();
          }
          this.graphShow();
        }
      });
      this.dialogVisible = true;
    },
    handleClose(done) {
      done();
    },
    graphShow() {
      const chart = this.$refs.chart;
      if (chart) {
        const myChart = this.$echarts.init(chart);

        myChart.setOption(this.options_graph);
        this.graph_chart = myChart;
        // myChart.setOption(this.options_graph);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
        // this.myChart = myChart;
        // console.log(this.myChart)
      }
      this.$on("hook:destroyed", () => {
        window.removeEventListener("resize", function () {
          myChart.resize();
        });
      });
    },
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
.d2-crud-dialog {
  .el-dialog__headerbtn {
    padding: 10px;
    top: 12px;
    &.fullscreen {
      right: 55px;
    }
  }
  &.d2p-drag-dialog {
    .is-fullscreen {
      left: 0px !important;
      top: 0px !important;
      .el-dialog__header {
        cursor: auto !important;
      }
    }
  }
}
</style>
