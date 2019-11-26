<template>
  <div class="main">
    <!--<div class="logo"><img src="/static/img/logo.png"/></div>-->

    <div class="home-info">
      <div class="info-header">
        <div class="signal_wrapper">
          <div class="signal">
            <img :src="curSignal"/>
          </div>
          <!--<strong>{{getSignalGen()}}</strong>-->
          <span>{{curSignalGen}}</span>
        </div>

        <div class="battery">
          <i class="icon iconfont" :class="getPowClass()"></i><span>{{getPow()}}%</span>
        </div>
      </div>
      <div class="info-content">
        <div class="info-content-left info-item">

          <div style="width: 100px;font-size: 32px;text-align: center">
            {{curPackageTodayUsed}}
          </div>

        </div>
        <div class="info-content-right info-item">
          <div>
            <p style="margin: 3px 0;"><strong>MB</strong> Used</p>
            <p style="margin: 3px 0;" :class="getSpeedClass()">{{getSpeed()}}</p>
            <p style="margin: 3px 0;">Connection:{{getConnection()}}</p>
            <!-- <p style="margin-bottom: 10px">SN: {{deviceInfo.deviceSN}}</p>
             <p>HwId: {{deviceInfo.deviceId}}</p>-->
          </div>
        </div>
      </div>
      <div style="width: 100%;height: 30px;color: #fff;font-size: 24px;text-align: center">{{curCountry}}</div>
      <!--<div style="background-color: #ffc107;width: 100%;height: 28px"></div>-->
    </div>

    <!--<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore"-->
    <!--topPullText="pull to refresh" topDropText="drop refresh" topLoadingText="loading...">-->
    <!--<div style="padding-bottom: 2px;font-size: 20px">Packages</div>-->
    <!--<mt-cell :title="item.package_name" is-link-->
    <!--:to="{path:'/package',query:{package_id:item.device_package_id,device_sn:deviceInfo.deviceSN}}"-->
    <!--v-for="item in packageList"></mt-cell>-->
    <!--</mt-loadmore>-->
    <div class="package">
      <ul>
        <li style="padding: 1px 2px" v-for="item in packageList">
          <div style="font-size: 18px;margin-bottom: 2px;color: #5D80D8">{{item.package_name}}</div>
          <div class="detail">
            <div class="detail-left">Used:{{toDecimal(item.data_used/1024)}}MB</div>
            <div class="detail-right">Valid
              peroid:{{item.effective_time.slice(0,10)}}~{{item.ineffective_time.slice(0,10)}}
            </div>
          </div>
        </li>
      </ul>

    </div>

    <!--<div style="margin-top: 10px">
      <p>Global WiFi Customer Service(24 hours)</p>
      <p>TEL(from overseas):+86-50-5840-9686</p>
      <p>TEL(from Japan):0120-510-670</p>
      <p>E-mail:info@townwifi.com</p>
    </div>-->

    <div class="float-btn" @click="shutdownDevice()" hidden><img src="/static/img/shutdown.png"/></div>
  </div>
</template>

<script>
  import {MessageBox} from 'mint-ui';

  export default {
    name: "mainVue",
    data() {
      return {
        deviceInfo: {},
        packageList: [],
        summary: {},
        allLoaded: false,
        curPackageTodayUsed: "--",
        curCountry: "...",
        curSignal: "/static/signal/signal-1.png",
        curSignalGen: "Unknown",
      }
    },
    methods: {
      getSpeedClass() {
        let isLimited = this.getSpeedState();
        if (isLimited) {
          return "slowspeed"
        }
        return ""
      },
      getSpeedState() {

        if (this.isEmptyObject(this.deviceInfo)) {
          return true;
        }
        let speedState = this.deviceInfo.speedState
        // speedState="3|3"
        let stateArr = speedState.split("|")
        let state = false;
        if (stateArr[0] == "rate" && stateArr[1] == "rate") {
          state = true;
        }
        return state;
      },

      getSpeed() {
        let isLimited = this.getSpeedState();
        if (isLimited) {
          return "Slow Speed";
        }
        return "Normal Speed"

      },

      isEmptyObject(obj) {
        if ((typeof obj) === 'string') {
          return true;
        }
        return JSON.stringify(obj) === "{}";
      },
      formateData(data) {
        let number = data / 1024;
        let str = Math.round(number * 100) / 100 + "M";
        return str;

      },

      getConnection() {
        if (this.isEmptyObject(this.deviceInfo)) {
          return "--";
        }
        let connection = this.deviceInfo.hotAmount;
        return connection;
      },
      shutdownDevice() {
        MessageBox({
          title: 'tips',
          message: 'do you want to shutdown?',
          showCancelButton: true,
          confirmButtonText: "yes",
          cancelButtonText: "cancel",
        }).then(action => {
          if (action === "cancel") {
            return;
          }

          this.axios.get('/localserver', {
            params: {
              localApi: "shutdown"
            }
          }).then((response) => {
            this.deviceInfo = response.data;

          }).catch((error) => {
            console.log(error);
          });

        });
      },
      loadTop() {
        this.getPackage(() => {
            this.allLoaded = true;
            this.$refs.loadmore.onTopLoaded();
          }
        );


      },
      loadBottom() {
        this.$refs.loadmore.onBottomLoaded();
        this.allLoaded = true;// 若数据已全部获取完毕
      },
      getPackage(callback) {
        if (this.isEmptyObject(this.deviceInfo)) {
          return 0;
        }
        let sn = this.deviceInfo.deviceSN
        if (sn == null || sn === '') {
          return 0;
        }
        //执行 POST 请求
        let params = new URLSearchParams();
        params.append('api_name', 'query_packages');
        params.append('device_sn', sn);
        this.axios.post('/api', params)
          .then((response) => {
            if (response.data.code != 0) {
              return;
            }
            let data = response.data.data;
            let packages = data.packages;
            let summary = data.summary;
            this.packageList = packages;
            this.summary = summary;

            this.curPackageTodayUsed = this.toDecimal(summary.todayDataUsed / 1024);

            //TODO
            this.curSignal = this.getSignalImg();

            this.curSignalGen = this.getSignalGen();

            if (callback != null) {
              callback();
            }


          }).catch((error) => {
          // console.log(error);
        });
      },
      getCurCountry(callback) {
        if (this.isEmptyObject(this.deviceInfo)) {
          return;
        }
        let sn = this.deviceInfo.deviceSN
        if (sn == null || sn === '') {
          return;
        }
        //执行 POST 请求
        let params = new URLSearchParams();
        params.append('api_name', 'device_info');
        params.append('device_sn', sn);
        this.axios.post('/api', params)
          .then((response) => {
            if (response.data.code != 0) {
              return;
            }
            let data = response.data.data;
            this.curCountry = data.countryStr;
            if (callback != null) {
              callback();
            }

          }).catch((error) => {
          // console.log(error);
          this.curCountry = "..."
        });
      },

      toDecimal(x) {
        let f = parseFloat(x);
        if (isNaN(f)) {
          return 0;
        }
        f = Math.round(x * 100) / 100;
        return f;
      },
      getPow() {
        if (this.isEmptyObject(this.deviceInfo)) {
          return 0;
        }
        return this.deviceInfo.pow
      },
      getPowClass() {
        if (this.isEmptyObject(this.deviceInfo)) {
          return "icon-iconset0252"
        }
        if (this.deviceInfo.charge === 1) {
          return "icon-iconset0247"
        }
        let pow = parseInt(this.deviceInfo.pow);
        let classStr = "icon-iconset0251";
        if (pow === 100) {
          classStr = "icon-iconset0252"
        } else if (pow >= 75) {
          classStr = "icon-iconset0251"
        } else if (pow >= 45) {
          classStr = "icon-iconset0250"
        } else if (pow >= 10) {
          classStr = "icon-iconset0249"
        } else {
          classStr = "icon-iconset0248"
        }
        return classStr
      },
      getSignalImg() {
        if (this.isEmptyObject(this.deviceInfo)) {
          return "/static/signal/signal-1.png"
        }
        return this.getSignalLevel();
      },
      getRealNetmodeInt() {
        if (this.isEmptyObject(this.deviceInfo)) {
          return 0;
        }
        let netmode = parseInt(this.deviceInfo.sim1.netMode);
        let mode = 0;
        switch (netmode) {
          //2G
          case 1:
            mode = 2;
            break;
          case 2:
            mode = 2;
            break;
          case 16:
            mode = 2;
            break;
          //3G
          case 3:
            mode = 3;
            break;
          case 8:
            mode = 3;
            break;
          case 9:
            mode = 3;
            break;
          //4G
          case 13:
            mode = 4;
            break;
          case 19:
            mode = 4;
            break;
          default:
            mode = 0;
        }
        return mode;

      },
      getSignalGen() {
        let mode = this.getRealNetmodeInt()
        if (mode === 0) {
          return "Unknown"
        }
        return mode + "G";
      },

      getSignalLevel() {
        let mode = this.getRealNetmodeInt()
        if (mode === 0) {
          return "/static/signal/signal-5";
        }

        let signal = parseInt(this.deviceInfo.sim1.signal);
        if (mode === 4) {
          signal = signal + 15;
        }
        if (signal >= -79 && signal <= -50) {
          return "/static/signal/signal-5.png"
        }
        if (signal >= -89 && signal <= -80) {
          return "/static/signal/signal-4.png"
        }
        if (signal >= -99 && signal <= -90) {
          return "/static/signal/signal-3.png"
        }
        if (signal >= -109 && signal <= -100) {
          return "/static/signal/signal-2.png"
        }
        if (signal >= -120 && signal <= -110) {
          return "/static/signal/signal-1.png"
        }
        return "/static/signal/signal-1.png"
      },

    },

    created() {
// 也可以通过 params 对象传递参数
      this.axios.get('/localserver', {
        params: {
          localApi: "info"
        }
      }).then((response) => {
        this.deviceInfo = response.data;
        this.getPackage();
        this.getCurCountry();

      }).catch((error) => {
        console.log(error);
      });
    }

  }
</script>

<style scoped>
  @import "../assets/battery/iconfont.css";

  .main {
    /*background-color: #eaeaea;*/
    background-color: #fff;
    padding: 10px;
    height: 100vh;
  }

  .logo {
    /*background-color: #ffc107;*/
    height: 30px;
    width: 275px;
    margin: 0 auto;
    margin-bottom: 16px;
  }

  .logo img {
    width: auto;
    height: auto;
    max-height: 100%;
    max-width: 100%;
  }

  .float-btn {
    width: 40px;
    height: 40px;
    position: fixed;
    top: 220px;
    text-align: center;
    line-height: 40px;
    border-radius: 20px;
    background-color: #ffc107;
    box-shadow: 0 2px 5px #888888;
    right: 30px;
  }

  .float-btn img {
    width: 50%;
    height: 50%;
  }

  .home-info {
    height: 200px;
    width: auto;
    padding: 0;
    box-shadow: 0 3px 5px #888888;
    /*background-color: #26a2ff;*/
    background-color: #5D80D8;
    /*border: 1px solid #26a2ff;*/
    border-radius: 8px;
    position: relative;
    margin-bottom: 10px;
  }

  .info-header {
    color: #fff;
    margin: 0;
    padding: 0;
    position: relative;
    width: auto;
    height: 32px;
    background-color: rgba(0, 0, 0, 0.2);
    /*border: 1px solid #26a2ff;*/
    border-radius: 5px 5px 0 0;
    /*opacity:0.5;*/
  }

  .signal_wrapper {
    left: 0;
    top: 4px;
    position: absolute;
    margin-left: 15px;
    width: 256px;
    height: 18px;
  }

  .signal {
    display: inline-block;
    height: 18px;
    width: 28px;
  }

  .signal img {
    width: auto;
    height: auto;
    max-height: 100%;
    max-width: 100%;
  }

  .battery {
    position: absolute;
    right: 0;
    top: 0;
    margin-right: 15px;
    height: 28px;
    /*background-color: #ffc107;*/
    font-size: 16px;
    text-align: center;
    display: table;
  }

  .battery i {
    font-size: 28px;
    vertical-align: middle;
    display: table-cell;

  }

  .battery span {
    font-size: 16px;
    vertical-align: middle;
    display: table-cell;
  }

  .info-content {
    /*height: 168px;*/
    height: 136px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .info-content-right {

  }

  .info-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-weight: bold
  }

  .info-item:first-child {
    /*background-color: #4caf50;*/

  }

  .info-item:last-child {
    /*background-color: #707274;*/
    text-align: left;
    font-size: 18px;
    font-weight: normal;
  }

  .slowspeed {
    color: #f00;
  }

  .package {

  }

  .package ul li {

    height: 56px;
    /*background-color: #4caf50;*/
    margin: 5px 0;
    padding: 0 2px;
    /*box-shadow: 1px 1px 1px #888888;*/
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    /*background-color: #5D80D8;*/
    border-radius: 2px;
  }

  .package ul li .detail {
    padding-left: 2px;
    padding-right: 2px;
    position: relative;
  }

  .package ul li .detail-left {
    float: left;
  }

  .package ul li .detail-right {
    float: right;
  }

</style>
