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
          <img src="../../assets/images/book/msgys.jpg"/>
          <div>
            <h3>{{item.name}}</h3>
            <p>{{item.author}}/{{item.catalogName}}</p>
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
        bookList : []
      }
    },
    methods : {
      getBookList () {
        var me = this
        $.ajax({
          type : 'GET',
          url : '/api/getBookList',
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              var list = res.list
              for(var i=0;i<list.length;i++){
                me.bookList.push(list[i])
              }
            }
          }
        })
      },
      infinite(done) {
        let self = this;//this指向问题
        let start = this.bookList.length;

        setTimeout(() => {
          $.ajax({
            type : 'GET',
            url : '/api/getBookList',
            dataType : 'json',
            success : function (res) {
              if(res.result == 0){
                var list = res.list
                for(var i=0;i<list.length;i++){
                  self.bookList.push(list[i])
                }
              }
            }
          })
          if(start > 30) {
            console.log('没有更多数据')
          }
          self.$refs.myscroller.resize();
          done()
        }, 1500)
      },
      refresh() {
        let self = this;//this指向问题
        setTimeout(() => {
          self.bookList = []
          $.ajax({
            type : 'GET',
            url : '/api/getBookList',
            dataType : 'json',
            success : function (res) {
              if(res.result == 0){
                var list = res.list
                for(var i=0;i<list.length;i++){
                  self.bookList.push(list[i])
                }
              }
            }
          })
          self.$refs.myscroller.finishPullToRefresh()
        },1500)
      },
      goBookInfo (id) {
        window.location.href = "/bookInfo/"+id
      }
    },
    mounted () {
      var me = this
      me.getBookList()
    }
  }
</script>

<style scoped>
  ._v-container {
    top:44px;
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
