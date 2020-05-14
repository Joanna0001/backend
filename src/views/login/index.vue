<template>
  <div class="dashboard-container">
    <div style="margin-bottom: 15px;">
      <el-button size="mini" type="primary" @click="createItem" :disabled="readonly == 1">新增</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      v-loading="loading"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
      <el-table-column header-align="center" label="内容" min-width="300" align="left">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.bz" :disabled="readonly == 1" />
        </template>
      </el-table-column>
      <el-table-column label="原件" align="center" width="130">
        <template slot-scope="scope">
          <el-input type="number" size="mini" v-model="scope.row.yj" :disabled="readonly == 1" />
        </template>
      </el-table-column>
      <el-table-column label="复印件" align="center" width="130">
        <template slot-scope="scope">
          <el-input type="number" size="mini" v-model="scope.row.fyj" :disabled="readonly == 1" />
        </template>
      </el-table-column>
      <el-table-column label="拍照" width="90" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="openMedia(scope.row.imgList)">拍照</el-button>
        </template>
      </el-table-column>
      <el-table-column label="选择文件" align="center" width="100">
        <template slot-scope="scope">
          <el-upload
            class="upload-demo"
            :action="fileUrl()"
            :on-success="uploadSuccess"
            :on-remove="removeFile"
          >
            <el-button size="mini" type="text" :disabled="readonly == 1">选择文件</el-button>
          </el-upload>
          <ul class="upload-file" v-for="(item, index) in scope.row.fileList" :key="index">
            <li>
              <div style="cursor: pointer;">
                <a :href="'http://118.178.120.218:8088' + url + item.split(',')[0]" target="_blank">{{ item.split(',')[1] }}</a>
                <i @click="deleteFile(index, scope.row.fileList)" class="el-icon-close" />
              </div>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="saveHandle(scope.row)"
            :disabled="readonly == 1"
          >保存</el-button>
          <el-button
            type="danger"
            size="mini"
            plain
            @click="deleteHandle(scope.row, scope.$index)"
            :disabled="readonly == 1"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.page"
        :page-size="listQuery.rows"
        :total="total"
        align="center"
        background
        layout="total, prev, pager, next, jumper"
        @current-change="currentChange"
      />
    </div>

    <el-dialog :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
      <take-photo @saveImage="saveImage" :initImage="initImage" class="photo" ref="photo"></take-photo>
      <span
        slot="footer"
        class="dialog-footer"
        style="display: flex; justify-content: space-around;"
      >
        <div style="text-align: center;">
          <el-button
            size="mini"
            type="primary"
            @click="handleTakePhoto"
            :disabled="readonly == 1"
          >拍照</el-button>
        </div>
        <el-button type="primary" @click="uploadImage" size="mini" :disabled="readonly == 1">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TakePhoto from "./take-photo";
import { getList, deleteItem, updateItem } from "@/api/table";
import $ from "jquery";

export default {
  inject: ["reload"],
  name: "Dashboard",
  components: {
    TakePhoto
  },
  data() {
    return {
      url: `/DataInput/FileService?method=DownloadFile&fileid=`,
      initImage: [],
      savedInitImage: [],
      imageList: [],
      fileList: [],
      loading: true,
      dialogVisible: false,
      total: 0,
      listQuery: {
        page: 1,
        rows: 10,
        fxbaid: "",
        serialno: ""
      },
      statusMsg: "拍照",
      status: 1,
      tableData: [],
      readonly: 1 // 只读1
    };
  },
  created() {
    var path = location.search;
    // var path = '/index.html?readonly=0&fxbaid=dc85adf45dfc4894a97de4bf16c5ce29&serialno=20200513001&typebh='
    var pathArr = path.split("&");
    this.readonly = pathArr[0].split("=")[1];
    this.listQuery[pathArr[1].split("=")[0]] = pathArr[1].split("=")[1];
    this.listQuery[pathArr[2].split("=")[0]] = pathArr[2].split("=")[1];
    this.fetchData();
  },
  methods: {
    saveImage(val) {
      this.savedInitImage = val;
    },
    deleteFile(index, val) {
      val.splice(index, 1)
    },
    createItem() {
      this.tableData.push({
        bz: "",
        fj: "",
        fyj: "",
        yj: ""
      });
    },
    fetchData() {
      getList(this.listQuery).then(res => {
        this.loading = false;
        this.total = res.total;
        let data = res.rows;
        for (let x = 0; x < data.length; x++) {
          if (data[x].fj) {
            this.$set(data[x], "fileList", []);
            this.$set(data[x], "imgList", []);
            var temp = data[x].fj.split("|");
            for (let i = 0; i < temp.length; i++) {
              if (temp[i].toLowerCase().indexOf("png") == -1) {
                data[x].fileList.push(temp[i].split("|")[0]);
              } else {
                data[x].imgList.push(temp[i].split("|")[0]);
              }
            }
          }
        }
        // console.log(data)
        this.tableData = data;
      });
    },
    saveHandle(val) {
      var sendData = {};
      if (val.recid) {
        // 修改
        sendData = {
          fxbaid: val.fxbaid,
          serialno: val.serialno,
          id: val.recid,
          lrrxm: val.lrrxm,
          lrrzh: val.lrrzh,
          lrsj: val.lrsj,
          rowstat: val.rowstat,
          bz: val.bz,
          yj: val.yj,
          fyj: val.fyj
        };
      } else {
        // 新增
        sendData = {
          serialno: this.listQuery.serialno,
          fxbaid: this.listQuery.fxbaid,
          bz: val.bz,
          yj: val.yj,
          fyj: val.fyj
        };
      }

      var fileTemp = [];

      if (this.savedInitImage.length > 0) {
        this.savedInitImage.forEach(item => {
          fileTemp.push(item);
        });
      } else if (val.imgList.length > 0) {
        val.imgList.forEach(item => {
          fileTemp.push(item);
        });
      }
      if (val.fileList) {
        val.fileList.forEach(item => {
          fileTemp.push(item);
        });
      }
      if (this.fileList.length > 0) {
        this.fileList.forEach(item => {
          fileTemp.push(item.fileid + "," + item.filename);
        });
      }

      sendData.fj = fileTemp.join("|");

      console.log(sendData);
      updateItem(sendData).then(res => {
        // 新增或则修改（id不传是新增，传了是修改）
        if (res.code == 0) {
          this.$message.success("保存成功");
          this.fetchData();
          $('.el-upload-list__item.is-success').css('display', 'none')
        } else {
          this.$message.error(res.msg);
        }
      });
      
    },
    deleteHandle(val, index) {
      if (val.recid) {
        var sendData = {
          bz: val.bz, //
          fj: val.fj, //
          fxbaid: val.fxbaid,
          fyj: val.fyj, //
          lrrxm: val.lrrxm,
          lrrzh: val.lrrzh,
          lrsj: val.lrsj,
          id: val.recid,
          rowstat: val.rowstat,
          serialno: val.serialno,
          yj: val.yj //
        };
        deleteItem(sendData).then(res => {
          if (res.code == 0) {
            this.fetchData();
            this.$message.success("删除成功");
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.tableData.splice(index, 1);
      }
    },
    uploadSuccess(file, fileList) {
      console.log(file);
      this.fileList.push(file);
    },
    removeFile(file, fileList) {
      this.fileList = fileList;
    },
    openMedia(val) {
      this.dialogVisible = true;
      this.initImage = val;
      setTimeout(this.handleTakePhoto, 100);
    },
    handleTakePhoto() {
      if (this.status === 1) {
        // 初始化摄像头
        this.statusMsg = "查找设备中...";
        this.$refs.photo.init(res => {
          if (res) {
            this.status = 2;
            this.statusMsg = "拍照";
          } else {
            alert("未发现设备");
          }
        }); // 初始化摄像头
      } else if (this.status === 2) {
        // 拍照
        this.$refs.photo.takePhoto((res, img) => {
          if (res) {
            this.statusMsg = "重新拍";
          }
        });
      } else if (this.status === 3) {
        // 重新拍
        this.$refs.photo.init(res => {
          if (res) {
            this.status = 2;
            this.statusMsg = "拍照";
          } else {
            alert("未发现设备");
          }
        }); // 初始化摄像头
      }
    },
    uploadImage() {
      this.dialogVisible = false;
      this.$refs.photo.closeMedia();
      this.$refs.photo.submitImage();
      this.status = 1;
    },
    handleClose(done) {
      this.status = 1;
      this.$refs.photo.closeMedia();
      done();
    },
    currentChange(val) {
      this.listQuery.page = val;
      this.fetchData();
    },
    fileUrl() {
      return `/DataInput/FileService?method=UploadFile&type=`;
    }
  }
};
</script>

<style lang="scss" scoped>
.file-success {
  display: none;
}
.is-success {
  display: none;
}
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
::v-deep .el-icon-document {
  display: none;
}
::v-deep .el-upload-list__item-name {
  padding-left: 0;
  margin-right: 25px;
}
::v-deep .el-upload-list__item {
  font-size: 9px;
  margin-top: 0;
}
::v-deep .el-upload-list__item .el-icon-close {
  top: 3px;
}
::v-deep .el-progress__text {
  font-size: 9px !important;
  top: -16px;
}
::v-deep .el-dialog__header {
  padding: 0;
}
::v-deep .el-dialog {
  height: 80%;
}
::v-deep .el-dialog__body {
  height: calc(100% - 60px);
}
ul.upload-file {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 9px;
}
ul.upload-file ul li {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 9px;
  cursor: pointer;
  line-height: 15px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
ul.upload-file li:hover i {
  display: inline;
  color: red;
  cursor: pointer;
}
ul.upload-file li i {
  display: none;
}
.pagination-container {
  margin-top: 20px;
}
</style>
