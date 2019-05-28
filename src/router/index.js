import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/Main'
import Package from "../components/Package"
import Second from "../components/Second"
// import Test from "../components/Test"
// import Home from "../components/test/Home"
// import Brand from "../components/test/Brand"
// import Member from "../components/test/Member"
// import Cart from "../components/test/Cart"
// import Me from "../components/test/Me"


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/package',
      name: 'Package',
      component: Package
    },
    {
      path: '/second',
      name: 'Second',
      component: Second
    },
    /*{
      path: '/test',
      name: 'Test',
      component: Test,
      redirect:'/test/Home',

      children:[
        {
          path:"/test/Home",
          name: 'Home',
          component: Home
        },

        {
          path:"/test/Cart",
          name: 'Cart',
          component: Cart
        },
        {
          path:"/test/Brand",
          name: 'Brand',
          component: Brand
        },
        {
          path:"/test/Me",
          name: 'Me',
          component: Me
        },
        {
          path:"/test/Member",
          name: 'Member',
          component: Member
        },
      ],
    }*/
  ]
})
