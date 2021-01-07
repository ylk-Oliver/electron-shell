<template>
  <div>
    <div id="wrapper">
      <img id="logo" src="~@/assets/logo.png" alt="electron-vue" />
      <p>所有应用已安装完毕!</p>
      <main>
        <div>
          <el-button @click="link()" type="primary">进入人工智能系统</el-button>
          <el-button @click="back()" type="primary">进入应用管理</el-button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    back() {
      this.$router.push({
        path: "/",
        query: {isInstall: "yes"},
      });
    },
    link() {
      const shell = require("electron").shell;
      shell.openExternal("http:127.0.0.1/ayes/");
    },
  },
};
</script>

<style lang="scss" scoped>
#wrapper {
  height: 100vh;
  padding: 60px 80px;
  #logo {
    display: block;
    margin: 15vh auto;
    margin-bottom: 20px;
    width: 150px;
  }
  p {
    font-size: 18px;
    text-align: center;
  }
  main {
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 15vh;
    .title {
      margin: 20vh 0px 20vh 0px;
    }
  }
}
</style>
