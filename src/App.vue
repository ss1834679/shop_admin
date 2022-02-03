<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import WebIM from "./utils/WebIM";
// import { mapState, mapActions } from "vuex";

export default {
  name: "App",
  // beforeMount() {
  //   const userInfo = localStorage.getItem("userInfo") && JSON.parse(localStorage.getItem("userInfo"));
  //   if (userInfo) {
  //     const userName = userInfo.userId;
  //     const password = userInfo.password;
  //     var options = {
  //       apiUrl: WebIM.config.apiURL,
  //       user: userName,
  //       pwd: password,
  //       appKey: WebIM.config.appkey
  //     };
  //     WebIM.conn.open(options);
  //   }
  // }
};
</script>
<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
}
/* 高度自适应 */
.el-card {
  display: flex;
  flex-direction: column;
  .el-card__header {
    height: 50px;
    padding: 0;
    padding-left: 18px;
    line-height: 50px;
  }
}
.xiaolianIcon {
  background-image: url("../public/img/xiaolian.png") !important;
  background-size: 100% 100% !important;
  background-repeat: no-repeat !important;
}
.uploadImgChat {
  margin-left: 6px !important;
  border-radius: 0 !important;
  border: none !important;
  width: 25px;
  height: 25px;
  background-image: url("../public/img/pictureup.png") !important;
  background-size: 100% 100% !important;
  background-repeat: no-repeat !important;
  // background-position: 5px 5px !important;
}
.uploadFileChat {
  margin-left: 6px !important;
  border-radius: 0 !important;
  border: none !important;
  width: 25px;
  height: 25px;
  background-image: url("../public/img/fileup.png") !important;
  background-size: 100% 100% !important;
  background-repeat: no-repeat !important;
  // background-position: 5px 5px !important;
}
.sengTxt {
  textarea {
    height: 100% !important;
    width: 100% !important;
    border: none !important;
    border-radius: 0 !important;
  }
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  min-width: 830px;
  height: 100%;
  min-height: 580px;
}
</style>
