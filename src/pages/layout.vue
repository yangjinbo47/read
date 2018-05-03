<template>
  <div id="layout">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <footer>
      <div class="footer-tap">
        <router-link v-for="item in footers" :key="item.name" :to="item.path" tag="a" class="nav-item" :class="item.cls" active-class="active">
          <span class="icon"></span>
          <span class="cap">{{item.name}}</span>
        </router-link>
      </div>
    </footer>

  </div>
</template>

<script>
  export default {
    data(){
      return {
        footers: [
          {
            name: '书架',
            path: '/bookshelf',
            icon: require('../assets/images/bookshelf.png'),
            cls : 'shelf-item',
            active: false
          },
          {
            name: '首页',
            path: '/home',
            icon: require('../assets/images/home.png'),
            cls : 'home-item',
            active: false
          },
          {
            name: '分类',
            path: '/category',
            icon: require('../assets/images/category.png'),
            cls : 'category-item',
            active: false
          },
          {
            name: '我的',
            path: '/user',
            icon: require('../assets/images/user.png'),
            cls : 'personal-item',
            active: false
          }
        ]
      }
    },
    components:{
    },
    methods:{

    },
    mounted () {
      var openid = this.GLOBAL.fetchFromSessionStorage(this.GLOBAL.OPENID_KEY)
      if (openid == null) {
        openid = this.GLOBAL.getUrlParam('openid')
      }
      if (openid != null) {
        this.GLOBAL.saveToSessionStorage(this.GLOBAL.OPENID_KEY, openid)
        this.openid = openid
      }
    }
  }
</script>


<style>
  #layout{
    /*height: 100%;*/
  }
  /**============container=================**/
  .container {
    #height: 100%;
    margin: 44px 0px 48px 0px;
    background-color:#efefef;
  }

  /**============底部=================**/
  .copyright{text-align:center;margin:1em 0;font-size:1em; line-height:1.6em;color:#999;}
  .copyright a{color:#999;}

  footer {
    position: fixed;
    height: 48px;
    width: 100%;
    bottom: 0;
    border-top: 1px solid rgba(0,0,0,.15);
    background-color: #fff;
  }
  .footer-tap {
    position: relative;
    height: 100%;
    background: #fff;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-around;
    justify-content: space-around;
  }
  .footer-tap .nav-item {
    width: 20%;
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    height: 100%;
  }
  .footer-tap .icon {
    height: 24px;
    width: 24px;
    display: block;
    margin: 4% auto 0;
  }
  /**footer文字*/
  .footer-tap .cap {
    font-size: 14px;
    display: block;
    text-align: center;
    color: rgba(0,0,0,.6);
  }
  .footer-tap .shelf-item .icon {
    background: url('../assets/images/bookshelf.png') no-repeat 50%;
    background-size: 100% auto;
  }
  .footer-tap .shelf-item.active .icon {
    background: url('../assets/images/bookshelf_s.png') no-repeat 50%;
    background-size: 100% auto;
  }
  .footer-tap .home-item .icon {
    background: url('../assets/images/home.png') no-repeat 50%;
    background-size: 100% auto;
  }
  .footer-tap .home-item.active .icon {
    background: url('../assets/images/home_s.png') no-repeat 50%;
    background-size: 100% auto;
  }
  .footer-tap .category-item .icon {
    background: url('../assets/images/category.png') no-repeat 50%;
    background-size: 100% auto;
  }
  .footer-tap .category-item.active .icon {
    background: url('../assets/images/catalog_s.png') no-repeat 50%;
    background-size: 100% auto;
  }
  .footer-tap .personal-item .icon {
    background: url('../assets/images/user.png') no-repeat 50%;
    background-size: 100% auto;
  }
  .footer-tap .personal-item.active .icon {
    background: url('../assets/images/user_s.png') no-repeat 50%;
    background-size: 100% auto;
  }


  /**书籍样式*/
  .m-arrow {
    display: inline-block;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    border: 1px solid #aba59a;
    border-left-color: transparent;
    border-bottom-color: transparent;
    width: 6px;
    height: 6px;
  }

  .m-list-box {
    padding: 15px;
    margin-bottom: 12px;
    background-color: #fff;
  }
  .m-list-box h3 .sep {
    display: inline-block;
    background: #ED6460;
    border-radius: 3px;
    width: 2.5px;
    height: 12px;
    margin-right: 6px;
  }
  .m-list-box h3 .gradient {
    height: 19px;
    line-height: 19px;
    padding-bottom: 20px;
    font-size: 18px;
    color: #ED6460;
    display: inline-block;
  }
  .m-list-box .more {
    float: right;
    display: block;
    font-weight: normal;
    font-size: 13px;
    color: #aba59a;
    height: 19px;
    line-height: 19px;
  }

  .m-book-list {
    width: 100%;
    transition: opacity .5s;
    -moz-transition: opacity .5s;
    -webkit-transition: opacity .5s;
    -o-transition: opacity .5s;
  }
  .m-book-list>li {
    position: relative;
    float: left;
    width: 30%;
    margin-right: 5%;
  }
  .m-book-list>li a.pic {
    display: block;
    /*长方形图书样式*/
    padding-bottom: 140%;
    /*padding-bottom: 100%;正方形绘本样式*/
    height: 0;
    overflow: hidden;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,0.08), 0px 4px 4px 0 rgba(0,0,0,0.08);
  }
  .m-book-list>li a.pic img {
    width: 100%;
  }
  .m-book-list>li a.info h4 {
    font-size: 14px;
    height: 36px;
    line-height: 18px;
    max-height: 36px;
    margin: 10px 0 5px;
    overflow: hidden;
    font-weight: normal;
    color: #6c6358;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .m-book-list>li:last-child, .m-book-list>li.ll {
    margin-right: 0;
  }

  .m-free-list li {
    margin-bottom: 20px;
  }
  .m-free-list li a img {
    float: left;
    width: 75px;
    height: 105px;
    margin-right: 10px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,0.09), 0px 4px 4px 0 rgba(0,0,0,0.03);
  }
  .m-free-list li h3 {
    font-weight: normal;
    font-size: 16px;
    color: #6c6358;
    height: 17px;
    line-height: 17px;
    overflow: hidden;
    margin-bottom: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .m-free-list li p:nth-of-type(1) {
    font-size: 12px;
    color: #aba59a;
    line-height: 13px;
    height: 13px;
    margin-bottom: 25px;
  }
  .m-free-list li p:nth-of-type(2) {
    font-size: 14px;
    line-height: 20px;
    height: 40px;
    color: #807a73;
    overflow: hidden;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  .m-book-single {
    margin-bottom: 15px;
  }
  .m-book-single>a img {
    float: left;
    width: 75px;
    height: 105px;
    margin-right: 10px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,0.09), 0px 4px 4px 0 rgba(0,0,0,0.03);
  }
  .m-book-single>a h3 {
    font-weight: normal;
    font-size: 16px;
    color: #6c6358;
    height: 17px;
    line-height: 17px;
    overflow: hidden;
    margin-bottom: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .m-book-single>a p:nth-of-type(1) {
    font-size: 12px;
    color: #aba59a;
    line-height: 13px;
    height: 13px;
    margin-bottom: 25px;
  }
  .m-book-single>a p:nth-of-type(2) {
    font-size: 14px;
    line-height: 20px;
    height: 40px;
    color: #807a73;
    overflow: hidden;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  .m-book-item>ul>li:first-child {
    border-top: #ededed solid 1px;
  }
  .m-book-item>ul>li:last-child {
    border-bottom: none;
  }
  .m-book-item>ul>li {
    padding: 15px 0;
    border-bottom: #ededed solid 1px;
  }
  .m-book-item>ul>li h4 {
    font-size: 16px;
    height: 17px;
    line-height: 17px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #6c6358;
    font-weight: normal;
  }
  .m-book-item>ul>li p {
    font-size: 13px;
    height: 14px;
    line-height: 14px;
    color: #807a73;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 12px;
    margin-bottom: 2px;
  }

  .f-fl {
    float: left;
  }
  .f-cb, .f-cbli li {
    zoom: 1;
  }
  .f-cb:after, .f-cbli li:after {
    display: block;
    clear: both;
    visibility: hidden;
    height: 0;
    overflow: hidden;
    content: ".";
  }
</style>
