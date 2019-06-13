<template>
  <div ref="myChart" :style="{width: '500px', height: '500px'}"></div>
</template>

<script>
export default {
  name: "hello",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      
     
      dataArr:[]
    };
  },
  async mounted() {
    let a = await this.recordFind();
    this.dataArr = a;
    console.log('arr----'+this.dataArr);
    //this.getDataArr(arr)
    this.drawLine();

    console.log("数据分析组件启动");
  },
  components: {
    
  },
  methods: {
    
    recordFind() {
      return new Promise((rsl, rsj) => {
        this.$axios.get("/api/recordc", {}).then(e => {
          this.count = e.data.result;
          console.log(this.count);
          rsl(e.data.result);
        });
      });
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(this.$refs.myChart);
      // 绘制图表
      myChart.setOption({
        title: {
          top: 30,
          left: "center",
          text: "2019年数据修改次数"
        },
        tooltip: {},
        visualMap: {
          min: 0,
          max: 10,
          type: "piecewise",
          orient: "horizontal",
          left: "center",
          top: 65,
          textStyle: {
            color: "#000"
          },
          inRange: {
            color: ["#B2E0A2", "#FF4500"]
          }
        },
        calendar: {
          top: 120,
          left: 30,
          right: 30,
          cellSize: ["auto", 13],
          range: "2019",
          itemStyle: {
            normal: { borderWidth: 0.5 }
          },
          yearLabel: { show: false }
        },
        series: {
          type: "heatmap",
          coordinateSystem: "calendar",
          data: this.getVirtulData(2019)
        }
      });
    },
    getVirtulData(year) {
      year = year || "2019";
      var date = +this.$echarts.number.parseDate(year + "-01-01");
      var end = +this.$echarts.number.parseDate(+year + 1 + "-01-01");
      var dayTime = 3600 * 24 * 1000;
      var data = [];
      for (var time = date; time < end; time += dayTime) {
        data.push([
          this.$echarts.format.formatTime("yyyy-MM-dd", time),
          Math.floor(0)
        ]);
      }
      for(let i=0;i<this.dataArr.length;i++){
        console.log('循环'+i);
        console.log(this.dataArr[i].date,this.dataArr[i].count);
        data.push([
        this.$echarts.format.formatTime("yyyy-MM-dd", this.dataArr[i].date),
        Math.floor(this.dataArr[i].count)
      ]);
      }
      
      console.log(this.today, this.count);
      return data;
    }
  }
};
</script>

<style>
</style>
