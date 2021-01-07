<template>
  <div>
    <div id="wrapper">
      <img id="logo" src="~@/assets/logo.png" alt="electron-vue" />
      <p>点内 Slogan</p>
      <main>
        <div v-if="!isInstall" class="button_1">
          <el-button @click="open()" type="primary">安装应用</el-button>
        </div>
        <div v-if="isInstall" class="button_2">
          <el-button @click="operation()" type="primary">应用管理</el-button>
          <el-button @click="openmore()" type="primary">影像管理</el-button>
        </div>
      </main>
    </div>
  </div>
</template>
 
<script>
export default {
  name: "landing-page",
  data() {
    return {
      dirname: "",
      isInstall: true,
    };
  },
  created() {
    if (this.$route.query.isInstall) {
      this.isInstall = true;
      return;
    }
    const {exec} = require("child_process");
    // 判断是否安装或者更新 如果没有docker命令 安装
    exec(`docker ps -a |grep ayes-be`, (error, stdout, stderr) => {
      if (error) {
        console.log(`执行的错误: ${error}`);
        this.$logger.info(error);
        this.isInstall = false;
        return;
      }
      this.isInstall = true;
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      this.$logger.info(stdout);
      this.$logger.info(stderr);
    });

    this.fileCreate();
  },
  methods: {
    fileCreate() {
      /**
       * cp files to /home/dntech/conf
       */
      const {exec} = require("child_process");
      exec(`cd 'dirname $0';pwd`, (error, stdout, stderr) => {
        if (error) {
          console.log(`执行的错误: ${error}`);
          this.$logger.info(error);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        this.$logger.info(stdout);
        this.$logger.info(stderr);
        stdout = stdout.replace(/[\r\n]/g, "");
        const dst = "/home/dntech/conf";
        // let dst = "/Users/oliver/Desktop/conf"
        const fs = require("fs");
        fs.access(dst, function(exists) {
          if (exists) {
            console.log(exists);
          } else {
            fs.mkdir(dst, function(error) {
              if (error) {
                console.log(error);
                return;
              }
              const path = require("path");
              const detailDirtory = path.join(__dirname, '/static/conf');
              const fileList = [
                "auditbeat.yml",
                "ayes-celeryconfig.yml",
                "ayes-dicom.yml",
                "ayes-server.yml",
                "gpubeat.yml",
                "heartbeat.yml",
                "logstash.yml",
                "metricbeat.yml",
                "monitoring.yml",
                "nginx.conf",
                "standalone.yml",
              ];
              fileList.forEach((value, index) => {
                const sourceFile = path.join(detailDirtory, value);
                const destPath = path.join(dst, value);
                const readStream = fs.createReadStream(sourceFile);
                const writeStream = fs.createWriteStream(destPath);
                readStream.pipe(writeStream);
              });
            });
          }
        });
      });
    },
    open() {
      this.$router.push("/login");
    },
    operation() {
      this.$router.push("./containManagement");
    },
    openmore() {
      this.$message("待后期开发");
    },
  },
};
</script>

<style lang="scss" soped>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
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
  .version {
    font-size: 24px;
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
    .button_2 {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }
  }
}
</style>
