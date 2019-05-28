<template>
  <div style="background-color: #eaeaea;">
    <!--    <div class="clearfix">
          <mt-header title="固定在顶部"></mt-header>
        </div>-->

    <mt-swipe :auto="4000">
      <mt-swipe-item class="slide1">

        <img src="../assets/ad501.png">

      </mt-swipe-item>
      <mt-swipe-item class="slide2">
        <img src="../assets/ad502.png">
      </mt-swipe-item>
      <mt-swipe-item class="slide3">
        <img src="../assets/ad503.png">

      </mt-swipe-item>
    </mt-swipe>

    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
      <div style="height: 32px;">Packages</div>
      <mt-cell :title="item" is-link :to="{path:'/package',query:{a:item}}" v-for="item in list"></mt-cell>
    </mt-loadmore>
  </div>
</template>

<script>
  export default {
    name: "mian",
    data() {
      return {
        list: [
          "title",
          "title",
          "title",
        ],
        allLoaded: false,
      }
    },
    methods: {
      itemClick(p) {
        console.log("==", p)
        return "/second"

      },
      loadTop() {
        let temp = [];
        for (let i = 0; i < 10; i++) {
          temp.push("title loadTop" + i);
        }
        this.list = temp;
        this.allLoaded = true;
        this.$refs.loadmore.onTopLoaded();

      },
      loadBottom() {
        let temp = [];
        for (let i = 0; i < 50; i++) {
          temp.push("title load bottom" + i);
        }
        this.list = temp;
        this.allLoaded = true;// 若数据已全部获取完毕
        this.$refs.loadmore.onBottomLoaded();
      },
      getPackage() {
        // 也可以通过 params 对象传递参数
        axios.get('/user', {
          params: {
            ID: 12345
          }
        }).then(function (response) {
          console.log(response);
        }).catch(function (error) {
          console.log(error);
        });
        //执行 POST 请求

        axios.post('/api', {
          param1: 'param1',
          param2: 'param2',
        }).then((response) => {
          console.log(response);
        }).catch((error) => {
          console.log(error);
        });

      }


    },
  }
</script>

<style scoped>
  .mint-swipe {
    color: #fff;
    font-size: 30px;
    text-align: center;
    margin-bottom: 20px;
    width: 100vw;
    height: 40.85vw;
  }

  .mint-swipe-item {

  }

  .slide1 {
    background-color: #0089dc;
    color: #fff;
  }

  img {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
  }

  .slide2 {
    background-color: #ffd705;
    color: #000;
  }

  .slide3 {
    background-color: #ff2d4b;
    color: #fff;
  }


</style>
