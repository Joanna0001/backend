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
          <div class="div-a">
            <video id="video" width="480" height="320" autoplay style="background:#ddd"></video>
            <p>
              <el-button id="capture" size="mini" type="text">拍照</el-button>
            </p>
          </div>
          <div class="div-b">
            <canvas id="canvas" width="480" height="320"></canvas>
          </div>
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
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
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
  mounted() {
    var success = this.success();
    var error = this.error();
    var video = document.getElementById("video");
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var base64 = "";
    if (
      navigator.mediaDevices ||
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia
    ) {
      //调用用户媒体设备, 访问摄像头
      this.getUserMedia(
        {
          audio: false,
          video: true
        },
        success,
        error
      );

      document.getElementById("capture").addEventListener("click", function() {
        context.drawImage(video, 0, 0, 480, 320); //显示拍照的图片

        //转换为base64格式
        base64 = canvas.toDataURL("image/jpeg");
      });
    } else {
      alert("不支持访问用户媒体");
    }
  },
  methods: {
    uploadSuccess(file, fileList) {},
    //访问用户媒体设备的兼容方法
    getUserMedia(constraints, success, error) {
      if (navigator.mediaDevices) {
        //最新的标准API
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(success)
          .catch(error);
      } else if (navigator.webkitGetUserMedia) {
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error);
      } else if (navigator.mozGetUserMedia) {
        //firfox浏览器
        navigator.mozGetUserMedia(constraints, success, error);
      } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constraints, success, error);
      }
    },
    success(stream) {
      window.stream = stream;
      if (window.URL) {
        video.src = window.URL.createObjectURL(stream);
      } else {
        video.src = stream;
      }
    },
    error(error) {
      alert("获取失败");
    },
    GetBase64ZP() {
      return base64;
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
.div-a {
  float: left;
  width: 49%;
}
.div-b {
  float: left;
  width: 49%;
}
</style>
