<template>
  <div id="main" class="main">
    <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 v-bind:src="musicUrl"></iframe>
    <br>
    <input type="text" v-model="musicName" class="searchBox"/>
    <button v-on:click="getData(musicName)">搜索</button>
    <ul class="songList">
      <li v-for="(item,index) in songList" v-show="songList" v-on:click="setMusicUrl(index)">{{item.name + item.artists[0].name}}</li>

    </ul>
  </div>
</template>
<script>
  import $ from "jquery"
  export default({
    data() {
      return{
        musicName: "",
        songList: [],
        data: "",
        musicId: "",
        musicUrl: "",
        singer: ""
      }

  },
    methods: {
      getJson: function (url) {
        let promise = new Promise(function (resolve, reject) {
          let client = new XMLHttpRequest();
          client.open('POST', url);
          client.onreadystatechange =handler;
          client.send();

          function handler() {
            if (this.readyState !== 4) {
              return;
            }
            if (this.status === 200) {
              console.log(client);
              resolve(this.response);
            } else {
              reject(new Error(this.statusText));
            }
          }
        });
        return promise;
      },
      getData: function (songName) {
        let self = this;
//        self.postJSON("/api/search/get/",songName).then(function (res) {
//          self.songs = res;
//          self.data = res.substring(1,res.length-2);
//          self.songs = JSON.parse(self.data).song;
//        }, function (error) {
//          console.log(songName);
//          alert("出错了");
//        })
        $.ajax({
          url:"http://music.163.com/api/search/get/",
          type: "POST",
          dataType:"json",
          data:{
            s:songName,
            limit:20,
            type:1,
            offset:1
          },
          success:function (res) {
            self.data = res.result;
            self.songList = self.data.songs;
//            self.data = res.substring(1,res.length-2);
//            self.songs = JSON.parse(self.data).song;
          },
          error:function () {
            console.log(arguments);
          }
        })
      },
      setMusicUrl: function (index) {
        let self = this;
        self.musicId = self.songList[index].id;

//        self.musicUrl = "//music.163.com/outchain/player?type=1&id="+self.musicId+"&auto=1&height=66";
        self.musicUrl = "//music.163.com/outchain/player?type=2&id="+self.musicId+"&auto=1&height=66";
        console.log(self.musicUrl);

      }

    }
  })

</script>
<style>
  .main{
    text-align: center;
  }
  .songList{
    list-style: none;
  }
  .songList li {
    cursor: pointer;
    text-align: center;
  }
  .searchBox{
  }
</style>
