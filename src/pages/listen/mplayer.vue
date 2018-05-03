<template>
  <div class="content">
    <div class="header">
      <a href="#" class="head-icon back" v-on:click="$router.back()"></a>
      小凯的家不一样了(需替换)
    </div>
    <audio id="audio" :src="audio" autoplay ref="audio"></audio>
    <div class="blur">
      <img src="../../assets/images/mplayer_bg.jpg"/>
    </div>

    <img class="play" id="xuanzhuan" :src="playPic" ref="playPic">

    <div class="downside">
      <!--图片-->
      <div class="singleinfo clearfix">
        <div class="single_pic fl">
          <img src="../../assets/slider/slider_1.jpg"/>
        </div>
      </div>
      <!--信息及播放器-->
      <div class="single_detail fl">
        <p class="single_sname">小凯的家不一样了</p>
        <p class="single_aname">杨锦波</p>
        <div class="playbox">
          <div class="playbar fl">
            <div class="playline">
              <div class="playline_clone"></div>
            </div>
          </div>
          <span class="fl">{{currentTime}}</span>
          <span class="fl">/</span>
          <span class="fl">{{duration}}</span>
        </div>
      </div>
      <!--播放按钮-->
      <div class="single_pausebtn fr" v-on:click="changeState($event)"></div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        audio:'http://zhangmenshiting.qianqian.com/data2/music/22668faba6574d1622e1eb80f02a9e6d/556428195/556428195.mp3?xcode=6307fe5b4830e3e83d7cab37c0a62272',
        playPic:require('../../assets/slider/slider_1.jpg'),
        play:true,
        currentTime:'00:00',
        duration:'00:00'
      }
    },
    methods : {
      changeState (event) {
        var audio = this.$refs.audio
        this.play = !this.play
        if (this.play) {//播放状态
          audio.play();
          event.target.setAttribute('class', 'single_pausebtn fr')
          this.$refs.playPic.setAttribute('id','xuanzhuan')
        } else {//暂停状态
          audio.pause();
          event.target.setAttribute('class', 'single_playbtn fr')
          this.$refs.playPic.setAttribute('id','')
        }
      },
      setCurrentTime (t) {
        t = Math.floor(t);
        var playTime = this.secondToMin(audio.currentTime);
        this.currentTime = playTime
        $('.playline_clone').css({
          width: (t / audio.duration).toFixed(4) * 100 + "%"
        })
      },
      secondToMin (s) {
        var MM = Math.floor(s / 60);
        var SS = s % 60;
        if(MM < 10)
          MM = "0" + MM;
        if(SS < 10)
          SS = "0" + SS;
        var min = MM + ":" + SS;
        return min.split('.')[0];
      }
    },
    mounted () {
      var me = this
      var audio = this.$refs.audio
      audio.oncanplay = function (e) {
        me.duration = me.secondToMin(audio.duration)
      }
      this.invId = setInterval(() => {
        var currentTime = audio.currentTime;
        me.setCurrentTime(currentTime);
      }, 1000)
    },
    destroyed() {
      clearInterval(this.invId)
    }
  }
</script>

<style scoped>
  .content {
    #margin: 44px 0px 0px 0px;
    height: 95%;
  }
  .blur {
    width: 100%;
    height: 100%;
    -webkit-filter: blur(15px);
    filter: blur(15px);
    position: relative;
  }
  .blur img {
    width: 100%;
    height: 100%;
  }

  .play{
    width: 20rem;
    height: 20rem;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    top: 10rem;
    left: 0px;
    right: 0px;
    bottom: 0px;
    box-shadow: 0 0 5px 8px #FFF;
    margin: 0 auto;
  }
  #xuanzhuan{
    -webkit-animation: play 10s linear infinite;
    -moz-animation: play 10s linear infinite;
    animation: play 10s linear infinite;
  }
  @-webkit-keyframes play{
    0%{-webkit-transform: rotate(0deg);}
    100%{transform: rotate(360deg);}
  }
  @-moz-keyframes play {
    0%{-moz-transform: rotate(0deg);}
    100%{transform: rotate(360deg);}
  }
  @keyframes play{
    0%{transform: rotate(0deg);}
    100%{transform: rotate(360deg);}
  }

  .downside {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 10rem;
    background: rgba(0,0,0,0.3);
  }

  .singleinfo {
    margin-bottom: 0.4rem;
    position: relative;
  }
  .clearfix {
    zoom: 1;
  }

  .single_pic {
    width: 7rem;
    height: 7.5rem;
    margin: 1rem 1rem 0 1rem;
  }
  .single_pic img {
    width: 100%;
    height: 100%;
  }

  .single_detail {
    width: 50%;
    height: 7.2rem;
    position: relative;
    #padding-top: 0.2rem;
    margin: 1rem 0rem 0 0rem;
  }
  .single_detail p {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .single_sname {
    color: #fff;
    font-size: 2rem;
    line-height: 3rem;
    width: 5rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .single_aname {
    color: rgba(255,255,255,0.5);
    font-size: 1.5rem;
    line-height: 1.5rem;
  }

  .playbox {
    position: absolute;
    left: 0;
    bottom: 0rem;
    width: 17rem;
    height: 0.8rem;
    font-size: 0.24rem;
    color: #eee;
  }
  .playbar {
    width: 10rem;
    height: 100%;
    margin-right: 0.2rem;
  }
  .playline {
    width: 10rem;
    height: 0.5rem;
    background: #fff;
    position: relative;
    top: 0.2rem;
  }
  .playline_clone {
    width: 0px;
    height: 100%;
    background: #1DA0EF;
  }

  .single_playbtn {
    width: 4rem;
    height: 4rem;
    background: url(../../assets/images/mplaybtn.png) no-repeat center center;
    background-size: 70%;
    margin:1rem 0.2rem 0rem 0rem;
  }
  .single_pausebtn {
    width: 4rem;
    height: 4rem;
    background: url(../../assets/images/mpausebtn.png) no-repeat center center;
    background-size: 70%;
    margin:1rem 0.2rem 0rem 0rem;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
</style>
