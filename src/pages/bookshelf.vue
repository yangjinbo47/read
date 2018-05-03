<template>
  <div class="container">
    <div class="header">
      书架
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
        navs : [
          {
            id : 1,
            name : '我的收藏',
            href : 'favorite'
          },
          {
            id : 2,
            name : '历史记录',
            href : 'history'
          },
          {
            id : 3,
            name : '我的订购',
            href : 'orderList'
          }
        ]
      }
    }
  }
</script>

<style scoped>
  nav, section {
    display: block;
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
