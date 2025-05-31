import { createRouter, createWebHistory } from 'vue-router';
import UserProfile from '../components/UserProfileHeader.vue';
import AboutUs from '../views/about-us/AboutUsView.vue';
import Adventure from '../views/adventure/AdventureView.vue';
import ChatBot from '../views/ai/ChatBotView.vue';
import Login from '../views/auth/LoginView.vue';
import Register from '../views/auth/RegisterView.vue';
import Home from '../views/home/HomeView.vue';
import Checkout from '../views/product/CheckoutView.vue';
import CheckoutComfirm from '../views/product/OrderConfirmationView.vue';
import ProductDetail from '../views/product/ProductDetailView.vue';
import ProductView from '../views/product/ProductView.vue';
import SiemReap from '../views/siem-reap/SiemReapView.vue';
import DetailsView from '../views/travel/TravelDetailView.vue';
import WishlistView from '../views/wishlist/WishlistView.vue';
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Home',
      transition: 'fade'
    }
  },
  {
    path: '/adventure',
    name: 'adventure',
    component: Adventure,
    meta: {
      title: 'Home',
      transition: 'slide-right'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'Login',
      transition: 'fade'
    }
  }, {
    path: '/profile',
    name: 'profile',
    component: UserProfile,
    meta: {
      title: 'Login',
      transition: 'fade'
    }
  }, {
    path: '/checkout',
    name: 'checkout',
    component: Checkout,
    meta: {
      title: 'Check',
      transition: 'fade'
    }
  }, {
    path: '/order-confirmation',
    name: 'order-confirmation',
    component: CheckoutComfirm,
    meta: {
      title: 'Order Comfirmation',
      transition: 'fade'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      title: 'Register',
      transition: 'fade'
    }
  },
  {
    path: '/siem-reap',
    name: 'siemReap',
    component: SiemReap,
    meta: {
      title: 'Siem Reap',
      transition: 'slide-up'
    }
  },{
    path: '/favorites',
    name: 'wish list',
    component: WishlistView,
    meta: {
      title: 'wishlist',
      transition: 'slide-up'
    }
  },
  {
    path: '/about-us',
    name: 'About Us',
    component: AboutUs,
    meta: {
      title: 'About Us',
      transition: 'slide-up'
    }
  },
  {
    path: '/chatbot',
    name: 'chatbot',
    component: ChatBot,
    meta: {
      title: 'Chat',
      transition: 'slide-left'
    }
  },
  {
    path: '/product',
    name: 'product',
    component: ProductView,
    meta: {
      title: 'Products',
      transition: 'slide-left',
      headerType: 'product'  // Add this line
    }
  },
  {
    path: '/product/detail/:id',
    name: 'product-detail',
    component: ProductDetail,
    meta: {
      title: 'Shop',
      transition: 'fade'
    }
  }, 
  // {
  //   path: '/location/getone/:id',
  //   name: 'product-detail',
  //   component: GetOneLocation,
  //   meta: {
  //     title: 'detail',
  //     transition: 'fade'
  //   }
  // },
  {
    path: '/location/detail/:id',
    name: 'location-details',
    component: DetailsView,
    // props: true,
    meta: {
      title: 'Details',
      transition: 'fade'
    }
  },
  {
    path: '/:pathMatch(.*)*', 
    // name: 'notFound',
    // component: () => import('../views/NotFound.vue'),
    // meta: { 
    //   title: 'Page Not Found',
    //   transition: 'fade'
    // }
     redirect: '/', // or component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

// Title and transition handling
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title}` : 'Camtour';
  next();
});

export default router;