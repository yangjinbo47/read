<template>
  <div class="container">
    <div class="header">
      个人中心
    </div>

    <div class="center-header">
      <img :src="user.headImg" class="center-header-img"/>
      <p class="center-header-p">
        {{user.nickName}}
      </p>
    </div>

    <nav class="module">
      <ul class="center-nav-ol">
        <li class="book-li">
          <a href="#" class="book-layout">
            <h3 class="book-title"><i class="icon-center-mobile"></i>绑定手机号</h3>
            <span class="book-author">
              <svg class="icon">
                  <svg viewBox="0 0 7 12" width="100%" height="100%"><path d="M6.146 6.354v-.708l-5.5 5.5a.5.5 0 0 0 .708.708l5.5-5.5a.5.5 0 0 0 0-.708l-5.5-5.5a.5.5 0 1 0-.708.708l5.5 5.5z"></path></svg>
              </svg>
            </span>
          </a>
        </li>
        <li class="book-li">
          <a v-on:click="goToRecharge" class="book-layout">
            <h3 class="book-title"><i class="icon-center-wallet"></i>充值</h3>
            <span class="book-author">
              <svg class="icon">
                  <svg viewBox="0 0 7 12" width="100%" height="100%"><path d="M6.146 6.354v-.708l-5.5 5.5a.5.5 0 0 0 .708.708l5.5-5.5a.5.5 0 0 0 0-.708l-5.5-5.5a.5.5 0 1 0-.708.708l5.5 5.5z"></path></svg>
              </svg>
            </span>
          </a>
        </li>
      </ul>
    </nav>

    <nav class="module">
      <ul class="center-nav-ol">
        <li class="book-li">
          <a href="#" class="book-layout">
            <h3 class="book-title"><i class="icon-center-user"></i>用户中心</h3>
            <span class="book-author">
              <svg class="icon">
                  <svg viewBox="0 0 7 12" width="100%" height="100%"><path d="M6.146 6.354v-.708l-5.5 5.5a.5.5 0 0 0 .708.708l5.5-5.5a.5.5 0 0 0 0-.708l-5.5-5.5a.5.5 0 1 0-.708.708l5.5 5.5z"></path></svg>
              </svg>
            </span>
          </a>
        </li>

        <li class="book-li">
          <a href="#" class="book-layout">
            <h3 class="book-title"><i class="icon-center-message"></i>消息中心</h3>
            <span class="book-author">
              <svg class="icon">
                  <svg viewBox="0 0 7 12" width="100%" height="100%"><path d="M6.146 6.354v-.708l-5.5 5.5a.5.5 0 0 0 .708.708l5.5-5.5a.5.5 0 0 0 0-.708l-5.5-5.5a.5.5 0 1 0-.708.708l5.5 5.5z"></path></svg>
              </svg>
            </span>
          </a>
        </li>

        <li class="book-li">
          <a href="#/bookshelf/favorite" class="book-layout">
            <h3 class="book-title"><i class="icon-center-history"></i>我的收藏</h3>
            <span class="book-author">
              <svg class="icon">
                  <svg viewBox="0 0 7 12" width="100%" height="100%"><path d="M6.146 6.354v-.708l-5.5 5.5a.5.5 0 0 0 .708.708l5.5-5.5a.5.5 0 0 0 0-.708l-5.5-5.5a.5.5 0 1 0-.708.708l5.5 5.5z"></path></svg>
              </svg>
            </span>
          </a>
        </li>

        <li class="book-li">
          <a href="#/bookshelf/history" class="book-layout">
            <h3 class="book-title"><i class="icon-center-history"></i>最近阅读</h3>
            <span class="book-author">
              <svg class="icon">
                  <svg viewBox="0 0 7 12" width="100%" height="100%"><path d="M6.146 6.354v-.708l-5.5 5.5a.5.5 0 0 0 .708.708l5.5-5.5a.5.5 0 0 0 0-.708l-5.5-5.5a.5.5 0 1 0-.708.708l5.5 5.5z"></path></svg>
              </svg>
            </span>
          </a>
        </li>

        <li class="book-li">
          <a href="#/bookshelf/orderList" class="book-layout">
            <h3 class="book-title"><i class="icon-center-history"></i>我的订购</h3>
            <span class="book-author">
              <svg class="icon">
                  <svg viewBox="0 0 7 12" width="100%" height="100%"><path d="M6.146 6.354v-.708l-5.5 5.5a.5.5 0 0 0 .708.708l5.5-5.5a.5.5 0 0 0 0-.708l-5.5-5.5a.5.5 0 1 0-.708.708l5.5 5.5z"></path></svg>
              </svg>
            </span>
          </a>
        </li>
      </ul>
    </nav>

    <my-dialog v-show="showDialog" :dialog-option="dialogOption" @on-close="closeDialog('showDialog')"></my-dialog>
  </div>

</template>

<script>
  import Dialog from '../components/base/dialog'
  export default {
    components:{
      MyDialog : Dialog,
    },
    data () {
      return {
        openid:'',
        user : {},
        showDialog:false,
        dialogOption : {
          text : '',
          isShowCancelButton : false
        }
      }
    },
    methods : {
      getUserInfo () {
        var me = this
        var openid = me.GLOBAL.fetchFromSessionStorage(this.GLOBAL.OPENID_KEY)
        $.ajax({
          type : 'GET',
          url : '/api/user/userinfo',
          data : {
            openid : openid
          },
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              me.user = res.user
            }
          }
        })
      },
      goToRecharge() {
        var me = this
        if (me.openid == null || me.openid.length == 0) {
          me.showDialog = true
          me.dialogOption.text = '您还未登陆，请先登陆再收藏'
          return
        }
        window.location.href = "#/recharge"
      },
      closeDialog : function (attr) {
        this[attr] = false
      }
    },
    created () {
      var me = this
      var openid = this.GLOBAL.fetchFromSessionStorage(this.GLOBAL.OPENID_KEY)
      if (openid == null) {
        openid = this.GLOBAL.getUrlParam('openid')
      }
      me.openid = openid
    },
    mounted () {
      var me = this
      me.getUserInfo()
    }
  }
</script>

<style scoped>
  ul, menu, dir {
    display: block;
    list-style-type: disc;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    -webkit-padding-start: 40px;
  }
  blockquote, body, dd, dl, figure, form, h1, h2, h3, h4, h5, h6, ol, p, ul {
    margin: 0;
  }
  ol, ul {
    padding: 0;
    list-style: none;
  }
  li {
    display: list-item;
    text-align: -webkit-match-parent;
  }


  .center-header {
    font-size: .875rem;
    overflow: hidden;
    min-height: 9rem;
    margin-top: -2rem;
    text-align: center;
    color: #fff;
    background: #ff3955 url('../assets/images/center-header-bg.jpg') no-repeat center;
    background-size: cover;
  }
  .center-header-img {
    width: 3.5rem;
    height: 3.5rem;
    margin-top: 3rem;
    vertical-align: bottom;
    border: 1px solid rgba(255,255,255,.4);
    border-radius: 4rem;
  }
  .center-header-p {
    margin: .25rem 0 .125rem;
  }

  .module {
    margin: .75rem 0;
    background-color: #fff;
  }

  .center-nav-ol {
    line-height: 1.25rem;
  }
  .center-nav-ol .book-title {
    font-size: .875rem;
    float: left;
  }
  .center-nav-ol .book-title>i {
    margin-right: .75rem;
    vertical-align: -.35ex;
  }
  .center-nav-ol .book-author {
    float: right;
  }

  .book-li::after {
    display: block;
    margin-top: -1px;
    margin-left: 1rem;
    content: '';
    -webkit-transition: margin-left .15s;
    transition: margin-left .15s;
    border-bottom: 1px solid #f0f1f2;
  }

  .book-layout {
    position: relative;
    display: block;
    overflow: hidden;
    padding: 1rem;
    -webkit-transition: padding-left .15s;
    transition: padding-left .15s;
  }

  .book-title {
    line-height: 1.4;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  i[class*=icon-] {
    display: inline-block;
  }

  .icon-center-mobile {
    background-image: url('../assets/images/sprite.png');
    background-repeat: no-repeat;
    background-position: -20px -158px;
    width: 16px;
    height: 16px;
  }
  .icon-center-wallet {
    background-image: url('../assets/images/sprite.png');
    background-repeat: no-repeat;
    background-position: -60px -158px;
    width: 16px;
    height: 16px;
  }
  .icon-center-user {
    background-image: url('../assets/images/sprite.png');
    background-repeat: no-repeat;
    background-position: -150px -55px;
    width: 18px;
    height: 18px;
  }
  .icon-center-vip {
    background-image: url('../assets/images/sprite.png');
    background-repeat: no-repeat;
    background-position: -20px -138px;
    width: 16px;
    height: 16px;
  }
  .icon-center-message {
    background-image: url('../assets/images/sprite.png');
    background-repeat: no-repeat;
    background-position: -40px -138px;
    width: 16px;
    height: 16px;
  }
  .icon-center-history {
    background-image: url('../assets/images/sprite.png');
    background-repeat: no-repeat;
    background-position: -40px -158px;
    width: 16px;
    height: 16px;
  }

  .book-author {
    font-size: .8125rem;
    display: block;
    overflow: hidden;
    max-width: 10em;
    max-width: calc(100vw - 2rem - (176rem / 16));
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #969ba3;
  }

  .icon>svg, svg.icon {
    width: 1em;
    height: 1em;
    vertical-align: -.25ex;
    fill: currentColor;
  }
  svg:not(:root), symbol, image, marker, pattern, foreignObject {
    overflow: hidden;
  }
  html|* > svg {
    transform-origin: 50% 50% 0px;
  }
</style>
