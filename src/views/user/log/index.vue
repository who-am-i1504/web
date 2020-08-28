<template>
  <d2-container>
    <div slot="header">
      <SplitPane
        :min-percent="10"
        style="margin: 10px; bottom-margin: 25px; height:2vh;"
        :default-percent="80"
        split="vertical"
      >
        <SplitPane slot="paneL" :min-percent="10" :default-percent="50" split="vertical">
          <div class="panel-search" slot="paneL">
            <el-input class="panel-search__input" placeholder="uuid" v-model="uuid">
              <el-button @click="getLogByUUID" slot="append">
                <d2-icon name="search" />搜索
              </el-button>
            </el-input>
          </div>
          <div class="panel-search" slot="paneR">
            <el-input class="panel-search__input" placeholder="用户名" v-model="username">
              <el-button @click="getLogByName" slot="append">
                <d2-icon name="search" />搜索
              </el-button>
            </el-input>
          </div>
        </SplitPane>
        <!-- <div slot="paneR"> -->
        <SplitPane
          slot="paneR"
          v-if="info.authority & 32"
          :min-percent="10"
          :default-percent="50"
          split="vertical"
        >
          <div slot="paneL" class="panel-search">
            <el-button
              class="panel-search__input"
              type="primary"
              icon="el-icon-refresh-right"
              circle
              @click="reset"
            ></el-button>
          </div>
          <div slot="paneR" class="panel-search">
            <el-button
              class="panel-search__input"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteSelection"
            ></el-button>
          </div>
        </SplitPane>
        <div v-else slot="paneR" class="panel-search">
          <el-button
            class="panel-search__input"
            type="primary"
            icon="el-icon-refresh-right"
            circle
            @click="reset"
          ></el-button>
        </div>
        <!-- </div> -->
      </SplitPane>
    </div>
    <!-- <el-table
      :data="log"
      size="mini"
      style="width: 100%"
      empty-text="暂无日志信息"
      stripe>
      时间
      <el-table-column
        prop="time"
        label="Time"
        width="140">
      </el-table-column>
      信息
      <el-table-column
        prop="request"
        label="Request"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="response"
        label="Response"
        min-width="200">
      </el-table-column>
      触发页面
      <el-table-column
        label="Url"
        align="center">
        <template slot-scope="scope">
          {{get(scope.row, 'meta.url')}}
        </template>
      </el-table-column>
      <el-table-column
        label="ip"
        align="center">
        <template slot-scope="scope">
          {{get(scope.row, 'meta.url')}}
        </template>
      </el-table-column>
      触发组件
      <el-table-column
        label="uuid"
        align="center">
        <template slot-scope="scope">
          <el-tag
            v-if="get(scope.row, 'meta.instance.$vnode.componentOptions.tag')"
            type="info"
            size="mini">
            &#60;{{get(scope.row, 'meta.instance.$vnode.componentOptions.tag')}}&gt;
          </el-tag>
        </template>
      </el-table-column>
      查看详情
      <el-table-column
        fixed="right"
        align="center"
        label="username"
        width="100">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleShowMore(scope.row)">
            <d2-icon name="eye"/>
          </el-button>
        </template>
      </el-table-column>
    </el-table>-->
    <!-- <d2-crud-x
      ref="d2Crud"
      v-bind="_crudProps"
      v-on="_crudListeners">
    </d2-crud-x>-->
    <d2-crud
      v-if="info.authority & 32"
      selection-row
      :selectionRow="selectionRow"
      ref="d2Crud"
      :columns="columns"
      :data="data"
      :form-options="options"
      :loading="loading"
      @selection-change="handleSelectionChange"
    ></d2-crud>

    <d2-crud
      v-else
      ref="d2Crud"
      :columns="columns"
      :data="data"
      :form-options="options"
      :loading="loading"
    ></d2-crud>

    <div slot="footer">
      <el-card style="height:100%; margin: -10px;">
        <SplitPane :min-percent="10" style="margin: -15px;" :default-percent="90" split="vertical">
          <el-pagination
            slot="paneL"
            @current-page="pagination.page"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="paginationCurrentChange"
            @prev-click="handlePaginationPrevClick"
            @next-click="handlePaginationNextClick"
          />
          <el-button
            slot="paneR"
            type="primary"
            size="mini"
            :loading="uploading"
            @click="handleUpload"
          >
            <d2-icon name="cloud-download" />下载日志文件
          </el-button>
        </SplitPane>
      </el-card>
    </div>
  </d2-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { logDown } from "@/api/filedownload";
import { get } from "lodash";
import { getLog, getLogByUUID, getLogByName, deleteLog } from "@/api/log.data";
export default {
  data() {
    return {
      state: 1,
      uuid: "",
      username: "",
      uploading: false,
      loading: false,
      options: {
        height: "100%",
        mini: true,
      },
      selectionRow: {
        align: "center",
        width: 90,
      },
      selection: [],
      columns: [
        {
          title: "时间",
          key: "time",
          type: "datetime",
          sortable: true,
          search: {
            disable: true,
          },
          form: {
            component: {
              props: {
                format: "YYYY-MM-DD HH:mm",
                valueFormat: "yyyy-MM-dd HH:mm",
              },
            },
          },
          component: {
            props: {
              format: "YYYY-MM-DD HH:mm",
            },
          },
        },
        {
          title: "请求内容",
          key: "request",
          search: {
            disable: true,
          },
        },
        {
          title: "Url",
          key: "url",
          sortable: true,
          search: {
            disable: true,
          },
        },
        {
          title: "响应内容",
          key: "response",
          sortable: true,
          search: {
            disable: true,
          },
        },
        {
          title: "IP地址",
          key: "ip",
          sortable: true,
          search: {
            disable: true,
          },
        },
        {
          title: "uuid",
          key: "uuid",
          sortable: true,
          search: {
            disable: true,
          },
        },
        {
          title: "用户名",
          key: "username",
          sortable: true,
          search: {
            disable: true,
          },
        },
      ],
      mid_data: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        pageCount: 9,
        layout: "prev, pager, next, jumper, ->, total, slot",
      },
    };
  },
  computed: {
    ...mapState("d2admin/user", ["info"]),
    data: function () {
      return this.mid_data;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    deleteSelection() {
      var length = this.selection.length;
      var count = 0;
      var suc = 0;
      for (var x in this.selection) {
        var req = {};
        req["id"] = this.selection[x]["id"];
        deleteLog({
          ...req,
        })
          .then((res) => {
            if (res.status === 200) {
              suc++;
            }
            count += 1;
            if (count === length) {
              this.$notify({
                title: "批量删除",
                message:
                  "成功删除  " + suc + "条，失败  " + (count - suc) + "条。",
                type: "success",
              });
            }
          })
          .catch((err) => {
            count += 1;
            if (count === length) {
              this.$notify({
                title: "批量删除",
                message:
                  "成功删除  " + suc + "条，失败  " + (count - suc) + "条。",
                type: "success",
              });
            }
          });
      }
    },
    handleSelectionChange(val) {
      this.selection = val;
    },
    reset() {
      this.state = 1;
      this.pagination.page = 1;
      this.fetchData();
    },
    getLogByUUID() {
      this.state = 2;
      this.fetchData();
    },
    getLogByName() {
      this.state = 3;
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
    paginationCurrentChange(page) {
      this.pagination.page = page;
      this.fetchData();
    },
    fetchData() {
      var req = {};
      req["page"] = this.pagination.page;
      req["pageSize"] = this.pagination.pageSize;
      if (this.state === 1) {
        getLog({
          ...req,
        }).then((res) => {
          if (res.status === 200) {
            this.total = res.size;
            this.mid_data = res.data;
          } else {
            this.$$message({
              message: res.message,
              type: "warning",
            });
          }
        });
      } else if (this.state === 2) {
        req["uuid"] = this.uuid;
        getLogByUUID({
          ...req,
        }).then((res) => {
          if (res.status === 200) {
            this.total = res.size;
            this.mid_data = res.data;
          } else {
            this.$$message({
              message: res.message,
              type: "warning",
            });
          }
        });
      } else if (this.state === 3) {
        req["username"] = this.username;
        getLogByName({
          ...req,
        }).then((res) => {
          if (res.status === 200) {
            this.total = res.size;
            this.mid_data = res.data;
          } else {
            this.$$message({
              message: res.message,
              type: "warning",
            });
          }
        });
      } else {
        this.state = 1;
      }
    },
    handleShowMore(log) {
      // 打印一条日志的所有信息到控制台
      // this.$notify({
      //   type: 'info',
      //   title: '日志详情',
      //   message: '完整的日志内容已经打印到控制台'
      // })
      // this.$log.capsule('D2Admin', 'handleShowMore', 'primary')
      // console.group(log.message)
      // console.log('time: ', log.time)
      // console.log('type: ', log.type)
      // console.log(log.meta)
      // console.groupEnd()
    },
    // 日志上传
    handleUpload() {
      logDown();
      // window.open(
      //   "http://10.246.174.203:5000/picture/log/download")
    },
  },
};
</script>
<style lang="scss" scoped>
.panel-search {
  display: flex;
  width: 100%;
  height: 100%;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  .panel-search__input {
    text-align: center;
  }
}
.place {
  align-items: center;
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