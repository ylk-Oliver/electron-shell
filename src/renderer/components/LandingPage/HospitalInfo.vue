<template>
  <div>
    <div class="logMin">
      <img src="../../assets/logo.png" alt />
    </div>
    <div class="box" v-loading="loading" element-loading-text="镜像下载中">
      <p class="hos_title">输入医院详细信息</p>
      <div class="box_main">
        <div class="box-title">
          <span>医院英文全称:</span>
          <span>医院省份/城市:</span>
        </div>
        <div class="put">
          <div class="put_item">
            <el-input @keyup.enter.native="next" v-model="hospital"></el-input>
          </div>

          <div class="put_item">
            <el-cascader
              size="large"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </div>
        </div>
      </div>

      <div class="button">
        <el-button @click="next()" type="success">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {provinceAndCityData} from "element-china-area-data";
export default {
  data() {
    return {
      hospital: "",
      password: "",
      province_city: "",
      city: "",
      options: provinceAndCityData,
      selectedOptions: [],
      loading: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    next() {
      this.loading = true;
      const reg = /^[A-Za-z][A-Za-z\s]*[A-Za-z]$/;
      const str = this.hospital.replace(/(^\s*)|(\s*$)/g, "");
      if (!reg.test(str)) {
        alert("医院英文全称验证不通过");
        this.loading = false;
      } else {
        this.hospital = this.hospital.replace(/[\r\n]/g, "");
        this.hospital = this.hospital.split(" ");

        let str = "";
        this.hospital.map(d => {
          const dd = d.split("");
          str += dd[0];
        });
        this.hospital = str.toUpperCase();

        const {exec} = require("child_process");
        /*
         * 修改主机名
         */
        exec(
            "echo " +
            this.$route.query.pwd +
            " | sudo -S hostnamectl set-hostname dncloud-" +
            this.hospital +
            "",
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

        /*
         * 配置Minio & Mongo
         */
        // exec(
        //   'echo ' +
        //     this.$route.query.pwd +
        //     ' | sudo -S mkdir -pv /mnt/Storage/minio-storage',
        //   (error, stdout, stderr) => {
        //     if (error) {
        //       console.log(`执行的错误: ${error}`)
        //       return
        //     }
        //     console.log(`stdout: ${stdout}`)
        //     console.log(`stderr: ${stderr}`)
        //   }
        // )
        // exec(
        //   'echo ' +
        //     this.$route.query.pwd +
        //     ' | sudo -S mkdir -pv /mnt/Storage/mongo-storage',
        //   (error, stdout, stderr) => {
        //     if (error) {
        //       console.log(`执行的错误: ${error}`)
        //       return
        //     }
        //     console.log(`stdout: ${stdout}`)
        //     console.log(`stderr: ${stderr}`)
        //   }
        // )
        // exec(
        //   'echo ' +
        //     this.$route.query.pwd +
        //     ' | sudo -S mkdir -pv /mnt/Storage/ayes-cache',
        //   (error, stdout, stderr) => {
        //     if (error) {
        //       console.log(`执行的错误: ${error}`)
        //       return
        //     }
        //     console.log(`stdout: ${stdout}`)
        //     console.log(`stderr: ${stderr}`)
        //   }
        // )

        // exec(
        //   'echo ' +
        //     this.$route.query.pwd +
        //     ' | sudo -S mkdir -pv /mnt/Storage/ayes-cache/original',
        //   (error, stdout, stderr) => {
        //     if (error) {
        //       console.log(`执行的错误: ${error}`)
        //       return
        //     }
        //     console.log(`stdout: ${stdout}`)
        //     console.log(`stderr: ${stderr}`)
        //   }
        // )

        // exec(
        //   'echo ' +
        //     this.$route.query.pwd +
        //     ' | sudo -S mkdir -pv /mnt/Storage/ayes-cache/download',
        //   (error, stdout, stderr) => {
        //     if (error) {
        //       console.log(`执行的错误: ${error}`)
        //       return
        //     }
        //     console.log(`stdout: ${stdout}`)
        //     console.log(`stderr: ${stderr}`)
        //   }
        // )

        /*
         * 检查Symbolic Link是否 关联
         */
        // this.$message('检查Symbolic Link是否关联');

        // NUM1
        // exec(
        //   `echo ${this.$route.query.pwd} | sudo -S find /var/lib/docker/volumes/minio-storage/_data -type l | wc -l`,
        //   (error, stdout, stderr) => {
        //     if (error) {
        //       console.log(`执行的错误: ${error}`)
        //       return
        //     }
        //     console.log(`stdout: ${stdout}`)
        //     console.log(`stderr: ${stderr}`)
        //     if (stdout == 1) {
        //       this.$message('symbolic link exist')
        //     } else {
        //       exec(
        //         'echo ' +
        //           this.$route.query.pwd +
        //           ' | sudo -S ln -s /mnt/Storage/minio-storage /var/lib/docker/volumes/minio-storage/_data',
        //         (error, stdout, stderr) => {
        //           if (error) {
        //             console.log(`执行的错误: ${error}`)
        //             return
        //           }
        //           console.log(`stdout: ${stdout}`)
        //           console.log(`stderr: ${stderr}`)
        //         }
        //       )
        //     }
        //   }
        // )

        // NUM2
        // exec(
        //   'echo ' +
        //     this.$route.query.pwd +
        //     ' | sudo -S find /var/lib/docker/volumes/mongo-storage/_data -type l | wc -l',
        //   (error, stdout, stderr) => {
        //     if (error) {
        //       console.log(`执行的错误: ${error}`)
        //       return
        //     }
        //     console.log(`stdout: ${stdout}`)
        //     console.log(`stderr: ${stderr}`)
        //     if (stdout == 1) {
        //       this.$message('symbolic link exist')
        //     } else {
        //       exec(
        //         'echo ' +
        //           this.$route.query.pwd +
        //           ' |sudo -S ln -s /mnt/Storage/mongo-storage /var/lib/docker/volumes/mongo-storage/_data',
        //         (error, stdout, stderr) => {
        //           if (error) {
        //             console.log(`执行的错误: ${error}`)
        //             return
        //           }
        //           console.log(`stdout: ${stdout}`)
        //           console.log(`stderr: ${stderr}`)
        //         }
        //       )
        //     }
        //   }
        // )

        // NUM3
        // exec(
        //   'echo ' +
        //     this.$route.query.pwd +
        //     ' | sudo -S find /var/lib/docker/volumes/ayes-download/_data -type l | wc -l',
        //   (error, stdout, stderr) => {
        //     if (error) {
        //       console.log(`执行的错误: ${error}`)
        //       return
        //     }
        //     console.log(`stdout: ${stdout}`)
        //     console.log(`stderr: ${stderr}`)
        //     if (stdout == 1) {
        //       this.$message('symbolic link exist')
        //     } else {
        //       exec(
        //         'echo ' +
        //           this.$route.query.pwd +
        //           ' | sudo -S ln -s /mnt/Storage/ayes-cache/download /var/lib/docker/volumes/ayes-download/_data',
        //         (error, stdout, stderr) => {
        //           if (error) {
        //             console.log(`执行的错误: ${error}`)
        //             return
        //           }
        //           console.log(`stdout: ${stdout}`)
        //           console.log(`stderr: ${stderr}`)
        //         }
        //       )
        //     }
        //   }
        // )

        // NUM4
        // exec(
        //   'echo ' +
        //     this.$route.query.pwd +
        //     ' | sudo -S find /var/lib/docker/volumes/ayes-original/_data -type l | wc -l',
        //   (error, stdout, stderr) => {
        //     if (error) {
        //       console.log(`执行的错误: ${error}`)
        //       return
        //     }
        //     console.log(`stdout: ${stdout}`)
        //     console.log(`stderr: ${stderr}`)
        //     if (stdout == 1) {
        //       this.$message('symbolic link exist')
        //     } else {
        //       exec(
        //         'echo ' +
        //           this.$route.query.pwd +
        //           ' | sudo -S ln -s /mnt/Storage/ayes-cache/original /var/lib/docker/volumes/ayes-original/_data',
        //         (error, stdout, stderr) => {
        //           if (error) {
        //             console.log(`执行的错误: ${error}`)
        //             return
        //           }
        //           console.log(`stdout: ${stdout}`)
        //           console.log(`stderr: ${stderr}`)
        //         }
        //       )
        //     }
        //   }
        // )
        setTimeout(() => {
          this.loading = false;
          this.$router.push({
            path: "/networkInfo",
            query: {
              pwd: this.$route.query.pwd,
              id: this.$route.query.id,
              name: this.hospital,
            },
          });
        }, 3000);
      }
    },
    handleChange(value) {
      console.log(value);
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
  padding: 20vh 10vw;
  .hos_title {
    text-align: center;
    font-size: 28px;
  }
  .box_main {
    margin-top: 10vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    .box-title {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      span {
        font-size: 18px;
        text-align: right;
        line-height: 8vh;
        height: 8vh;
      }
    }
    .put {
      display: flex;
      flex-direction: column;
      margin-left: 3vw;
      .put_item {
        height: 8vh;
        line-height: 8vh;
        .el-select {
          display: inline;
        }
      }
    }
  }
  .button {
    width: 8vw;
    display: block;
    margin: 5vh auto;
  }
}
</style>
