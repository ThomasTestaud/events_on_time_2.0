<template>
  <div class="pt-8"></div>
  <div class="flex justify-evenly w-full relative px-4 pb-8">
    <div class="w-4/12 sticky top-20 max-h-80 pr-4">

      <RouterLink to="/create-graph" class="flex justify-center items-center text-gray-400 hover:text-gray-500 border border-gray-300 rounded-lg w-full bg-gray-100 hover:bg-gray-200 transition duration-300 p-2 mb-2">
        <i class="fa-solid fa-plus mr-2"></i>
        <div class="text-xl font-bold">New graph</div>
      </RouterLink>

      <div class="border border-gray-300 rounded-lg w-full m-auto p-4 flex flex-col relative">
        <button>This a a graph</button>
      </div>

    </div>

    <div class="w-8/12 inline-block grid-container">
      <template v-if="data.length > 0">
        
      </template>

      <div v-else class="item-3 h-full flex justify-center items-center border border-gray-300 rounded-lg">
        <div class="text-gray-400 text-2xl">Select a graph</div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
const data = ref([]);
</script>

