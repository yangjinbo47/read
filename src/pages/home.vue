<template>
  <div class="container">
    <div class="header">
      <router-link to="/search" class="head-icon search"></router-link>
      爽文小说坊
    </div>

    <swipe class="swipe">
      <swipe-item v-for="item in swipes" :key="item.name"><a :href="item.href"><img :src="item.img"></a></swipe-item>
    </swipe>

    <div id="cate-container">
      <div v-for="item in catagroies" :key="item.id" class="pointer">
        <router-link :to="item.href"><div class="icon" :class="item.cls"></div></router-link>
        <div class="title">{{item.name}}</div>
      </div>
    </div>

    <div class="m-list-box">
      <h3 class="f-cb">
        <div class="f-fl">
          <em class="sep"></em>
          <span class="gradient">最新上架</span>
        </div>
        <!--<a href="recommend/idx_zuixinshangjia" class="more">更多<em class="m-arrow"></em></a>-->
        <router-link to="/recommend/idx_zuixinshangjia" class="more">更多<em class="m-arrow"></em></router-link>
      </h3>
      <ul class="m-book-list f-cb">
        <li v-for="item in zxsjBookList">
          <router-link :to="'/bookInfo/' + item.id" class="pic"><img :src="item.coverView"/></router-link>
          <router-link :to="'/bookInfo/' + item.id" class="info"><h4>{{item.name}}</h4></router-link>
        </li>
      </ul>
    </div>

    <div>
      <img src="../assets/images/adv/adv.jpg" style="width: 100%;height: 100px;"/>
    </div>

    <section class="m-list-box">
      <h3 class="f-cb">
        <div class="f-fl">
          <em class="sep"></em>
          <span class="gradient">重磅推荐</span>
        </div>
        <router-link to="/recommend/idx_zhongbangtuijian" class="more">更多<em class="m-arrow"></em></router-link>
      </h3>
      <div class="m-book-single" v-if="zbSingle != null">
        <router-link :to="'/bookInfo/' + zbSingle.id">
          <img :src="zbSingle.coverView">
          <h3>{{zbSingle.name}}</h3>
          <p>{{zbSingle.authorsName}}/{{zbSingle.categoryName}}</p>
          <p>{{zbSingle.description}}</p>
        </router-link>
      </div>
      <div class="m-book-item">
        <ul>
          <li v-for="(item,index) in zbItemList">
            <router-link :to="'/bookInfo/' + item.id">
              <h4>[{{item.categoryName}}]{{item.name}}</h4>
              <p>{{item.description}}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </section>

    <section class="m-list-box">
      <h3 class="f-cb">
        <div class="f-fl">
          <em class="sep"></em>
          <span class="gradient">最新红书</span>
        </div>
        <router-link to="/recommend/idx_zuixinhongshu" class="more">更多<em class="m-arrow"></em></router-link>
      </h3>
      <ul class="m-free-list">
        <li v-for="item in zxhsBookList">
          <router-link :to="'/bookInfo/' + item.id">
            <img :src="item.coverView">
            <h3>{{item.name}}</h3>
            <p>{{item.authorsName}}/{{item.categoryName}}</p>
            <p>{{item.description}}</p>
          </router-link>
        </li>
      </ul>
    </section>

    <section class="m-list-box">
      <h3 class="f-cb">
        <div class="f-fl">
          <em class="sep"></em>
          <span class="gradient">精选完本</span>
        </div>
        <router-link to="/recommend/idx_jingxuanwanben" class="more">更多<em class="m-arrow"></em></router-link>
      </h3>
      <ul class="m-free-list">
        <li v-for="item in jxwbBookList">
          <router-link :to="'/bookInfo/' + item.id">
            <img :src="item.coverView">
            <h3>{{item.name}}</h3>
            <p>{{item.authorsName}}/{{item.categoryName}}</p>
            <p>{{item.description}}</p>
          </router-link>
        </li>
      </ul>
    </section>

  </div>
</template>

<script>
  require('vue-swipe/dist/vue-swipe.css');
  import {Swipe,SwipeItem} from 'vue-swipe'
  export default {
    components : {
      Swipe,
      SwipeItem
    },
    computed : {
      zbSingle () {
        return this.zbtjBookList[0]
      },
      zbItemList () {
        return this.zbtjBookList.slice(1)
      }
    },
    data () {
      return {
        zxsjBookList : [],
        zbtjBookList : [],
        zxhsBookList : [],
        jxwbBookList : [],
        swipes : [
          {
            id : 1,
            name : "1",
            img : require('../assets/slider/slider_1.jpg'),
            href : '/bookInfo/1'
          },
          {
            id : 2,
            name : "2",
            img : require('../assets/slider/slider_2.jpg'),
            href : '/bookInfo/1'
          },
          {
            id : 3,
            name : "3",
            img : require('../assets/slider/slider_3.jpg'),
            href : '/bookInfo/1'
          },
          {
            id : 4,
            name : "4",
            img : require('../assets/slider/slider_4.jpg'),
            href : '/bookInfo/1'
          }
        ],
        catagroies : [
          {
            id:1,
            name:'最近更新',
            cls:'zjgx',
            href:'/recommend/idx_zuijingengxin'
          },
          {
            id:2,
            name:'排行榜',
            cls:'rank',
            href:'/recommend/idx_paihangbang'
          },
          {
            id:3,
            name:'男生爱看',
            cls:'boy',
            href:'/recommend/idx_nanshengaikan'
          },
          {
            id:4,
            name:'女生爱看',
            cls:'girl',
            href:'/recommend/idx_nvshengaikan'
          }
        ]
      }
    },
    methods : {
      getBookList () {
        var me = this
        $.ajax({
          type : 'GET',
          //url : this.GLOBAL.apiHost + '/api/operation/recommend/contentList',
          url : '/api/operation/index',
//          data : {
//            idxName : 'idx_zuixinshangjia',
//            count : 3
//          },
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              var zxsj = res.zxsj
              for(var i=0;i<zxsj.length;i++){
                me.zxsjBookList.push(zxsj[i])
              }
              var zbtj = res.zbtj
              for(var i=0;i<zbtj.length;i++){
                me.zbtjBookList.push(zbtj[i])
              }
              var zxhs = res.zxhs
              for(var i=0;i<zxhs.length;i++){
                me.zxhsBookList.push(zxhs[i])
              }
              var jxwb = res.jxwb
              for(var i=0;i<zxhs.length;i++){
                me.jxwbBookList.push(jxwb[i])
              }
            }
          }
        })
      }
    },
    mounted () {
      var me = this
      me.getBookList()
    }
  }
</script>

<style scoped>
  .search {
    left: 10px;
    background: url('../assets/images/search.png') no-repeat;
    background-size: 100% auto;
    background-position: 50% 50%;
    width: 36px;
    height: 44px;
  }

  .swipe {
    height: 160px;
    color: #fff;
    font-size: 30px;
    text-align: center;
  }
  .swipe img {
    width: 100%;
    height: 100%;
  }

  #cate-container {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-around;
    justify-content: space-around;
    font-size: 16px;
    margin: 10px;
    padding: 10px;
    padding-bottom: 5px;
    background-color: #fff;
    border-radius: 10px;
  }
  #cate-container .pointer {
    cursor: pointer;
  }
  #cate-container .icon {
    text-align: center;
    height: 45px;
    line-height: 45px;
    margin: 0 auto;
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: contain;
  }
  #cate-container .title {
    line-height: 25px;
  }

  .zjgx {
    background-image: url('../assets/images/nav_zjgx.png');
  }
  .rank {
    background-image: url('../assets/images/nav_rank.png');
  }
  .boy {
    background-image: url('../assets/images/nav_boy.png');
  }
  .girl {
    background-image: url('../assets/images/nav_girl.png');
  }

</style>
