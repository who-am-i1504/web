<template>
  <d2-container :type="containerType" :scroll-delay="scrollDelay" better-scroll>
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
              <el-checkbox style="margin: 10px;" slot="paneR" v-model="checkbox1">{{radioString}}</el-checkbox>
            </SplitPane>
          </el-form-item>
          <el-form-item>
            <SplitPane
              style="width: 150px;"
              :min-percent="10"
              :default-percent="80"
              split="vertical"
            >
              <el-input v-model="inputStr3" slot="paneL" size="small" placeholder="序列号"></el-input>
              <el-checkbox style="margin: 10px;" slot="paneR" v-model="checkbox3">{{radioString}}</el-checkbox>
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
              <el-checkbox style="margin: 10px;" slot="paneR" v-model="checkbox4">{{radioString}}</el-checkbox>
            </SplitPane>
          </el-form-item>

          <el-form-item style="width: 150px;">
            <el-button size="small" @click="searchItemInForm">
              <d2-icon name="search" />搜索
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
      :options="options"
      :columns="columns"
      :data="data"
      @selection-change="handleSelectionChange"
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
  </d2-container>
</template>

<script>
import menu from "@/menu/modules/demo-playground";
import { HL7Collect, HL7Detail, HL7Search } from "@api/collect.data";
import Vue from "vue";
import { mapActions } from "vuex";
import SplitPane from "vue-splitpane";
import sendCell from "./component/sendCell";
import receiverCell from "./component/receiverCell";
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
          title: "序列号",
          key: "seqnumber",
          align: "center",
          showOverflowTooltip: true,
          sortable: true
        },
        {
          title: "发送时间",
          key: "time",
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
          title: "数据大小",
          key: "size",
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
        { label: "序列号", prop: "seqnumber" },
        { label: "发送时间", prop: "time" },
        { label: "版本号", prop: "version" },
        { label: "数据大小", prop: "size" },
        { label: "详细内容", prop: "content1" },
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
      searchRequest: {},
      list: [],
      list_name: []
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
      var para = {};
      para["page"] = this.pagination.page;
      para["pageSize"] = this.pagination.pageSize;
      if (this.whichShow) {
      } else {
        for (var x in this.searchRequest) {
          para[x] = this.searchRequest[x];
        }
      }
      if (!this.searching) {
        HL7Collect({
          ...para
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
        HL7Search({
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
    // fetchData() {
    //   this.loading = true;
    //   if (this.whichShow) {
    //     HL7Collect({
    //       ...this.pagination
    //     })
    //       .then(res => {
    //         this.mid_data = res.data;
    //         this.pagination.total = res.size;
    //         this.loading = false;
    //       })
    //       .catch(err => {
    //         this.loading = false;
    //       });
    //   } else {
    //     this.searchRequest["pageSize"] = this.pagination.pageSize;
    //     this.searchRequest["page"] = this.pagination.page;
    //   HL7Search({
    //     ...this.searchRequest
    //   })
    //     .then(res => {
    //       this.loading = false;
    //       if (res.status === 200) {
    //         this.mid_data = res.data;
    //         this.pagination.total = res.size;
    //       } else {
    //         this.$message({
    //           message: res.message,
    //           type: "warning"
    //         });
    //       }
    //     })
    //     .catch(err => {
    //       this.loading = false;
    //       this.$message({
    //         message: "网络错误",
    //         type: "error"
    //       });
    //     });
    // }
    // },
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
      this.searchRequest = {};
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
      // if (this.checkbox2 && this.inputStr2 === "") {
      //   this.$message({
      //     message: "您的IP地址输入框输入为空",
      //     type: "warning"
      //   });
      //   return;
      // } else if (this.checkbox2) {
      //   // 此处正则表达式主要匹配以下几种情况 如果格式不正确则返回相关的提示信息
      //   // 1 ip 127.0.0.1
      //   // 2 ip:  127.0.0.1:
      //   // 3 ip:port 127.0.0.1:8080
      //   // 4 :port  :8080
      //   let re = new RegExp(
      //     "(^((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}$)|(^((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}:[0-9]{0,5}$)|(^:[0-9]{1,5}$)"
      //   );
      //   if (!re.test(this.inputStr2)) {
      //     this.$notify({
      //       title: "IP地址和端口号输入不正确",
      //       message:
      //         "<strong>主要有以下几种形式:</strong><br><i>ip    127.0.0.1</i><br><i>ip:     127.0.0.1:</i><br><i>ip:port     127.0.0.1:8080</i><br><i>:port     :8080</i>",
      //       type: "warining",
      //       dangerouslyUseHTMLString: true
      //     });
      //     return;
      //   }
      //   if (this.inputStr2.indexOf(":") == -1) {
      //     newRow["ip"] = this.inputStr2;
      //   } else {
      //     if (this.inputStr2.indexOf(":") === this.inputStr2.length - 1) {
      //       newRow["ip"] = this.inputStr2.substring(
      //         0,
      //         this.inputStr2.length - 1
      //       );
      //     } else if (this.inputStr2.indexOf(":") == 0) {
      //       value = Number(this.inputStr2.substring(1).trim());
      //       if (!isNaN(value)) {
      //         newRow["port"] = value;
      //       }
      //       this.$message({
      //         message: "端口号取整出现问题",
      //         type: "warning"
      //       });
      //       return;
      //     } else {
      //       newRow["ip_port"] = this.inputStr2;
      //     }
      //   }
      // }
      if (this.checkbox3 && this.inputStr3 === "") {
        this.$message({
          message: "您的序列号输入框输入为空",
          type: "warning"
        });
        return;
      } else if (this.checkbox3) {
        newRow["seqnumber"] = this.inputStr3;
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
    downloadAllDataTranslate(data) {
      var num = 0;
      return data.map(row => ({
        ...row,
        order: (num += 1),
        content1: row.content.replace(/\n/g, " ")
      }));
    },
    exportExecl(execl_columns, execl_data) {
      this.$export
        .excel({
          title: "HL7数据概述",
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
          title: "HL7数据概述",
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
          if (this.whichShow) {
            var params = {};
            params["pageSize"] = this.pagination.total;
            params["page"] = 1;
            HL7Collect({
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
            HL7Search({
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
            HL7Collect({
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
            HL7Search({
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
    }
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