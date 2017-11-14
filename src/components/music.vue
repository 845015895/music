<template>
  <div>
    <loading v-if="loading">
    </loading>
    <div id="main" class="wrapper" >
      <img src="../assets/player_logo1.png" alt="" class="player_logo">
      <div class="audioBar">
        <!--<marquee>{{song_name + " - " + author_name}}</marquee>-->
        <div class="showName">
          <p class="songName">{{song_name}}</p>
          <p class="authorName">{{author_name}}</p>
        </div>
        <div id="progress">
          <!--创建加载进度条-->
          <span id="bar">
          <!--创建控制点-->
        <div id="control"></div>
        </span>
        </div>
        <div class="time" v-show="showTime">
          <div>{{playTime}}</div>
          <div>{{allTime}}</div>
        </div>
        <audio id="audio" v-on:ended="musicEnd($event)" v-bind:src="musicUrl" controlsList="nodownload" preload="auto"
               v-on:canplay="canplaythrough" autoplay="autoplay">
          亲 您的浏览器不支持html5的audio标签
        </audio>
      </div>
      <s class="line"></s>
      <input type="text" v-model="musicName" class="searchBox" placeholder="歌曲/歌手"/>
      <button v-on:click="getData(musicName)" class="searchBtn">搜索</button>
      <div v-bind:class="{songListLy:showLyrics,songList:!showLyrics}">
        <div class="lyrics" v-show="showLyrics">
          <div class="lyricsBar">
            <p v-for="(item,index) in lyrics" v-bind:class="{light:isLight===index}">{{item.lyricsStr}}</p>
          </div>
        </div>
        <ul v-show="!showLyrics">
          <li v-for="(item,index) in songList" v-show="songList" v-on:click="setMusicUrl(index)">
            <div class="musicBar" v-show="!showBank">
              <p>{{item.SongName}}</p>
              <p>{{item.SingerName}}</p>
            </div>
            <div class="musicBar" v-show="showBank">
              <p>{{item.filename}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="audioTool">
        <div class="skipBtn back" v-on:click="next()"></div>
        <div class="btn playBtn" id="playBtn" v-show="!isPlaying" v-on:click="play()"></div>
        <div class="btn pauseBtn" v-show="isPlaying" v-on:click="stop()"></div>
        <div class="skipBtn next" v-on:click="back()"></div>
      </div>
    </div>
  </div>

</template>
<script>
  import $ from "jquery";
  import loading from "./myLoading.vue";
  import resize from "../tools/resize";

  export default ({
    data() {
      return {
        musicName: "",
        songList: [],
        data: "",
        musicId: "",
        musicUrl: "",
        singer: "",
        width: "",
        height: "",
        showLyrics: false,
        isPlaying: false,
        song_name: "橙子音乐",
        author_name: "易子程",
        lyrics: [],
        playTime: "00:00",
        allTime: "00:00",
        showTime: false,
        isLight: false,
        currentIndex: "",
        showBank: false,
        loading: true

      }

    },
    components: {
      loading
    },
    created: function () {
//      document.body.addEventListener('touchmove', function (event) {
//        event.preventDefault();
//      }, false);
      let self = this;

      self.getData("");
    },
    mounted: function () {
      let self = this;
      setInterval(function () {
        self.loading = false;
      }, 4000);
      let audio = document.querySelector("#audio");
      let bar = document.querySelector("#bar");
      let progress = document.querySelector("#progress");
      let control = document.querySelector("#control");
      let playTimeM, playTimeS, allTimeM, allTimeS;
      audio.loop = false;
      audio.addEventListener("timeupdate", function () {
        let scales = audio.currentTime / audio.duration;
        bar.style.width = progress.offsetWidth * scales + "px";
        control.style.left = progress.offsetWidth * scales - 10 + "px";
        if (!isNaN(audio.duration)) {
          allTimeM = Math.floor(Math.floor(audio.duration) / 60);
          allTimeS = Math.floor(audio.duration) % 60;
          self.allTime = (allTimeM > 9 ? allTimeM : "0" + allTimeM) + ":" + (allTimeS > 9 ? allTimeS : "0" + allTimeS);
        }

        if (Math.floor(audio.currentTime) < 10) {
          self.playTime = "00:" + "0" + Math.floor(audio.currentTime);
        } else if (Math.floor(audio.currentTime) >= 10 && Math.floor(audio.currentTime) < 60) {
          self.playTime = "00:" + Math.floor(audio.currentTime);
        } else {
          playTimeM = Math.floor(Math.floor(audio.currentTime) / 60);
          playTimeS = Math.floor(audio.currentTime) % 60;
          self.playTime = (playTimeM > 9 ? playTimeM : "0" + playTimeM) + ":" + (playTimeS > 9 ? playTimeS : "0" + playTimeS);

        }
        for (let i = 0; i < self.lyrics.length; i++) {

          if (audio.currentTime /*当前播放的时间*/ > self.lyrics[i].time) {
            //显示到页面
            self.isLight = i;

            $(".lyricsBar").css('top', resize.resetPx(150) - i * resize.resetPx(30));
          }
        }
      }, false);

      document.addEventListener("WeixinJSBridgeReady", function () {
        self.auto();
      }, false);


//      playBtn.click();

    },
    methods: {
      getData: function (songName) {
        let self = this;
        if (songName === "热歌榜") {
          $.ajax({
//            url: `//m.kugou.com/rank/info/?rankid=8888&page=1&json=true`,
            url: `/rank/info/?rankid=8888&page=1&json=true`,
            type: "GET",
            dataType: "json",
            success: function (res) {
              self.data = res.songs;
              self.songList = self.data.list;
              self.showLyrics = false;
              self.showBank = true;
            },
            error: function () {
              console.log(arguments);
            }
          })

        } else if (songName === "新歌榜") {
          $.ajax({
//            url: ` http://m.kugou.com/rank/info/?rankid=8888&page=1&json=true`,
            url: `/rank/info/?rankid=27&page=1&json=true`,
            type: "GET",
            dataType: "json",
            success: function (res) {
              self.data = res.songs;
              self.songList = self.data.list;
              self.showLyrics = false;
              self.showBank = true;
            },
            error: function () {
              console.log(arguments);
            }
          })
        } else {
          $.ajax({
//          url: `/api/search/get/?s=${songName}&limit=40&type=1&offset=0`,
            //这个是不通过跨域处理的链接
//            url: `http://songsearch.kugou.com/song_search_v2?keyword=${songName}&page=1&clientver=&platform=WebFilter`,
            //这个是通过跨域处理的链接
            url: `/song_search_v2?keyword=${songName}&page=1&clientver=&platform=WebFilter`,
            type: "GET",
            dataType: "json",
            success: function (res) {
              self.data = res.data;
              self.songList = self.data.lists;
              self.showBank = false;
              self.showLyrics = false;
            },
            error: function () {
              console.log(arguments);
            }
          })
        }

      },
      setMusicUrl: function (index) {
        let self = this;
        self.currentIndex = index;
        self.lyrics = [];

        if (self.showBank) {
          self.musicId = self.songList[index].hash;

        } else {
          self.musicId = self.songList[index].FileHash;
        }
        var audio = document.querySelector('#audio');
        $.ajax({
//          url: `/api/search/get/?s=${songName}&limit=40&type=1&offset=0`,
          //这个是不通过跨域处理的链接
//          url: `http://www.kugou.com/yy/index.php?r=play/getdata&hash=${self.musicId}`,
          //这个是通过跨域处理的链接
          url: `/yy/index.php?r=play/getdata&hash=${self.musicId}`,
          type: "GET",
          dataType: "json",
          success: function (res) {
            self.musicUrl = res.data.play_url;
//            audio.loop = true;
            audio.load();
            self.isPlaying = false;
            self.showName = true;
            self.song_name = res.data.song_name;
            self.author_name = res.data.author_name;
            self.showLyrics = true;
            let lyricsTemp = res.data.lyrics.split("\r\n");
            self.render(lyricsTemp);
            $(".lyricsBar").css('top', resize.resetPx(150));
          },
          error: function () {
            console.log(arguments);
          }
        });
      },
      play: function () {
        var audio = document.querySelector('#audio');
        if (!this.isPlaying) {
//          audio.load();
          audio.play();
          document.addEventListener("WeixinJSBridgeReady", function () {
//            audio.load();
            audio.play();
          }, false);
          this.isPlaying = true;
          this.showTime = true;
        }
      },
      stop: function () {
        var audio = document.querySelector('#audio');
        if (this.isPlaying) {
          audio.pause();
          this.isPlaying = false;
        }
      },
      render: function (lyrics) {
        let pattern = /\[\d{2}:\d{2}.\d{2}\]/g;
        let self = this;
        for (let i in lyrics) {
          if (lyrics[i] !== "") {
            let temp = {};
            let time = "";
            let t1 = "";
            let t2 = "";
            time = lyrics[i].match(pattern);
            t1 = time[0];
            t2 = t1.slice(1, -1).split(':');
            temp.time = parseInt(t2[0], 10) * 60 + parseFloat(t2[1]);
            temp.lyricsStr = lyrics[i].replace(pattern, "");
            self.lyrics.push(temp);
          }
        }

      },
      canplaythrough: function () {
        this.play();
      },
      musicEnd: function (e) {
        let audio = e.target;
        let self = this;
        self.isPlaying = false;
        audio.currentTime = 0;
        ++self.currentIndex;
        if (self.currentIndex >= self.songList.length) {
          self.currentIndex = 0;
        }
        self.setMusicUrl(self.currentIndex);


      },
      next() {
        let audio = document.querySelector("#audio");
        let self = this;
        self.isPlaying = false;
        audio.currentTime = 0;
        ++self.currentIndex;
        if (self.currentIndex >= self.songList.length) {
          self.currentIndex = 0;
        }
        self.setMusicUrl(self.currentIndex);
      },
      back() {
        let audio = document.querySelector("#audio");
        let self = this;
        self.isPlaying = false;
        audio.currentTime = 0;
        --self.currentIndex;
        if (self.currentIndex < 0) {
          self.currentIndex = self.songList.length - 1;
        }
        self.setMusicUrl(self.currentIndex);
      }
    }
  })

</script>
<style lang="scss" scoped="">
  @import "../scss/_size.scss";

  * {
    margin: 0;
    padding: 0;

    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .player_logo {
    position: absolute;
    left: 0;
    opacity: 0;
    z-index: -100;
    filter: alpha(opacity=0);
  }

  .wrapper {
    width: 100%;
    min-height: 85%;
    box-sizing: border-box;
    text-align: center;
    background: url("../assets/Background.jpg") no-repeat;
    background-size: cover;
    border-radius: px(10);

    .searchBox {
      padding-left: px(20);
      width: 70%;
      height: px(50);
      font-size: px(16);
      border-radius: px(10);
      border: 0;
      outline: none;
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }
    .searchBox::-webkit-input-placeholder {
      color: #dddddd;
      font-size: px(16);
    }
    .searchBtn {
      border-radius: px(10);
      border: 0;
      width: 20%;
      height: px(50);
      background: rgba(255, 255, 255, 0.1);
      font-size: px(16);
      color: #fff;
      outline: none;
    }
    .songList {
      width: 100%;
      margin: px(10) auto;
      padding: px(5);
      height: 50%;
      height: px(230);
      overflow: auto;
      box-sizing: border-box;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      border-radius: px(10);
      .noMusic {
        width: px(200);
        margin: px(40) auto;
        display: flex;
        height: px(20);
        line-height: px(20);
        color: #fff;
        .icon {
          display: block;
          width: px(20);
          height: px(20);
          margin-right: px(5);
        }
      }
      ul {
        padding-top: px(10);
        list-style: none;

        li {
          padding-left: px(10);
          display: flex;
          align-items: center;
          cursor: pointer;
          text-align: left;
          font-size: px(12);
          padding-top: px(15);
          padding-bottom: px(15);
          border-bottom: 1px solid #ddd;

          .musicBar {
            p:nth-child(1) {
              font-size: px(16);
              color: #fff;
              font-weight: 400;
            }
            p:nth-child(2) {
              font-size: px(13);
              color: #fff;
            }

          }
        }
        li:nth-child(1) {
          border-top: 1px solid #ddd;
        }
      }

    }
    .songListLy {
      width: 100%;
      margin: px(10) auto;
      height: px(230);
      overflow: hidden;
      border-radius: px(10);
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
    }
    .audioBar {
      width: 100%;
      height: px(120);
      audio {
        width: 100%;
        height: px(100);
      }
      .showName {
        margin: px(5) auto;
        width: 80%;
        overflow: hidden;
        text-align: left;
        .songName {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          margin-top: px(10);
          color: #fff;
          font-size: px(20);
          font-weight: bold;
        }
        .authorName {
          margin-top: px(10);
          color: #fff;
          font-size: px(15);
        }
      }
      #progress {
        margin: px(10) auto px(10) auto;
        width: 80%;
        height: 10px;
        background: rgba(204, 204, 204, 0.5);
        border-radius: 10px;
        overflow: hidden;
        /*进度加载*/
        #bar {
          width: 0;
          height: 100%;
          background: #39f;
          display: block;
          position: relative;
          border-radius: 10px;
          left: 0;
          text-align: right;

        }
        /*控制点*/
        #control {
          width: 10px;
          height: 10px;
          background: #fff;
          position: relative;
          top: 0;
          left: -10px;
          border-radius: 10px;
          cursor: pointer;
        }
      }

    }
    .audioTool {
      padding-top: px(5);
      padding-bottom: px(5);
      display: flex;
      align-content: center;
      .btn {
        margin: 0 auto;
        width: px(50);
        height: px(50);
        border: 0;
        outline: none;
      }
      .playBtn {
        background: url("../assets/play.png");
        background-size: cover;
      }
      .pauseBtn {
        background: url("../assets/pause.png");
        background-size: cover;
      }

      .skipBtn {
        width: px(32);
        height: px(22);
      }
      .back {
        margin-left: 20%;
        background: url("../assets/backBtn.png") no-repeat;
        background-size: cover;
      }
      .next {
        margin-right: 20%;
        background: url("../assets/nextBtn.png") no-repeat;
        background-size: cover;
      }
    }

    .line {
      display: block;
      margin-top: px(5);
      width: 100%;
      height: px(15);
      background: url(../assets/line.png) no-repeat;
      background-size: 100% 100%;
    }

    .lyrics {
      width: 100%;
      min-height: px(300);
      .lyricsBar {
        position: relative;
        transition: top 0.5s;
        top: px(150);
        p {
          color: #d9d9d9;
          font-size: px(15);
          min-height: px(30);
          line-height: px(30);
        }
        .light {
          color: #a6e22d;
        }
      }

    }
    .time {
      display: flex;
      justify-content: space-between;
      width: 80%;
      margin: 0 auto;
      font-size: px(12);
      color: #fff;
    }

  }

</style>
