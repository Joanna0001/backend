<template>
  <div class="dashboard-container">
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
      <el-table-column header-align="center" prop="date" width="250" label="内容" align="left"></el-table-column>
      <el-table-column label="姓名" align="center">
        <template>
          <el-input size="mini" />
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template>
          <el-input size="mini" />
        </template>
      </el-table-column>
      <el-table-column label="拍照" width="80" align="center">
        <template>
          <el-button size="mini" type="text" @click="openMedia">拍照</el-button>
        </template>
      </el-table-column>
      <el-table-column label="选择文件" align="center" width="100">
        <template>
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="uploadSuccess"
          >
            <el-button size="mini" type="text">选择文件</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170" align="center">
        <el-button type="primary" size="mini" plain>保存</el-button>
        <el-button type="danger" size="mini" plain>删除</el-button>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
      <take-photo class="photo" ref="photo"></take-photo>
      <span
        slot="footer"
        class="dialog-footer"
        style="display: flex; justify-content: space-around;"
      >
        <div style="text-align: center;">
          <el-button size="mini" type="primary" @click="handleTakePhoto">拍照</el-button>
        </div>
        <el-button type="primary" @click="dialogVisible = false" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TakePhoto from "./take-photo";
import {getList} from '@/api/table'

export default {
  name: "Dashboard",
  components: {
    TakePhoto
  },
  data() {
    return {
      dialogVisible: false,
      statusMsg: "拍照",
      status: 1,
      tableData: [
        {
          date: "建设工程消防设计备案申报表",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "建设单位的工商营业执照等合法身份证明文件复印件",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date:
            "申请人身份证明文件（建设单位法定代表人委托他人办理事项的，应提供委托书、委托人和被委托人身份证明文件）",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "消防设计文件（施工图电子化联合审查前）",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "所在建筑的建筑合法性证明文件（改建工程）",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "施工许可文件复印件（新建、扩建工程）",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "施工图审查机构出具的《建设工程施工图设计文件消防审查合格书》",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  created(){
    getList().then(res => {
      console.log(res)
    })
  },
  methods: {
    uploadSuccess(file, fileList) {},
    openMedia() {
      this.dialogVisible = true;
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
            this.status = 3;
            console.log(img);
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
    handleClose(done) {
      this.$refs.photo.closeMedia();
      done();
    }
  }
};
</script>

<style lang="scss" scoped>
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
  margin-right: 22px;
}
::v-deep .el-upload-list__item {
  font-size: 9px;
  margin-top: 0;
}
::v-deep .el-upload-list__item .el-icon-clse {
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
</style>
