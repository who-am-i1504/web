<template>
  <d2-container>
    <!-- <SplitPane
      split="horizontal"
    >-->
    <!-- <div > -->
    <!-- <template slot="paneL"> -->
    <div>
      <el-row :gutter="20" style="height:70vh;">
        <el-col :span="10" style="height:70vh;">
          <div class="panel-search" style="height:70vh;">
            <el-upload
              ref="upload"
              class="upload-demo panel-search__input"
              drag
              :limit="1"
              :file-list="fileList"
              :headers="headers"
              :on-success="getFileName"
              :on-exceed="removeFile"
              accept=".pcap"
              :show-file-list="true"
              :action="url"
              :before-remove="deletePreFile"
            >
              <!-- multiple -->
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <!-- <div class="el-upload__tip" slot="tip">只能上传pcap文件</div> -->
            </el-upload>
            <br/>
            <br/>
            <el-checkbox-group v-model="cons_type">
              <el-checkbox-button v-for="t in types" :label="t" :key="t">{{t}}</el-checkbox-button>
            </el-checkbox-group>
            <br />
            <el-button type="primary" round @click="start">开始重组</el-button>
          </div>
        </el-col>

        <el-col :span="14">
          <div>
            <d2-crud-x
              v-if="data.length>0"
              :loading="loading"
              ref="d2Crud"
              @download="download"
              :data="data"
              :columns="columns"
              :options="options"
              :rowHandle="rowHandle"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </d2-container>
</template>

<script>
import util from "@/libs/util";
import d2CrudX from "d2-crud-x";
import {
  deleteFile,
  deleteBySessionId,
  ConstructPara,
} from "@/api/construct.pcap";
import request from "@/plugin/axiosfile";
import { d2CrudPlus } from "d2-crud-plus";
import { pcapBatchDown, pcapDown } from "@/api/filedownload";
export default {
  components: {
    d2CrudX,
  },
  data() {
    return {
      url: process.env.VUE_APP_API + '/construct/upload',
      loading: false,
      options: {
        height: "70vh",
        width: "100%",
        rowKey: "id",
        size: "mini",
      },
      headers: {},
      filename: undefined,
      files: [],
      cons_type: ["TCP重组"],
      types: ["TCP重组", "HTTP下载重组", "PDU重组"],
      direc: {
        TCP重组: "TCP_CONSTRUCT",
        HTTP下载重组: "HTTP_DOWNLOAD_CONSTRUCT",
        PDU重组: "PDU_CONSTRUCT",
      },
      directorys: [],
      columns: [
        {
          title: "序号",
          key: "id",
          width: 80,
        },
        {
          title: "文件名称",
          key: "name",
          treeNode: true,
        },
        {
          title:'文件大小',
          key:'size',
        },
        {
          title: "文件类型",
          key: "type",
          type: "select",
          dict: {
            label: "label",
            children: "children",
            color: "color",
            value: "value",
            data: [
              { value: "dir", label: "文件夹" },
              { value: "file", label: "文件" },
            ],
          },
          component: {
            name: "values-format",
            props: {
              dict: {
                label: "label",
                children: "children",
                color: "color",
                value: "value",
                data: [
                  { value: "dir", label: "文件夹" },
                  { value: "file", label: "文件" },
                ],
              },
            },
          },
        },
      ],
      expandRow: {},
      pageOptions: {
        compact: false,
      },
      rowHandle: {
        custom: [
          {
            icon: "el-icon-download",
            text: "下载",
            size: "small",
            fixed: "right",
            emit: "download",
          },
        ],
      },
    };
  },
  created() {
    const token = util.cookies.get("token");
    this.headers["X-Token"] = token;
    var req = {};
    deleteBySessionId({
      ...req,
    });
  },
  beforeDestroy(){
    var req = {};
    deleteBySessionId({
      ...req,
    });
  },
  computed: {
    fileList: function () {
      return this.files;
    },
    data: function () {
      var count = 1;
      for (var x in this.directorys) {
        var item = this.directorys[x];
        var pre = item["name"];
        item["id"] = count;
        count++;
        if (item["size"] === undefined){
          item["size"] = ''
        }
        if (item["children"] === undefined) {
          continue;
        } else {
          for (var i in item["children"]) {
            item["children"][i]["id"] = count;
            item["children"][i]["path"] =
              pre + "/" + item["children"][i]["name"];
            count++;
          }
        }
      }
      // console.log(this.directorys)
      return this.directorys;
    },
  },
  mounted() {},
  methods: {
    download({ index, row }) {
      if (row.type === "dir") {
        pcapBatchDown({
          dirname: row.name,
        });
      } else {
        pcapDown({
          filename: row.path,
        });
      }
    },
    downloadFile(response) {
      // 文件导出
      if (!response.data) {
        return;
      }
    },
    start() {
      this.directorys = [];
      this.loading = true;
      for (var x in this.cons_type) {
        var req = {};
        req["cons_type"] = this.direc[this.cons_type[x]];
        req["filename"] = this.filename;
        ConstructPara({
          ...req,
        }).then((res) => {
          if (res.status === 200) {
            this.directorys.push(res.data);
          } else {
            this.$message({
              message: res.message,
              type: "warning",
            });
          }
          this.loading = false;
        });
      }
    },
    deletePreFile(file, fileList) {
      var req = {
        filename: this.filename,
      };
      this.filename = undefined;
      deleteFile({
        ...req,
      }).then((res) => {
        if (res.status === 200) {
        } else {
          this.$message({
            message: res.message,
            type: "warning",
          });
        }
      });
      return true;
    },
    removeFile(files, fileList) {
    },
    getFileName(response, file, fileList) {
      if (response.status === 200) {
        if (this.filename !== undefined) {
          var req = {
            filename: this.filename,
          };
          deleteFile({
            ...req,
          }).then((res) => {
            if (res.status === 200) {
            } else {
              this.$message({
                message: res.message,
                type: "warning",
              });
            }
          });
        }
        this.filename = response.data;
      } else {
        this.$message({
          message: response.message,
          type: "warning",
        });
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
  }
}
</style>