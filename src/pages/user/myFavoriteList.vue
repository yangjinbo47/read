<template>
  <div>
    <scroller :on-infinite="infinite" :on-refresh="refresh" ref="myscroller">
      <section class="m-list-box">
        <ul class="m-free-list">
          <li v-for="item in bookList">
            <router-link :to="'/bookInfo/' + item.id">
            <!--<a href="#">-->
              <img :src="item.coverView">
              <h3>{{item.name}}</h3>
              <p>{{item.authorsName}}/{{item.categoryName}}</p>
              <p>{{item.description}}</p>
            <!--</a>-->
            </router-link>
          </li>
        </ul>
      </section>
    </scroller>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        openid : '',
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
            url : '/api/userfavorite/list',
            data : {
              openid : me.openid,
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

//          me.$refs.myscroller.resize();
//          done()
        }, 1500)
      },
      refresh() {
        let me = this;//this指向问题
        setTimeout(() => {
          me.bookList = []
          me.curPage = 0
          $.ajax({
            type : 'POST',
            url : '/api/userfavorite/list',
            data : {
              openid : me.openid,
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
      }
    },
    created () {
      var me = this
      var openid = this.GLOBAL.fetchFromSessionStorage(this.GLOBAL.OPENID_KEY)
      if (openid == null) {
        openid = this.GLOBAL.getUrlParam('openid')
      }
      me.openid = openid
    }
  }
</script>

<style scoped>
  ._v-container {
    margin-top:88px;
  }
</style>
