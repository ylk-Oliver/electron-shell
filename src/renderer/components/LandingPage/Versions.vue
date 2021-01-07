<template>
  <div v-loading="loading" element-loading-text="镜像导入中">
    <div class="logMin">
      <img src="../../assets/logo.png" alt />
    </div>
    <div class="box" v-if="!isShowList">
      <el-button class="online" @click="next()" type="success">在线安装</el-button>
      <el-button class="offline" @click="showList()" type="primary">离线安装</el-button>
    </div>
    <div class="list" v-if="isShowList">
      <p class="title">镜像导入列表</p>

      <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="name" label="服务名称" width="120"></el-table-column>
        <el-table-column prop="content" label="描述">
          <template slot-scope="scope">
            <el-tag type="success">{{scope.row.content}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">导入</el-button>
            <el-button type="text" @click="handleCheck(scope.row)" size="small">检查</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="import">
        <el-button @click="back()">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowList: false,
      loading: false,
      tableData: [
        {
          name: "ayes-be",
          content: "智能后端",
          value: "registry.cn-shenzhen.aliyuncs.com/dntech/ayes-be",
        },
        {
          name: "ayes-ai",
          content: "智能AI",
          value: "registry.cn-shenzhen.aliyuncs.com/dntech/ayes-ai",
        },
        {
          name: "ayes-fe",
          content: "智能服务",
          value: "registry.cn-shenzhen.aliyuncs.com/dntech/ayes-fe",
        },
        {
          name: "rabbitmq",
          content: "消息中间件",
          value: "rabbitmq",
        },
        {
          name: "mongo-express",
          content: "数据库控台",
          value: "mongo-express",
        },
        {
          name: "minio",
          content: "文件存储",
          value: "minio/minio",
        },
        {
          name: "mongo",
          content: "数据库",
          value: "mongo",
        },
        {
          name: "nginx",
          content: "静态内容",
          value: "nginx",
        },
      ],
    };
  },
  created() {},
  mounted() {
    this.pwd = this.$route.query.pwd;
  },
  methods: {
    next() {
      this.$router.push({path: "/menu", query: {pwd: this.password}});
    },
    showList() {
      this.isShowList = true;
    },
    handleClick(item) {
      this.loading = true;
      const {exec} = require("child_process");
      exec(
          `docker load -i /home/dntech/${item.name}.tar`,
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
      let time = 0;
      // ayes-fe与ayes-be服务启动完成时间无法估计，暂定1min
      if (item.name == "ayes-fe" || item.name == "aye-be") {
        time = 60000;
      } else {
        time = 30000;
      }
      setTimeout(() => {
        this.loading = false;
      }, time);
    },
    handleCheck(item) {
      const {exec} = require("child_process");
      exec(
          "docker images|awk '{print $1}' |grep -v REPOSITORY",
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
            // 如果全部包含flag为true代表可以进入下一步，如果不全部包含flag为flase，不可以进入下一步
            // 设置假数据arr便于测试写代码
            // 此处应该将stdout合成arr数组
            stdout = stdout.replace(/[ ]/g, "");
            const arr = stdout.split("\n");
            let flag = false;
            let message = "";
            if (arr.includes(item.value)) {
              flag = true;
              message = "导入镜像成功，进入下一步";
            } else {
              flag = false;
              message = "状态不成功，需要手动检查";
            }

            this.$confirm(message, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
                .then(() => {
                  if (flag) {
                    this.next();
                  }
                })
                .catch(() => {});
          }
      );
    },
    back() {
      this.isShowList = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-loading-spinner {
  top: 40%;
}
.box {
  display: flex;
  flex-direction: column;
  align-items: center;
  .online {
    width: 20vw;
    margin-top: 10vh;
  }
  .offline {
    width: 20vw;
    margin-left: 0px;
    margin-top: 10vh;
  }
}
.list {
  width: 80vw;
  height: 140vh;
  margin-left: 10vw;
  padding: 20vh 10vw;
  .import {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
