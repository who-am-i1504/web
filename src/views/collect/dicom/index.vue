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
              <el-input v-model="patient_name" slot="paneL" placeholder="患者姓名" size="small"></el-input>
              <el-checkbox
                style="margin: 10px; margin-top: 5px;"
                slot="paneR"
                v-model="patient_name_tag"
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
              <el-input v-model="patient_id" slot="paneL" size="small" placeholder="患者ID"></el-input>
              <el-checkbox
                style="margin: 10px; margin-top: 5px;"
                slot="paneR"
                v-model="patient_id_tag"
              >{{radioString}}</el-checkbox>
            </SplitPane>
          </el-form-item>

          <el-form-item style="width: 150px;">
            <el-button style="width: 100%;" @click="searchItemInForm">
              <d2-icon name="search" />搜索
            </el-button>
          </el-form-item>

          <el-form-item v-if="info.authority && (info.authority & 2)">
            <el-button style="width: 100%;" type="danger" @click="deleteBatch">
              <d2-icon name="warning" />删除
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button style="width: 100%;" @click="downloadBatch">
              <d2-icon name="download" />图片批量下载
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
      :expand-row="{title:'详情', align:'center'}"
      :options="options"
      :columns="columns"
      :data="data"
      @selection-change="handleSelectionChange"
      :form-options="formOptions"
      :rowHandle="rowHandle"
      @custom-emit-2="downloadPicture"
      :loading="loading"
    >
      <template slot="image_pathSlot" slot-scope="scope">
        <!-- <div> -->
        <image-tag :value="scope.row.image_path" @click="doubleClick(scope.row)" />
        <!-- </div> -->
      </template>
      <template slot="expandSlot" slot-scope="scope">
        <!-- <div> -->
        <!-- <SplitPane :min-percent='10' :default-percent='50' split="vertical"> -->
        <el-form slot="paneL" ref="form" :model="scope.row" :fullscreen="true">
          <el-row>
            <!-- <el-col :span="4"> -->
            <template v-for="(key, index) in list">
              <el-col v-if="scope.row[key]" :span="12">
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
    <!-- <el-dialog
      :append-to-body="true"
      title="详情"
      :lock-scroll="true"
      :modal="false"
      :visible.sync="dialogVisible"
      width="60%"
      height="60%"
      :before-close="handleClose">
        <el-container style="height:300px;">
          <el-main>
            <el-form
              :model="formData"
            >
              <div v-for="(value, key, index) in formData" :key="index">
                <el-form-item
                  v-if="handleFormTemplateMode(key) === undefine ? false:true"
                  :label="handleFormTemplateMode(key).title"
                  :prop="key"
                >

                </el-form-item>
              </div>
            </el-form>
          </el-main>
        </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>-->
    <img-viewer ref="viewer" />
  </d2-container>
</template>

<script>
import { DICOMSearch, DICOMDelete } from "@api/collect.data";
import { getDICOMByPage } from "@/api/medical.data";
import Vue from "vue";
import { mapActions } from "vuex";
import SplitPane from "vue-splitpane";
import sendCell from "./component/sendCell";
import receiverCell from "./component/receiverCell";
import ImageTag from "./component/image";
import ImgViewer from "./component/ImgViewer";
import { mapState } from "vuex";
import request from "@/plugin/axiosfile";
import axios from "axios";
const FileDownload = require('js-file-download');
// import {d2CrudPlus} from 'd2-crud-plus'
Vue.component("SplitPane", SplitPane);
export default {
  // mixins:[d2CrudPlus.crud],
  data() {
    return {
      patient_name: "",
      patient_id: "",
      patient_name_tag: false,
      patient_id_tag: false,
      formData: {},
      content: "",
      dialogVisible: false,
      currentTableData: [],
      multipleSelection: [],
      inputStr2: "",
      containerType: "full",
      scrollDelay: 50,
      radioString: "",
      addIcon: "el-icon-circle-plus",
      columns: [
        {
          title: "序号",
          key: "order",
          align: "center",
          width: 90,
          showOverflowTooltip: true,
          sortable: true,
        },
        {
          title: "姓名",
          key: "patient_name",
          sortable: true,
          showOverflowTooltip: true,
          align: "center",
        },
        {
          title: "年龄",
          key: "patient_age",
          width: "50",
          align: "center",
          sortable: true,
        },
        {
          title: "患者ID",
          key: "patient_id",
          align: "center",
          sortable: true,
        },
        {
          title: "发送方IP地址及端口号",
          key: "sender_tag",
          align: "center",
          showOverflowTooltip: true,
          sortable: true,
          component: {
            name: sendCell,
            disabled: false,
          },
        },
        {
          title: "接收方IP地址及端口号",
          key: "receiver_tag",
          align: "center",
          sortable: true,
          showOverflowTooltip: true,
          component: {
            name: receiverCell,
          },
        },
        {
          title: "发送时间",
          key: "time",
          align: "center",
          sortable: true,
          showOverflowTooltip: true,
        },
        {
          title: "数据大小",
          key: "size",
          // width: 100,
          sortable: true,
          align: "center",
          showOverflowTooltip: true,
        },
        {
          title: "图片预览",
          key: "image_path",
          align: "center",
          type: "datetime",
          width: 90,
          rowSlot: true,
          // component: {
          //   name: image
          // }
        },
      ],
      rowHandle: {
        custom: [
          // {
          //   icon: 'el-icon-edit',
          //   text: '详情',
          //   size: 'small',
          //   fixed: 'right',
          //   emit: 'custom-emit-1'
          // },
          {
            icon: "el-icon-download",
            text: "图片下载",
            size: "small",
            fixed: "right",
            emit: "custom-emit-2",
          },
        ],
      },
      mid_data: [],
      loading: false,
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        pageCount: 9,
        layout: "prev, pager, next, jumper, ->, total, slot",
      },
      formOptions: {
        saveButtonIcon: "el-icon-edit",
        saveButtonText: "修改",
        saveLoading: false,
      },
      options: {
        size: "mini",
        stripe: true,
      },
      searching: false,
      searchRequest: {},
      images: [],
      list: [
        "patient_name",
        "patient_sex",
        "patient_birth_date",
        "patient_birth_time",
        "patient_weight",
        "patient_id",
        "patient_pregnancy_status",
        "patient_age",
        "study_ris_id",
        "study_id",
        "study_instance_id",
        "study_date",
        "study_time",
        "study_body_part",
        "study_description",
        "series_num",
        "series_instance_id",
        "series_modality",
        "series_description",
        "series_date",
        "series_time",
        "slice_thickness",
        "spacing_between_slices",
        "slice_location",
        "sop_instance_id",
        "image_date",
        "image_time",
        "high_bit",
        "window_center",
        "window_width",
        "image_path",
      ],
      list_name: [
        "患者姓名",
        "患者性别",
        "患者出生日期",
        "患者出生时间",
        "患者重量",
        "患者ID",
        "怀孕状态",
        "患者年龄",
        "检查号",
        "检查ID",
        "检查实例号",
        "检查日期",
        "检查时间",
        "检查部位",
        "检查描述",
        "序列号",
        "序列实例号",
        "检查模态",
        "检查描述和说明",
        "检查日期",
        "检查时间",
        "层厚",
        "层与层之间的间距",
        "实际相对位置",
        "sop实例号",
        "图片日期",
        "图片时间",
        "高位",
        "窗位",
        "窗宽",
        "图片路径",
      ],
    };
  },
  components: {
    ImgViewer,
    ImageTag,
  },
  watch: {
    pagination: function (value) {
      this.handleSet("pagination", value);
    },
  },
  computed: {
    ...mapState("d2admin/user", ["info"]),
    data: function () {
      var x;
      var i = 1;
      this.images = [];
      for (x in this.mid_data) {
        this.mid_data[x]["order"] =
          (this.pagination["page"] - 1) * this.pagination["pageSize"] + i;
        for (var j in this.mid_data[x]["content"]) {
          if (this.mid_data[x][j] == undefined) {
            if (
              typeof this.mid_data[x]["content"][j] === "undefined" ||
              this.mid_data[x]["content"][j] === null
            ) {
              this.mid_data[x]["content"][j] = "无";
            } else if (typeof this.mid_data[x][j] === "string") {
            } else {
              this.mid_data[x]["content"][j] = String(
                this.mid_data[x]["content"][j]
              );
            }
            this.mid_data[x][j] = this.mid_data[x]["content"][j];
          }
        }
        if (this.mid_data[x]["image_path"] !== undefined) {
          this.images.push({
            thumbnail: "/picture/show/" + this.mid_data[x]["image_path"],
            source: "/picture/show/" + this.mid_data[x]["image_path"],
            title: this.mid_data[x]["order"],
          });
        }
        i += 1;
      }
      // console.log
      // console.log(this.images)
      return this.mid_data;
    },
    whichShow: function () {
      return !this.searching;
    },
    downloadColumns: function () {
      var result = [];
      var list = this.list;
      var list_name = this.list_name;
      for (var x = 0; x < list.length; x++) {
        result.push({ label: list_name[x], prop: list[x] });
      }
      result.push({ label: "序号", prop: "order" });
      return result;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    downloadPicture({ index, row }) {
      window.open("http://10.246.174.203:5000/picture/download/" + row.image_path);
    },
    // showCurdDialog({index, row}){
    //   this.$refs.dialogMyself.handleFormData(row)
    //   this.dialogVisible = true
    // },
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
        getDICOMByPage({
          ...para,
        })
          .then((res) => {
            this.mid_data = res.data;
            this.pagination.total = res.size;
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
          });
      } else {
        for (var x in this.searchRequest) {
          para[x] = this.searchRequest[x];
        }
        DICOMSearch({
          ...para,
        })
          .then((res) => {
            this.mid_data = res.data;
            this.pagination.total = res.size;
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
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
    doubleClick(row) {
      // this.$refs.d2Crud.showDialog({
      //   mode:'edit',
      //   rowIndex : row.order - (this.pagination.page - 1)*this.pagination.pageSize  - 1
      // })
      // this.content = '<strong>' + row.content.replace(/\n/g, '<br><br>') + '</strong>'
      // this.dialogVisible = true
      this.$refs.viewer.show(
        this.images,
        row.order - (this.pagination.page - 1) * this.pagination.pageSize - 1
        // Math.floor(Math.random() * 10)
      );
    },
    // handleDialogCancel(done) {
    //   done();
    // },
    // handleRowEdit({ index, row }, done) {
    //   this.formOptions.saveLoading = true;
    //   setTimeout(() => {}, 300);
    // },
    searchItemInForm() {
      this.searching = false;
      var newRow = {};
      if (this.patient_name_tag && this.patient_name === "") {
        this.$message({
          message: "您的患者姓名输入框输入为空",
          type: "warning",
        });
        return;
      } else if (this.patient_name_tag) {
        newRow["patient_name"] = this.patient_name;
      }
      if (this.patient_id_tag && this.patient_id === "") {
        this.$message({
          message: "您的患者ID输入框输入为空",
          type: "warning",
        });
        return;
      } else if (this.patient_id_tag) {
        newRow["patient_id"] = this.patient_id;
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
      return data.map((row) => ({
        ...row,
      }));
    },
    handleDownloadXlsx(data) {
      this.$export
        .excel({
          title: "DICOM部分数据",
          columns: this.downloadColumns,
          data: this.downloadDataTranslate(data),
        })
        .then(() => {
          this.$message("导出表格成功");
        });
    },
    handleDownloadCsv(data) {
      this.$export
        .csv({
          title: "DICOM部分数据",
          columns: this.downloadColumns,
          data: this.downloadDataTranslate(data),
        })
        .then(() => {
          this.$message("导出CSV成功");
        });
    },
    downloadAllDataTranslate(data) {
      var num = 0;
      return data.map((row) => ({
        ...row,
        // order: (num += 1)
      }));
    },
    exportExecl(execl_columns, execl_data) {
      this.$export
        .excel({
          title: "DICOM数据概述",
          columns: execl_columns,
          data: this.downloadAllDataTranslate(execl_data),
        })
        .then(() => {
          this.$message("导出表格成功");
        });
    },
    exportCvs(cvs_columns, cvs_data) {
      this.$export
        .csv({
          title: "DICOM数据概述",
          columns: cvs_columns,
          data: this.downloadAllDataTranslate(cvs_data),
        })
        .then(() => {
          this.$message("导出CSV成功");
        });
    },
    handleDownloadAllXlsx() {
      if (this.pagination.total > 10000) {
        this.$notify({
          message: "下载数据量过大，需要一些时间",
        });
      }
      setTimeout(() => {
        if (this.currentTableData.length != this.pagination.total) {
          if (this.whichShow) {
            var params = {};
            params["pageSize"] = this.pagination.total;
            params["page"] = 1;
            getDICOMByPage({
              ...params,
            })
              .then((res) => {
                if (res.status === 200) {
                  this.currentTableData = res.data;
                  this.exportExecl(this.downloadColumns, res.data);
                } else {
                  this.$message({
                    message: res.message,
                    type: "warining",
                  });
                }
              })
              .catch((err) => {
                this.$message({
                  message: "网络错误",
                  type: "error",
                });
              });
          } else {
            var params = this.searchRequest;
            params["pageSize"] = this.pagination.total;
            params["page"] = 1;
            for (var x in this.searchRequest) {
              params[x] = this.searchRequest[x];
            }
            DICOMSearch({
              ...params,
            })
              .then((res) => {
                if (res.status === 200) {
                  this.currentTableData = res.data;
                  this.exportExecl(this.downloadColumns, res.data);
                } else {
                  this.$message({
                    message: res.message,
                    type: "warining",
                  });
                }
              })
              .catch((err) => {
                this.$message({
                  message: "网络错误",
                  type: "error",
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
          message: "下载数据量过大，需要一些时间",
        });
      }
      setTimeout(() => {
        if (this.currentTableData.length != this.pagination.total) {
          if (this.whichShow) {
            var params = {
              pageSize: this.pagination.total,
              page: 1,
            };
            getDICOMByPage({
              ...params,
            })
              .then((res) => {
                if (res.status === 200) {
                  this.currentTableData = res.data;
                  this.exportCvs(this.downloadColumns, res.data);
                } else {
                  this.$message({
                    message: res.message,
                    type: "warining",
                  });
                }
              })
              .catch((err) => {
                this.$message({
                  message: "网络错误",
                  type: "error",
                });
              });
          } else {
            var params = this.searchRequest;
            params["pageSize"] = this.pagination.total;
            params["page"] = 1;
            for (var x in this.searchRequest) {
              params[x] = this.searchRequest[x];
            }
            DICOMSearch({
              ...params,
            })
              .then((res) => {
                this.loading = false;
                if (res.status === 200) {
                  this.currentTableData = res.data;
                  this.exportCvs(this.downloadColumns, res.data);
                } else {
                  this.$message({
                    message: res.message,
                    type: "warning",
                  });
                }
              })
              .catch((err) => {
                this.loading = false;
                this.$message({
                  message: "网络错误",
                  type: "error",
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
        DICOMDelete({
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
    downloadBatch() {
      var req = [];
      for (var x in this.multipleSelection) {
        req.push(this.multipleSelection[x]["image_path"]);
      }
      if (req.length === 0) return;
      
      // window.open('http://10.246.174.203:5000/picture/test')
      
      // axios({
      //   url: process.env.VUE_APP_API + '/picture/download/1.jpg',
      //   method: "get",
      //   headers:{
      //     'Access-Control-Allow-Origin':'*'
      //   },
      //   responseType:'blob'
      // }).then(res => {
      //   // this.downloadFile(res);
      //   const fileName = res.headers["content-disposition"].match(/filename=(.*)/)[1]
        
      //   FileDownload(res.data, fileName);
      // });
      axios({
        url: process.env.VUE_APP_API + "/picture/downDirectory",
        method: "post",
        headers:{
          'Access-Control-Allow-Origin':'*'
        },
        data: {
          pictures: req,
        },
        responseType:'blob'
      }).then(res => {
        // this.downloadFile(res);
        const fileName = res.headers["content-disposition"].match(/filename=(.*)/)[1]
        
        FileDownload(res.data, fileName);
      });
    },
    downloadFile(response) {
      // 文件导出
      // response.data = response.data.replace(/[^\x00-\xff]/g,"01")
      // console.log(response)
      // console.log("2", response.data.length, typeof response.data, response.data);
      // if (!response.data) {
      //   return;
      // }
      const content = response;
      const blob = new Blob([content], { type: "zip" });
      console.log(blob);
      const fileName = "导出信息.xlsx";
      if ("download" in document.createElement("a")) {
        // 非IE下载
        const elink = document.createElement("a");
        // elink.download = fileName;
        elink.style.display = "none";
        elink.href = window.URL.createObjectURL(blob);
        // elink.setAttribute(
        //   "download",
        //   response.headers["content-disposition"].match(/filename=(.*)/)[1]
        // );
        [elink.download] = [
          response.headers["content-disposition"].match(/filename=(.*)/)[1],
        ];
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
        window.URL.revokeObjectURL(elink.href); // 释放URL 对象
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, fileName);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.panel-search {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  .panel-search__input {
    text-align: center;
    width: 800px;
  }
}
.place {
  align-items: center;
}
.viewer {
  height: 100%;
  .images {
    height: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 5px;
    .image-wrapper {
      display: inline-block;
      width: calc(33% - 20px);
      margin: 5px 5px 0 5px;
      .image {
        width: 100%;
        cursor: pointer;
        display: inline-block;
      }
    }
  }
}
</style>