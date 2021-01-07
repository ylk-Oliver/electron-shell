<template>
  <div v-loading="loading" element-loading-text="镜像下载中">
    <div class="logMin">
      <img src="../../assets/logo.png" alt />
    </div>
    <div class="box">
      <p class="box_title">创建应用管理员账户</p>
      <div class="box_main">
        <div class="put">
          <div class="title">用户名:</div>
          <div>
            <el-input @keyup.enter.native="next" v-model="account" placeholder="请输入用户名"></el-input>
          </div>
        </div>
        <div class="put">
          <div style="margin-left: 14px;" class="title">密&emsp;码:</div>
          <div>
            <el-input style="width:94%;" @keyup.enter.native="next" :type="pwdType" v-model="password" placeholder="请输入密码">
              <i slot="suffix" class="el-icon-view" @click="showPwd"></i>
            </el-input>
          </div>
        </div>
        <p :class="{ active: isActive }">{{message}}</p>
      </div>
      <div class="button">
        <el-button @click="next()" type="success">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: "",
      password: "",
      dirname: "/home/dntech/conf",
      loading: false,
      pwdType: "password",
      message: "",
      messageArr: ["用户名不可为空", "密码不可为空"],
      isActive: false,
    };
  },
  created() {},
  mounted() {
  },
  methods: {
    showPwd() {
      this.pwdType === "password" ?
        (this.pwdType = "") :
        (this.pwdType = "password");
      const e = document.getElementsByClassName("el-icon-view")[0];
      this.pwdType == "" ?
        e.setAttribute("style", "color: #409EFF") :
        e.setAttribute("style", "color: #c0c4cc");
    },
    next() {
      // 判断账号和密码不可为空
      if (this.account == "") {
        this.message = this.messageArr[0];
        this.isActive = true;
        return;
      }
      if (this.password == "") {
        this.message = this.messageArr[1];
        this.isActive = true;
        return;
      }
      this.loading = true;
      const {exec} = require("child_process");
      exec(
          `sed -i.bak 's/#HOST_IP_ADDRESS/${this.$route.query.ip}/g' ${this.dirname}/ayes-dicom.yml`,
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

      exec(
          `sed -i.bak 's/#ADMIN_USERNAME/${this.account}/g' ${this.dirname}/ayes-dicom.yml`,
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

      exec(
          `sed -i.bak 's/#ADMIN_PASSWORD/${this.password}/g' ${this.dirname}/ayes-dicom.yml`,
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
      setTimeout(() => {
        this.loading = false;
        this.$router.push({
          path: "/pacsInfo",
          query: {
            pwd: this.$route.query.pwd,
            id: this.$route.query.id,
            name: this.$route.query.name,
            ip: this.$route.query.ip,
          },
        });
      }, 5000);
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
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20vh 10vw;
  .box_title {
    font-size: 28px;
    text-align: center;
  }
  .box_main {
    margin-top: 5vh;
    p {
      font-size: 18px;
      text-align: center;
    }
    .active {
      color: red;
    }
    .put {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin: 5vh 0px 5vh 0px;
      .el-icon-view {
        position: absolute;
        right: 0px;
        top: 33%;
      }
      .title {
        margin-right: 20px;
      }
    }
  }

  .button {
    display: flex;
    justify-content: space-around;
  }
}
</style>
