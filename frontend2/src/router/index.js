import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/ResetPasswordView.vue')
    },
    {
      path: '/',
      name: 'Dashboards',
      component: () => import('../views/eventsOnTime/DashboardsView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/graphs',
      name: 'graphs',
      component: () => import('../views/eventsOnTime/GraphsView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/create-graph',
      name: 'create-graph',
      component: () => import('../views/eventsOnTime/GraphCreateView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/datas',
      name: 'datas',
      component: () => import('../views/eventsOnTime/DatasView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router
