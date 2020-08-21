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
              action="/construct/upload"
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
              :loading="loading"
              ref="d2Crud"
              @download="download"
              :data="data"
              :columns="columns"
              :options="options"
              :rowHandle="rowHandle"
            />
            <!-- <SplitPane
            style="width:100%; height:25vh;"
            :min-percent="10"
            :default-percent="80"
            split="vertical"
          >
          <div slot="paneL">
          </div>
          <div slot="paneR">
          </div>
            </SplitPane>-->
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- </template> -->

    <!-- </div> -->
    <!-- <template slot="paneR">
        <div>woshiasdfasdf</div>
    </template>-->
    <!-- </SplitPane> -->
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
  // mixins: [d2CrudPlus.crud],
  components: {
    d2CrudX,
  },
  data() {
    return {
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
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    this.headers["X-Token"] = token;
    var req = {};
    deleteBySessionId({
      ...req,
    });
  },
  watch: {
    // directorys:function(n, o){
    //   this.crud.doRefresh()
    // }
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
      // console.log(this.directorys);
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
        // request({
        //   url: "/construct/downDirectory",
        //   method: "post",
        //   data: {
        //     dirname: row.name,
        //   },
        // }).then((res) => {
        //   this.downloadFile(res);
        // });
      } else {
        pcapBatchDown({
          filename: row.path,
        });
        // request({
        //   url: "/construct/downfile",
        //   method: "post",
        //   data: {
        //     filename: row.path,
        //   },
        // }).then((res) => {
        //   this.downloadFile(res);
        // });
      }
    },
    downloadFile(response) {
      // 文件导出
      if (!response.data) {
        return;
      }
      // let url = window.URL.createObjectURL(new Blob([response.data]));
      // let link = document.createElement("a");
      // link.style.display = "none";
      // link.href = url;
      // link.setAttribute(
      //   "download",
      //   response.headers["content-disposition"].match(/filename=(.*)/)[1]
      // );

      // document.body.appendChild(link);
      // link.click();
    },
    // pageRequest(query) {
    //   var p = new Promise(function (resolve, reject) {
    //     setTimeout(function () {
    //       resolve("成功!"); //代码正常执行！
    //     }, 250);
    //   });
    //   return p.then(res => {
    //     return {
    //       code:0,
    //       msg:'',
    //       data:{
    //         current:1,
    //         size:this.directorys.length,
    //         total:this.directorys.length,
    //         records:this.directorys
    //       }
    //     }
    //   });
    // },
    // getCrudOptions() {
    //   return {
    //     columns: this.columns,
    //   };
    // },
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
            // res.data['hasChildren'] = true
            // console.log(this.directorys)
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
      // console.log(files, files[0])
      // this.$refs.upload.handleRemove(files[0].raw)
      // console.log(this.fileList)
      // this.$refs.upload.clearFiles()
      // this.$refs.upload.uploadFiles(files)
      // this.fileList = []
      // this.fileList.push({
      //   name:files[0]['name'],
      //   raw:files[0]
      // })
      // console.log(files, fileList)
      // fileList[0] = {
      //   name:files[0]['name'],
      //   raw:files[0]
      // }
      // delete fileList[0]
      // fileList[0] = files
      // this.$refs.upload.submit();
      // console.log(files, fileList)
    },
    getFileName(response, file, fileList) {
      // console.log(response, file, fileList)
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
        // this.$refs.upload.clearFiles()
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