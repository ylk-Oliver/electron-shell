<template>
  <div>
    <div class="logMin">
      <img src="../assets/logo.png" alt />
    </div>
    <div class="box changebutton" v-loading="loading" element-loading-text="镜像下载中">
      <p class="title">应用管理</p>
      <el-table
        border
        :data="tableData"
        style="width: 100%;background: radial-gradient(ellipse at top left,rgba(255, 255, 255, 1) 40%,rgba(229, 229, 229, 0.9) 100%);"
      >
        <el-table-column align="center" label="服务名称" width="150">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="descript" label="描述" width="100"></el-table-column>
        <el-table-column align="center" prop="status" label="状态" width="100"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleStop(scope.$index, scope.row)">
              <img class="ico" title="停止" src="../assets/stop.png" alt />
            </el-button>
            <el-button size="mini" @click="handleStart(scope.$index, scope.row)">
              <img class="ico" title="开始" src="../assets/start.png" alt />
            </el-button>
            <el-button size="mini" @click="handleRestart(scope.$index, scope.row)">
              <img class="ico" title="重启" src="../assets/restart.png" alt />
            </el-button>
            <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">
              <img class="ico" title="更新" src="../assets/update.png" alt />
            </el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              <img class="ico" title="编辑" src="../assets/edit.png" alt />
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="route-index">
        <el-button type="primary" @click="back()">返回首页</el-button>
      </div>
    </div>

    <div class="pop-up" v-if="isEdit">
      <div class="title">
        <div class="pop-up-title">{{fileList}}</div>
        <div class="pop-up-delete" @click="close()">
          <img class="ico-delete" src="../assets/close.png" alt />
        </div>
      </div>
      <div class="pop-wrapper">
        <div>
          <el-table :data="tableData[indexEdit].fileArr" style="width: 100%">
            <el-table-column align="left" prop="fileName" label="文件名称"></el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="ReadRow(scope.$index, tableData[indexEdit].fileArr)"
                  type="text"
                  size="small"
                >
                  <img class="ico" src="../assets/read.png" alt />
                </el-button>
                <el-button
                  @click.native.prevent="EditRow(scope.$index, tableData[indexEdit].fileArr)"
                  type="text"
                  size="small"
                >
                  <img class="ico" src="../assets/edit.png" alt />
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <div class="pop-up" id="code-editor" v-if="isOpenEdit">
      <div class="title">
        <div class="pop-up-title">{{fileDetailList}}</div>
        <div class="pop-up-delete" @click="closeEditor()">
          <img class="ico-delete" src="../assets/close.png" alt />
        </div>
      </div>
      <Editor @input="codeChange" :value="codeValue"></Editor>
      <div v-if="isRead" class="pop-save">
        <el-button @click="save()" type="primary">保存</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import Editor from "./Editor";
export default {
  data() {
    return {
      isMonitioring: false,
      indexEdit: 0,
      isRead: false,
      fileDetailList: "",
      fileList: "",
      val: "",
      path: "",
      codeValue: ``,
      codeUpate: ``,
      fileDirname: "",
      dirname: "",
      isEdit: false,
      loading: false,
      isOpenEdit: false,
      tableData: [
        {
          name: "standalone",
          descript: "智能随访",
          status: "正常",
          fileArr: [
            {
              fileName: "standalone.yml",
              fileLoaction: "/home/dntech/conf/standalone.yml",
            },
          ],
        },
      ],
      dockerArr: [],
      optionArr1: [
        "ayes-followup",
        "ayes-detection",
        "rabbitmq",
        "gpubeat",
        "heartbeat",
        "logstash",
        "auditbeat",
        "metricbeat",
      ],
      optionArr2: ["ayes-be", "mongo-express", "minio", "mongo", "nginx"],
      optionArr3: ["ayes-fe"],
    };
  },
  components: {
    Editor,
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    back() {
      this.$router.push({
        path: "/",
        query: {isInstall: "yes"},
      });
    },
    close() {
      this.isEdit = false;
    },
    closeEditor() {
      this.isOpenEdit = false;
      this.isRead = false;
    },
    handleStop(index, row) {
      this.loading = true;
      console.log(index, row);
      let assign = "";
      if (row.name == "standalone") {
        assign = "standalone";
      } else if (row.name == "monitoring") {
        assign = "monitoring";
      } else {
        const {exec} = require("child_process");
        exec(`docker stop ${row.name}`, (error, stdout, stderr) => {
          if (error) {
            console.log(`执行的错误: ${error}`);
            this.$logger.info(error);
            return;
          }
          console.log("stdout", stdout);
          console.log(`stderr: ${stderr}`);
          this.$logger.info(stdout);
          this.$logger.info(stderr);
          this.loading = false;
          this.$message(`${row.name}服务停止`);
          this.init();
        });
      }

      if (assign != "") {
        const {exec} = require("child_process");
        exec(
            `docker-compose -f /home/dntech/conf/${assign}.yml -p standalone down`,
            (error, stdout, stderr) => {
              if (error) {
                console.log(`执行的错误: ${error}`);
                this.$logger.info(error);
                return;
              }
              console.log("stdout", stdout);
              console.log(`stderr: ${stderr}`);
              this.$logger.info(stdout);
              this.$logger.info(stderr);
              this.loading = false;
              this.$message(`${row.name}服务停止`);
              this.init();
            }
        );
      }
    },
    handleStart(index, row) {
      console.log(index, row);
      this.loading = true;
      let assign = "";
      if (row.name == "standalone") {
        assign = "standalone";
      } else if (row.name == "monitoring") {
        assign = "monitoring";
      } else {
        const {exec} = require("child_process");
        exec(`docker start ${row.name}`, (error, stdout, stderr) => {
          if (error) {
            console.log(`执行的错误: ${error}`);
            this.$logger.info(error);
            return;
          }
          console.log("stdout", stdout);
          console.log(`stderr: ${stderr}`);
          this.$logger.info(stdout);
          this.$logger.info(stderr);
          this.loading = false;
          this.$message(`${row.name}服务启动`);
          this.init();
        });
      }
      if (assign != "") {
        const {exec} = require("child_process");
        exec(
            `docker-compose -f /home/dntech/conf/${assign}.yml -p standalone up -d`,
            (error, stdout, stderr) => {
              if (error) {
                console.log(`执行的错误: ${error}`);
                this.$logger.info(error);
                return;
              }
              console.log("stdout", stdout);
              console.log(`stderr: ${stderr}`);
              this.$logger.info(stdout);
              this.$logger.info(stderr);
              this.loading = false;
              this.$message(`${row.name}服务启动`);
              this.init();
            }
        );
      }
    },
    handleRestart(index, row) {
      console.log(index, row);
      this.loading = true;
      if (row.name == "standalone" || row.name == "monitoring") {
        this.$message("该服务不可重启");
        this.loading = false;
        return;
      }
      const {exec} = require("child_process");
      exec(`docker restart ${row.name}`, (error, stdout, stderr) => {
        if (error) {
          console.log(`执行的错误: ${error}`);
          this.$logger.info(error);
          return;
        }
        console.log("stdout", stdout);
        console.log(`stderr: ${stderr}`);
        this.$logger.info(stdout);
        this.$logger.info(stderr);
        this.loading = false;
        this.$message(`${row.name}服务重启`);
        this.init();
      });
    },
    handleUpdate(index, row) {
      console.log(index, row);
      this.autoupdate();
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.indexEdit = index;
      this.fileList = row.name;
      this.isEdit = true;
    },
    autoupdate() {
      this.$confirm("检测到更新，需要更新", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            this.loading = true;
            // 停止应用
            const {exec} = require("child_process");
            exec(
                `docker stop ayes-be ayes-fe && docker rm ayes-be ayes-fe`,
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
                  // 删除原有镜像
                  const {exec} = require("child_process");
                  exec(
                      `docker rmi registry.cn-shenzhen.aliyuncs.com/dntech/ayes-be:latest`,
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
                        // 删除原有镜像
                        const {exec} = require("child_process");
                        exec(
                            `docker rmi registry.cn-shenzhen.aliyuncs.com/dntech/ayes-fe:latest`,
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
                              // 登陆镜像仓库
                              const {exec} = require("child_process");
                              exec(
                                  `docker login --username=container@dntech --password="&9Xl1t4zV&h5" registry.cn-shenzhen.aliyuncs.com`,
                                  (error, stdout, stderr) => {
                                    if (error) {
                                      console.log(`执行的错误: ${error}`);
                                      this.$logger.info(error);
                                      return;
                                    }
                                    console.log(`stdout:, ${stdout}`);
                                    console.log(`stderr:, ${stderr}`);
                                    this.$logger.info(stdout);
                                    this.$logger.info(stderr);
                                    // 本地拉取最新镜像:
                                    const {exec} = require("child_process");
                                    exec(
                                        `docker pull registry.cn-shenzhen.aliyuncs.com/dntech/ayes-be:latest`,
                                        (error, stdout, stderr) => {
                                          if (error) {
                                            console.log(`执行的错误: ${error}`);
                                            this.$logger.info(error);
                                            return;
                                          }
                                          console.log(`stdout:, ${stdout}`);
                                          console.log(`stderr:, ${stderr}`);
                                          this.$logger.info(stdout);
                                          this.$logger.info(stderr);
                                          // 本地拉取最新镜像
                                          const {exec} = require("child_process");
                                          exec(
                                              `docker pull registry.cn-shenzhen.aliyuncs.com/dntech/ayes-fe:latest`,
                                              (error, stdout, stderr) => {
                                                if (error) {
                                                  console.log(`执行的错误: ${error}`);
                                                  this.$logger.info(error);
                                                  return;
                                                }
                                                console.log(`stdout:, ${stdout}`);
                                                console.log(`stderr:, ${stderr}`);
                                                this.$logger.info(stdout);
                                                this.$logger.info(stderr);
                                                // 更新并重启
                                                const {exec} = require("child_process");
                                                exec(
                                                    `docker-compose -f /home/dntech/conf/standalone.yml -p standalone up -d`,
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
                                                      this.$message({
                                                        type: "success",
                                                        message: "更新成功!",
                                                      });
                                                      this.loading = false;
                                                      this.init();
                                                    }
                                                );
                                              }
                                          );
                                        }
                                    );
                                  }
                              );
                              console.log(`stderr: ${stderr}`);
                            }
                        );
                      }
                  );
                }
            );
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消更新",
            });
          });
    },
    init() {
      this.dockerGet();
      this.dockerArr = [];
      this.tableData = [
        {
          name: "standalone",
          descript: "智能随访",
          status: "正常",
          fileArr: [
            {
              fileName: "standalone.yml",
              fileLoaction: "/home/dntech/conf/standalone.yml",
            },
          ],
        },
      ];
      const {exec} = require("child_process");
      exec(`docker ps --format "table {{.Names}}"`, (error, stdout, stderr) => {
        if (error) {
          console.log(`执行的错误: ${error}`);
          this.$logger.info(error);
          return;
        }
        console.log("stdout", stdout);
        console.log("stderr", stderr);
        this.$logger.info(stdout);
        this.$logger.info(stderr);
        stdout = stdout.split("\n");
        stdout.pop();
        const arr = this.curtail(stdout);
        arr.forEach((d, index) => {
          if (d == "ayes-followup") {
            // 判断是否是选择一和二选项，即打开了监控服务
            this.isMonitioring = true;
            this.tableData.push({
              name: "monitoring",
              descript: "智能监控",
              status: "正常",
              fileArr: [
                {
                  fileName: "monitoring.yml",
                  fileLoaction: "/home/dntech/conf/monitoring.yml",
                },
                {
                  fileName: "metricbeat.yml",
                  fileLoaction: "/home/dntech/conf/metricbeat.yml",
                },
                {
                  fileName: "logstash.yml",
                  fileLoaction: "/home/dntech/conf/logstash.yml",
                },
                {
                  fileName: "heartbeat.yml",
                  fileLoaction: "/home/dntech/conf/heartbeat.yml",
                },
                {
                  fileName: "gpubeat.yml",
                  fileLoaction: "/home/dntech/conf/gpubeat.yml",
                },
                {
                  fileName: "auditbeat.yml",
                  fileLoaction: "/home/dntech/conf/auditbeat.yml",
                },
              ],
            });
          }
          let descript;
          if (this.optionArr1.includes(d)) {
            descript = "智能监控";
          } else if (this.optionArr2.includes(d)) {
            descript = "智能服务";
          } else if (this.optionArr3.includes(d)) {
            descript = "智能前端";
          }
          this.tableData.push({
            name: d,
            descript: descript,
          });
          if (d == "ayes-be") {
            this.tableData.forEach((value, index) => {
              if (value.name == "ayes-be") {
                value.fileArr = [
                  {
                    fileName: "ayes-dicom.yml",
                    fileLoaction: "/home/dntech/conf/ayes-dicom.yml",
                  },
                  {
                    fileName: "ayes-server.yml",
                    fileLoaction: "/home/dntech/conf/ayes-server.yml",
                  },
                  {
                    fileName: "ayes-celeryconfig.yml",
                    fileLoaction: "/home/dntech/conf/ayes-celeryconfig.yml",
                  },
                ];
              }
            });
          }

          if (d == "nginx") {
            this.tableData.forEach((value, index) => {
              if (value.name == "nginx") {
                value.fileArr = [
                  {
                    fileName: "nginx.conf",
                    fileLoaction: "/home/dntech/conf/nginx.conf",
                  },
                ];
              }
            });
          }
        });
        const {exec} = require("child_process");
        exec(
            `docker ps --format "table {{.Status}}"`,
            (error, stdout, stderr) => {
              if (error) {
                console.log("执行的错误", error);
                this.$logger.info(error);
                return;
              }
              console.log("stdout", stdout);
              console.log("stderr", stderr);
              this.$logger.info(stdout);
              this.$logger.info(stderr);
              stdout = stdout.split("\n");
              stdout.pop();
              const arr1 = this.curtail(stdout);
              const arr2 = [];
              let status = "";
              if (this.isMonitioring == true) {
                arr1.unshift("Up", "Up");
              } else {
                arr1.unshift("Up");
              }
              arr1.forEach(d => {
                if (d.search("Up") != -1) {
                  status = "已启动";
                } else if (d.search("Restart" != -1)) {
                  status = "重新启动";
                }
                arr2.push({
                  status: status,
                });
              });
              this.tableData = this.tableData.map((item, index) => {
                return {...item, ...arr2[index]};
              });
              this.tableData.forEach((item, index) => {
                this.dockerArr = this.dockerArr.filter(d => {
                  return item.name != d;
                });
              });
              let description;
              this.dockerArr = this.dockerArr.map(d => {
                if (this.optionArr1.includes(d)) {
                  description = "智能监控";
                } else if (this.optionArr2.includes(d)) {
                  description = "智能服务";
                } else if (this.optionArr3.includes(d)) {
                  description = "智能前端";
                }
                return {name: d, descript: description, status: "尚未启动"};
              });
              this.tableData = this.tableData.concat(this.dockerArr);
            }
        );
      });
    },
    dockerGet() {
      const {exec} = require("child_process");
      exec(
          `docker ps -a | awk '{print $NF}' |grep -v 'NAMES'`,
          (error, stdout, stderr) => {
            if (error) {
              console.log(`执行的错误: ${error}`);
              this.$logger.info(error);
              return;
            }
            stdout = stdout.split("\n");
            stdout.pop();
            console.log("stdout", stdout);
            console.log(`stderr: ${stderr}`);
            this.$logger.info(stdout);
            this.$logger.info(stderr);
            this.dockerArr = stdout;
          }
      );
    },
    curtail(arr) {
      const res = arr.slice(0);
      res.shift(arr[0]);
      return res;
    },
    EditRow(index, row) {
      this.fileDetailList = row[index].fileName;
      console.log(index, row[index].fileLoaction);
      if (row[index].fileLoaction != "") {
        this.isRead = true;
        this.path = `${row[index].fileLoaction}`;
        if (this.path != "" || typeof this.path !== "undefined") {
          this.isOpenEdit = true;
        }
        const fs = require("fs");
        const content = fs.readFileSync(this.path, {encoding: "utf-8"});
        this.codeValue = content;
      }
    },
    ReadRow(index, row) {
      this.fileDetailList = row[index].fileName;
      console.log(index, row[index].fileLoaction);
      if (row[index].fileLoaction != "") {
        this.path = `${row[index].fileLoaction}`;
        if (this.path != "" || typeof this.path !== "undefined") {
          this.isOpenEdit = true;
        }
        const fs = require("fs");
        const content = fs.readFileSync(this.path, {encoding: "utf-8"});
        this.codeValue = content;
      }
    },
    save() {
      if (this.val == "") {
        this.$message("文件尚未更改");
      } else {
        const fs = require("fs");
        fs.writeFile(this.path, this.val, function(err) {
          if (err) {
            this.$message("保存失败");
          }
        });
        this.$message("保存成功");
      }
      this.isOpenEdit = false;
    },
    codeChange(val) {
      this.val = val;
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

.logMin {
  width: 50px;
  position: absolute;
  top: 3vh;
  left: 3vw;
}
.box {
  height: 100%;
  padding: 20vh 10vw;
}
.ico {
  width: 25px;
}
.ico-delete {
  width: 20px;
}
.changebutton {
  .el-button {
    border: none;
  }
}
.title {
  font-size: 28px;
  text-align: center;
}
.route-index {
  display: flex;
  justify-content: flex-end;
  margin-top: 5vh;
}
.pop-up {
  width: 40vw;
  background: #8a8a8a;
  position: absolute;
  top: 20vh;
  left: 30%;
  z-index: 9999;
  border: 1px solid #e1e1e1;
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 30px;
    line-height: 30px;
    padding: 0px 10px 0px 20px;
    .pop-up-title {
      font-size: 20px;
    }
  }
  .pop-wrapper {
    padding: 2px 2px 2px 2px;
  }
}
#code-editor {
  width: 80vw;
  height: 50vh;
  left: 10%;
}
.pop-save {
  display: flex;
  justify-content: center;
  background: #e1e1e1;
}
</style>
