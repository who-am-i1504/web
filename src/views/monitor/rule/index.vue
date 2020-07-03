<template>
  <d2-container :type="containerType" :scroll-delay="scrollDelay" better-scroll>
    <template slot="header" style="background-color: rgba(#000, .7);">
      <div class="panel-search">
        <!-- style="margin: -16px; background-color:rgba(#000, .7);" -->
        <el-form :inline="true" ref="form">
          <!-- style="background-color: rgba(#000, .7);margin-bottom: -30px; width: 100%; align-items: center;" -->
          <el-form-item style="background-color: rgba(#000, .7);">
            <el-input
              style="background-color: rgba(#000, .7);"
              v-model="inputStr"
              placeholder="IP地址"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="addItemInForm">
              <d2-icon name="plus" />添加
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchItemInForm">
              <d2-icon name="search" />查找
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetTable">
              <d2-icon name="reset" />重置
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="batchDelete">
              <d2-icon name="warning" />批量删除
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
      <el-form-item :label="`导入文件添加黑名单`">
        <el-button-group>
          <el-button type="success">
            <el-upload :accept="'*.csv'" :before-upload="handleUploadCsv" action="default">
              <d2-icon name="file-o" />选择要导入的 .csv 表格
            </el-upload>
          </el-button>
          <el-button type="success">
            <el-upload :before-upload="handleUploadXlsx" action="default">
              <d2-icon name="file-o" />选择要导入的 .xlsx 表格
            </el-upload>
          </el-button>
        </el-button-group>
      </el-form-item>

      <el-form-item>{{table.batchStatus}}</el-form-item>
    </el-form>
    <d2-crud
      style="margin: -20px; background-color: rgba(#000, .7); color: #FFF;"
      ref="d2Crud"
      selection-row
      @selection-change="handleSelectionChange"
      :columns="columns"
      :editTemplate="editTemplate"
      :data="data"
      :form-options="formOptions"
      @dialog-cancel="handleDialogCancel"
      @row-dblclick="doubleClick"
      @row-edit="handleRowEdit"
      :loading="loading"
    />
    <el-card style="margin: -10px;" slot="footer">
      <el-pagination
        @current-page="pagination.page"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[20, 40, 80, 100, 1000]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin: -10px;"
        @size-change="handleSizeChange"
        @current-change="paginationCurrentChange"
        @prev-click="handlePaginationPrevClick"
        @next-click="handlePaginationNextClick"
      ></el-pagination>
    </el-card>
    <el-dialog
      :append-to-body="true"
      title="添加黑名单信息表格"
      :lock-scroll="true"
      :modal="false"
      :visible.sync="dialogVisible"
      width="60%"
      height="60%"
      :before-close="handleClose"
    >
      <el-container style="height:300px;" better-scroll>
        <el-main>
          <el-table v-bind="table">
            <el-table-column
              v-for="(item, index) in table.columns"
              :key="index"
              :prop="item.prop"
              :label="item.label"
            ></el-table-column>
          </el-table>
        </el-main>
      </el-container>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="batchSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import {
  getMonitorRule,
  searchMonitorRule,
  addMonitorRule,
  updateMonitorRule,
  deleteMonitorRule
} from "@api/monitor";
import Vue from "vue";
import { mapActions } from "vuex";
import SplitPane from "vue-splitpane";
Vue.component("SplitPane", SplitPane);
export default {
  data() {
    return {
      dialogVisible: false,
      table: {
        columns: [],
        data: [],
        size: "mini",
        stripe: true,
        border: true,
        mid_data: [],
        index: 0,
        timer: null,
        batchStatus: ""
      },
      multipleSelection: [],
      currentTableData: [],
      downloadColumns: [
        { label: "序号", prop: "order" },
        { label: "ID", prop: "id" },
        { label: "IP地址黑名单", prop: "ip" }
      ],
      inputStr: "",
      containerType: "full",
      scrollDelay: 10,
      radio: 1,
      addIcon: "el-icon-circle-plus",
      // menu,
      banner: {
        title: "HL7规则管理",
        subTitle: "在这里可以进行HL7规则的添加,删除,更改等功能"
      },
      columns: [
        {
          title: "序号",
          key: "order",
          align: "center",
          width: 100
        },
        {
          title: "黑名单IP地址",
          key: "ip",
          align: "center"
        }
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
      editTemplate: {
        ip: {
          title: "字符串",
          value: ""
        },
        radio: {
          title: "修改选项：",
          component: {
            name: "el-radio",
            options: [
              {
                label: "修改",
                value: 1
              },
              {
                label: "删除",
                value: 2
              }
            ]
          }
        }
      },
      formOptions: {
        saveButtonIcon: "el-icon-edit",
        saveButtonText: "修改",
        saveLoading: false,
        "append-to-body": true,
        "lock-scroll": true
      },
      tagGet: true
    };
  },
  computed: {
    data: function() {
      var x;
      var i = 1;
      for (x in this.mid_data) {
        this.mid_data[x]["order"] =
          (this.pagination["page"] - 1) * this.pagination["pageSize"] + i;
        this.mid_data[x]["radio"] = 1;
        i += 1;
      }
      return this.mid_data;
    }
  },
  watch: {
    inputStr: function(value) {
      this.handleSet("inputStr", value);
    },
    pagination: function(value) {
      this.handleSet("pagination", value);
    }
  },
  mounted() {
    this.load();
    this.fetchData();
  },
  methods: {
    ...mapActions("d2admin/db", ["databasePage", "databasePageClear", "pageClear"]),
    async load() {
      const db = await this.databasePage({
        user: true
      });
      var str = db.value();
      if (str.inputStr) {
        this.inputStr = str.inputStr;
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
    batchSubmit() {
      var success = 0;
      var faild = 0;
      var sum = 0;
      var index = 0;
      var mid_data = this.table.mid_data;
      var notify = this.$notify;
      var t = this.table;
      var f = function() {
        for (var x = index; x < index + 1000 && x < mid_data.length; x++) {
          var row = {};
          t.batchStatus = "已经提交" + String(x) + "条数据。";
          row["IP地址黑名单"] = mid_data[x]["IP地址黑名单"];
          addMonitorRule({
            ...row
          })
            .then(res => {
              sum++;
              if (res.status === 200) {
                success++;
              } else {
                faild++;
              }
              if (sum === mid_data.length) {
                t.batchStatus = "";
                notify({
                  title: "批量添加信息",
                  message: "失败:" + String(faild) + "成功:" + String(success),
                  type: "success"
                });
              }
            })
            .catch(err => {
              sum++;
              faild++;
              if (sum === mid_data.length) {
                t.batchStatus = "";
                notify({
                  title: "批量添加信息",
                  message: "失败:" + String(faild) + "成功:" + String(success),
                  type: "success"
                });
              }
            });
        }
        index = x;
        // console.log(x)
        if (x === mid_data.length) {
          t.batchStatus = "全部提交完成";
          clearInterval(timer);
        }
      };
      var timer = setInterval(f, 10);
      this.dialogVisible = false;
    },
    dealDialogTable() {
      for (
        var x = this.table.index;
        x < this.table.index + 100 && x < this.table.mid_data.length;
        x++
      ) {
        this.table.data.push(this.table.mid_data[x]);
      }
      this.table.index = x;
      // console.log(x)
      if (x == this.table.mid_data.length || !this.dialogVisible) {
        clearInterval(this.table.timer);
      }
    },
    handleClose(done) {
      // this.batchSubmit()
      // console.log(this.table)
      done();
    },
    handleUploadCsv(file) {
      if (!(file.type === "application/vnd.ms-excel")) {
        this.$message({
          message: "只能导入csv文件",
          type: "error"
        });
        return false;
      }
      this.$import.csv(file).then(res => {
        this.table.columns = Object.keys(res.data[0]).map(e => ({
          label: e,
          prop: e
        }));
        this.table.index = 0;
        this.table.data = [];
        this.table.mid_data = results;
        this.table.timer = setInterval(this.dealDialogTable, 100);
        this.dialogVisible = true;
      });
      return false;
    },
    handleUploadXlsx(file) {
      if (
        !(
          file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      ) {
        this.$message({
          message: "只能导入csv文件",
          type: "error"
        });
        return false;
      }
      this.$import.xlsx(file).then(({ header, results }) => {
        this.table.columns = header.map(e => {
          return {
            label: e,
            prop: e
          };
        });
        this.table.index = 0;
        this.table.data = [];
        this.table.mid_data = results;
        this.table.timer = setInterval(this.dealDialogTable, 100);
        // console.log(results)
        // this.table.data = results
        this.dialogVisible = true;
      });
      return false;
    },
    paginationCurrentChange(page) {
      this.pagination.page = page;
      if (this.tagGet) {
        this.fetchData();
      } else {
        this.searchItemInForm();
      }
    },
    fetchData() {
      this.loading = true;
      getMonitorRule({
        ...this.pagination
      })
        .then(res => {
          if (res.status === 200) {
            this.mid_data = res.data;
            this.pagination.total = res.size;
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message({
            message: "网络错误",
            type: "error"
          });
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      if (this.tagGet) {
        this.fetchData();
      } else {
        this.searchItemInForm();
      }
    },
    paginationCurrentChange(val) {
      this.pagination.page = val;
      if (this.tagGet) {
        this.fetchData();
      } else {
        this.searchItemInForm();
      }
    },
    handlePaginationPrevClick(val) {
      this.pagination.page = val;
      if (this.tagGet) {
        this.fetchData();
      } else {
        this.searchItemInForm();
      }
    },
    handlePaginationNextClick(val) {
      this.pagination.page = val;
      if (this.tagGet) {
        this.fetchData();
      } else {
        this.searchItemInForm();
      }
    },
    doubleClick(row, event) {
      this.$refs.d2Crud.showDialog({
        mode: "edit",
        rowIndex:
          row.order - (this.pagination.page - 1) * this.pagination.pageSize - 1
      });
    },
    handleDialogCancel(done) {
      done();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    downloadDataTranslate(data) {
      return data.map(row => ({
        ...row
      }));
    },
    handleDownloadXlsx(data) {
      this.$export
        .excel({
          title: "HL7部分数据",
          columns: this.downloadColumns,
          data: this.downloadDataTranslate(data)
        })
        .then(() => {
          this.$message("导出表格成功");
        });
    },
    handleDownloadCsv(data) {
      this.$export
        .csv({
          title: "HL7部分数据",
          columns: this.downloadColumns,
          data: this.downloadDataTranslate(data)
        })
        .then(() => {
          this.$message("导出CSV成功");
        });
    },
    handleRowEdit({ index, row }, done) {
      this.formOptions.saveLoading = true;
      setTimeout(() => {
        // console.log(index)
        // console.log(row)
        var newRow = {};
        newRow["id"] = row.id;
        newRow["ip"] = row.ip;
        if (row.radio === 2) {
          deleteMonitorRule({
            ...newRow
          })
            .then(res => {
              if (res.status === 200) {
                if (this.tagGet) {
                  this.fetchData();
                } else {
                  this.searchItemInForm();
                }
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
              } else {
                if (this.tagGet) {
                  this.fetchData();
                } else {
                  this.searchItemInForm();
                }
                this.$message({
                  message: res.message,
                  type: "warning"
                });
              }
              done();
              this.formOptions.saveLoading = false;
            })
            .catch(err => {
              this.$message({
                message: "网络错误",
                type: "warning"
              });
              this.formOptions.saveLoading = false;
            });
        } else if (row.radio == 1) {
          deleteMonitorRule({
            ...newRow
          })
            .then(res => {
              if (res.status === 200) {
                if (this.tagGet) {
                  this.fetchData();
                } else {
                  this.searchItemInForm();
                }
                this.$message({
                  message: "更改成功",
                  type: "success"
                });
              } else {
                if (this.tagGet) {
                  this.fetchData();
                } else {
                  this.searchItemInForm();
                }
                this.$message({
                  message: res.message,
                  type: "warning"
                });
              }
              done();
              this.formOptions.saveLoading = false;
            })
            .catch(err => {
              // console.log('err', err)
              this.$message({
                message: "网络错误",
                type: "warning"
              });
              this.formOptions.saveLoading = false;
              done();
            });
        }
      }, 300);
    },
    valid() {
      this.handleClear();
      let re = new RegExp(
        "((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}"
      );
      if (!re.test(this.inputStr)) {
        this.$message({
          message: "输入的IP地址格式不正确",
          type: "warning"
        });
        return -1;
      }
      return 0;
    },
    addItemInForm() {
      if (this.valid() !== 0) return;
      var newRow = {};
      newRow["ip"] = this.inputStr;
      addMonitorRule({
        ...newRow
      })
        .then(res => {
          if (res["status"] === 200) {
            this.$notify({
              title: "IP地址添加成功",
              message: res["data"],
              type: "success"
            });
          } else {
            this.$notify({
              title: "HL7添加出现问题",
              message: res["message"],
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.$notify.error({
            title: "错误",
            message: "网络连接发生错误"
          });
        });
    },
    downloadAllDataTranslate(data) {
      var num = 0;
      return data.map(row => ({
        ...row,
        order: (num += 1)
      }));
    },
    exportExecl(execl_columns, execl_data) {
      this.$export
        .excel({
          title: "IP地址黑名单",
          columns: execl_columns,
          data: this.downloadAllDataTranslate(execl_data)
        })
        .then(() => {
          this.$message("导出表格成功");
        });
    },
    exportCvs(cvs_columns, cvs_data) {
      this.$export
        .csv({
          title: "IP地址黑名单",
          columns: cvs_columns,
          data: this.downloadAllDataTranslate(cvs_data)
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
          var now = {};
          now["pageSize"] = this.pagination.total;
          now["page"] = 1;
          this.loading = true;
          getMonitorRule({
            ...now
          })
            .then(res => {
              if (res.status === 200) {
                this.currentTableData = res.data;
                this.exportExecl(this.downloadColumns, res.data);
              } else {
                this.$message({
                  message: res.message,
                  type: "warning"
                });
              }
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
            });
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
          var now = {};
          now["pageSize"] = this.pagination.total;
          now["page"] = 1;
          this.loading = true;
          getMonitorRule({
            ...now
          })
            .then(res => {
              if (res.status === 200) {
                this.currentTableData = res.data;
                this.exportCvs(this.downloadColumns, res.data);
              } else {
                this.$message({
                  message: res.message,
                  type: "warning"
                });
              }
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
            });
        } else {
          this.exportCvs(this.downloadColumns, this.currentTableData);
        }
      }, 300);
    },
    searchItemInForm() {
      if (this.inputStr === "") {
        this.tagGet = true;
        this.fetchData();
        return;
      }
      if (this.valid() !== 0) return;
      this.tagGet = false;
      var newRow = {};
      newRow["ip"] = this.inputStr;
      newRow["page"] = this.pagination.page;
      newRow["pageSize"] = this.pagination.pageSize;
      searchMonitorRule({
        ...newRow
      })
        .then(res => {
          if (res.status === 200) {
            this.mid_data = res.data;
            this.pagination.total = res.size;
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message({
            message: "网络错误",
            type: "error"
          });
          this.loading = false;
        });
    },
    resetTable() {
      this.tagGet = true;
      this.fetchData();
    },
    batchDelete() {
      var length = this.multipleSelection.length;
      var count = 0;
      var success = 0;
      var error = 0;
      setTimeout(() => {
        // console.log(index)
        // console.log(row)
        for (var i = 0; i < length; i++) {
          var newRow = {};
          newRow["id"] = this.multipleSelection[i].id;
          newRow["ip"] = this.multipleSelection[i].ip;

          deleteMonitorRule({
            ...newRow
          })
            .then(res => {
              count++;
              if (res.status == 200){
                success ++;
              }else{
                error ++;
              }
              if (count == length) {
                if (this.tagGet) {
                  this.fetchData();
                } else {
                  this.searchItemInForm();
                }
                this.$message({
                  message: "删除成功" + String(success) + "条; 删除失败" + String(error) + "条。",
                  type: "success"
                });
              }
            })
            .catch(err => {
              count ++;
              error ++;
              if (count == length) {
                if (this.tagGet) {
                  this.fetchData();
                } else {
                  this.searchItemInForm();
                }
                this.$message({
                  message: "删除成功" + String(success) + "条; 删除失败" + String(error) + "条。",
                  type: "success"
                });
              }
            });
        }
      }, 300);
    }
  }
};
</script>
<style lang="scss" scoped>
.panel-search {
  @extend %unable-select;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  margin: 30px;
  height: 0px;
  width: 100%;
  .panel-search__input {
    text-align: center;
  }
}
</style>>
