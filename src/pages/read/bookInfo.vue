<template>
  <div class="container">
    <div class="header">
      <a class="head-icon back" v-on:click="$router.back()"></a>
      书籍详情
    </div>

    <section class="m-book-info">
      <div class="info">
        <div class="img">
          <img :src="bookInfo.coverView">
        </div>
        <h1>{{bookInfo.name}}</h1>
        <p>作者:{{bookInfo.authorsName}}</p>
        <p v-if="bookInfo.finish == 0">分类:{{bookInfo.categoryName}} | 连载中</p>
        <p v-else>分类:{{bookInfo.categoryName}} | 已完结</p>
        <p>字数:{{bookInfo.words}}</p>
        <p>点击:{{bookInfo.clickNum}}</p>
      </div>

      <div class="j-actions">
        <div class="btns">
          <!--<a href="#/reader" class="ui-blue two">立即阅读</a>-->
          <!--<a class="ui-blue-light two" v-on:click="addFav(bookInfo.bookId)" ref="fav">{{favText}}</a>-->
          <a :class="readHis ? 'ui-blue two' : 'ui-blue-light two'" v-on:click="continueRead" ref="read">{{readHisText}}</a>
          <a :class="favorite ? 'ui-blue two' : 'ui-blue-light two'" v-on:click="addFav" ref="fav">{{favText}}</a>
        </div>
      </div>
    </section>

    <div class="description">
      <div class="shortDesc" ref="shortDesc">
      简介：{{bookInfo.description}}
      </div>
      <p class="showmore" ref="showmore" v-on:click="showDesc">展开<i class="j-more"></i></p>
    </div>

    <div class="column-container">
      <div class="title-bar">
        <div class="title">目录</div>
      </div>
      <div class="chapter-list-container">
        <ul class="chapter-list-ul">
          <li class="latest" v-on:click="goToReader(lastChapter.id)">最新章节：{{lastChapter.chapterName}}</li>
          <li v-for="item in chapterList" :class="{free:item.isFree}" v-on:click="goToReader(item.id)">
            {{item.chapterName}}
          </li>
        </ul>
        <a :href='goToChapterList' class="more">更多章节</a>
      </div>
    </div>

    <div class="m-list-box">
      <h3 class="f-cb">
        <div class="f-fl">
          <em class="sep"></em>
          <span class="gradient">猜你喜欢</span>
        </div>
      </h3>
      <ul class="m-book-list f-cb">
        <li v-for="item in guess">
          <router-link :to="'/bookInfo/' + item.id" class="pic"><img :src="item.coverView"/></router-link>
          <router-link :to="'/bookInfo/' + item.id" class="info"><h4>{{item.name}}</h4></router-link>
        </li>
      </ul>
    </div>

    <my-dialog v-show="showDialog" :dialog-option="dialogOption" @on-close="closeDialog('showDialog')"></my-dialog>
  </div>
</template>

<script>
  import Dialog from '../../components/base/dialog'
  export default {
    components:{
      MyDialog : Dialog,
    },
    data () {
      return {
        openid : '',
        showDialog:false,
        bookId:'',
        categoryId:'',
        firstChapterId:'',
        favorite:false,//是否收藏
        favText:'加入收藏',
        readHis:false,//阅读记录
        readHisText:'立即阅读',
        bookInfo : {},
        chapterList : [],
        lastChapter : {},
        guess:[],
        dialogOption : {
          text : '',
          isShowCancelButton : false
        }
      }
    },
    computed : {
      goToChapterList () {
        return '#/chapterList/'+this.bookId
      }
    },
    methods : {
      loadData() {
        var me = this
        var bookId = this.$route.params.id
        if(bookId){
          me.bookId = bookId
          me.getBookInfo(bookId)
          me.getChapterList(bookId)
          me.getLastChapter(bookId)
        }
      },
      getBookInfo (id) {
        let me = this
//        let reqParams = {
//          bookId: id
//        }
        $.ajax({
          type : 'GET',
          url : '/api/content/bookInfo/'+id,
//          data : reqParams,
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              me.bookInfo = res.bookInfo
              me.categoryId = res.bookInfo.categoryId
              me.getGuess(me.categoryId)
            }
          }
        })
      },
      getChapterList (id) {
        let me = this
        let reqParams = {
          bookId: id,
          page:1,
          pageSize:5
        }
        $.ajax({
          type : 'POST',
          url : '/api/content/chapterInfo/list',
          data : reqParams,
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              me.chapterList = res.list
              //取第一章id
              var chapterListJson = eval(me.chapterList)
              if (chapterListJson.length > 0){
                me.firstChapterId = chapterListJson[0].id
              }
            }
          }
        })
      },
      getLastChapter (id) {
        let me = this
        $.ajax({
          type : 'POST',
          url : '/api/content/chapterInfo/lastChapter/'+id,
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              me.lastChapter = res.chapter
            }
          }
        })
      },
      showDesc () {
        this.$refs.shortDesc.setAttribute("style","display:block")
        this.$refs.showmore.remove()
      },
      goToReader(cid) {
        var me = this
        if (me.openid == null || me.openid.length == 0) {
          me.showDialog = true
          me.dialogOption.text = '您还未登陆，请先登陆再收藏'
          return
        }
        window.location.href = "#/reader/"+this.bookId+"/"+cid
      },
      getGuess (category_id) {
        let me = this
        $.ajax({
          type : 'GET',
          url : '/api/content/bookInfo/guess/'+category_id,
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              me.guess = res.list
            }
          }
        })
      },
      addFav() {
        var me = this
        if (me.openid == null || me.openid.length == 0) {
          me.showDialog = true
          me.dialogOption.text = '您还未登陆，请先登陆再收藏'
          return
        }
        let reqParams = {
          openid:me.openid,
          bookId: me.bookId
        }
        var url = me.favorite ? '/api/userfavorite/cancel' : '/api/userfavorite/add';
        $.ajax({
          type : 'POST',
          url : url,
          data : reqParams,
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              me.favorite = !me.favorite
              if (me.favorite) {
                me.favText = '取消收藏'
              } else {
                me.favText = '加入收藏'
              }
            } else {
              me.showDialog = true
              me.dialogOption.text = res.msg
              return
            }
          }
        })
      },
      checkFav (id) {
        var me = this
        //favorite需要ajax从服务器取
        let reqParams = {
          openid:me.openid,
          bookId: id
        }
        $.ajax({
          type : 'POST',
          url : '/api/userfavorite/check',
          data : reqParams,
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              me.favorite = res.check
              if (me.favorite) {
                me.favText = '取消收藏'
              } else {
                me.favText = '加入收藏'
              }
            }
          }
        })
      },
      checkHis(id) {
        var me = this
        if (me.GLOBAL.fetchFromLocalStorage(id + 'last_chapter')) {//有阅读记录
          me.readHis = true
          me.readHisText = '继续阅读'
        }
      },
      continueRead(){
        var me = this
        var chapterId = me.GLOBAL.fetchFromLocalStorage(me.bookId + 'last_chapter')
        if (chapterId) {//有阅读记录
          window.location.href = "#/reader/"+me.bookId+"/"+chapterId
        } else {
          chapterId = me.firstChapterId
          window.location.href = "#/reader/"+me.bookId+"/"+chapterId
        }
      },
      closeDialog : function (attr) {
        this[attr] = false
      }
    },
    created () {
      var me = this
      var bookId = this.$route.params.id
      var openid = this.GLOBAL.fetchFromSessionStorage(this.GLOBAL.OPENID_KEY)
      if (openid == null) {
        openid = this.GLOBAL.getUrlParam('openid')
      }
      me.openid = openid
      me.checkFav(bookId)
      me.checkHis(bookId)
    },
    mounted () {
      var me = this
      me.loadData()
    },
    watch:{
      '$route':'loadData'
    }
  }
</script>

<style scoped>
  .ui-blue, .ui-green, .ui-grey, .ui-default, .ui-red, .ui-white, .ui-blue-light, .ui-disabled {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    display: inline-block;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    vertical-align: middle;
    border-radius: 3px;
  }
  .ui-blue {
    background-color: #3C98C9;
    border: #3C98C9 solid 1px;
    color: #fff;
  }
  .ui-blue-light {
    background-color: #FFF;
    border: #3B98C9 solid 1px;
    color: #3B98C9;
  }

  .m-book-info {
    padding: 15px;
    background: #FFF;
    color: #888;
  }
  .m-book-info .img {
    float: left;
    position: relative;
    margin-right: 10px;
    line-height: 0;
  }
  .m-book-info .img img {
    width: 93px;
    height: 130px;
  }
  .m-book-info h1 {
    font-size: 16px;
    margin-bottom: 5px;
    color: #1D2C33;
    height: 1.14em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .m-book-info p {
    line-height: 1.8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .m-book-info .info:after {
    content: " ";
    display: table;
    clear: both;
    height: 0;
  }

  .m-book-info .btns {
    clear: both;
    padding-top: 15px;
    position: relative;
  }
  .m-book-info .btns a.two:first-child {
    float: left;
  }
  .m-book-info .btns a.two:last-child {
    float: right;
  }
  .m-book-info .btns a.two {
    width: 47%;
  }
  .m-book-info .btns a {
    width: 100%;
    border-width: 1px;
  }
  .m-book-info .btns:after {
    content: " ";
    display: table;
    clear: both;
    height: 0;
  }

  .description {
    margin-top: 0;
    position: relative;
    padding-bottom: 8px;
    padding-left: 4.2%;
    padding-right: 4.2%;
    background: #fff;
  }
  .shortDesc {
    font-size: 14px;
    padding-top: 11px;
    padding-bottom: 5px;
    line-height: 26px;
    overflow: hidden;
    color: #a3a3a3;
    -webkit-line-clamp: 4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .description .showmore {
    position: relative;
    margin-top: 10px;
    font-size: 14px;
    color: #3998C9;
    padding-right: 11px;
    text-align: right;
  }
  .description .showmore i {
    position: absolute;
    top: 7px;
    right: 0;
    width: 9px;
    height: 6px;
    background: url(../../assets/images/arrow-down.png) 0 0 no-repeat;
    background-size: 100% 100%;
  }

  .column-container {
    font-size: 14px;
    margin-bottom: 8px;
    background-color: #fff;
    padding: 5px;
  }
  .title-bar {
    padding: 5px;
    background-color: #fff;
    z-index: 99;
    margin: -5px;
    margin-bottom: 5px;
  }
  .title{
    border-left: 4px solid #5396d5;
    font-size: 16px;
    height: 31px;
    line-height: 31px;
    padding: 0 5px;
    background-color: #fff;
  }

  .chapter-list-container {
    background-color: #fff;
    overflow: hidden;
    height: 100%;
  }
  .chapter-list-ul {
    overflow: hidden;
    display: block;
    font-size: 16px;
    color: #333;
    padding-bottom: 10px;
  }
  .chapter-list-ul li {
    padding: 10px 2px;
    border-bottom: 1px solid #eee;
  }
  li.latest {
    padding: 0 10px;
    background-color: #f0eeed;
    font-size: 14px;
    color: #df230a;
    text-align: center;
    line-height: 30px;
    border-radius: 4px;
    border: 1px solid #d8d8d8;
  }
  li.free:after {
    content: "\514D\8D39";
    float: right;
    background: #ed424b;
    color: #fff;
    font-size: 10px;
    border-radius: 2px;
  }
  .chapter-list-container .more {
    display: block;
    margin-top: 14px;
    height: 29px;
    line-height: 27px;
    background-color: #faf7f5;
    color: #998D7F;
    text-align: center;
    border: 1px solid #E4E0DD;
    border-radius: 3px;
  }

</style>
