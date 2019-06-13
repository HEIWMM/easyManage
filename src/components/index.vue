<template>
  <div class="d-main">
    <el-container>
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo1"
          :mode="mode"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="1" @click="handle1">数据中心</el-menu-item>
          <el-menu-item index="2" @click="handle3">数据分析</el-menu-item>
        </el-menu>
        <el-menu
          
          class="el-menu-demo2"
          :mode="mode"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          
        >
          <el-submenu index="1">
            <template slot="title">管理端</template>
            <el-menu-item index="1-1" @click="handle1">数据中心</el-menu-item>
            <el-menu-item index="1-2" @click="handle3">数据分析</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-container class="d-contain" style="height:">
        <el-aside width="200px">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="1" @click="handle1">
              <i class="el-icon-menu"></i>
              <span slot="title">数据操作</span>
            </el-menu-item>
            <el-menu-item index="2" @click="handle2">
              <i class="el-icon-document"></i>
              <span slot="title">图片上传</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <dealData v-show="showde"></dealData>
          <uploadpic v-show="showup"></uploadpic>
          <recordChart v-show="showrd"></recordChart>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import dealData from "@/components/dealData";
import uploadpic from "@/components/uploadpic";
import recordChart from "@/components/recordChart";
export default {
  mounted(e) {
    

    //console.log(window.innerWidth);
    //获取屏幕尺寸（宽度）
    if (window.innerWidth > 500) {
      this.mode = "horizontal";
    } else {
      this.mode = "vertical";
    }
    console.log('主框架页面启动');
  },

  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handle1() {
      [this.showde, this.showup, this.showrd] = [true, false, false];
    },
    handle2() {
      [this.showde, this.showup, this.showrd] = [false, true, false];
    },
    handle3() {
      [this.showde, this.showup, this.showrd] = [false, false, true];
    }
  },
  components: {
    dealData,
    uploadpic,
    recordChart
  },
  data() {
    return {
      showde: true,
      showup: false,
      showrd: false,
      msg: "Welcome to Your Vue.js App",
      activeIndex: "1",
      activeIndex2: "1-1",
      mode: this.mode
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.d-main {
  height: 100%;
}

.d-main {
  .el-container {
    height: 100%;
  }
  .d-contain {
    //height: 100%;
  }
}
</style>

<style scoped lang="scss">
@media screen and (max-width: 500px) {
  .el-aside {
    display: none;
  }
  .el-menu-demo1 {
    display: none;
  }
}
@media screen and (min-width: 500px) {
  .el-menu-demo2 {
    display: none;
  }
}
.el-menu-demo1 {
  .el-menu-item:nth-child(1) {
    margin-left: 30%;
  }
  .el-menu-item:nth-child(2) {
    margin-left: 30%;
  }
}
.el-menu-demo2 {
  .el-menu-item {
    opacity: 0.7;
    z-index: 99;
  }
}
.el-header {
  //background-color: #b3c0d1;
  //color: #333;
  padding: 0;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>