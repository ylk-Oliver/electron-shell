<template>
  <div>
    <div class="logMin">
      <img src="../../assets/logo.png" alt />
    </div>
    <div class="box">
      <p class="title">选择网络环境</p>
      <ul class="net">
        <!-- 3G -->
        <li>
          <img src="../../assets/wifi.png" alt />
          <el-button 
            style="width:100%;" 
            @click="setup_network('wireless')" 
            type="success">
            无线上网</el-button>
        </li>
        <!-- enp（本地不能上网） -->
        <li>
          <img src="../../assets/lan.png" alt />
          <el-button
            style="width: 100%;padding-left: 11px;"
            @click="setup_network('nolan')"
            type="success"
          >局域网(无外网)</el-button>
        </li>
        <!-- enp（本地可以上网） -->
        <li>
          <img src="../../assets/lan.png" alt />
          <el-button
            style="width: 100%;padding-left: 11px;"
            @click="setup_network('lan')"
            type="success"
          >局域网(有外网)</el-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: "",
      pwd: "",
      isDiskMounted: false,
    };
  },
  created() {},
  mounted() {
    this.pwd = this.$route.query.pwd;
  },
  methods: {
    setup_network(type) {
      this.radio = type;
      this.next();
    },
    next() {
      // 检测硬盘挂载
      const {exec} = require("child_process");
      exec(`df -h |grep '/mnt/storage' |wc -l`, (error, stdout, stderr) => {
        if (error) {
          console.log(`执行的错误: ${error}`);
          this.$logger.info(error);
          return;
        }
        if (stdout == 1) {
          this.$message({
            type: "info",
            message: "挂载成功",
          });
          // 判断是否刚刚挂载失败后重新挂载硬盘
          if (this.isDiskMounted) {
            const {exec} = require("child_process");
            exec(
                `echo ${this.pwd} | sudo -S systemctl restart docker`,
                (error, stdout, stderr) => {
                  if (error) {
                    console.log(`执行的错误: ${error}`);
                    this.$logger.info(error);
                    return;
                  }
                  console.log(`stdout: ${stdout}`);
                  console.log(`stderr: ${stderr}`);
                  this.$logger.info(stdout);
                  this.$logger.info(stderr);
                }
            );
          }
          this.$router.push({
            path: "/hospitalInfo",
            query: {id: this.radio, pwd: this.$route.query.pwd},
          });
        } else {
          // 此处方便调试，提交代码需要注释
          // this.$router.push({
          //   path: "/hospitalInfo",
          //   query: { id: this.radio, pwd: this.$route.query.pwd }
          // })
          this.$message({
            type: "info",
            message: "请重新挂载硬盘到/mnt/storage目录下",
          });
          this.isDiskMounted = true;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        this.$logger.info(stdout);
        this.$logger.info(stderr);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.logMin {
  width: 50px;
  position: absolute;
  top: 3vh;
  left: 3vw;
}
.box {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20vh 10vw;
  .title {
    text-align: center;
    font-size: 28px;
  }
  .net {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-top: 10vh;
    li {
      width: 33.33%;
      padding: 3vh 5vw 3vh 5vw;
      margin: 0 auto;
      .el-button--success {
        display: block;
        margin: 0 auto;
      }
    }
  }
}
</style>
