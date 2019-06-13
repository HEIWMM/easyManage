<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  created() {
    try {
      this.$axios("/api/user")
        .then(e => console.log(this.$message.success(`服务端已启动`)))
        .catch(e => {
          this.$message.warning(`请启动服务端server.js(@/../server.js)`);
        });
    } catch (err) {
      this.$message.warning(`请启动服务端server.js(@/../server.js)`);
    }
  },
  name: "App"
};
</script>

<style>
html {
  height: 100%;
}
body {
  padding: 0;
  margin: 0;
  height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  color: #2c3e50;
}
</style>
