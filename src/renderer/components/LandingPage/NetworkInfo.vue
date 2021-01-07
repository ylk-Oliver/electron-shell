<template>
  <div>
    <div class="logMin">
      <img src="../../assets/logo.png" alt />
    </div>
    <div class="box_main" v-loading="loading" element-loading-text="镜像下载中" v-if="show">
      <div class="box">
        <div class="box_box">
          <div class="info_title">
            <span>网卡信息:</span>
            <span>IP 地址:</span>
          </div>
          <div class="info_box">
            <div style="padding: 2vh 2vw 2vh 2vw;">
              <el-select v-model="network" placeholder="请选择">
                <el-option
                  v-for="item in networkArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <span>{{ipAdress}}</span>
          </div>
        </div>
        <div class="button">
          <el-button @click="next()" type="success">确认</el-button>
        </div>
      </div>
    </div>
    <div v-if="!show" v-html="networkhtml"></div>
  </div>
</template>

<script>
// 1 3G
// 2 选项 enp（本地不能上网）
// 3 enp(本地可以上网)
export default {
  data() {
    return {
      input: "",
      ipAdress: "127.0.0.1",
      network: "",
      networkA: "",
      networkArr: [],
      id: "",
      mainName: "",
      docode: "",
      loading: false,
      dirname: "/home/dntech/conf",
      show: true,
      networkhtml: "",
    };
  },
  created() {},
  watch: {
    network(val) {
      const {exec} = require("child_process");
      exec(
          `ip addr show $(echo ${this.network})|grep inet | grep -v inet6 | grep -v 127 | sed 's/^[ \t]*//g' | cut -d ' ' -f2 | cut -d '/' -f1 | head -1`,
          (error, stdout, stderr) => {
            if (error) {
              console.log(`执行的错误: ${error}`);
              this.$logger.info(error);
              this.$message("没有获取到ip地址!");
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            this.ipAdress = stdout;
            this.$logger.info(stdout);
            this.$logger.info(stderr);
          }
      );
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    this.mainName = this.$route.query.name;
    // const myHost = this.getIPAdress();
    // // ip地址
    // this.ipAdress = myHost;
    this.getNetworkEnpUsbIp();
  },
  methods: {
    getIPAdress() {
      const os = require("os");
      const networksObj = os.networkInterfaces();
      for (const nw in networksObj) {
        if (Object.prototype.hasOwnProperty.call(networksObj, nw)) {
          const objArr = networksObj[nw];
          for (let i = 0; i < objArr.length; i++) {
            const alias = objArr[i];
            if (
              alias.family === "IPv4" &&
              alias.address !== "127.0.0.1" &&
              !alias.internal
            ) {
              return alias.address;
            }
          }
        }
      }
    },
    // 3G_ip 选项1
    getNetwork3GIp() {},

    // enp_usb_ip 选项2
    getNetworkEnpUsbIp() {
      const {exec} = require("child_process");
      exec(
          `ifconfig -a | awk -F '[:]' '{print $1}'|grep '^[a-z]'|grep -v 'lo\|docker0\|Iface\|veth\|br'`,
          (error, stdout, stderr) => {
            if (error) {
              console.log(`执行的错误: ${error}`);
              this.$logger.info(error);
              return;
            }
            console.log(`stdout: ${stdout}`);
            this.$logger.info(stdout);
            this.$logger.info(stderr);
            // 网卡信息
            this.networkA = stdout;
            this.networkA = this.networkA.replace(/[ ]/g, "");
            this.networkA = this.networkA.split("\n");
            this.networkA = this.networkA.filter(d => {
              return (
                d.indexOf("lo") === -1 &&
              d.indexOf("docker0") === -1 &&
              d.indexOf("Iface") === -1 &&
              d.indexOf("veth") === -1 &&
              d.indexOf("br") === -1
              );
            });
            this.networkA = this.networkA.join("\n");
            this.networkArr = this.networkA.split("\n");
            const arr = [];
            this.networkArr.map(d => {
              arr.push({
                value: d,
                label: d,
              });
            });
            this.networkArr = arr;
            console.log(`stderr: ${stderr}`);
          }
      );
    },

    // enp_ip 选项3
    getNetworkEnpIp() {},

    next() {
      // 此处方便调试，提交代码需要注释
      // this.$router.push({
      //   path: "/createdInfo",
      //   query: {
      //     pwd: this.$route.query.pwd,
      //     id: this.$route.query.id,
      //     name: this.mainName,
      //     ip: this.ipAdress
      //   }
      // })
      this.loading = true;
      // 修改对应的NAT规则
      const {exec} = require("child_process");
      exec(
          "echo " +
          this.$route.query.pwd +
          ' | sudo -S sed -i.bak "15s/<NETWORK_DEVICE_NAME>/' +
          this.network +
          '/ "   /etc/ufw/before.rules',
          (error, stdout, stderr) => {
            if (error) {
              console.log(`执行的错误: ${error}`);
              this.$logger.info(error);
              return;
            }
            this.$logger.info(stdout);
            this.$logger.info(stderr);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
          }
      );

      exec(
          "echo " + this.$route.query.pwd + " | sudo -S ufw disable",
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
          "echo " + this.$route.query.pwd + " | sudo -S ufw enable",
          (error, stdout, stderr) => {
            if (error) {
              console.log(`执行的错误: ${error}`);
              this.$logger.info(error);
              return;
            }
            this.$logger.info(stdout);
            this.$logger.info(stderr);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
          }
      );

      // 主动推/拉图以及websocket本地防火墙配置
      exec(
          "echo " + this.$route.query.pwd + " | sudo -S ufw allow 6080",
          (error, stdout, stderr) => {
            if (error) {
              console.log(`执行的错误: ${error}`);
              this.$logger.info(error);
            // return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            this.$logger.info(stdout);
            this.$logger.info(stderr);
          }
      );

      exec(
          "echo " + this.$route.query.pwd + " | sudo -S ufw allow 6090",
          (error, stdout, stderr) => {
            if (error) {
              console.log(`执行的错误: ${error}`);
              this.$logger.info(error);
            // return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            this.$logger.info(stdout);
            this.$logger.info(stderr);
          }
      );

      exec(
          "echo " + this.$route.query.pwd + " | sudo -S ufw allow 6078",
          (error, stdout, stderr) => {
            if (error) {
              console.log(`执行的错误: ${error}`);
              this.$logger.info(error);
            // return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            this.$logger.info(stdout);
            this.$logger.info(stderr);
          }
      );

      // 修改服务版本号
      exec(
          `sed -i.bak "s/#HOSTNAME/${this.mainName}/g" ${this.dirname}/standalone.yml`,
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
          `sed -i "s/#HOST_IP_ADDRESS/${this.ipAdress}/g" ${this.dirname}/standalone.yml`,
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
            this.loading = false;
            this.$router.push({
              path: "/createdInfo",
              query: {
                pwd: this.$route.query.pwd,
                id: this.$route.query.id,
                name: this.mainName,
                ip: this.ipAdress,
              },
            });
          // const { exec } = require("child_process");
          // 获取邀请码
          // exec(
          //   `docker exec ayes-be python3 /opt/dntech/ayes/dncloud/conf/main.py dcode admin 1 /var/dntech/ayes/admin.txt >a.txt`,
          //   (error, stdout, stderr) => {
          //     if (error) {
          //       console.log(`执行的错误: ${error}`);
          //       return;
          //     }
          //     console.log(`stdout: ${stdout}`);
          //     console.log(`stderr: ${stderr}`);
          //     const { exec } = require("child_process");
          //     exec(
          //       'cat `sed -i "s#\r##g" a.txt` a.txt',
          //       (error, stdout, stderr) => {
          //         if (error) {
          //           console.log(`执行的错误: ${error}`);
          //           return;
          //         }
          //         console.log(`stdout: ${stdout}`);
          //         console.log(`stderr: ${stderr}`);
          //         let docode = stdout;
          //         let index = stdout.lastIndexOf("-");
          //         docode = docode
          //           .substring(index + 1, docode.length)
          //           .replace(/[\r\n]/g, "");
          //         this.docode = docode;
          //         const { exec } = require("child_process");
          //         exec(
          //           `curl -X POST http://127.0.0.1/api/users/strange \ -H 'Content-Type: application/json' \ -H 'cache-control: no-cache' \ -d '{"display_name": "Strange","password":"Diannei123","dcode":"${docode}"}'`,
          //           (error, stdout, stderr) => {
          //             if (error) {
          //               console.log(`执行的错误: ${error}`);
          //               return;
          //             }
          //             console.log(`stdout: ${stdout}`);
          //             if (stdout.indexOf("<html>") != -1) {
          //               this.show = false;
          //               this.loading = false;
          //               this.networkhtml = stdout;
          //               this.$message.error("需要检测下ip服务是否正常!");
          //               return;
          //             } else {
          //               this.show = true;
          //               this.loading = false;
          //               this.$router.push({
          //                 path: "/createdInfo",
          //                 query: {
          //                   pwd: this.$route.query.pwd,
          //                   id: this.$route.query.id,
          //                   name: this.mainName,
          //                   ip: this.ipAdress
          //                 }
          //               });
          //             }
          //             console.log(`stderr: ${stderr}`);
          //           }
          //         );
          //       }
          //     );
          //   }
          // );
          }
      );
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
.box_main {
  height: 100vh;
  .box {
    display: flex;
    flex-direction: column;
    justify-content: center;
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
          padding: 2vh 2vw 2vh 2vw;
        }
      }
      .info_box {
        display: flex;
        flex-direction: column;
        span {
          font-size: 28px;
          text-align: left;
          padding: 2vh 2vw 2vh 2vw;
          width: 30vw;
          height: 10vh;
        }
      }
      .put {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin: 10vh 0px 10vh 0px;
        .title {
          margin-right: 20px;
        }
      }
    }

    .button {
      display: flex;
      justify-content: space-around;
      margin-top: 2vh;
    }
  }
}
</style>
