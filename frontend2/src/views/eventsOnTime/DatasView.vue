<template>
  <div class="pt-8"></div>
  <div class="flex justify-evenly w-full relative px-4 pb-8">
    <div class="w-4/12 sticky top-20 max-h-80 pr-4">
      <div class="border border-gray-300 rounded-lg w-full m-auto p-4 flex flex-col relative">
        <template v-for="datatype, index in datatypes">
          <button @click="getData(datatype.id)"
            :class="[datalist.includes(datatype.id) ? 'bg-gray-100 border' : '', 'flex items-center hover:bg-gray-100 rounded transition duration-300 px-2 mt-1']">
            <input type="checkbox" :checked="datalist.includes(datatype.id)" class="mr-2">
            <span class="text-gray-700">{{ datatype.name }}</span>
            <span v-if="datalist.includes(datatype.id)"
              :style="['border: 2px solid ' + graphColors[index].borderColor + ';']" class="ml-2 w-12 rounded"></span>
            <span class="text-gray-400 text-sm ml-auto">{{ unitTable[datatype.unit] || datatype.unit }}</span>
          </button>
        </template>
      </div>

      <div
        class="mt-2 border border-gray-300 rounded-lg font-semibold text-sm text-gray-500 w-full m-auto flex justify-around overflow-hidden">
        <template v-for="interval, index in intervals">
          <button @click="selectedInterval = interval; requestDatas()"
            :class="[selectedInterval.name === interval.name ? 'bg-gray-100' : '', 'py-1 px-2 w-full']">
            {{ interval.name }}
          </button>
          <div v-if="index < intervals.length - 1" class="border-r border-gray-300"></div>

        </template>
      </div>

      <div
        class="mt-2 border border-gray-300 rounded-lg font-semibold text-sm text-gray-500 w-full m-auto flex justify-around overflow-hidden">
        <template v-for="graph, index in graphAvalible">
          <button
            @click="graphList.includes(graph) ? graphList = graphList.filter(item => item !== graph) : graphList.push(graph)"
            :class="[graphList.includes(graph) ? 'bg-gray-100' : '', 'py-1 px-2 w-full']">
            {{ graph }}
          </button>
          <div v-if="index < graphAvalible.length - 1" class="border-r border-gray-300"></div>

        </template>
      </div>
    </div>

    <div class="w-8/12 inline-block grid-container">
      <template v-if="data.length > 0">
        <headnumbers v-if="graphList.includes('headnumbers')" :datatypes="datatypes" :data="data" />
        <LineGraph v-if="graphList.includes('line')" :datatypes="datatypes" :data="data" />
        <BarTotalGraph v-if="graphList.includes('barTotal')" :datatypes="datatypes" :data="data" />
        <PieTotalGraph v-if="graphList.includes('pieTotal')" :datatypes="datatypes" :data="data" />
      </template>

      <div v-else class="item-3 h-full flex justify-center items-center border border-gray-300 rounded-lg">
        <div class="text-gray-400 text-2xl">No data to display</div>
      </div>
    </div>
  </div>
</template>

<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.grid-item {
  text-align: center;
  grid-column: span 1;
  /* This will make the item span one column */
  grid-row: span 1;
}

.item-2 {
  grid-column: span 2;
}

.item-3 {
  grid-column: span 3;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import LineGraph from '@/components/eventsOnTime/graphTypes/LineGraph.vue';
import BarTotalGraph from '@/components/eventsOnTime/graphTypes/BarTotalGraph.vue';
import PieTotalGraph from '@/components/eventsOnTime/graphTypes/PieTotalGraph.vue';
import graphColors from '@/stores/graphColors.json'
import headnumbers from '@/components/eventsOnTime/graphTypes/HeadNumbers.vue';

const datatypes = ref([]);
const data = ref([]);
let datalist = ref([]);

let intervals = [
  { name: '12 mois', value: 365 },
  { name: '30 jours', value: 30 },
  { name: '14 jours', value: 14 },
  { name: '7 jours', value: 7 },
  { name: "Aujourd'hui", value: 1 },
];
let selectedInterval = ref(intervals[intervals.length - 2]);

let graphList = ref(['headnumbers', 'line', 'barTotal', 'pieTotal']);
let graphAvalible = ref(['headnumbers', 'line', 'barTotal', 'pieTotal']);


let unitTable = ref({
  secondes: 'heures',
});

function convertUntis(object) {
  if (object.unit === "secondes") {
    if (unitTable.value[object.unit] === "minutes") {
      object.unit = "minutes"
      object.Data = object.Data.map(item => {
        item.value = item.value / 60
        return item
      });
    } else if (unitTable.value[object.unit] === "heures") {
      object.unit = "heures"
      object.Data = object.Data.map(item => {
        item.value = item.value / 60 / 60
        return item
      });
    }
  }
  return object;
}


onMounted(() => {
  getDatatypes()
});

function getDatatypes() {
  axios.get(import.meta.env.VITE_API_URL + "/datatypes", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      //console.log(response)
      datatypes.value = response.data;
    })
    .catch((error) => {
      console.log(error)
    })
}

function getData(datatypeId) {
  //Manage datalist
  if (datalist.value.includes(datatypeId)) {
    datalist.value = datalist.value.filter((item) => item !== datatypeId);
  } else {
    datalist.value.push(datatypeId);
  }

  //Stop function is list is empty
  if (datalist.value.length === 0) {
    data.value = [];
    return;
  }

  //Request
  requestDatas();
}

function requestDatas() {
  axios.get(import.meta.env.VITE_API_URL + "/datatypes/list/" + datalist.value + "/" + selectedInterval.value.value, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      data.value = response.data.map(item => convertUntis(item));
    })
    .catch((error) => {
      console.log(error)
    })
}

</script>
