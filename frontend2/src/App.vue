<template>
  <Header />
  <RouterView />
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import router from './router'
import Header from './components/Header.vue'
import axios from 'axios'
import { ref } from 'vue'

export default {
  components: {
    RouterLink,
    RouterView,
    Header
  },
  setup() {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      axios.get(import.meta.env.VITE_API_URL + "/user/refresh-token", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        //console.log(response.data);
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          sessionStorage.setItem("token", response.data.token);
        }
      })
      .catch((error) => {
        //console.log(error.response.status);
        if (error.response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      })
    }
  }
}
</script>
