<template>
  <div id="package" style="background-color: #eaeaea">
    <div class="clearfix">
      <mt-header title="Package Details">
        <router-link to="/" slot="left">
          <mt-button icon="back">Back</mt-button>
        </router-link>
      </mt-header>
    </div>
    <div style="padding: 10px;">
      <div class="card" v-for="item in packets" style="margin-bottom: 8px">
        <div style="padding: 5px;">
          <mt-cell title="effective_time" :value="formateTime(item.effective_time)"></mt-cell>
          <mt-cell title="ineffective_time" :value="formateTime(item.ineffective_time)"></mt-cell>
          <mt-cell title="used_data" :value="formateData(item.used_data)"></mt-cell>
          <mt-cell title="total_data" :value="formateData(item.total_data)"></mt-cell>
          <mt-cell title="type" :value="item.type"></mt-cell>
        </div>

      </div>
    </div>


  </div>
</template>

<script>
  export default {
    name: "package",
    data() {
      return {
        packets: [],
      }
    },
    methods: {
      formateData(data) {
        let number = data / 1024;
        let str = Math.round(number * 100) / 100 + "M";
        return str;

      },
      formateTime(time) {
        let unixTimestamp = new Date(time * 1000);
        let commonTime = unixTimestamp.toLocaleString()
        return commonTime;
      },

      getPackage(sn, packageId, callback) {
        if (sn == null || sn === '') {
          return 0;
        }
        console.log("sn=", sn, "packageid=", packageId)
        //执行 POST 请求
        let params = new URLSearchParams();
        params.append('api_name', 'query_packet');
        params.append('device_sn', sn);
        params.append('device_package_id', packageId);
        this.axios.post('/api', params)
          .then((response) => {
            if (response.data.code != 0) {
              return;
            }
            let data = response.data.data;
            let packets = data.packets;
            this.packets = packets;
            console.log("packets", packets)
            if (callback != null) {
              callback();
            }


          }).catch((error) => {
          console.log(error);
        });
      },
    },
    created() {
      let packageid = this.$route.query.package_id;
      let sn = this.$route.query.device_sn;
      this.getPackage(sn, packageid)
    }
  }
</script>

<style scoped>
  .card {
    background: #fff;
    border-radius: 5px;

  }


</style>
