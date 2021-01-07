<template>
  <div>
    <div class="box">
      <img class="logo" src="../../assets/logo.png" alt="electron-vue" />
      <p :class="{ active: isActive }">{{message}}</p>
      <div class="put">
        <div>
          <el-input @keyup.enter.native="next" :type="pwdType" v-model="password">
            <i slot="suffix" class="el-icon-view" @click="showPwd"></i>
          </el-input>
        </div>
      </div>
      <div class="button">
        <el-button @click="next()" type="success">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: "",
      pwdType: "password",
      messageArr: [
        "请输入本机管理员密码",
        "密码错误，请重新输入本机管理员密码",
      ],
      message: "",
      isActive: false,
      uuid: "",
      proccesorid: "",
      mac: "",
    };
  },
  created() {
    this.message = this.messageArr[0];
  },
  mounted() {},
  methods: {
    next() {
      // 此处方便调试，提交代码需要注释
      // this.$router.push({ path: "/versions", query: { pwd: this.password } })
      // 此处获取uuid
      const {exec} = require("child_process");
      exec(
          "echo " + this.password + "|sudo -S ufw status",
          (error, stdout, stderr) => {
            if (error) {
              console.log(`执行的错误: ${error}`);
              this.$logger.info(error);
              this.isActive = true;
              this.message = this.messageArr[1];
              return;
            }
            const {exec} = require("child_process");
            exec(
                `echo ${this.password} |sudo -S dmidecode -t 1 |grep UUID|awk -F "[ :]+" '{print $2}'`,
                (error, stdout, stderr) => {
                  if (error) {
                    console.log(`执行的错误: ${error}`);
                    this.$logger.info(error);
                    return;
                  }
                  this.uuid = stdout;
                  // 此处获取proccesorid
                  const {exec} = require("child_process");
                  exec(
                      `echo ${this.password} |sudo -S dmidecode -t processor |grep ID |head -1|sed 's/ID:/ /g'`,
                      (error, stdout, stderr) => {
                        if (error) {
                          console.log(`执行的错误: ${error}`);
                          this.$logger.info(error);
                          return;
                        }
                        this.proccesorid = stdout;
                        console.log(`stdout: ${stdout}`);
                        console.log(`stderr: ${stderr}`);
                        this.$logger.info(stdout);
                        this.$logger.info(stderr);
                        // 此处获取mac地址
                        const {exec} = require("child_process");
                        exec(
                            `echo ${this.password} |sudo -S lshw -c network | grep serial |head -n 1| awk -F "[ ]+" '{print $3}'`,
                            (error, stdout, stderr) => {
                              if (error) {
                                console.log(`执行的错误: ${error}`);
                                this.$logger.info(error);
                                return;
                              }
                              this.mac = stdout;
                              // 将uuid、proccesorid、mac拼接字符串，生成唯一标志位，三者缺一不可,此处可以做判断
                              this.onlyId = `${this.uuid},${this.proccesorid},${this.mac}`;
                              if (this.onlyId.split(",").length < 3) {
                                this.$message("your os version is not supported!");
                                return;
                              } else {
                                this.$router.push({
                                  path: "/versions",
                                  query: {pwd: this.password},
                                });
                              }
                              console.log(`stdout: ${stdout}`);
                              console.log(`stderr: ${stderr}`);
                              this.$logger.info(stdout);
                              this.$logger.info(stderr);
                            }
                        );
                      }
                  );
                  console.log(`stdout: ${stdout}`);
                  console.log(`stderr: ${stderr}`);
                  this.$logger.info(stdout);
                  this.$logger.info(stderr);
                }
            );
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            this.$logger.info(stdout);
            this.$logger.info(stderr);
          }
      );
    },
    showPwd() {
      this.pwdType === "password" ?
        (this.pwdType = "") :
        (this.pwdType = "password");
      const e = document.getElementsByClassName("el-icon-view")[0];
      this.pwdType == "" ?
        e.setAttribute("style", "color: #409EFF") :
        e.setAttribute("style", "color: #c0c4cc");
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 30px;
    width: 150px;
  }
  p {
    font-size: 18px;
    text-align: center;
  }
  .active {
    color: red;
  }
  height: 100vh;
  background: radial-gradient(
    ellipse at top left,
    white 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  padding: 25vh 10vw;
  .put {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 6vh 0px 6vh 0px;
    .el-icon-view {
      position: absolute;
      right: 0px;
      top: 33%;
    }
  }
  .button {
    display: flex;
    justify-content: space-around;
  }
}
</style>
