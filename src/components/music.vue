<template>
  <div id="main" class="wrapper">
    <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" v-bind:width="width" v-bind:height="height" v-bind:src="musicUrl"></iframe>
    <input type="text" v-model="musicName" class="searchBox" placeholder="歌曲/歌手"/>
    <button v-on:click="getData(musicName)" class="searchBtn">搜索</button>
    <div class="songList">
      <div v-show="!isMusic" class="noMusic">
        <img src="../assets/noMusic.png" alt="*" class="icon">
        暂无音乐，请搜索！
      </div>
      <ul v-show="isMusic">
        <li v-for="(item,index) in songList" v-show="songList" v-on:click="setMusicUrl(index)">
          <div class="musicBar">
            <p>{{item.name + "  (" + item.album.name + ")"}}</p>
            <p>{{item.artists[0].name}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import $ from "jquery"
  import resize from "../tools/resize";
  import wechat from "../tools/weixin";

  export default ({
    data() {
      return {
        musicName: "",
        songList: [],
        data: "",
        musicId: "",
        musicUrl: "//music.163.com/outchain/player?type=2&id=35470530&auto=1&height=66",
        singer: "",
        width: "",
        height: "",
        isMusic: false
      }

    },

    created: function(){
      let self = this;
      self.width = resize.resetPx(375);
      self.height = resize.resetPx(85);
    },
    methods: {
      getData: function (songName) {
        let self = this;
        $.ajax({
          url: `/api/search/get/?s=${songName}&limit=40&type=1&offset=0`,
          type: "POST",
          dataType: "json",
          success: function (res) {
            self.data = res.result;
            self.songList = self.data.songs;
            self.isMusic = true;
          },
          error: function () {
            console.log(arguments);
          }
        })
      },
      setMusicUrl: function (index) {
        let self = this;
        self.musicId = self.songList[index].id;

        self.musicUrl = "//music.163.com/outchain/player?type=2&id=" + self.musicId + "&auto=1&height=66";
      },
      shareWx: function () {
        wechat.wx.config({
          debug: false,
          appId: '${shakeMap.appId}',
          timestamp: '${shakeMap.timestamp}',
          nonceStr: '${shakeMap.nonceStr}',
          signature: '${shakeMap.signature}',
          jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
          ]
        });
      }

    }
  })

</script>
<style lang="scss" scoped="">
  @import "../scss/_size.scss";

  * {
    margin: 0;
    padding: 0;
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
      margin-top: px(10);
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
      height: px(400);
      border: 1px solid #ddd;
      overflow: auto;
      border-radius: px(10);
      .noMusic{
        width: px(200);
        margin: px(40) auto;
        display: flex;
        height: px(20);
        line-height: px(20);
        color: #fff;
        .icon{
          display: block;
          width: px(20);
          height:px(20);
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
    .searchBox {
    }
  }

</style>
