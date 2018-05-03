<template>
  <div class="container">
    <div class="header">
      分类
    </div>

    <section class="m-lib" v-for="item in categories">
      <h3>
        <em class="sep"></em>
        {{item.text}}
      </h3>
      <table>
        <tbody>
        <tr v-for="i in Math.ceil(item.children.length/3)">
          <td v-for="(obj,idx) in item.children" v-if="idx>=i*3-3&&idx<i*3?true:false"><router-link :to="'/category/' + obj.id">{{obj.text}}</router-link></td>
        </tr>
        <!--<tr>
          <td v-for="(obj,idx) in item.children" v-if="idx<3?true:false"><a href="#">{{obj.text}}</a></td>
        </tr>
        <tr>
          <td v-for="(obj,idx) in item.children" v-if="(2<idx&&idx<6)?true:false"><a href="#">{{obj.text}}</a></td>
        </tr>
        <tr>
          <td v-for="(obj,idx) in item.children" v-if="(5<idx&&idx<9)?true:false"><a href="#">{{obj.text}}</a></td>
        </tr>-->
        </tbody>
      </table>
    </section>

    <!--<section class="m-lib">
      <h3>
        <em class="sep"></em>
        男生
      </h3>
      <table>
        <tbody>
          <tr>
            <td><a href="#">悬疑都市1</a></td>
            <td><a href="#">悬疑都市2</a></td>
            <td><a href="#">悬疑都市3</a></td>
          </tr>
          <tr>
            <td><a href="#">悬疑都市4</a></td>
            <td><a href="#">悬疑都市5</a></td>
            <td><a href="#">悬疑都市6</a></td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="m-lib">
      <h3>
        <em class="sep"></em>
        女生
      </h3>
      <table>
        <tbody>
        <tr>
          <td><a href="#">悬疑都市1</a></td>
          <td><a href="#">悬疑都市2</a></td>
          <td><a href="#">悬疑都市3</a></td>
        </tr>
        <tr>
          <td><a href="#">悬疑都市4</a></td>
          <td><a href="#">悬疑都市5</a></td>
          <td><a href="#">悬疑都市6</a></td>
        </tr>
        </tbody>
      </table>
    </section>

    <section class="m-lib">
      <h3>
        <em class="sep"></em>
        出版
      </h3>
      <table>
        <tbody>
        <tr>
          <td><a href="#">悬疑都市1</a></td>
          <td><a href="#">悬疑都市2</a></td>
          <td><a href="#">悬疑都市3</a></td>
        </tr>
        <tr>
          <td><a href="#">悬疑都市4</a></td>
          <td><a href="#">悬疑都市5</a></td>
          <td><a href="#">悬疑都市6</a></td>
        </tr>
        </tbody>
      </table>
    </section>-->
  </div>
</template>

<script>
  export default {
    data () {
      return {
        categories : [{
          id : 1,
          text : '男生',
          children : [
            {
              id : 1,
              text : '悬疑都市'
            },{
              id : 2,
              text : '悬疑都市'
            }
          ]
        },{
          id : 2,
          text : '女生',
          children : [
            {
              id : 1,
              text : '悬疑都市'
            },{
              id : 2,
              text : '悬疑都市'
            }
          ]
        },{
          id : 3,
          text : '出版',
          children : [
            {
              id : 1,
              text : '悬疑都市'
            },{
              id : 2,
              text : '悬疑都市'
            }
          ]
        }]
      }
    },
    methods : {
      getCategories () {
        var me = this
        $.ajax({
          type : 'GET',
          url : '/api/content/category/menu',
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              me.categories = res.categories
            }
          }
        })
      }
    },
    mounted () {
      var me = this
      me.getCategories()
    }
  }
</script>

<style scoped>
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
  }
  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }
  .m-lib {
    background-color: #fff;
    margin-bottom: 8px;
    padding: 15px;
  }
  .m-lib h3 {
    height: 20px;
    line-height: 20px;
    font-size: 20px;
    color: #ED6460;
  }
  .m-lib h3 .sep {
    display: inline-block;
    background: #ED6460;
    border-radius: 3px;
    width: 2.5px;
    height: 14px;
    margin-right: 6px;
  }
  .m-lib table {
    width: 100%;
    margin: 5px 0 0;
    table-layout: fixed;
  }
  .m-lib table td {
    width: 33%;
    text-align: center;
    height: 50px;
    font-size: 16px;
  }
  .m-lib table td a {
    display: block;
    width: 85px;
    margin: 0 auto;
    height: 30px;
    line-height: 30px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    background: #f5f5f5;
    color: #3b352d;
    border-radius: 4px;
  }
  .m-lib table td a.hot {
    color: #ED6460;
  }
</style>
