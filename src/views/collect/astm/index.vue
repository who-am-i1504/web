<template>
  <d2-container :type="containerType" :scroll-delay="scrollDelay">
    <template slot="header">
      <div class="panel-search">
        <el-form :inline="true" ref="form" size="mini" class="panel-search__input">
          <el-form-item>
            <SplitPane
              style="width: 150px;"
              :min-percent="10"
              :default-percent="80"
              split="vertical"
            >
              <el-input v-model="inputStr1" slot="paneL" placeholder="类型" size="small"></el-input>
              <el-checkbox
                style="margin: 10px; margin-top: 5px;"
                slot="paneR"
                v-model="checkbox1"
              >{{radioString}}</el-checkbox>
            </SplitPane>
          </el-form-item>

          <el-form-item>
            <SplitPane
              style="width: 150px;"
              :min-percent="10"
              :default-percent="80"
              split="vertical"
            >
              <el-input v-model="inputStr4" slot="paneL" size="small" placeholder="版本号"></el-input>
              <el-checkbox
                style="margin: 10px; margin-top: 5px;"
                slot="paneR"
                v-model="checkbox4"
              >{{radioString}}</el-checkbox>
            </SplitPane>
          </el-form-item>

          <el-form-item style="width: 150px;">
            <el-button size="small" @click="searchItemInForm">
              <d2-icon name="search" />搜索
            </el-button>
          </el-form-item>

          <el-form-item v-if="info.authority && (info.authority & 2)">
            <el-button style="width: 100%;" type="danger" @click="deleteBatch">
              <d2-icon name="warning" />删除
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <el-form :inline="true" size="mini">
      <el-form-item :label="`全部数据下载 [ ${pagination.total} ] 条`">
        <el-button-group>
          <el-button
            type="primary"
            size="mini"
            :disabled="pagination.total === 0"
            @click="handleDownloadAllXlsx()"
          >xlsx</el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="pagination.total === 0"
            @click="handleDownloadAllCsv()"
          >csv</el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item :label="`已选数据下载 [ ${multipleSelection.length} ] 条`">
        <el-button-group>
          <el-button
            type="primary"
            size="mini"
            :disabled="multipleSelection.length === 0"
            @click="handleDownloadXlsx(multipleSelection)"
          >xlsx</el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="multipleSelection.length === 0"
            @click="handleDownloadCsv(multipleSelection)"
          >csv</el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item>
        <el-popover
          placement="top-start"
          title="提示"
          width="200"
          trigger="hover"
          content="当下载数据量过大时，下载时间将会过长，甚至将会造成崩溃。建议发生此类情况时，使用选定数据下载。"
        >
          <el-button slot="reference" style="margin-left: 20px; margin-top: 3px;" circle>
            <d2-icon name="question-circle-o" />
          </el-button>
        </el-popover>
      </el-form-item>
    </el-form>
    <d2-crud
      style="margin: -20px;"
      ref="d2Crud"
      selection-row
      expand-row
      @selection-change="handleSelectionChange"
      :options="options"
      :columns="columns"
      :data="data"
      :form-options="formOptions"
      :loading="loading"
    >
      <template slot="expandSlot" slot-scope="scope">
        <el-input type="textarea" placeholder="内容" :rows="10" v-model="scope.row.content"></el-input>
        <!-- <div> -->
        <!-- <SplitPane :min-percent='10' :default-percent='50' split="vertical"> -->
        <el-form slot="paneL" ref="form" :model="scope.row" :fullscreen="true">
          <el-row>
            <!-- <el-col :span="4"> -->
            <template v-for="(key, index) in list">
              <el-col :span="12">
                <el-form-item :label="list_name[index]">
                  <el-button type="text">{{scope.row[key]}}</el-button>
                </el-form-item>
              </el-col>
            </template>
            <!-- </el-col> -->
            <el-col :span="4">
              <image slot="paneR" :value="scope.row['image_path']" />
            </el-col>
          </el-row>
          <!-- <slot name="FormBodyAppendSlot" :form="scope.row" /> -->
        </el-form>

        <!-- </SplitPane> -->
        <!-- </div> -->
      </template>
    </d2-crud>
    <el-card style="margin: -10px;" slot="footer">
      <el-pagination
        @current-page="pagination.page"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[20, 50, 100, 500, 1000, 2000, 5000]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin: -10px;"
        :pager-count="15"
        @size-change="handleSizeChange"
        @current-change="paginationCurrentChange"
        @prev-click="handlePaginationPrevClick"
        @next-click="handlePaginationNextClick"
      ></el-pagination>
    </el-card>
    <el-dialog
      :append-to-body="true"
      title="Astm详细内容"
      :lock-scroll="true"
      :modal="false"
      :visible.sync="dialogVisible"
      width="60%"
      height="60%"
      :before-close="handleClose"
    >
      <el-container style="height:300px;">
        <el-main>
          <p v-html="content"></p>
        </el-main>
      </el-container>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import { AstmCollect, AstmDetail, AstmSearch, AstmDelete } from "@api/collect.data";
import Vue from "vue";
import { mapActions } from "vuex";
import SplitPane from "vue-splitpane";
import sendCell from "./component/sendCell";
import receiverCell from "./component/receiverCell";
import { mapState } from "vuex";
Vue.component("SplitPane", SplitPane);
export default {
  data() {
    return {
      content: "",
      dialogVisible: false,
      currentTableData: [],
      multipleSelection: [],
      inputStr1: "",
      inputStr2: "",
      inputStr3: "",
      inputStr4: "",
      containerType: "full",
      scrollDelay: 50,
      checkbox1: false,
      checkbox2: false,
      checkbox3: false,
      checkbox4: false,
      radioString: "",
      addIcon: "el-icon-circle-plus",
      columns: [
        {
          title: "序号",
          key: "order",
          align: "center",
          width: 90,
          showOverflowTooltip: true,
          sortable: true
        },
        {
          title: "类型",
          key: "type",
          align: "center",
          showOverflowTooltip: true,
          sortable: true
        },
        {
          title: "发送方IP地址及端口号",
          key: "sender_tag",
          align: "center",
          showOverflowTooltip: true,
          sortable: true,
          component: {
            name: sendCell
          }
        },
        {
          title: "发送方",
          key: "sender",
          align: "center",
          showOverflowTooltip: true,
          sortable: true
        },
        {
          title: "接收方IP地址及端口号",
          key: "receiver_tag",
          align: "center",
          showOverflowTooltip: true,
          sortable: true,
          component: {
            name: receiverCell
          }
        },
        {
          title: "接收方",
          key: "receiver",
          align: "center",
          showOverflowTooltip: true,
          sortable: true
        },
        {
          title: "发送时间",
          key: "message_time",
          align: "center",
          showOverflowTooltip: true,
          sortable: true
        },
        {
          title: "版本号",
          key: "version",
          align: "center",
          showOverflowTooltip: true,
          sortable: true
        },
        {
          title: "数据大小(byte)",
          key: "size",
          width: 90,
          align: "center",
          showOverflowTooltip: true,
          sortable: true
        }
      ],
      downloadColumns: [
        { label: "序号", prop: "order" },
        { label: "类型", prop: "type" },
        { label: "发送方IP地址及端口号", prop: "send_ip_port" },
        { label: "接收方IP地址及端口号", prop: "receiver_ip_port" },
        { label: "发送时间", prop: "message_time" },
        { label: "版本号", prop: "version" },
        { label: "数据大小", prop: "size" },
        { label: "详细内容", prop: "content1" },
        { label: "发送方", prop: "sender" },
        { label: "接收方", prop: "receiver" },
        { label: "ID", prop: "id" }
      ],
      mid_data: [],
      loading: false,
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        pageCount: 9,
        layout: "prev, pager, next, jumper, ->, total, slot"
      },
      formOptions: {
        saveButtonIcon: "el-icon-edit",
        saveButtonText: "修改",
        saveLoading: false
      },
      options: {
        size: "mini",
        stripe: true
      },
      searching: false,
      searchRequest: {}
    };
  },
  watch: {
    checkbox1: function(value) {
      this.handleSet("checkbox1", value);
      // if (!value){
      //   this.handleSet('inputStr1', '')
      // }
    },
    checkbox2: function(value) {
      this.handleSet("checkbox2", value);
    },
    checkbox3: function(value) {
      this.handleSet("checkbox3", value);
    },
    checkbox4: function(value) {
      this.handleSet("checkbox4", value);
    },
    inputStr1: function(value) {
      this.handleSet("inputStr1", value);
    },
    inputStr2: function(value) {
      this.handleSet("inputStr2", value);
    },
    inputStr3: function(value) {
      this.handleSet("inputStr3", value);
    },
    inputStr4: function(value) {
      this.handleSet("inputStr4", value);
    },
    pagination: function(value) {
      this.handleSet("pagination", value);
    }
  },
  computed: {
    ...mapState("d2admin/user", ["info"]),
    data: function() {
      var x;
      var i = 1;
      for (x in this.mid_data) {
        this.mid_data[x]["order"] =
          (this.pagination["page"] - 1) * this.pagination["pageSize"] + i;
        i += 1;
      }
      return this.mid_data;
    },
    whichShow: function() {
      return !this.searching;
    }
  },
  mounted() {
    this.load();
    this.fetchData();
  },
  methods: {
    ...mapActions("d2admin/db", ["databasePage", "databasePageClear"]),
    async load() {
      const db = await this.databasePage({
        user: true
      });
      var str = db.value();
      if (str.checkbox1) {
        this.checkbox1 = str.checkbox1;
      }
      if (str.checkbox2) {
        this.checkbox2 = str.checkbox2;
      }
      if (str.checkbox3) {
        this.checkbox3 = str.checkbox3;
      }
      if (str.checkbox4) {
        this.checkbox4 = str.checkbox4;
      }
      if (str.inputStr1) {
        this.inputStr1 = str.inputStr1;
      }
      if (str.inputStr2) {
        this.inputStr2 = str.inputStr2;
      }
      if (str.inputStr3) {
        this.inputStr3 = str.inputStr3;
      }
      if (str.inputStr4) {
        this.inputStr4 = str.inputStr4;
      }
      if (str.pagination) {
        this.pagination = str.pagination;
      }
    },
    async handleSet(name, value) {
      if (name === "") {
        return;
      }
      const db = await this.databasePage({
        user: true
      });
      db.set(name, value).write();
    },
    async handleClear() {
      await this.pageClear({ instance: this, user: true });
    },
    handleClose(done) {
      done();
    },
    paginationCurrentChange(page) {
      this.pagination.page = page;
      this.fetchData();
    },
    fetchData() {
      this.loading = true;
      if (this.whichShow) {
        AstmCollect({
          ...this.pagination
        })
          .then(res => {
            this.mid_data = res.data;
            this.pagination.total = res.size;
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
      } else {
        this.searchRequest["pageSize"] = this.pagination.pageSize;
        this.searchRequest["page"] = this.pagination.page;
        AstmSearch({
          ...this.searchRequest
        })
          .then(res => {
            this.loading = false;
            if (res.status === 200) {
              this.mid_data = res.data;
              this.pagination.total = res.size;
            } else {
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message({
              message: "网络错误",
              type: "error"
            });
          });
      }
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
      // this.$refs.d2Crud.showDialog({
      //   mode:'edit',
      //   rowIndex : row.order - (this.pagination.page - 1)*this.pagination.pageSize  - 1
      // })
      this.content =
        "<strong>" + row.content.replace(/\n/g, "<br><br>") + "</strong>";
      this.dialogVisible = true;
    },
    handleDialogCancel(done) {
      done();
    },
    handleRowEdit({ index, row }, done) {
      this.formOptions.saveLoading = true;
      setTimeout(() => {}, 300);
    },
    searchItemInForm() {
      this.searching = false;
      var newRow = {};
      if (this.checkbox1 && this.inputStr1 === "") {
        this.$message({
          message: "您的类型输入框输入为空",
          type: "warning"
        });
        return;
      } else if (this.checkbox1) {
        newRow["type"] = this.inputStr1;
      }
      if (this.checkbox4 && this.inputStr4 === "") {
        this.$message({
          message: "您的版本号输入框输入为空",
          type: "warning"
        });
        return;
      } else if (this.checkbox4) {
        newRow["version"] = this.inputStr4;
      }
      if (Object.getOwnPropertyNames(newRow).length > 0) {
        this.searching = true;
      }
      this.searchRequest = newRow;
      this.fetchData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    downloadDataTranslateXlsx(data) {
      var num = 0;
      return data.map(row => ({
        ...row,
        order: (num += 1),
        content1: row.content.replace(/\n/g, "\r")
      }));
    },
    downloadDataTranslateCsv(data) {
      var num = 0;
      return data.map(row => ({
        ...row,
        order: (num += 1),
        content1: row.content.replace(/\n/g, "\r")
      }));
    },
    handleDownloadXlsx(data) {
      this.$export
        .excel({
          title: "Astm部分数据",
          columns: this.downloadColumns,
          data: this.downloadDataTranslateXlsx(data)
        })
        .then(() => {
          this.$message("导出表格成功");
        });
    },
    handleDownloadCsv(data) {
      this.$export
        .csv({
          title: "Astm部分数据",
          columns: this.downloadColumns,
          data: this.downloadDataTranslateCsv(data)
        })
        .then(() => {
          this.$message("导出CSV成功");
        });
    },
    downloadAllDataTranslateCsv(data) {
      var num = 0;
      return data.map(row => ({
        ...row,
        order: (num += 1),
        content1: row.content.replace(/\n/g, "\r")
      }));
    },
    downloadAllDataTranslateXlsx(data) {
      var num = 0;
      return data.map(row => ({
        ...row,
        order: (num += 1),
        content1: row.content.replace(/\n/g, "\r")
      }));
    },
    exportExecl(execl_columns, execl_data) {
      this.$export
        .excel({
          title: "Astm数据概述",
          columns: execl_columns,
          data: this.downloadAllDataTranslateXlsx(execl_data)
        })
        .then(() => {
          this.$message("导出表格成功");
        });
    },
    exportCvs(cvs_columns, cvs_data) {
      this.$export
        .csv({
          title: "Astm数据概述",
          columns: cvs_columns,
          data: this.downloadAllDataTranslateCsv(cvs_data)
        })
        .then(() => {
          this.$message("导出CSV成功");
        });
    },
    handleDownloadAllXlsx() {
      if (this.pagination.total > 10000) {
        this.$notify({
          message: "下载数据量过大，需要一些时间"
        });
      }
      setTimeout(() => {
        if (this.currentTableData.length != this.pagination.total) {
          if (this.whichShow) {
            var params = {};
            params["pageSize"] = this.pagination.total;
            params["page"] = 1;
            AstmCollect({
              ...params
            })
              .then(res => {
                if (res.status === 200) {
                  this.currentTableData = res.data;
                  this.exportExecl(this.downloadColumns, res.data);
                } else {
                  this.$message({
                    message: res.message,
                    type: "warining"
                  });
                }
              })
              .catch(err => {
                this.$message({
                  message: "网络错误",
                  type: "error"
                });
              });
          } else {
            var params = this.searchRequest;
            params["pageSize"] = this.pagination.total;
            params["page"] = 1;
            AstmSearch({
              ...params
            })
              .then(res => {
                if (res.status === 200) {
                  this.currentTableData = res.data;
                  this.exportExecl(this.downloadColumns, res.data);
                } else {
                  this.$message({
                    message: res.message,
                    type: "warining"
                  });
                }
              })
              .catch(err => {
                this.$message({
                  message: "网络错误",
                  type: "error"
                });
              });
          }
        } else {
          this.exportExecl(this.downloadColumns, this.currentTableData);
        }
      }, 300);
    },
    handleDownloadAllCsv(data) {
      if (this.pagination.total > 10000) {
        this.$notify({
          message: "下载数据量过大，需要一些时间"
        });
      }
      setTimeout(() => {
        if (this.currentTableData.length != this.pagination.total) {
          if (this.whichShow) {
            var params = {
              pageSize: this.pagination.total,
              page: 1
            };
            AstmCollect({
              ...params
            })
              .then(res => {
                if (res.status === 200) {
                  this.currentTableData = res.data;
                  this.exportCvs(this.downloadColumns, res.data);
                } else {
                  this.$message({
                    message: res.message,
                    type: "warining"
                  });
                }
              })
              .catch(err => {
                this.$message({
                  message: "网络错误",
                  type: "error"
                });
              });
          } else {
            var params = this.searchRequest;
            params["pageSize"] = this.pagination.total;
            params["page"] = 1;
            AstmSearch({
              ...params
            })
              .then(res => {
                this.loading = false;
                if (res.status === 200) {
                  this.currentTableData = res.data;
                  this.exportCvs(this.downloadColumns, res.data);
                } else {
                  this.$message({
                    message: res.message,
                    type: "warning"
                  });
                }
              })
              .catch(err => {
                this.loading = false;
                this.$message({
                  message: "网络错误",
                  type: "error"
                });
              });
          }
        } else {
          this.exportCvs(this.downloadColumns, this.currentTableData);
        }
      }, 300);
    },
    deleteBatch() {
      var length = this.multipleSelection.length;
      var count = 0;
      var success = 0;
      for (var x in this.multipleSelection) {
        var req = {};
        req["id"] = this.multipleSelection[x]["id"];
        AstmDelete({
          ...req,
        })
          .then((res) => {
            count += 1;
            if (res.status === 200) {
              success += 1;
            }
            if (count === length) {
              this.$message({
                message:
                  "删除成功" +
                  String(success) +
                  "条; 删除失败" +
                  String(length - success) +
                  "条。",
                type: "success",
              });
            }
          })
          .catch((err) => {
            count += 1;
            if (count === length) {
              this.$message({
                message:
                  "删除成功" +
                  String(success) +
                  "条; 删除失败" +
                  String(length - success) +
                  "条。",
                type: "success",
              });
            }
          });
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.panel-search {
  @extend %unable-select;

  justify-content: center;
  align-items: center;
  width: 100%;
  .panel-search__input {
    text-align: center;
  }
}
</style>