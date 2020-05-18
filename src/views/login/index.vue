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
          <el-input
            size="mini"
            v-model="scope.row.bz"
            :title="scope.row.bz"
            :disabled="readonly == 1"
          />
        </template>
      </el-table-column>
      <el-table-column label="原件" align="center" width="90">
        <template slot-scope="scope">
          <el-input type="number" size="mini" v-model="scope.row.yj" :disabled="readonly == 1" />
        </template>
      </el-table-column>
      <el-table-column label="复印件" align="center" width="90">
        <template slot-scope="scope">
          <el-input type="number" size="mini" v-model="scope.row.fyj" :disabled="readonly == 1" />
        </template>
      </el-table-column>
      <el-table-column label="拍照" width="70" align="center">
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
              <div style="cursor: pointer; display: flex; align-items: center;">
                <a
                  :title="item.split(',')[1]"
                  style="display: block; overflow: hidden; width: 95%; white-space: nowrap; text-overflow: ellipsis;"
                  :href="'http://118.178.120.218:8088' + url + item.split(',')[0]"
                  target="_blank"
                >{{ item.split(',')[1] }}</a>
                <i @click="deleteFile(index, scope.row.fileList)" class="el-icon-close" />
              </div>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="文件照片列表" align="center" width="110">
        <template slot-scope="scope">
          <div>
            <ul class="upload-file" v-for="(item, index) in scope.row.fileList" :key="index">
              <li>
                <div style="cursor: pointer; display: flex; align-items: center;">
                  <a
                    :title="item.split(',')[1]"
                    style="display: block; overflow: hidden; width: 95%; white-space: nowrap; text-overflow: ellipsis;"
                    :href="'http://118.178.120.218:8088' + url + item.split(',')[0]"
                    target="_blank"
                  >{{ item.split(',')[1] }}</a>
                  <!-- <i @click="deleteFile(index, scope.row.fileList)" class="el-icon-close" /> -->
                </div>
              </li>
            </ul>
            <div
              v-for="(item, index) in scope.row.imgShowList"
              :key="index + 'a'"
              class="upload-image"
            >
              <el-image
                fit="cover"
                :src="item"
                :preview-src-list="scope.row.imgShowList"
                style="width: 40px; height: 30px;"
              ></el-image>
              <!-- <i @click="deleteImage(index, 'list')" class="el-icon-close"></i> -->
            </div>
          </div>
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
      <div class="wrapper">
        <el-row
          type="flex"
          :gutter="20"
          justify="space-around"
          align="middle"
          style="height: 100%; overflow: auto;"
        >
          <el-col :span="12">
            <video ref="video" width="300" height="400" autoplay></video>
          </el-col>
          <el-col :span="12" align="center" class="image-container">
            <canvas ref="canvas" v-show="taked" width="300" height="400"></canvas>
            <div v-for="(item, index) in initImage1" :key="index + 'a'" class="image-style">
              <el-image
                fit="cover"
                :src="item"
                :preview-src-list="initImage1"
                style="width: 150px; height: 200px;"
              ></el-image>
              <i @click="deleteImage(index, 'init')" class="el-icon-close"></i>
            </div>
            <div v-for="(item, index) in imglist" :key="index + 'b'" class="image-style">
              <el-image
                fit="cover"
                :src="item"
                :preview-src-list="imglist"
                style="width: 150px; height: 200px;"
              ></el-image>
              <i @click="deleteImage(index)" class="el-icon-close"></i>
            </div>
          </el-col>
        </el-row>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
        style="display: flex; justify-content: space-around;"
      >
        <div style="text-align: center;">
          <el-button size="mini" type="primary" @click="takePhoto" :disabled="readonly == 1">拍照</el-button>
        </div>
        <el-button type="primary" @click="submitImage" size="mini" :disabled="readonly == 1">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, deleteItem, updateItem } from "@/api/table";
import $ from "jquery";
import axios from "axios";

export default {
  inject: ["reload"],
  name: "Dashboard",
  data() {
    return {
      initImage1: [], // 能显示照片的url格式
      initImage2: [], // 保存传到接口的fileid格式
      video: null,
      track: "",
      taked: false,
      width: null,
      height: null,
      imglist: [],
      url: `/DataInput/FileService?method=DownloadFile&fileid=`,
      savedImage: [],
      fileList: [], // 页面显示
      loading: true,
      dialogVisible: false,
      total: 0,
      listQuery: {
        page: 1,
        rows: 10,
        fxbaid: "",
        serialno: ""
      },
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
    init() {
      this.video = this.$refs.video;
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia(
          { video: true },
          stream => {
            this.track = stream.getTracks()[0]; // 通过这个关闭摄像头
            try {
              this.video.src = window.URL.createObjectURL(stream); // chrome版本<=70
            } catch (e) {
              this.video.srcObject = stream; // chrome版本>70
            }
            this.video.onloadedmetadata = e => {
              // console.log(e);
              this.video.play();
            };
          },
          err => {
            console.log(err);
          }
        );
      } else {
        alert("不支持访问用户媒体");
      }
    },
    takePhoto() {
      let canvas = this.$refs.canvas;
      let context2D = canvas.getContext("2d");
      context2D.fillStyle = "#ffffff";
      context2D.fillRect(0, 0, 300, 400);
      context2D.drawImage(this.video, 0, 0, 300, 400);

      let image_code = canvas.toDataURL("image/png"); //图片的base64
      this.imglist.push(image_code);
    },
    submitImage() {
      var temp = [];
      this.imglist.forEach(item => {
        var data = this.dataURLtoFile(item);
        var formData = new FormData();
        formData.append("Filedata", data);

        axios
          .post(`/DataInput/FileService?method=UploadFile&type=`, formData)
          .then(res => {
            // console.log(res);
            if (res.status == 200) {
              temp.push(res.data.fileid + "," + res.data.filename);
            }
          })
          .catch(err => {
            console.log(err);
          });

        if (this.initImage2.length > 0) {
          this.initImage2.forEach(item => {
            temp.push(item);
          });
        }

        this.savedImage = temp;
      });

      if (this.imglist.length == 0) {
        temp = this.initImage2;
        this.savedImage = temp;
      }

      this.dialogVisible = false;
      this.closeMedia();
    },
    deleteFile(index, val) {
      val.splice(index, 1);
    },
    deleteImage(index, val) {
      if (val) {
        // 本来就有的
        this.initImage1.splice(index, 1);
        this.initImage2.splice(index, 1);
      } else {
        this.imglist.splice(index, 1);
      }
    },
    createItem() {
      this.tableData.push({
        bz: "",
        fj: "",
        fyj: "",
        yj: ""
      });
      this.fileList = [];
      this.imglist = [];
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
            this.$set(data[x], "imgShowList", []);
            var temp = data[x].fj.split("|");
            for (let i = 0; i < temp.length; i++) {
              if (temp[i].toLowerCase().indexOf("png") == -1) {
                data[x].fileList.push(temp[i].split("|")[0]);
              } else {
                data[x].imgList.push(temp[i].split("|")[0]);
                data[x].imgShowList.push(this.url + temp[i].split(",")[0]);
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
      if (this.savedImage.length > 0) {
        this.savedImage.forEach(item => {
          fileTemp.push(item);
        });
      } else if (val.imgList) {
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
          $(".el-upload-list__item.is-success").css("display", "none");
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
      this.fileList.push(file);
    },
    removeFile(file, fileList) {
      this.fileList = fileList;
    },
    openMedia(data) {
      this.dialogVisible = true;
      var temp = [];
      var temp1 = [];
      if (data) {
        data.forEach(item => {
          if (item.toLowerCase().indexOf("png") != -1) {
            temp.push(this.url + item.split(",")[0]);
            temp1.push(item);
          }
        });
        this.initImage1 = temp;
        this.initImage2 = temp1;
      }
      setTimeout(this.init, 100);
    },
    dataURLtoFile(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, { type: mime });
    },
    closeMedia() {
      if (null != this.track) {
        this.track.stop(); //关闭摄像头
        this.imglist = [];
      }
    },
    handleClose(done) {
      done();
      this.closeMedia();
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
.upload-image i {
  display: none;
}
.upload-image:hover i {
  display: inline;
  color: red;
  cursor: pointer;
}
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
  word-break: break-all;
  width: 100%;
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
.wrapper {
  height: 100%;
  margin-right: 20px;
  video {
    object-fit: cover;
    width: 100%;
  }
}
.image-style {
  position: relative;
  margin: 0 10px 10px 0;
}
.image-container .el-icon-close {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 99999;
}
.image-container .el-icon-close:hover {
  cursor: pointer;
  color: red;
}
.image-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  height: 100%;
}
</style>
