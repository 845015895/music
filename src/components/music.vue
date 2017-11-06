<template>
  <div id="main" class="wrapper">
    <img src="../assets/player_logo1.png" alt="" class="player_logo">
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
          <div class="musicBar">
            <p>{{item.SongName}}</p>
            <p>{{item.SingerName}}</p>
          </div>
        </li>
      </ul>

    </div>

    <div class="audioBar">
      <div class="btn playBtn" v-show="!isPlaying" v-on:click="play()"></div>
      <div class="btn pauseBtn" v-show="isPlaying" v-on:click="stop()"></div>
      <div class="time" v-show="showTime"> {{playTime + "/" + allTime}}</div>
      <marquee>{{song_name + " - " + author_name}}</marquee>
      <div id="progress">
        <!--创建加载进度条-->
        <span id="bar"></span>
        <!--创建控制点-->
        <div id="control"></div>
      </div>

      <audio id="audio" v-bind:src="musicUrl" loop="loop" controlsList="nodownload" preload="auto">
        亲 您的浏览器不支持html5的audio标签
      </audio>
    </div>

  </div>
</template>
<script>
  import $ from "jquery"
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
        song_name: "",
        author_name: "",
        lyrics: [],
        playTime: "",
        allTime: "00:00",
        showTime: false,
        isLight: false

      }

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
      let audio = document.querySelector("#audio");
      let bar = document.querySelector("#bar");
      let control = document.querySelector("#control");
      let playTimeM, playTimeS, allTimeM, allTimeS;
      audio.addEventListener("timeupdate", function () {
        let scales = audio.currentTime / audio.duration;
        bar.style.width = progress.offsetWidth * scales + "px";
        control.style.left = progress.offsetWidth * scales - 12 + "px";
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


    },
    methods: {
      getData: function (songName) {
        let self = this;
        $.ajax({
//          url: `/api/search/get/?s=${songName}&limit=40&type=1&offset=0`,
//          url: `http://songsearch.kugou.com/song_search_v2?keyword=${songName}&page=1&clientver=&platform=WebFilter`,
          url: `/song_search_v2?keyword=${songName}&page=1&clientver=&platform=WebFilter`,
          type: "GET",
          dataType: "json",
          success: function (res) {
            self.data = res.data;
            self.songList = self.data.lists;
            self.showLyrics = false;
          },
          error: function () {
            console.log(arguments);
          }
        })
      },
      setMusicUrl: function (index) {
        let self = this;
        self.lyrics = [];
        self.musicId = self.songList[index].FileHash;
        var audio = document.querySelector('#audio');
        $.ajax({
//          url: `/api/search/get/?s=${songName}&limit=40&type=1&offset=0`,
//          url: `http://www.kugou.com/yy/index.php?r=play/getdata&hash=${self.musicId}`,
          url: `/yy/index.php?r=play/getdata&hash=${self.musicId}`,
          type: "GET",
          dataType: "json",
          success: function (res) {
            self.musicUrl = res.data.play_url;
            audio.loop = true;
            audio.load();
            self.isPlaying = false;
            self.showName = true;
            self.song_name = res.data.song_name;
            self.author_name = res.data.author_name;
            self.showLyrics = true;
            let lyricsTemp = res.data.lyrics.split("\r\n");
            self.render(lyricsTemp);
          },
          error: function () {
            console.log(arguments);
          }
        });
      },
      play: function () {
        var audio = document.querySelector('#audio');
        if (!this.isPlaying) {
          audio.play();
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

      }

    }
  })

</script>
<style lang="scss" scoped="">
  @import "../scss/_size.scss";

  * {
    margin: 0;
    padding: 0;

    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }

  .player_logo {
    position: absolute;
    opacity: 0;
    z-index: -100;
    filter: alpha(opacity=0);
  }

  .wrapper {
    width: px(375);
    min-height: 100%;
    position: relative;
    box-sizing: border-box;
    text-align: center;
    background: url("../assets/timg1.jpg") no-repeat;
    background-size: cover;

    .searchBox {
      margin-top: px(15);
      padding-left: px(20);
      width: px(230);
      height: px(50);
      font-size: px(16);
      border-radius: px(10);
      border: 0;
      outline: none;
      color: #fff;
      background: rgba(158, 109, 74, 0.5);
    }
    .searchBox::-webkit-input-placeholder {
      color: #dddddd;
      font-size: px(16);
    }
    .searchBtn {
      border-radius: px(10);
      border: 0;
      width: px(100);
      height: px(50);
      background: rgba(158, 109, 74, 0.5);
      font-size: px(16);
      color: #fff;
      outline: none;
    }
    .songList {
      width: px(350);
      margin: px(10) auto;
      padding: px(5);
      height: 50%;
      max-height: px(300);
      border: 1px solid #ddd;
      overflow: auto;
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
      width: px(350);
      margin: px(10) auto;
      height: px(300);
      border: 1px solid #ddd;
      overflow: hidden;
      border-radius: px(10);
      background: url("../assets/asi1.jpg");
      background-size: cover;
    }
    .audioBar {
      width: 100%;
      height: px(120);
      border-top-left-radius: px(50);
      border-top-right-radius: px(50);
      background: rgba(226, 226, 226, 0.2);
      position: fixed;
      bottom: 0;
      .btn {
        margin: px(10) auto 0 auto;
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
      marquee {
        color: #fff;
      }
      audio {
        width: 100%;
        height: px(100);
      }

    }

    #progress {
      margin: px(5) auto;
      width: 80%;
      height: px(3);
      background: #ccc;
    }
    /*进度加载*/
    #bar {
      width: 0;
      height: 100%;
      background: #39f;
      display: block;
      position: relative;
      left: 0;

    }
    /*控制点*/
    #control {
      width: 8px;
      height: 8px;
      background: #fff;
      position: relative;
      top: -8px;
      left: -14px;
      border-radius: 100%;
      border: 3px solid rgba(0, 0, 0, 0.4);
      cursor: pointer;
    }
    .lyrics {
      width: 100%;
      min-height: px(300);
      background: rgba(0, 0, 0, 0.5);
      .lyricsBar {
        position: relative;
        transition: top 0.5s;
        top: px(150);
        p {
          color: #d9d9d9;
          font-size: px(15);
          height: px(30);
          line-height: px(30);
        }
        .light {
          color: #a6e22d;
        }
      }

    }
    .time {
      position: fixed;
      right: 0;
      bottom: px(80);
      width: px(100);
      font-size: px(12);
      color: #fff;
    }

  }

</style>
