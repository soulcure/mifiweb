<template>
  <div class="test">
    <router-view></router-view>
    <TestTab></TestTab>

  </div>

</template>

<script>
  import TestTab from "./test/Tab"

  export default {
    name: "test",
    components: {
      TestTab
    },
    methods: {
      goSecond() {
        console.log("===goSecond======")
        this.$router.push('/second')
      },
      goBack() {
        console.log("===goBack1======")
        this.$router.go(-1)
      }
    },
    created() {
      // console.log("======created=======")
      // this.axios.get("/sayit").then((data) => {
      //   console.log("data", data)
      // }).catch((error) => {
      //
      //   console.log("error", error)
      // })
    },
  }
</script>

<style scoped>
  .test {
    height: 100vh;
    background-color: #707274;
  }

  .test-route {
  }

  .test-item {
    width: inherit;
    height: 100px;
    background-color: #000000;
  }

</style>
