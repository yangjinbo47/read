<template>
  <div class="container">
    <div class="header">
      充值
    </div>

    <div class="m-account">
      <p>
        <label>充值账号:</label>
        <span v-if="user.userName == null || user.userName.length == 0">{{user.nickName}}(昵称)</span>
        <span v-else>{{user.userName}}(用户名)</span>
      </p>
      <p>
        <label>账户余额:</label>
        <span>{{user.currency}}阅点</span>
      </p>
    </div>

    <div class="m-rechargelist">
      <h3>
        选择充值方式
        <span class="tip">赠送的红包将在充值完成后自动到账</span>
      </h3>

      <div class="m-rechargeitem" data-type="wxpay">
        <h4>
          <b class="wx"></b>
          微信支付
        </h4>

        <ul class="f-cb">
          <li v-for="(item,idx) in products" class="item" :class="idx%2==1?'even':''" v-on:click="pay(item.id)">
            <p class="money">{{item.name}}</p>
            <P class="yd">
              {{item.tip}}
            </P>
            <b v-if="item.isRec == true" class="hot-icon">
              <img src="../../assets/images/ico-hot.png">
            </b>
          </li>
        </ul>
      </div>
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
        openid:'',
        user:'',
        currency:0,
        products:[],
        showDialog:false,
        dialogOption : {
          text : '',
          isShowCancelButton : false
        }
      }
    },
    methods : {
      getUser () {
        var me = this
        var openid = me.openid
        $.ajax({
          type : 'GET',
          url : '/api/user/userinfo',
          data : {
            openid : openid
          },
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              me.user = res.user
            }
          }
        })
      },
      getConfigs () {
        var me = this
        $.ajax({
          type : 'GET',
          url : '/api/operation/product/list',
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              me.products = res.products
            }
          }
        })
      },
      pay(id_) {
        var me = this
        let wx = require('weixin-js-sdk')
        let reqParams = {
          openid:this.openid,
          productId : id_
        }
        $.ajax({
          type : 'GET',
          url : '/api/weixin/prepay',
          data : reqParams,
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              console.log(res.data)
              wx.chooseWXPay({
                timestamp : res.data.payTimestamp,
                nonceStr : res.data.payNonceStr,
                package : 'prepay_id=' + res.data.prePayId,
                signType : 'MD5',
                paySign : res.data.paySign, // 支付签名
                success : function(e) {
                  console.log("支付成功")
                }
              })
            }
          }
        })
      },
      initWX() {
        var me = this
        let wx = require('weixin-js-sdk')
        var url = location.href.split('#')[0]
        console.log(url)
        let reqParams = {
          url:url
        }
        $.ajax({
          type : 'GET',
          url : '/api/weixin/getSign',
          data : reqParams,
          dataType : 'json',
          success : function (res) {
            if(res.result == 0){
              wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.appId, // 必填，公众号的唯一标识
                timestamp: res.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.nonceStr, // 必填，生成签名的随机串
                signature: res.signature, // 必填，签名，见附录1
                jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              });
            }
          }
        })
      },
      closeDialog : function (attr) {
        window.location.href = "#/user"
      }
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
        me.getUser()
      }
      me.initWX()
    },
    mounted () {
      var me = this
      me.getConfigs()
    }
  }
</script>

<style scoped>

  .m-account {
    padding: 12px 15px;
    background-color: #fff;
  }
  .m-account p {
    height: 24px;
    line-height: 24px;
    color: #6c6358;
    overflow: hidden;
    font-size: 15px;
  }
  .m-account p span {
    word-break: break-all;
  }

  .m-rechargelist h3 {
    font-size: 16px;
    font-weight: normal;
    color: #595550;
    margin: 13px 15px;
  }
  .m-rechargelist em {
    font-weight: normal;
    color: #ed6460;
  }
  .m-rechargelist .tip {
    display: block;
    font-size: 14px;
    color: #ed6460;
    margin-top: 5px;
  }
  .m-rechargelist .m-rechargeitem {
    margin-bottom: 10px;
    padding: 0 15px;
    background: #fff;
    color: #6c6358;
  }
  .m-rechargelist .m-rechargeitem h4 {
    padding: 13px 0 15px;
    font-size: 15px;
    font-weight: normal;
    height: 28px;
    line-height: 28px;
  }
  .m-rechargelist .m-rechargeitem h4 b {
    float: left;
    width: 28px;
    height: 28px;
    margin-right: 12px;
    background: url('../../assets/images/icon-pay.png');
    background-size: 28px;
  }
  .m-rechargelist .m-rechargeitem b.wx {
    background-position: 0 -99px;
  }

  .m-rechargelist .m-rechargeitem li {
    position: relative;
    display: block;
    float: left;
    width: 47.8%;
    height: 60px;
    margin-bottom: 10px;
    text-align: center;
    background: transparent;
    border: 1px solid #cacaca;
    border-radius: 4px;
  }
  .m-rechargelist .m-rechargeitem li.even {
    float: right;
  }
  .m-rechargelist .m-rechargeitem li .money {
    font-size: 16px;
    color: #ed6460;
    margin-top: 11px;
  }
  .m-rechargelist .m-rechargeitem li .yd {
    font-size: 12px;
    margin-top: 8px;
  }
  .m-rechargelist .m-rechargeitem .hot-icon {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 25px;
    height: 25px;
  }
  .m-rechargelist .m-rechargeitem .hot-icon img {
    width: 100%;
    height: 100%;
  }
</style>
