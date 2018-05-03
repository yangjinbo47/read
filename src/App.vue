<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style>
  ul,li,dl,dt,dd,ol{ list-style-type:none; margin:0; padding:0;}
  h1,h2,h3,h4,h5,h6,form,input,textarea,label,table,tr,td,p,header,article,footer,nav,section,aside
  header,article,footer,nav,section,aside
  table{ border-collapse:collapse; border-spacing:0;}
  img{ border:none;}

  html {
    color: #000;
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
  }

  html * {
    outline: none;
    padding: 0;
    margin: 0;
    border: 0;
    -webkit-text-size-adjust: none;
    -webkit-tap-highlight-color: transparent;
  }

  body, html {
    /*height: 100%;*/
    font-family: miui;
    font-size: 14px;
    color: rgba(0,0,0,.6);
  }

  #app {
    /*height: 100%;*/
  }

  a:link,a:visited{text-decoration:none;outline:none;}
  a:active,a:hover{text-decoration:none;}

  /**============头部=================**/
  .header {
    line-height: 44px;
    height: 44px;
    width:100%;
    background-color: #339ee2;
    color: #fff;
    text-align: center;
    font-size: 18px;
    padding: 0 8px;
    position: fixed;
    top: 0;
    z-index: 999999;
  }
  .head-icon {
    position: absolute;
    line-height: 44px;
  }
  .back {
    left: 10px;
    background: url('./assets/images/back.png') no-repeat;
    background-size: auto 26px;
    background-position: left center;
    width: 36px;
    height: 44px;
  }

  /**============阅读器文字样式，ajax加载的数据没有样式版本，在组件中无法执行，所以用全局=================**/
  .m-read-content h4 {
    font-size: 20px;
    color: #736357;
    border-bottom: solid 1px #736357;
    margin: 0 0 1em 0;
    letter-spacing: 2px;
  }
  .m-read-content p {
    text-indent: 2em;
    margin: 0.5em 0;
    text-align: justify;
    letter-spacing: 0px;
    line-height: 24px;
  }
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
</style>
