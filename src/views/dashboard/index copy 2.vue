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
          <el-button size="mini" type="text">拍照</el-button>
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
  methods: {
    uploadSuccess(file, fileList) {},
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
</style>
