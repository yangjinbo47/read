<template>
  <div class="container">
    <div class="header">
      <a class="head-icon back" v-on:click="$router.back()"></a>
      目录
    </div>

    <div class="tbar padLR">
      <div class="bar-text">目录</div>
      <a title class="px" v-on:click="sort" v-text="order==true?'倒序':'顺序'"></a>
    </div>

    <scroller :on-infinite="infinite" :on-refresh="refresh" ref="myscroller">
      <div class="chapter-list-container">
        <ul class="chapter-list-ul">
          <li v-for="item in chapterList" :class="{free:item.isFree}" v-on:click="goToReader(item.id)">
            {{item.chapterName}}
          </li>
        </ul>
      </div>
    </scroller>
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
        openid: '',
        order : true,//true-顺序 false-倒序
        curPage : 0,
        pageSize:10,
        bookId : '',
        chapterList : [],

        showDialog:false,
        dialogOption : {
          text : '',
          isShowCancelButton : false
        }
      }
    },
    methods : {
      sort () {
        var me = this
        me.order = !me.order
        me.refresh()
      },
      infinite(done) {
        let me = this;//this指向问题

        var maxPage = me.total/me.pageSize
        if(me.curPage > maxPage) {
          done(true)
          return
        }

        setTimeout(() => {
          $.ajax({
            type : 'POST',
            url : '/api/content/chapterInfo/list',
            data : {
              bookId : me.bookId,
              pageSize : me.pageSize,
              page : me.curPage + 1,
              order : me.order
            },
            dataType : 'json',
            success : function (res) {
              if(res.result == 0){
                me.curPage = res.curPage
                me.total = res.total
                var list = res.list
                for(var i=0;i<list.length;i++){
                  me.chapterList.push(list[i])
                }
              }
            }
          })

          me.$refs.myscroller.resize();
          done()
        }, 1500)
      },
      refresh(){
        var me = this
        setTimeout(() => {
          me.chapterList = []
          me.curPage = 0
          $.ajax({
            type : 'POST',
            url : '/api/content/chapterInfo/list',
            data : {
              bookId : me.bookId,
              pageSize : me.pageSize,
              page : 1,
              order : me.order
            },
            dataType : 'json',
            success : function (res) {
              if(res.result == 0){
                me.curPage = res.curPage
                me.total = res.total
                var list = res.list
                for(var i=0;i<list.length;i++){
                  me.chapterList.push(list[i])
                }
              }
            }
          })
          me.$refs.myscroller.finishPullToRefresh()
        },1500)
      },
      changeParam(){
        var me = this

        var bookid = this.$route.params.id
        if (bookid) {
          me.bookid = bookid
          me.refresh()
        }
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
      var bookid = this.$route.params.id
      me.bookId = bookid
    },
    watch:{
      '$route':'changeParam'
    }
  }
</script>

<style scoped>
  /*._v-container {*/
    /*top:85px;*/
  /*}*/
  ._v-container {
    margin-top:85px;
  }
  .tbar {
    font-size: 18px;
    height: 35px;
    line-height: 40px;
    padding-bottom: 5px;
    display: -webkit-box;
    background: #fff;
    color: #5396d5;
    border-bottom: 1px solid #f5f5f5;
    padding-bottom: 5px;
  }
  .tbar .bar-text {
    -moz-box-flex: 1;
    -webkit-box-flex: 1;
    box-flex: 1;
  }
  .padLR {
    padding-left: 4.2%;
    padding-right: 4.2%;
    background: #fff;
    position: relative;
  }
  .px {
    display: inline-block;
    box-sizing: border-box;
    color: #63a9ea;
    font-size: 14px;
    height: 21px;
    line-height: 20px;
    border: 1px solid #63a9ea;
    padding: 1px 9px;
    border-radius: 3px;
    -webkit-border-radius: 3px;
  }

  .chapter-list-container {
    background-color: #fff;
    overflow: hidden;
    height: 100%;
    box-sizing: border-box;
    width: 100%;
  }
  .chapter-list-ul {
    overflow: hidden;
    display: block;
    font-size: 16px;
    color: #333;
  }
  .chapter-list-ul li {
    padding: 10px 10px;
    border-bottom: 1px solid #eee;
  }
  li.free:after {
    content: "\514D\8D39";
    float: right;
    background: #ed424b;
    color: #fff;
    font-size: 10px;
    border-radius: 2px;
  }
</style>
