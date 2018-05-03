<template>
  <div class="container">
    <div class="header">
      <a class="head-icon back" v-on:click="$router.back()"></a>
      <div class="search-input">
        <div class="inner f-fl">
          <input type="search" name="key" :placeholder="defaultKey">
          <button>搜索</button>
        </div>
      </div>
    </div>

    <section class="m-search-key">
      <dl class="m-hotkey">
        <dt>大家都在搜</dt>
        <dd>
          <router-link :to="'/searchResult/'+item.words" :key="item.id" v-for="item in hotWords">{{item.words}}</router-link>
        </dd>
      </dl>

      <dl class="m-historykey">
        <dt>最近搜索<span class="clear"></span></dt>
        <dd>
          <router-link :to="'/searchResult/'+item.name" :key="item.id" v-for="item in historyWords">{{item.name}}</router-link>
        </dd>
      </dl>
    </section>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        defaultKey:'',
        hotWords:[],
        historyWords : [
          {
            name : "解忧杂货店"
          },
          {
            name : '妖猫传'
          }
        ]
      }
    },
    methods : {
      getWords () {
        var me = this
        $.ajax({
          type : 'GET',
          url : '/api/operation/hotwords/list',
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              me.hotWords = res.hotwords
              if (res.hotwords.length > 0) {
                me.defaultKey = res.hotwords[0].words
              }
            }
          }
        })
      }
    },
    mounted () {
      var me = this
      me.getWords()
    }
  }
</script>

<style scoped>
  dl {
    display: block;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
  }

  .search-input {
    margin-left: 40px;
    padding: 8px 15px 8px 0;
    height: 28px;
    min-width: 256px;
  }
  .search-input .inner {
    position: relative;
    width: 85%;
  }
  .search-input button {
    width: 51px;
    height: 28px;
    border: none;
    vertical-align: middle;
    background: url('../../assets/images/search_button.png') center center no-repeat;
    background-size: contain;
    text-indent: -9999px;
    position: absolute;
    top: 0;
    right: 0;
  }
  .search-input input[type="search"] {
    border: none;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
    vertical-align: middle;
    float: left;
    box-sizing: border-box;
    color: #6c6358;
    background: #fff;
    border-radius: 14px;
    width: 100%;
    padding: 0 51px 0 15px;
  }

  .m-search-key {
    background: #fff;
  }
  .m-search-key dt {
    font-size: 14px;
    text-indent: 2px;
    color: #aaa;
    line-height: 38px;
    background: #f5f5f5;
    color: #807a73;
    padding: 0 15px;
  }
  .m-search-key dd {
    padding: 15px;
    font-size: 0;
  }
  .m-search-key dd a {
    background: #fff;
    font-size: 14px;
    padding: 0 10px;
    line-height: 28px;
    height: 28px;
    margin-right: 15px;
    margin-bottom: 15px;
    display: inline-block;
    color: #aba59a;
    border: 1px solid #c8c8c8;
    border-radius: 4px;
    position: relative;
  }
  .m-historykey dt .clear {
    display: block;
    float: right;
    background: url('../../assets/images/clear.png') no-repeat;
    background-size: contain;
    width: 10px;
    height: 13px;
    margin: 12px 1px;
  }
</style>
