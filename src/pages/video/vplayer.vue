<template>
  <div class="content">
    <div class="header">
      <a href="#" class="head-icon back" v-on:click="$router.back()"></a>
      小凯的家不一样了(需替换)
    </div>

    <div class="video">
      <video controls="true">
        <source :src="video">
      </video>
    </div>

    <nav>
      <ul class="i_nav">
        <router-link v-for="item in navs" :key="item.id" :to="item.href" tag="li" active-class="on">
          <a href="#">{{item.name}}</a>
        </router-link>
      </ul>
    </nav>

    <keep-alive>
      <router-view></router-view>
    </keep-alive>


  </div>
</template>

<script>
  export default {
    data () {
      return {
        video:require('../../assets/video/bxz.mp4'),
        navs : [
          {
            id : 1,
            name : '视频介绍',
            href : '/vPlayer/description'
          },
          {
            id : 2,
            name : '猜你喜欢',
            href : '/vPlayer/guess'
          }
        ]
      }
    },
    methods : {

    }
  }
</script>

<style scoped>
  .content {
    margin: 44px 0px 0px 0px;
    #height: 95%;
  }

  video {
    object-fit: contain;
  }
  .video video {
    width: 100%;
    height: inherit;
    margin-bottom: 5px;
  }


  .i_nav {
    background: #f6f6f6;
    height: 42px;
    border-top: #d7d7d7 1px solid;
    border-bottom: #d7d7d7 1px solid;
    display: -webkit-box;
  }
  .i_nav li {
    -webkit-box-flex: 1;
  }
  .i_nav li a {
    font-size: 16px;
    color: #838383;
    display: block;
    width: 80px;
    height: 39px;
    line-height: 39px;
    margin: 0 auto;
    text-align: center;
  }
  .i_nav li.on {
    border-bottom: 1px solid #0fc5c7;
  }
  .i_nav li.on a {
    color: #00b068;
  }
</style>
