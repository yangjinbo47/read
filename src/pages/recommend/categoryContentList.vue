<template>
  <div>
    <div class="header">
      <a class="head-icon back" v-on:click="$router.back()"></a>
      爽文小说坊
    </div>

    <scroller :on-infinite="infinite" :on-refresh="refresh" ref="myscroller">
    <div class="book_list">
      <ul class="book_list_ul">
        <li v-for="item in bookList" v-on:click="goBookInfo(item.id)">
          <!--正式环境替换http图片路径-->
          <img :src="item.coverView"/>
          <div>
            <h3>{{item.name}}</h3>
            <p>{{item.authorsName}}/{{item.categoryName}}</p>
            <p>{{item.description}}</p>
          </div>
        </li>
      </ul>
    </div>
    </scroller>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        categoryId : "",
        curPage : 0,
        pageSize : 10,
        total : 1000,
        bookList : []
      }
    },
    methods : {
      infinite(done) {
        let me = this;

        var maxPage = me.total/me.pageSize
        if(me.curPage > maxPage) {
          done(true)
          return
        }
        setTimeout(() => {
          $.ajax({
            type : 'POST',
            url : '/api/content/category/contentPage',
            data : {
              categoryId : me.categoryId,
              pageSize : me.pageSize,
              page : me.curPage + 1
            },
            dataType : 'json',
            success : function (res) {
              if(res.result == 0){
                me.curPage = res.curPage
                me.total = res.total
                var list = res.list
                for(var i=0;i<list.length;i++){
                  me.bookList.push(list[i])
                }
                me.$refs.myscroller.resize();
                done()
              } else {
                done(true)
              }
            }
          })
        }, 1500)
      },
      refresh() {
        let me = this;//this指向问题
        setTimeout(() => {
          me.bookList = []
          me.curPage = 0
          $.ajax({
            type : 'POST',
            url : '/api/content/category/contentPage',
            data : {
              categoryId : me.categoryId,
              pageSize : me.pageSize,
              page : 1
            },
            dataType : 'json',
            success : function (res) {
              if(res.result == 0){
                me.curPage = res.curPage
                me.total = res.total
                var list = res.list
                for(var i=0;i<list.length;i++){
                  me.bookList.push(list[i])
                }
              }
            }
          })
          me.$refs.myscroller.finishPullToRefresh()
        },1500)
      },
      goBookInfo (id) {
        window.location.href = "#/bookInfo/"+id
      },
      changeParam(){
        var me = this

        var categoryId = this.$route.params.categoryId
        if (categoryId) {
          me.categoryId = categoryId
          me.refresh()
        }
      }
    },
    mounted () {
      var me = this

      var categoryId = this.$route.params.categoryId
      me.categoryId = categoryId
    },
    watch:{
      '$route':'changeParam'
    }
  }
</script>

<style scoped>
  ._v-container {
    margin-top:44px;
  }
  .book_list {
    overflow: hidden;
  }

  .book_list_ul {
    overflow: hidden;
  }
  .book_list_ul li {
    width: 100%;
    height: 100px;
    overflow: hidden;
    border-bottom: solid 1px #eaeaea;
    margin: 5px;
    padding: 5px 0px 10px 0px;
  }
  .book_list_ul li img {
    width: 90px;
    height: 90px;
    border: solid 2px #d5d4d4;
    padding: 5px;
    position: absolute;
    border-radius: 5px;
  }
  .book_list_ul li a {
    display: block;
  }
  .book_list_ul li div {
    padding-left: 120px;
    padding-right: 10px;
    position: relative;
  }
  .book_list_ul li div h3 {
    display: block;
    font-size: 16px;
    color: #39ac4b;
  }
  .book_list_ul li div p:nth-of-type(1) {
    display: block;
    color: #555555;
    padding-top: 5px;
    line-height: 20px;
  }
  .book_list_ul li div p:nth-of-type(2) {
    display: block;
    color: #555555;
    padding-top: 5px;
    line-height: 20px;
    overflow: hidden;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
</style>
