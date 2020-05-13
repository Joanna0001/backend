<template>
  <div class="wrapper">
    <el-row type="flex" :gutter="20" justify="space-around" align="middle">
      <el-col :span="12">
        <video ref="video" autoplay></video>
      </el-col>
      <el-col :span="12" align="center">
        <canvas ref="canvas" v-show="taked"></canvas>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "TakePhoto",
  data() {
    return {
      video: null,
      track: "",
      taked: false,
      width: null,
      height: null
    };
  },
  methods: {
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
              console.log(e);
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
      this.taked = true;
      call(true, image_code);
    },
    closeMedia() {
      if (null != this.track) {
        this.track.stop(); //关闭摄像头
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  margin-right: 20px;
  video {
    object-fit: fill;
    width: 100%;
  }
}
</style>