import Vue from 'vue';
import Router from 'vue-router';
import Menu from '../components/LandingPage/Menu.vue';
import HospitalInfo from '../components/LandingPage/HospitalInfo.vue';
import NetworkInfo from '../components/LandingPage/NetworkInfo.vue';
import CreatedInfo from '../components/LandingPage/CreatedInfo.vue';
import PacsInfo from '../components/LandingPage/PacsInfo.vue';
import HospitalDetailInfo from '../components/LandingPage/HospitalDetailInfo.vue';
import Exit from '../components/LandingPage/Exit.vue';
import Login from '../components/LandingPage/Login.vue';
import ContainManagement from '../../renderer/components/ContainManagement.vue';
import Versions from '../components/LandingPage/Versions.vue';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default,
    },
    {
      path: '/containManagement',
      name: 'containManagement',
      component: ContainManagement,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/versions',
      name: 'versions',
      component: Versions,
    },
    {
      path: '/menu',
      name: 'menu',
      component: Menu,
    },
    {
      path: '/hospitalInfo',
      name: 'hospitalInfo',
      component: HospitalInfo,
    },
    {
      path: '/networkInfo',
      name: 'networkInfo',
      component: NetworkInfo,
    },
    {
      path: '/createdInfo',
      name: 'createdInfo',
      component: CreatedInfo,
    },
    {
      path: '/pacsInfo',
      name: 'pacsInfo',
      component: PacsInfo,
    },
    {
      path: '/hospitalDetailInfo',
      name: 'hospitalDetailInfo',
      component: HospitalDetailInfo,
    },
    {
      path: '/exit',
      name: 'exit',
      component: Exit,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
