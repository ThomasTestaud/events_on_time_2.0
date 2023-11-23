<template>
    <div class="pt-8"></div>
    <div class="flex justify-evenly w-full relative px-4 pb-8">
        <div class="w-4/12 sticky top-20 max-h-80 pr-4">

            <RouterLink to="/graphs"
                class="relative flex justify-center items-center text-gray-400 hover:text-gray-500 border border-gray-300 rounded-lg w-full bg-gray-100 hover:bg-gray-200 transition duration-300 p-2 mb-2">
                <i class="fa-solid fa-chevron-left absolute left-2"></i>
                <div class="text-xl font-bold">Back</div>
            </RouterLink>

            <div class="border border-gray-300 rounded-lg w-full m-auto flex flex-col relative overflow-hidden">
                <div
                    class="flex justify-between text-gray-400 font-semibold bg-gray-100 border-b border-gray-300 m-b2 text-sm px-6">
                    <span>name</span>
                    <span>unit</span>
                </div>
                <div class="p-4 flex flex-col">
                    <template v-for="datatype, index in datatypes">
                        <button @click="getData(datatype.id)"
                            :class="[datalist.includes(datatype.id) ? 'bg-gray-100 border' : '', 'flex items-center hover:bg-gray-100 rounded transition duration-300 px-2 mt-1']">
                            <input type="checkbox" :checked="datalist.includes(datatype.id)" class="mr-2">
                            <span class="text-gray-700">{{ datatype.name }}</span>
                            <span v-if="datalist.includes(datatype.id)"
                                :style="['border: 2px solid ' + graphColors[index].borderColor + ';']"
                                class="ml-2 w-12 rounded"></span>
                            <span class="text-gray-400 text-sm ml-auto">{{ unitTable[datatype.unit] || datatype.unit
                            }}</span>
                        </button>
                    </template>
                </div>
            </div>

            <div
                class="mt-2 border border-gray-300 rounded-lg font-semibold text-sm text-gray-500 w-full m-auto flex justify-around overflow-hidden mb-2">
                <template v-for="interval, index in intervals">
                    <button @click="selectedInterval = interval.value; requestDatas()"
                        :class="[selectedInterval === interval.value ? 'bg-gray-100' : '', 'py-1 px-2 w-full']">
                        {{ interval.name }}
                    </button>
                    <div v-if="index < intervals.length - 1" class="border-r border-gray-300"></div>

                </template>
            </div>

            <div class="border border-gray-300 rounded-lg w-full m-auto flex flex-col relative overflow-hidden mb-2">
                <div
                    class="flex justify-center text-gray-400 font-semibold bg-gray-100 border-b border-gray-300 m-b2 text-sm px-6">
                    <span>Type of graph</span>
                </div>
                <div class="p-4 flex flex-col">
                    <template v-for="graph, index in graphAvalible">
                        <button
                            @click="graphList.includes(graph) ? graphList = graphList.filter(item => item !== graph) : graphList.push(graph)"
                            :class="[graphList.includes(graph) ? 'bg-gray-100 border' : '', 'flex items-center hover:bg-gray-100 rounded transition duration-300 px-2 mt-1']">
                            <input type="checkbox" :checked="graphList.includes(graph)" class="mr-2">
                            <span class="text-gray-700">{{ graph }}</span>
                            <button v-if="graphList.includes(graph)" class="text-gray-400 text-sm ml-auto grabbable">
                                <i class="fa-solid fa-grip-vertical"></i>
                            </button>
                        </button>
                    </template>
                </div>
            </div>

            <button
                class="flex justify-center items-center text-gray-400 hover:text-gray-500 border border-gray-300 rounded-lg w-full bg-gray-100 hover:bg-gray-200 transition duration-300 p-2 mb-2">
                <i class="fa-regular fa-floppy-disk mr-2"></i>
                <div class="text-xl font-bold">Save</div>
            </button>
        </div>

        <div class="w-8/12 inline-block grid-container border border-gray-300 rounded-lg bg-gray-100">
            <GrapLoader :datatypes="datatypes" :data="data" :graphList="graphList" :unitTable="unitTable"/>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import graphColors from '@/stores/graphColors.json'
import GrapLoader from '@/components/eventsOnTime/GraphLoader.vue';



//////////////////////////////////////
// This component's internal config //
//////////////////////////////////////
//Interval picker setup
let intervals = [
    { name: '12 mois', value: 365 },
    { name: '30 jours', value: 30 },
    { name: '14 jours', value: 14 },
    { name: '7 jours', value: 7 },
    { name: "Aujourd'hui", value: 1 },
];
//All graphs avalible
let graphAvalible = ref(['headnumbers', 'line', 'barTotal', 'pieTotal']);
//All datatypes for that user
//Used to display the list of datatypes and to fill in "datalist"
const datatypes = ref([]);
//All the REAL data displayed in the graphs
const data = ref([]);




//////////////////////////////////////
//        DATA THAT IS SAVED        //
//     IN DDB AS A GRAPH CONFIG     //
//////////////////////////////////////
/*
Datatypes selected by the user. (Used to request data in this component)
Saved in DDB in Graphs_Datatypes table. (Array of datatypeId)
*/ let datalist = ref([]);
/*
Selected interval from the user. (Used to request data in this component)
Saved as an int (corresponding to the amount of days) in DDB in Graphs table.
*/
let selectedInterval = ref(7);
/*
Unit table to convert units. (Used to convert units in the graphLoader component)
Saved as is (Object) in DDB in Graphs table.
*/ let unitTable = ref({ secondes: 'heures' });
/*
Graphs selected for that graph. (Used to display the apropriate graphs in the graphLoader component)
Saved as is (Array) in DDB in Graphs table.
*/ let graphList = ref(['headnumbers', 'line', 'barTotal', 'pieTotal']);




//////////////////////////////////////
//           FUNCTIONS              //
//////////////////////////////////////
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
    axios.get(import.meta.env.VITE_API_URL + "/datatypes/list/" + datalist.value + "/" + selectedInterval.value, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
    })
        .then((response) => {
            data.value = response.data;
        })
        .catch((error) => {
            console.log(error)
        })
}

</script>

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

.grabbable {
    cursor: move;
    /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
}

/* (Optional) Apply a "closed-hand" cursor during drag operation. */
.grabbable:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
}
</style>
  
  