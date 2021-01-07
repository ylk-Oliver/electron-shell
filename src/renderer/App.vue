<template>
  <div id="app">
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "frakta",
};
</script>

<style lang="scss">
/* CSS */
* {
  margin: 0;
  padding: 0;
  list-style: none;
  box-sizing: border-box;
}

a {
  color: #000;
  text-decoration: none;
}

img {
  width: 100%;
}

html,
body {
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-family: "黑体";
  background: #e1e1e1;
}

input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
}

#app,
.home {
  width: 100%;
  height: 100%;
}
</style>
