<template>
  <div class="inner">
    <h2 class="text-left">上传（限制大小2M的image、png、jpg、jpeg文件）：</h2>

    <div id="upload">
      <el-upload
        class="upload-demo"
        action="/api/upa"
        accept="image/png,image/jpg,image/jpeg"
        :on-preview="handlePreview"
        :auto-upload="true"
        :on-remove="handleRemove"
        :on-success="onSuccess"
        :on-change="onchange"
        :limit="3"
        :on-exceed="handleExceed"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <h2 class="text-left">上传过的图片：</h2>
    <div style="height:600px;">
      <el-scrollbar style="height:100%">
        <div class="demo-image">
          <el-image v-for="url in urls" :key="url" :src="url"></el-image>
          <!-- <el-image src="@/../static/upload/Cthulhu1.jpg_2019_5_4_0_43.jpg"></el-image> -->
        </div>
      </el-scrollbar>
    </div>
    <el-dialog 
    :visible.sync="dialogFormVisible">
      <el-image :src="imgsrc"></el-image>
    </el-dialog>

    

    <!--展示选中图片的区域-->
  </div>
</template>

<script>


export default {
  async mounted() {
    let a = await this.getimgpath();
    console.log('图片上传组件启动');
  },
  data() {
    return {
      dialogFormVisible:false,
      imgsrc:'',
      urls: []
    };
  },
  methods: {
    getimgpath() {
      return new Promise((resolve, reject) => {
        this.$axios.get("/api/user").then(e => {
          let imgpaths = e.data.result.imgpaths;
          let arr = new Array();
          for (let i = 0; i < imgpaths.length; i++) {
            arr.push(imgpaths[i].imgpath);
          }
          this.urls = arr;
          console.log(imgpaths);
          resolve(imgpaths);
        });
      });
    },
    beforeRemove(file, fileList) {
      //return this.$confirm(`确定移除 ${ file.name }？`);
    },

    handlePreview(file) {
      this.dialogFormVisible = true;
      this.imgsrc = file.url;
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    //阻止upload的自己上传，进行再操作
    onchange(file, filesList) {
      console.log(file);
      //创建临时的路径来展示图片
      
      // return false;
    },
    handleRemove(file, filesList) {
      let url = file.response.file.path;
      this.$axios.get('/api/recordDel',{
        params:{
          imgpath:url
        }
      }).then(e=>{
        this.$message.success(`删除成功`);
      })
      console.log(file);
     
    },
    onSuccess() {
      this.$message.success(`上传成功`);
    }
  }
};
</script>
<style lang="scss">
.inner{
  .el-main{
    line-height:0;
  }
}
</style>

<style lang="scss">
.text-left {
  text-align: left;
}
</style>
