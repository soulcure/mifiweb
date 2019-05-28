<template>
    <div>
      <h1 @click="goBack">goback</h1>
      <div class="parent">
       <!-- <img src="../assets/ad502.png">
        <img src="../assets/ad502.png">
        <img src="../assets/ad502.png">
        <img src="../assets/ad502.png">-->

      </div>

    </div>
</template>

<script>
    export default {
        name: "second",
      methods:{
        goBack() {
          console.log("===goBack2======")
          this.$router.go(-1)
        }
      },

    }
</script>

<style scoped>
  .parent{
    margin-top: 30px;
    width: 100vw;
    background: green;
  }
  img{
    width: auto;
    height: auto;
    max-width: 100%;
  }

</style>
