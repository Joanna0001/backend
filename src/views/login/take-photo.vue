<template>
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
        <canvas ref="canvas" v-show="taked"></canvas>
        <div v-for="(item, index) in initImage1" :key="index + 'a'" class="image-style">
          <el-image
            fit="fill"
            :src="item"
            :preview-src-list="initImage1"
            style="width: 150px; height: 150px;"
          ></el-image>
          <i @click="deleteImage(index, 'init')" class="el-icon-close"></i>
        </div>
        <div v-for="(item, index) in imglist" :key="index + 'b'" class="image-style">
          <el-image
            fit="fill"
            :src="item"
            :preview-src-list="imglist"
            style="width: 150px; height: 150px;"
          ></el-image>
          <i @click="deleteImage(index)" class="el-icon-close"></i>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getOssUrl } from "@/api/table";
import $ from "jquery";
import axios from "axios";

export default {
  name: "TakePhoto",
  props: ["initImage"],
  data() {
    return {
      initImage1: [],
      initImage2: [],
      url: "",
      video: null,
      track: "",
      taked: false,
      width: null,
      height: null,
      imglist: [],
      imglistTemp: [],
      url: `/DataInput/FileService?method=DownloadFile&fileid=`
    };
  },
  created() {
    if (this.initImage) {
      var data = this.initImage;
      var temp = [];
      var temp1 = [];
      data.forEach(item => {
        if (item.toLowerCase().indexOf("png") != -1) {
          temp.push(this.url + item.split(",")[0]);
          temp1.push(item);
        }
      });
      this.initImage1 = temp;
      this.initImage2 = temp1;
    }
  },
  methods: {
    deleteImage(index, val) {
      if (val) {  // 本来就有的
        this.initImage1.splice(index, 1);
        this.initImage2.splice(index, 1);
      } else {
        this.imglist.splice(index, 1);
      }
    },
    init(call) {
      this.taked = false;
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
              call(true);
            };
          },
          err => {
            console.log(err);
            call(false);
          }
        );
      } else {
        call(false);
      }
    },
    takePhoto(call) {
      let canvas = this.$refs.canvas;
      let context2D = canvas.getContext("2d");
      context2D.fillStyle = "#ffffff";
      context2D.fillRect(0, 0, 300, 400);
      context2D.drawImage(this.video, 0, 0, 300, 400);
      let image_code = canvas.toDataURL("image/png"); //图片的base64

      this.imglistTemp.push(image_code);
      this.imglist = this.imglistTemp;
      // this.taked = true;
      // call(true, image_code);
    },
    submitImage() {
      var temp = []
      
      this.imglist.forEach(item => {
        var data = this.dataURLtoFile(item);
        var formData = new FormData();
        formData.append("Filedata", data);
        
        axios
          .post(`/DataInput/FileService?method=UploadFile&type=`, formData)
          .then(res => {
            // console.log(res);
            if(res.status == 200){
              temp.push(res.data.fileid + ',' + res.data.filename)
            }
          })
          .catch(err => {
            console.log(err);
          });

        if(this.initImage2.length > 0){
          this.initImage2.forEach(item => {
            temp.push(item)
          })
        }

        this.$emit("saveImage", temp);
      });

      if(this.imglist.length == 0){
        temp = this.initImage2
        this.$emit("saveImage", temp);
      }
    },
    closeMedia() {
      if (null != this.track) {
        this.track.stop(); //关闭摄像头
        this.imglist = [];
      }
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
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  height: 100%;
  margin-right: 20px;
  video {
    object-fit: fill;
    // width: 100%;
  }
}
.image-style {
  position: relative;
  margin: 0 10px 10px 0;
}
.el-icon-close {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 99999;
}
.el-icon-close:hover {
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