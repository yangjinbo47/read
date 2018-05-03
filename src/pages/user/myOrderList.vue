<template>
  <div>
    <scroller :on-infinite="infinite" :on-refresh="refresh" ref="myscroller">
      <section class="m-list-box">
        <ul class="m-free-list">
          <li v-for="item in bookList">
            <a href="#">
              <img :src="item.pic">
              <h3>{{item.name}}</h3>
              <p>{{item.author}}/{{item.catalog}}</p>
              <p>{{item.description}}</p>
            </a>
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
        bookList : [
          {
            id:1,
            name:'美食供应商',
            author:'杨锦波',
            catalog:'都市生活',
            pic:require('../../assets/images/book/msgys.jpg'),
            description:'他是浩然霸气的妖族帝王，他是权谋无双的魔门尊者他是浩然霸气的妖族帝王，他是权谋无双的魔门尊者',
          },
          {
            id:2,
            name:'我是全能大明星',
            author:'杨锦波',
            catalog:'都市生活',
            pic:require('../../assets/images/book/qndmx.jpg'),
            description:'他是浩然霸气的妖族帝王，他是权谋无双的魔门尊者他是浩然霸气的妖族帝王，他是权谋无双的魔门尊者',
          },
          {
            id:3,
            name:'信仰诸天',
            author:'杨锦波',
            catalog:'玄幻武侠',
            pic:require('../../assets/images/book/xyzt.jpg'),
            description:'他是浩然霸气的妖族帝王，他是权谋无双的魔门尊者他是浩然霸气的妖族帝王，他是权谋无双的魔门尊者',
          },
          {
            id:1,
            name:'美食供应商',
            author:'杨锦波',
            catalog:'都市生活',
            pic:require('../../assets/images/book/msgys.jpg'),
            description:'他是浩然霸气的妖族帝王，他是权谋无双的魔门尊者他是浩然霸气的妖族帝王，他是权谋无双的魔门尊者',
          },
          {
            id:2,
            name:'我是全能大明星',
            author:'杨锦波',
            catalog:'都市生活',
            pic:require('../../assets/images/book/qndmx.jpg'),
            description:'他是浩然霸气的妖族帝王，他是权谋无双的魔门尊者他是浩然霸气的妖族帝王，他是权谋无双的魔门尊者',
          },
          {
            id:3,
            name:'信仰诸天',
            author:'杨锦波',
            catalog:'玄幻武侠',
            pic:require('../../assets/images/book/xyzt.jpg'),
            description:'他是浩然霸气的妖族帝王，他是权谋无双的魔门尊者他是浩然霸气的妖族帝王，他是权谋无双的魔门尊者',
          }
        ]
      }
    },
    methods : {
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
      }
    }
  }
</script>

<style scoped>
  ._v-container {
    margin-top:88px;
  }
</style>
