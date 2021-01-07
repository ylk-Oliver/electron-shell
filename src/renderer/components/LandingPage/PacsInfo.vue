<template>
  <div v-loading="loading" element-loading-text="镜像下载中">
    <div class="logMin">
      <img src="../../assets/logo.png" alt />
    </div>
    <div class="box">
      <div class="box_box">
        <div class="info_title">
          <span>PACS IP 地址:</span>
        </div>

        <div class="info_box">
          <div v-for="(item,index) in pacsCtArr" :key="index">
            <el-input
              style="width: 10vw;"
              @change="pacsInput(item.value1)"
              maxlength="3"
              v-model="item.value1"
            ></el-input>
            <el-input
              style="width: 10vw;"
              @change="pacsInput(item.value2)"
              maxlength="3"
              v-model="item.value2"
            ></el-input>
            <el-input
              style="width: 10vw;"
              @change="pacsInput(item.value3)"
              maxlength="3"
              v-model="item.value3"
            ></el-input>
            <el-input
              style="width: 10vw;"
              @change="pacsInput(item.value4)"
              maxlength="3"
              v-model="item.value4"
            ></el-input>
          </div>
          <div>
            <el-input-number v-model="pacsCt" :min="1" :max="10" label="描述文字"></el-input-number>
          </div>
        </div>
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
      pacsIp: "",
      pacsCt: "",
      pacsCtArr: [],
      dirname: "/home/dntech/conf",
      loading: false,
      checkVaild: false,
    };
  },
  watch: {
    pacsCt(newVal, oldVal) {
      if (newVal > oldVal) {
        this.pacsCtArr.push({value1: "", value2: "", value3: "", value4: ""});
      } else if (newVal < oldVal) {
        this.pacsCtArr.pop();
      }
    },
  },
  created() {},
  mounted() {
    const {exec} = require("child_process");
    exec(
        `sed -i 's#none#passive#g' ${this.dirname}/standalone.yml`,
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
  },
  methods: {
    next() {
      if (this.checkVaild) {
        this.$message("不可大于255");
        return;
      }
      this.loading = true;
      this.pacsIp = `${this.pacsCtArr[0].value1}.${this.pacsCtArr[0].value2}.${this.pacsCtArr[0].value3}.${this.pacsCtArr[0].value4}`;
      // 配置PACS服务
      const {exec} = require("child_process");
      exec(
          `sed -i "s/#PACS_IP_ADDRESS/${this.pacsIp}/g" ${this.dirname}/ayes-dicom.yml`,
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
      if (this.pacsCt > 1) {
        for (let i = 1; i < this.pacsCtArr.length; i++) {
          const item = `${this.pacsCtArr[i].value1}.${this.pacsCtArr[i].value2}.${this.pacsCtArr[i].value3}.${this.pacsCtArr[i].value4}`;
          exec(
              "echo " +
              this.$route.query.pwd +
              " |sudo -S ufw allow from " +
              item +
              " to any port 6070",
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
      }

      setTimeout(() => {
        // 重启应用
        exec(
            `docker-compose -f ${this.dirname}/standalone.yml -p standalone up -d`,
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
        if (this.$route.query.id === "wireless" || this.$route.query.id === "lan") {
          this.$router.push({
            path: "/hospitalDetailInfo",
            query: {
              pwd: this.$route.query.pwd,
              id: this.$route.query.id,
              name: this.$route.query.name,
              ip: this.$route.query.ip,
            },
          });
        } else {
          this.$router.push("/exit");
        }
      }, 5000);
    },
    pacsInput(value) {
      if (value > 255) {
        this.$message("不可大于255");
        this.checkVaild = true;
      } else {
        this.checkVaild = false;
      }
    },
  },
};
</script>
<style lang="scss">
.el-input__inner {
  font-size: 18px !important;
}
</style>
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
  .box_box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 10vh;
    .info_title {
      display: flex;
      flex-direction: column;
      span {
        font-size: 28px;
        text-align: right;
        height: 5vh;
        line-height: 5vh;
        margin: 2vh 2vw 2vh 2vw;
      }
    }
    .info_box {
      display: flex;
      flex-direction: column;
      div {
        height: 6vh;
        font-size: 28px;
        margin: 1.4vh 0vw 1.4vh 0vw;
      }
    }
  }
  .button {
    display: flex;
    justify-content: space-around;
    margin-top: 5vh;
  }
}
</style>
