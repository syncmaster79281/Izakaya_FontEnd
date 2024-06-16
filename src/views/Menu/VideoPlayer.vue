<template>
      <div>
        Input Youtube URL: <input type="text" v-model="vt_url" @click="vt_url=''">
        <button @click="change_yt">切換</button>
      </div>
      <div>
        <h3>vt_url: {{ vt_url  }}</h3>
        <h3>videoID: {{ videoID  }}</h3>
        <h3>ytlink: {{ ytlink  }}</h3>
      </div>
      <div>
      <video width="100%" height="600px" controls autoplay src="../../../public/assets/img/product/vedio.mp4" poster="../../../public/assets/img/product/product2.jpg">
      </video>   
      </div>
</template>
    
<script setup>
      import {ref} from 'vue';
      let vt_url=ref("https://www.youtube.com/watch?v=Ptk_1Dc2iPY");
      let videoID= ref("");
      let ytlink=ref("");

      const change_yt=()=> {
            let str = vt_url.value;
            let urlParams = new URLSearchParams(str.split("?")[1])
            let vid = urlParams.get("v");
            if(vid!=null){
            videoID.value = vid;
            } else {
            let f1 = str.indexOf("?"); 
            if(f1!=-1){
                  str = str.split("?")[0];
            } 
            let f2 = str.indexOf("youtu.be"); 
            let f3 = str.indexOf("embed"); 
            if(f2!=-1){
                  videoID.value = str.split("youtu.be/")[1];
            } else if(f3!=-1){
                  videoID.value = str.split("embed/")[1];
            } else {
                  videoID.value = "";
            }
            }
            ytlink.value = "https://www.youtube.com/embed/"+videoID.value
            }
</script>
    
<style scoped>
      div {
      padding:10px
      }
      .banner{
      width: 100%;
      height: 100vh;
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items:center;
      }
      .banner video{
      position: absolute;
      width: 100%;
      height: 100%;
      top:0;
      left:0;
      object-fit: cover;
      }
      .banner h2{
      position: absolute;
      top:0;
      left:0;
      width: 100%;
      height: 100%;
      font-size: 30vw;
      text-align: center;
      line-height:100vh;
      text-transform:uppercase;
      background-color: #fff;
      mix-blend-mode: screen;

      }
</style>