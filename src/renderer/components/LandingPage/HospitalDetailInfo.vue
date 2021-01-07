<template>
  <div>
    <div class="logMin">
      <img src="../../assets/logo.png" alt />
    </div>
    <div class="box">
      <div class="box_box">
        <div class="info_title">
          <span>医院所在地区:</span>
          <span>医院所在城市:</span>
          <span>国家名称:</span>
          <span>医院英文全称:</span>
          <span>医院唯一标识（联系运维索取）:</span>
        </div>

        <div class="info_box">
          <div>
            <el-input @keyup.enter.native="next" v-model="region" placeholder="请输入医院所在地区 "></el-input>
          </div>

          <div>
            <el-input @keyup.enter.native="next" v-model="city" placeholder="请输入医院所在城市 "></el-input>
          </div>

          <div>
            <el-input @keyup.enter.native="next" v-model="cn" placeholder="请输入国家名称 "></el-input>
          </div>

          <div>
            <el-input @keyup.enter.native="next" v-model="fn" placeholder="请输入医院英文全称 "></el-input>
          </div>

          <div>
            <el-input @keyup.enter.native="next" v-model="input" placeholder="请输入医院唯一标识（联系运维索取） "></el-input>
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
      region: "",
      city: "",
      fn: "",
      input: "",
      cn: "",
      dirname: "/home/dntech/conf",
    };
  },
  created() {},
  mounted() {
  },
  methods: {
    next() {
      // 提示请输入医院所在地区
      if (!this.region) {
        this.$message("请输入医院所在地区");
        return;
      }
      // 提示请输入医院所在城市
      if (!this.city) {
        this.$message("请输入医院所在城市");
        return;
      }
      // 提示请输入国家名称
      if (!this.cn) {
        this.$message("请输入国家名称");
        return;
      }
      // 提示请输入全称HOSPITAL——NAME
      if (!this.fn) {
        this.$message("请输入医院英文全称");
        return;
      }
      // 提示请提供医院名称联系运维索取
      if (!this.input) {
        this.$message("请输入医院唯一标识（联系运维索取）");
        return;
      }

      // 监控服务
      const {exec} = require("child_process");
      exec(
          `sed -i.bak "s/#HOSTNAME/${this.$route.query.name}/g"  ${this.dirname}/monitoring.yml`,
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
          `sed -i.bak "s/#HOSTNAME/${this.$route.query.name}/g"  ${this.dirname}/auditbeat.yml`,
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
          `sed -i.bak "s/#HOSTNAME/${this.$route.query.name}/g"  ${this.dirname}/heartbeat.yml`,
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
          `sed -i.bak "s/#HOSTNAME/${this.$route.query.name}/g"  ${this.dirname}/metricbeat.yml`,
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
          `sed -i.bak "s/#HOSTNAME/${this.$route.query.name}/g"  ${this.dirname}/logstash.yml`,
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
          `echo ${this.$route.query.pwd} | sudo -S sed -i.bak "s/#HOSTNAME/${this.$route.query.name}/g"  ${this.dirname}/gpubeat.yml`,
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
          `echo ${this.$route.query.pwd} | sudo -S sed -i "s/#REGION_NAME/${this.region}/g"  ${this.dirname}/gpubeat.yml`,
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
          `echo ${this.$route.query.pwd} | sudo -S sed -i "s/#CITY_NAME/${this.city}/g"  ${this.dirname}/gpubeat.yml`,
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
          `echo ${this.$route.query.pwd} | sudo -S sed -i "s/#COUNTRY_NAME/${this.cn}/g" ${this.dirname}/gpubeat.yml`,
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
          `echo ${this.$route.query.pwd}| sudo -S sed -i "s/#HOST_FULL_NAME/${this.fn}/g" ${this.dirname}/gpubeat.yml`,
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
          `sed -i "s/#REGION_NAME/${this.region}/g" ${this.dirname}/auditbeat.yml`,
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
          `sed -i "s/#CITY_NAME/${this.city}/g" ${this.dirname}/auditbeat.yml`,
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
          `sed -i "s/#COUNTRY_NAME/${this.cn}/g" ${this.dirname}/auditbeat.yml`,
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
          `sed -i "s/#HOST_FULL_NAME/${this.fn}/g" ${this.dirname}/auditbeat.yml`,
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
          `sed -i "s|#REGION_NAME|${this.region}|g" ${this.dirname}/heartbeat.yml`,
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
          `sed -i "s/#CITY_NAME/${this.city}/g" ${this.dirname}/heartbeat.yml`,
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
          `sed -i "s/#COUNTRY_NAME/${this.cn}/g" ${this.dirname}/heartbeat.yml`,
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
          `sed -i "s/#HOST_FULL_NAME/${this.fn}/g" ${this.dirname}/heartbeat.yml`,
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
          `sed -i "s/#REGION_NAME/${this.region}/g" ${this.dirname}/metricbeat.yml`,
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
          `sed -i "s/#CITY_NAME/${this.city}/g" ${this.dirname}/metricbeat.yml`,
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
          `sed -i "s/#COUNTRY_NAME/${this.cn}/g" ${this.dirname}/metricbeat.yml`,
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
          `sed -i "s/#HOST_FULL_NAME/${this.fn}/g" ${this.dirname}/metricbeat.yml`,
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

      // 启动监控服务
      exec(
          `docker-compose -f ${this.dirname}/monitoring.yml -p monitoring up -d`,
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

      // 启动jenkins agent
      exec(
          `echo ${this.$route.query.pwd} | sudo -S sed -i.bak "s/<NODE_NAME>/${this.$route.query.name}/g" /lib/systemd/system/jenkins-agent.service`,
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
          `echo ${this.$route.query.pwd} | sudo -S sed -i "s/<SECRET_GENERATED_BY_JENKINS>/${this.input}/g" /lib/systemd/system/jenkins-agent.service`,
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
          `echo ${this.$route.query.pwd} | sudo -S systemctl start jenkins-agent`,
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
          `echo ${this.$route.query.pwd} | sudo -S systemctl enable jenkins-agent`,
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
      this.$router.push("/exit");
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
  .box_box {
    display: flex;
    flex-direction: row;
    justify-content: center;
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
        line-height: 6vh;
        font-size: 28px;
        margin: 1.2vh 2vw 1.2vh 2vw;
      }
    }
  }
  .button {
    display: flex;
    justify-content: space-around;
  }
}
</style>
