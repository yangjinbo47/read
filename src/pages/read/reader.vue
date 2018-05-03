<template>
  <div>
    <div class="body">
      <div class="loading-mask" id="init_loading">
        <div class="loading-icon"></div>
      </div>
      <!--<div class="container" id="root">-->
      <div id="root">
        <div id="fiction_chapter_title"></div>
        <div class="m-artical-action">
          <div class="artical-action-mid" id="action_mid" v-on:click="showHeadFooter"></div>
        </div>
        <div id="fiction_container" class="m-read-content" v-html="chapterInfo.chaptercontent"></div>
        <div class="top-nav" id="top-nav" style="display:none">
          <div class="top-nav-warp">
            <div class="icon-back" v-on:click="goToBookInfo"></div>
            <div class="nav-title" id="nav_title">
              {{Title}}
            </div>
          </div>
        </div>
        <div class="top-nav-pannel-bk font-container" style="display:none;"></div>
        <div class="top-nav-pannel font-container" style="display:none;">
          <div class="child-mod">
            <span>字号</span>
            <button id="large-font" class="spe-button" v-on:click="largeFont">
              大
            </button>
            <button id="small-font" class="spe-button" style="margin-left:10px;" v-on:click="smallFont">
              小
            </button>
          </div>
          <div class="child-mod" id="bk-container">
            <span>背景</span>
            <div v-for="item in colorArr" class="bk-container"
                 :id="item.id" :data-font="item.font" :data-bottomcolor="item.bottomcolor" :data-color="item.value" :style="item.style" v-on:click="changebg(item,$event)">
              <div class="bk-container-current" v-if="bkCurColor == item.value" style="display: block;"></div>
              <div class="bk-container-current" v-else="bkCurColor == item.value" style="display: none;"></div>
              <span>{{item.name}}</span>
            </div>
          </div>
        </div>
        <div class="m-button-bar" id="bottom_tool_bar" ref="bottom_tool_bar" style="display:none;padding-bottom:70px;">
          <ul class="u-tab" id="bottom_tool_bar_ul">
            <li id="prev_button" v-on:click="goToPreChapter">
              上一章
            </li>
            <li id="next_button" style="border-right:none" v-on:click="goToNextChapter">
              下一章
            </li>
          </ul>
        </div>

        <div class="bottom-nav-bk bottom_nav" style="display:none"></div>

        <div class="bottom-nav bottom_nav" style="display:none">
          <div class="item menu-button" id="menu_button">
            <div class="item-warp">
              <div class="icon-menu"></div>
              <div class="icon-text">
                目录
              </div>
            </div>
          </div>
          <div class="item" id="font-button" v-on:click="showFontMask">
            <div class="item-warp">
              <div class="icon-ft"></div>
              <div class="icon-text">
                字体
              </div>
            </div>
          </div>
          <div class="item" id="night-button" v-on:click="changeDayNight">
            <div class="item-warp" style="display:none" id="day_icon">
              <div class="icon-day"></div>
              <div class="icon-text">
                白天
              </div>
            </div>
            <div class="item-warp" id="night_icon">
              <div class="icon-night"></div>
              <div class="icon-text">
                夜间
              </div>
            </div>
          </div>
        </div>

        <div class="loading" id="loading" style="display:none">
          正在加载中...
        </div>
        <div class="m-tool-bar-mask" id="tool_bar_mask" style="display:none"></div>
        <ul class="menu-container chapter-list" id="menu_container" style="display:none"></ul>
        <div class="menu-mask" id="menu_mask" style="display:none"></div>
        <div class="mask" id="mask" style="display:none"></div>
      </div>
    </div>
    <div class="pay">
      <div class="buy_view_title">
        {{payTitle}}
      </div>
      <p v-if="chargeType == 1">本章价格：{{payPrice}}书币</p>
      <p v-else="chargeType == 2">本书价格：{{payPrice}}书币</p>
      <p>用户余额：{{currency}}书币</p>
      <button class="btn" v-on:click="pay(Book_id,Chapter_id)">购买</button>
    </div>
    <my-dialog v-show="showDialog" :dialog-option="dialogOption" @on-close="closeDialog('showDialog')"></my-dialog>
  </div>
</template>

<script>
  const STORAGE_KEY = 'fiction_reader_'
  import Dialog from '../../components/base/dialog'
  export default {
    components:{
      MyDialog : Dialog,
    },
    data () {
      return {
        openid : '',
        userId : '',
        Title : '',
        Book_id : '',
        Chapter_id : '',

        showDialog:false,
        dialogOption : {
          text : '',
          isShowCancelButton : false
        },

        payTitle : '',
        payPrice : 0,
        currency : 0,
        chargeType : 0,

        bkCurColor:'',
        NightMode:false,
        InitFontSize:18,

        chapterInfo:{
          pre_chapter_id:'',
          pre_chapter_name:'',
          next_chapter_id:'',
          next_chapter_name:'',
          price:'',
          chaptername:'',
          chaptercontent:''
        },
        colorArr : [{
          value : '#f7eee5',
          name : '米白',
          font : '',
          style:'background-color:#f7eee5'
        }, {
          value : '#e9dfc7',
          name : '纸张',
          font : '',
          id : "font_normal",
          style:'background-color:#e9dfc7'
        }, {
          value : '#a4a4a4',
          name : '浅灰',
          font : '',
          style:'background-color:#a4a4a4'
        }, {
          value : '#cdefce',
          name : '护眼',
          font : '',
          style:'background-color:#cdefce'
        }, {
          value : '#283548',
          name : '灰蓝',
          font : '#7685a2',
          bottomcolor : '#fff',
          style:'background-color:#283548'
        }, {
          value : '#0f1410',
          name : '夜间',
          font : '#4e534f',
          bottomcolor : 'rgba(255,255,255,0.7)',
          id : "font_night",
          style:'background-color:#0f1410'
        }]
      }
    },
    methods : {
//      fetch (key) {
//        return window.localStorage.getItem(STORAGE_KEY+key)
//      },
//      save : function (key,val) {
//        window.localStorage.setItem(STORAGE_KEY+key, val)
//      },

      initReader() {
        var me = this

        var bookId = this.$route.params.bookId
        var chapterId = this.$route.params.chapterId
        this.Book_id = bookId
        this.Chapter_id = chapterId

        let reqParams = {
          openid : me.openid,
          bookId: bookId,
          chapterId: chapterId
        }
        $.ajax({
          type : 'POST',
          url : '/api/order/orderInfo',
          data : reqParams,
          dataType : 'json',
          success : function (res) {
            if(res.result != 0){//订单不存在，无法阅读
              $('.body').hide()
              $('.pay').show()

              me.getPayInfo(bookId,chapterId)
            } else {//可读
              $('.body').show()
              $('.pay').hide()
              me.getChapterInfo(bookId,chapterId)

//              if (me.fetch(this.Book_id + 'last_chapter')) {
//                me.Chapter_id = me.fetch(this.Book_id + 'last_chapter');
//              }
            }
          }
        })
      },

      getChapterInfo (id_, cid_) {
        let me = this
        let reqParams = {
          book_id: id_,
          chapter_id: cid_
        }
        $.ajax({
          type : 'POST',
          url : '/api/content/chapterInfo/'+cid_,
          data : reqParams,
          dataType : 'json',
          success : function (res) {
            me.chapterInfo = res
            me.Title = res.chaptername;
            $('#init_loading').hide();

            me.GLOBAL.saveToLocalStorage(me.Book_id + 'last_chapter',cid_)//保存最近阅读章节

            var html = "<h4>" + res.chaptername + "</h4>";
            html += res.chaptercontent
            me.chapterInfo.chaptercontent = html//章节内容
            me.Dom.bottom_tool_bar.show();//显示上下章按钮
          }
        })
      },
      goToBookInfo() {
        var me = this
        var bookId = me.Book_id
        window.location.href = "#/bookInfo/"+me.Book_id
      },
      goToPreChapter() {
        var me = this
        var preChapterId = me.chapterInfo.pre_chapter_id
        if(preChapterId) {
          window.location.href = "#/reader/" + me.Book_id + "/" + preChapterId
        }
      },
      goToNextChapter() {
        var me = this
        var nextChapterId = me.chapterInfo.next_chapter_id
        if(nextChapterId){
          window.location.href = "#/reader/"+me.Book_id+"/"+nextChapterId
        }
      },
      initSetting () {
        var me = this
        var RootContainer = $('#fiction_container');

//        var tool_bar = me.fetch('toolbar_background_color');
//        var bottomcolor = me.fetch('bottom_color');
//        var color = me.fetch('background_color');
//        var font = me.fetch('font_color');
//        var bkCurColor = me.fetch('background_color');
//        var fontColor = me.fetch('font_color');
        var tool_bar = me.GLOBAL.fetchFromLocalStorage('toolbar_background_color')
        var bottomcolor = me.GLOBAL.fetchFromLocalStorage('bottom_color');
        var color = me.GLOBAL.fetchFromLocalStorage('background_color');
        var font = me.GLOBAL.fetchFromLocalStorage('font_color');
        var bkCurColor = me.GLOBAL.fetchFromLocalStorage('background_color');
        var fontColor = me.GLOBAL.fetchFromLocalStorage('font_color');

        me.bkCurColor = bkCurColor
        if (bottomcolor) {
          $('#bottom_tool_bar_ul').find('li').css('color', bottomcolor);
        }
        if (color) {
          $('.body').css('background-color', color);
        }
        if (font) {
          $('.m-read-content').css('color', font);
        }
        //夜间模式
        if (fontColor == '#4e534f') {
          me.NightMode = true;
          $('#day_icon').show();
          $('#night_icon').hide();
          $('#bottom_tool_bar_ul').css('opacity', '0.6');
        }

        //字体设置信息
//        var InitFontSize = me.fetch('font_size');
        var InitFontSize = me.GLOBAL.fetchFromLocalStorage('font_size')
        InitFontSize = parseInt(InitFontSize);
        if (InitFontSize) {
          me.InitFontSize = InitFontSize;
        }
        RootContainer.css('font-size', me.InitFontSize);
      },
      //显示头部底部导航条
      showHeadFooter () {
        var Dom = this.Dom
        if (Dom.top_nav.css('display') == 'none') {
          Dom.bottom_nav.show();
          Dom.top_nav.show();
        } else {
          Dom.bottom_nav.hide();
          Dom.top_nav.hide();
          Dom.font_container.hide();
          Dom.font_button.removeClass('current');
        }
      },
      //背景更换按钮
      changebg(item,event) {
        var Dom = this.Dom
        var color = item.value
        var font = item.font
        var bottomcolor = item.bottomcolor
        var tool_bar = font;
        Dom.bk_container.find('.bk-container-current').hide();
        var el = event.currentTarget
        var cur = el.querySelectorAll('.bk-container-current')
        el.querySelectorAll('.bk-container-current')[0].style.cssText = 'display:block'
        if (!font) {
          font = '#000';
        }
        if (!tool_bar) {
          tool_bar = '#fbfcfc';
        }
        if (bottomcolor && bottomcolor != "undefined") {
          $('#bottom_tool_bar_ul').find('li').css('color', bottomcolor);
        } else {
          $('#bottom_tool_bar_ul').find('li').css('color', '#a9a9a9');
        }
        $('.body').css('background-color', color);
        $('.m-read-content').css('color', font);

//        this.save('toolbar_background_color', tool_bar);
//        this.save('bottom_color', bottomcolor);
//        this.save('background_color', color);
//        this.save('font_color', font);
        this.GLOBAL.saveToLocalStorage('toolbar_background_color', tool_bar);
        this.GLOBAL.saveToLocalStorage('bottom_color', bottomcolor);
        this.GLOBAL.saveToLocalStorage('background_color', color);
        this.GLOBAL.saveToLocalStorage('font_color', font);

//        var fontColor = this.fetch('font_color');
        var fontColor = this.GLOBAL.fetchFromLocalStorage('font_color');
        //夜间模式
        if (fontColor == '#4e534f') {
          this.NightMode = true;
          $('#day_icon').show();
          $('#night_icon').hide();
          $('#bottom_tool_bar_ul').css('opacity', '0.6');
        } else {
          this.NightMode = false;
          $('#day_icon').hide();
          $('#night_icon').show();
          $('#bottom_tool_bar_ul').css('opacity', '0.9');
        }
      },
      //白天夜间模式转化
      changeDayNight() {
        //夜间和白天模式的转化
        if (this.NightMode) {
          $('#day_icon').hide();
          $('#night_icon').show();
          $('#font_normal').trigger('click');
          this.NightMode = false;
        } else {
          $('#day_icon').show();
          $('#night_icon').hide();
          $('#font_night').trigger('click');
          this.NightMode = true;
        }
      },
      //显示字体设置窗口
      showFontMask() {
        var Dom = this.Dom
        if (Dom.font_container.css('display') == 'none') {
          Dom.font_container.show();
          Dom.font_button.addClass('current');
        } else {
          Dom.font_container.hide();
          Dom.font_button.removeClass('current');
        }
      },
      //大字号按钮
      largeFont() {
        var Dom = this.Dom
        var RootContainer = Dom.root_container
        var InitFontSize = this.InitFontSize
        if (InitFontSize >= 20) {
          return;
        }
        InitFontSize += 1;
//        this.save('font_size', InitFontSize);
        this.GLOBAL.saveToLocalStorage('font_size', InitFontSize)
        this.InitFontSize = InitFontSize;
        RootContainer.css('font-size', InitFontSize);
      },
      //小字号按钮
      smallFont() {
        var Dom = this.Dom
        var RootContainer = Dom.root_container
        var InitFontSize = this.InitFontSize
        if (InitFontSize <= 12) {
          return;
        }
        InitFontSize -= 1;
//        this.save('font_size', InitFontSize);
        this.GLOBAL.saveToLocalStorage('font_size', InitFontSize)
        this.InitFontSize = InitFontSize;
        RootContainer.css('font-size', InitFontSize);
      },
      getPayInfo(id_, cid_) {
        let me = this
        let reqParams = {
          openid: me.openid,
          bookId: id_,
          chapterId: cid_
        }
        $.ajax({
          type : 'POST',
          url : '/api/content/bookInfo/payInfo',
          data : reqParams,
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              me.userId = res.userId
              me.payTitle = res.payTitle
              me.payPrice = res.payPrice
              me.currency = res.currency
              me.chargeType = res.chargeType
            }
          }
        })
      },
      pay(book_id_,chapter_id_) {
        let me = this
        let reqParams = {
          userId: me.userId,
          bookId: book_id_,
          chapterId: chapter_id_
        }
        $.ajax({
          type : 'POST',
          url : '/api/order/pay',
          data : reqParams,
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              location.reload();
            }
          }
        })
      },
      closeDialog : function (attr) {
        window.location.href = "#/bookInfo/"+this.Book_id
      }
    },
    mounted () {
      var me = this

//      var bookId = me.$route.params.bookId
//      var chapterId = me.$route.params.chapterId
//      me.Book_id = bookId
//      me.Chapter_id = chapterId

      me.initReader()
      //初始化配置
      me.initSetting()

      var Dom = this.Dom = {
        root_container : $('#fiction_container'),
        bottom_tool_bar : $('#bottom_tool_bar'),
        nav_title : $('#nav_title'),
        bk_container : $('#bk-container'),
        bk_container_current : $('.bk-container-current'),
        night_button : $('#night-button'),
        next_button : $('#next_button'),
        prev_button : $('#prev_button'),
        back_button : $('#back_button'),
        top_nav : $('#top-nav'),
        bottom_nav : $('.bottom_nav'),
        font_container : $('.font-container'),
        font_button : $('#font-button'),
        menu_container : $('#menu_container')
      }

      //按钮的多态样式效果
      $('.spe-button').on('touchstart', function() {
        $(this).css('background', 'rgba(255,255,255,0.3)');
      }).on('touchmove', function() {
        $(this).css('background', 'none');
      }).on('touchend', function() {
        $(this).css('background', 'none');
      });

      var Win = $(window);
      //对屏幕的滚动监控
      Win.scroll(function() {
        Dom.top_nav.hide();
        Dom.bottom_nav.hide();
        Dom.font_container.hide();
        Dom.font_button.removeClass('current');
      });
    },
    created () {
      var me = this

      var openid = this.GLOBAL.fetchFromSessionStorage(this.GLOBAL.OPENID_KEY)
      if (openid == null) {
        openid = this.GLOBAL.getUrlParam('openid')
      }
      me.openid = openid
      if (me.openid == null || me.openid.length == 0) {
        me.showDialog = true
        me.dialogOption.text = '您还未登陆，请先登陆再收藏'
        return
      } else {
        me.openid = openid
      }
    },
    watch:{
      '$route':'initReader'
    }
  }
</script>

<style scoped>
  .m-read-content {
    font-size: 14px;
    color: #555;
    line-height: 31px;
    padding: 15px;
  }
  /*.m-read-content h4 {*/
    /*font-size: 20px;*/
    /*color: #736357;*/
    /*border-bottom: solid 1px #736357;*/
    /*margin: 0 0 1em 0;*/
    /*letter-spacing: 2px;*/
  /*}*/
  /*.m-read-content p {*/
    /*text-indent: 2em;*/
    /*margin: 0.5em 0;*/
    /*text-align: justify;*/
    /*letter-spacing: 0px;*/
    /*line-height: 24px;*/
  /*}*/
  .artical-action-top {
    position: fixed;
    top: 0px;
    height: 30%;
    width: 100%;
    z-index: 90;
  }
  .artical-action-mid {
    position: fixed;
    top: 30%;
    height: 40%;
    width: 100%;
    z-index: 10002;
  }
  .artical-action-bottom {
    position: fixed;
    bottom: 0px;
    height: 30%;
    width: 100%;
    z-index: 90;
  }
  .m-tool-bar {
    text-align: center;
    width: 100%;
    height: 40px;
    position: fixed;
    bottom: 0px;
    z-index: 10000;
  }
  .m-tool-bar-mask {
    text-align: center;
    width: 100%;
    height: 40px;
    position: fixed;
    bottom: 0px;
    z-index: 9999;
    background: #000;
    opacity: .9;
  }
  .menu-mask {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 9999;
    background: #000;
    opacity: .8;
    top: 0px
  }
  .m-tool-button {
    padding: 5px 15px;
    margin-top: 7px;
    border: 1px #fff solid;
    background: transparent;
    color: #fff
  }
  .top-nav {
    position: fixed;
    top: 0px;
    height: 50px;
    background: #000;
    width: 100%;
    opacity: 1;
    z-index: 10004
  }
  .top-nav-warp {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
  }
  .top-nav-pannel-bk {
    position: fixed;
    bottom: 70px;
    height: 135px;
    background: #000;
    width: 100%;
    color: #fff;
    opacity: 0.9;
    z-index: 10003
  }
  .top-nav-pannel {
    position: fixed;
    bottom: 70px;
    height: 135px;
    background: none;
    width: 100%;
    color: #fff;
    z-index: 10004
  }
  .top-nav-pannel button {
    background: none;
    border: 1px #8c8c8c solid;
    padding: 5px 40px;
    color: #fff;
    display: inline-block;
    border-radius: 16px;
  }
  .top-nav-pannel .bk-container {
    position: relative;
    height: 30px;
    width: 30px;
    background: #fff;
    border-radius: 15px;
    display: inline-block;
    vertical-align: -14px;
    margin-left: 10px;
  }
  .top-nav-pannel .bk-container-current {
    position: absolute;
    height: 32px;
    width: 32px;
    border-radius: 16px;
    display: inline-block;
    vertical-align: -14px;
    margin-left: 10px;
    border: 1px #ff7800 solid;
    top: -2px;
    left: -12px;
  }
  .top-nav-pannel .bk-container span {
    position: absolute;
    top: 32px;
    left: -8px;
    display: block;
    font-size: 12px;
    width: 40px;
  }
  .bottom-nav-bk {
    position: fixed;
    bottom: 0px;
    height: 70px;
    background: #000;
    width: 100%;
    opacity: .9;
    z-index: 10004
  }

  .bottom-nav {
    position: fixed;
    bottom: 0px;
    height: 70px;
    background: none;
    width: 100%;
    opacity: 1;
    z-index: 10004;
    margin: 0 auto;
    text-align: center
  }
  .bottom-nav .item {
    display: inline-block;
    width: 32%;
    color: #fff;
    text-align: center;
    margin: 0 auto;
  }

  .m-button-bar {
    text-align: center;
    font-size: 14px;
    padding: 5px;
    margin: 10px;
    max-width: 900px;
    margin: 0 auto;
    width: 70%
  }
  .m-button-bar button {
    background: none;
    border: 1px #000 solid;
    padding: 5px 10px;
  }
  .nav-title {
    position: absolute;
    top: 16px;
    left: 42px;
    color: #d5d5d6
  }
  .top-nav button {
    width: 65px;
    font-size: 12px;
    background: none;
    border: 1px #d5d5d6 solid;
    padding: 5px 10px;
    color: #d5d5d6;
    position: absolute;
    top: 11px;
    border-radius: 16px 0 0 16px;
    opacity: 0.9
  }

  .child-mod {
    padding: 5px 10px;
    margin-top: 15px
  }
  .child-mod span {
    display: inline-block;
    padding-right: 20px;
    padding-left: 10px;
  }
  .large-font p {
    font-size: 18px
  }
  .small-font p {
    font-size: 14px
  }
  .menu-container {
    height: 60%;
    position: fixed;
    bottom: 0px;
    width: 100%;
    overflow: scroll;
    background: #fff;
    display: block;
    z-index: 19999
  }
  .chapter-list {
    text-align: left;
  }
  .chapter-list li {
    padding: 15px;
  }
  .chapter-list li:nth-child(2n-1) {
    background-color: #ededed
  }
  .chapter-list li:nth-child(2n) {
    background-color: #e6e6e6
  }
  .chapter-list .free {
    float: right;
  }
  .free {
    color: #459c3a;
  }
  .loading {
    position: fixed;
    text-align: center;
    width: 100%;
    top: 40%;
    color: #fff;
    z-index: 199999
  }
  .u-tab {
    position: relative;
    height: 34px;
    margin: 10px auto;
    line-height: 34px;
    border-radius: 8px;
    border: 1px solid #858382;
    font-size: 13px;
    background: #000;
    opacity: 0.9;
  }
  .u-tab li {
    display: inline-block;
    width: 49%;
    font-size: 13px;
    border-right: 1px solid #858382;
    -webkit-box-sizing: border-box;
    text-align: center;
    color: #fff;
  }
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 12000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: .4;
    background: #000;
  }

  .buy-mask {
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0px;
    text-align: center;
    margin: 0 auto;
    display: none;
    z-index: 10001;
    background: #e9dfc7;
  }
  .icon-back {
    position: absolute;
    top: 14px;
    left: 10px;
    width: 23px;
    height: 23px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJGMkEyQkQxMjdBNDExRTU4NjA2QTJDMjFDQ0I0ODhEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJGMkEyQkQyMjdBNDExRTU4NjA2QTJDMjFDQ0I0ODhEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkYyQTJCQ0YyN0E0MTFFNTg2MDZBMkMyMUNDQjQ4OEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkYyQTJCRDAyN0E0MTFFNTg2MDZBMkMyMUNDQjQ4OEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Ia560AAAHWklEQVR42uyd7W9U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);
    background-size: contain;
  }
  .icon-text {
    position: absolute;
    top: 25px;
    font-size: 10px;
  }
  .icon-menu, .icon-ft, .icon-night, .icon-day {
    position: absolute;
    top: 3px;
    left: 2px;
    width: 18px;
    height: 13px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAAoCAYAAABerrI1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkNFN0E3M0IwMjc4NDExRTU5RkYxQjg1Rjk2QkEyNzBEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkNFN0E3M0IxMjc4NDExRTU5RkYxQjg1Rjk2QkEyNzBEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6N0M1ODVCRkYyNzg0MTFFNTlGRjFCODVGOTZCQTI3MEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6N0M1ODVDMDAyNzg0MTFFNTlGRjFCODVGOTZCQTI3MEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5uTX6PAAAA0UlEQVR42uyXsQrCMBRFX4p0V39Pv8FJcekHFJe6d+v3NY6CDvUFooQ0AcEllnPhlgz3QU6bBq6ZnvdaRC7qndqoB/VR/ZC5wuxGytLtvXejUJ0uDlGgVZ8Tg6lsaWod1Jh461a9TQyMBX6hWLaSBary5zBWn8kPf8DUr/Rx8hfEPth4kxkIs+tCL4rG/VOLPH5AAQUUUEABBRRQv0O54nf1tcL6dZ3Jh9mpMH/2TkmkJFISKYmURKCAAgoooIACCihKIiWRkkhJpCR+XxJfAgwA/ROhOlYvoWQAAAAASUVORK5CYII=);
    background-size: contain;
  }
  .icon-night, .icon-day, .icon-ft {
    left: 1px;
  }
  .icon-ft {
    width: 20px;
    height: 13px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAuCAYAAACViW+zAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBCRTkzQUQ3Mjc4NzExRTU5RkYxQjg1Rjk2QkEyNzBEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBCRTkzQUQ4Mjc4NzExRTU5RkYxQjg1Rjk2QkEyNzBEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0U3QTczQkEyNzg0MTFFNTlGRjFCODVGOTZCQTI3MEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEJFOTNBRDYyNzg3MTFFNTlGRjFCODVGOTZCQTI3MEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6/hjRDAAAFqklEQVR42uRaaWwVVRi9fTbYqoBoEGIVrDsBA6JRAY0VSkQUl7pQI8YQGjTRaNCgBtdoApho3aoRRJaIC25/VBTBCiqCuKX+QDFqFANRsRCtsRWr9XzxNBnu++6bO/fNe9i+k5y0c2fmzrwz3/22mbKuv9pNChgCLgLHgBvABnCr6Qkor1CHy1ISZjVYG9leC55V6sLsB/4ucynj7T1VmEwKU09VRBHUmx6MNIS5JuF4SQhzIniKY5+MjypVYa4OtKb/PfJxvn3B7eABOY4Rp3wo2FZKzndajCiG+68otaWkLaP23rKcQoWRDHekMj5DGZPjTisVYWYqY+vB5/g3qZPuFcIMYFJn4wnrr50EDujtwlwFVlpjreBL/P9lbkdRyfMKBcmn7gRfAbeAO8G/wS7yT3Ab+AHYBF4I7ptmuJbUfzN4vDXeCN4U2X4AvNE65gtwOG80rYc6ndcdFnD+DnAe+ChCdme+wpzJyjmKLgr1VWTsOAph11A14LoURBkKrgBPTWGu98CLIE5rPktJC73NliiG5vxOgUK3WN3GlEQRnAG+Zjo7+oQKMxCsU8YXOI7XnHAd5wnFQeAb4GBl37fgXeDp4CGS09Jiy+hPxMoud0RNSSduDV1Kt4DzrbEfecHdyvHyBKSLN8galxu4L1CYp5lxRyGO9WbwcbDT00/OtYVg2VKFJdWWxGIyjtxliUMUw/HFjhwoJBqOVMoLuca54COeonT7xDmMUHbtV5d0KU0Ej7TG/gEXxpy3kMdFIfPUBghzneLMJUS/HTCXiPOYMl6bVBgtc30T/C7mPNm/KgUnvA94iTX2Cy0lFO87rNJbmCpwiqdz9XXCUzivLyqZK21g4tadSObTU96q5FSHJxFmBj18FD8wOvhgJY/fowviKDhz9XXuBccy4kg/eWkKofo3a/tAX2HkBzQo44sSODs57illvEER3Ac7mdxtTEGY/UNrpXOi5hXzQ3NBE1LmnbyXasSTafHlocJoTvJVFmRJsI3n7a12xCD6tfnM0j8CJ4UWkUeA3yjinQ2+FXBzkxS/JKH8KI/o5oP+4LHgMWA177+a20O8ZymvKDMxa9yViK1Kue0xkwlXyLmy1M/jw6pO08RcFiPp/PeOmiRt5CorcvWEbgePDrzmbpYld7gsxiXMpeALRXSGl4Evei6XpWw0JcEf7CN9Bn4Ivs4H0pVUmDXghCIK0+xxvT70UeMd+yXx+5RhfDOrbXH68u5rV47SwFsYcWBfFrDJVKP0arRmlw2tKyj4GnwYfJY5TtKaSRUm4wihtigi1LspWcc6zme3AnKFbnGs1yo/ai4bV00BogyM8+xRVBi9ab3ApNer7XI0t7Qmezemm+zm9f3gbQmddhQnJBFGKtiDrTFZa8tS9inLlAJQrnux4/gJSu10T573MD6JMFqmuyKH8wrFLkfUc7Ujhlvbn1Cc4DTF6O/GVGFGgOMczaZCQFtO4xQTzzBM21acD+rjcqBMzNNqYQ+kEJB5P/eon6RssD8jGWb0z9t8cBj4oE9aLZDPNaZ5PtU0oTWxtM9LWqxtyZTPD7ievO9abbIb9JHeQUcmKsxUxVxlDS8vsDDLFV/R32R/2LhSOfdJ4/8VhfRdZoEfmz3fomoRbXBUGG0ZPWMK/yVUGxOzuOW0mGm9nYes531eQCvqXl7lrNrr2QuSNmajZYm/gjco1x7RnfkOdZT9o1lbFBqjGWW0pC56X9czw42DtCv7xvig7VyKP5vsL9gfQvY7Syymw2S/4thUJFEM65tNisO1I4+8EZjnkWj2ixFFLHQUH4b0ordY+6+En+knwvzElDoaCmeb4mK2JUQT78vGHPZeWhLOL3M/D55k/ntptyOy724l0WyMFpE1jO3NrEyLDVk6E1lIrvU4fgxFGkv/UsWSQnxHK5dhC/3QGqe/dHy1+a8AAwCKR08FSRIHxQAAAABJRU5ErkJggg==);
    background-size: contain;
  }

  .current .icon-ft {
    top: 2px;
    left: 0px;
    width: 22px;
    height: 15px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAAA0CAYAAAAg5t6HAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkNFN0E3M0I4Mjc4NDExRTU5RkYxQjg1Rjk2QkEyNzBEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkNFN0E3M0I5Mjc4NDExRTU5RkYxQjg1Rjk2QkEyNzBEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0U3QTczQjYyNzg0MTFFNTlGRjFCODVGOTZCQTI3MEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0U3QTczQjcyNzg0MTFFNTlGRjFCODVGOTZCQTI3MEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7nhaYNAAANmElEQVR42uxbC1RV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);
    background-size: contain;
  }

  .icon-day {
    width: 19px;
    height: 18px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA5CAYAAACMGIOFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkNFN0E3M0I0Mjc4NDExRTU5RkYxQjg1Rjk2QkEyNzBEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkNFN0E3M0I1Mjc4NDExRTU5RkYxQjg1Rjk2QkEyNzBEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0U3QTczQjIyNzg0MTFFNTlGRjFCODVGOTZCQTI3MEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0U3QTczQjMyNzg0MTFFNTlGRjFCODVGOTZCQTI3MEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6o6V5PAAADu0lEQVR42uyaTUgVURTHm/cigiS1LEitoHoqbgtcZAStngtDoYxa9rFsYYuWfUBhuSjCneiylkH2oavoEZlC4aYsM9toakWLnpsWyfQfOMJrOvdjZs6bedQc+OF7d9499/y9M/fj3HFc110Xo3WAYfp8BozG0agTs8hFsIM+L4H6f1GkvzEnjkYz6/4DS0WmIlORSlsq+bxcKSI3gkHwBlwSGA3PkrjPNE+GnhXAZYprkOLUjOmYQjT0un/aMHAMdcqNQ3GUWq+ujqknt/i+nwZDcc1vih4cojh0cQbqyQaw4P5tSfQo14OezYNGXV0b5zly5Le+mEX2KQTmTHVtl3U58BQ0lpQtgJ2Gei2gE7SDVrANVIMf4Bt4B56Dh+C9wdc80/4RMGteTNr/J/09+lhzW3WBCTeYTVA91WPwKGgPBrldS9kFBkA/qGOuN4FnbjTz6jczvuuoXa/93UHilnxmjoMVV8ZWyJ9IbFICz4FVV9ZWyW9FiDwGfmmCnQIXQBuoBxvobxuVT2nqen57khbpPYNFRYBzoNtiPnXod3MKP0VqJxGRjmaQGQXVAf1VUz3VYOQkIbJLEdADkA3pM0v1OetKQuQ4E8gHUBXxEfDqzzC+x+MW2aL4b+eFRuu8wn9LGH9hN82dTNlrMCa02xgjf347GmdmoJ0puyu8rbrHlB2MU2QrUzYuLLJg2a6VyA7KbLsMi3Tdb9sVuwRJ+2TZrjF+b+4pTd2rkk/1hky4Z+vBapkz7lzW3Ri/ze3KpTqKTNlmYYG1TNlKmJRJpiSDxpkqq/aVKdsrLHIPU/ZFkwFUxu/dYk8M3c3ZNNjnKzsEXgmKPKxo12/G+MOOri+YslPCPXnSst2yTSEjTNkBkBcSmCd/Nu1aDF/hl15cDmdGYO26SXrtGuUs5AZT1kQrn2xIn1la6TQx1/rDT0TR9pMFxUL6fogeraJ6nBWS2k+uZQZUyauPtOO38dNNv1cltZqTzvH0WOZ49oMaqlND321yPCfSbF2ad5UXufaMFiIKLER9BqOK9Ea4m2CZEk61mrOQyYDiJjUpzFpqb5nad8olkjsfvG6RC7oIRsBsSY62SN9H6Lopd3MtyvmorcCM4gD0dkxnk7eiHARHEWg84RWkUXPinZEQeSXsCa8wOYXQqxIi31aAQN3R/rTEAv1lqCNs3taSTqoEmclmqf2FIFlCm3cGvBeBzoOt4I7vraqgJvW+awPF9B0MgJ9RRZYz+5a+75qKTEWmIstuFfm+q7RJve8ayH4LMACaxEJEaXs23AAAAABJRU5ErkJggg==);
    background-size: contain;
  }

  .icon-night {
    left: 4px;
    width: 16px;
    height: 16px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU2OUYzRUEwMjc4NzExRTU5RkYxQjg1Rjk2QkEyNzBEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhBMzA2RjA2Mjc4QTExRTU5RkYxQjg1Rjk2QkEyNzBEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTY5RjNFOUUyNzg3MTFFNTlGRjFCODVGOTZCQTI3MEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTY5RjNFOUYyNzg3MTFFNTlGRjFCODVGOTZCQTI3MEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4v5YACAAAC/UlEQVR42tSaXYhNURTH97kzRnJ9ZTQzPh7IMEr5yshHEwkRkSeSjweEiMjDePTkhcKLPCApUV54GxTKcDM0JfL9QE0UGdcdEmb7L3edOq5zzz1nn332Pvdfv5e5Z9Zd666711577etIKYUGjQILwRwwDOwDfcKAamP873CwBawDrcABP8ACU87/FWUgIk3gKMjL/7VfwV4sojxcCw6AL9JfD0DGdABhv0KTwAUwO+CZvaBfGFaYAJaDyyAb8Mwt0CksKFPh9W3gWgXnSSeFJTkBZXQrOM3VJUi9oJErUGoysBKcCuE86YYt58sF0MILtiakjTvCojI+i/o876Zh9ThNARysUCr99NpmAN5FTAvxBRgS0QZlK5+GDLQrOC9sOu/NADVm70LU+9RmYJOi8yLigk8sgPUxbEy0HUATH0RUNdV2AG0hd9xyarMdwNyYNhaDOpsBTI5pYwRYYTMAHYtwh80ARmqws1ShBdEWwGAdGyI4HrMYKAegawFSMdhlo5XIK/ZAfvoO5oFukxn4oNHeID5DjzUZwCvNNsn5DjDOVADPErA7BdwF0xP2v4YCyCVknDJwjxe2k8AHT4O0VTSeawD9Mll1glZN48T5IMc+N7p/7JJm1AFWg4ERna4Da8F1j62cdzZKY5RZBtbcEuYzuAlugyfgOSjwyS7LJ8QJYJoojuuX+RycLnqPlPXgLZfBalCB11iveyL7CM6K6tEZURxp/jNWGc2pzFbBp98M3peOVXrA4Sr49I+4zpdmgDSA94UZKXX+ITeNP8sFIDg9XWBoypyni0O6THzqN1bx6iXYCH6nyHnyZXOp8+UCIF0Fe1LiPH1FdoMr/q8G74DbwS9pT/TeO+Nes64JuFpNUl+5fdByT9wMHhl0vhu06L7opobqEPiWoON9oJ0v1bXf1LuMAcdAQbPjJ6g9juqPE+PXKvVcbjeAmQqHFsmb5iVwzu1tVKYSOkpdA1jEU246To4XxZ/gZLlUU5v8CbzhI+x9bqV74r7xHwEGAPDRVwnecW5KAAAAAElFTkSuQmCC);
    background-size: contain;
  }

  .item-warp {
    width: 26px;
    margin: 0 auto;
    position: relative;
  }
  .loading-icon {
    margin: 0 auto;
    margin-top: 50%;
    background: url(data:image/gif;base64,R0lGODlhGAAYAIAAAK2trTE6QiH/C05FVFNDQVBFMi4wAwEAAAAh+QQFDwABACwDAAkAEgAGAAACFIQReah7GRZ0r5lJWayb4ms5n7YUACH5BAkPAAEALAIABwATAAoAAAIbhB+pq4cMwwMR0lbZTTvL1WVdWI1e45BRqkIFACH5BAkPAAEALAMABwASAAoAAAIdjA+px63r4EtmylktyI/jYHkd+GkbOY5M2LQsUwAAIfkECQ8AAQAsAwAIABMACAAAAhqMjwfLrWyaBG/FCa8NOPPcbd8WUpo5Jeq5FAA7);
    width: 20px;
    height: 20px;
  }
  .loading-mask {
    text-align: center;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.1;
    position: fixed;
    top: 0px;
  }

  .buy-container {
    width: 100%;
    position: fixed;
    top: 20%;
    text-align: center;
    margin: 0 auto;
    display: none;
    z-index: 10003
  }
  .buy-container h3 {
    font-weight: normal;
    line-height: 30px;
    font-family: microsoft yahei, arial, helvetica, sans-serif
  }
  .buy-container h2 {
    padding-bottom: 80px;
  }

  .buy-container button {
    font-family: microsoft yahei, arial, helvetica, sans-serif;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    border: none;
    color: #fff;
    padding: 0 10px;
    width: 160px;
    background: #4a90b1;
    margin-top: 10px;
  }

  .m-read-content {
    min-height: 300px;
    max-width: 900px;
    margin: 0 auto;
  }

  .pay {
    width: 100%;
    margin-top: -80px;
    position: absolute;
    top: 50%;
    text-align: center;
  }

  .buy_view_title {
    font-size: 22px;
    margin-bottom: 20px;
  }

  .btn {
    width: 50%;
    padding: 5px 0;
    font-size: 16px;
    background-color: #339ee2;
    border-radius: 5px;
    color: #fff;
    margin-top: 50px;
  }
</style>
