<template>
    <template v-if="props.data.length > 0" v-for="graph in props.graphList">
        <headnumbers v-if="graph === 'headnumbers'" :datatypes="props.datatypes" :data="props.data" />
        <LineGraph v-if="graph === 'line'" :datatypes="props.datatypes" :data="props.data" />
        <BarTotalGraph v-if="graph === 'barTotal'" :datatypes="props.datatypes" :data="props.data" />
        <PieTotalGraph v-if="graph === 'pieTotal'" :datatypes="props.datatypes" :data="props.data" />
    </template>

    <div v-else class="item-3 h-full flex justify-center items-center">
        <div class="text-gray-400 text-2xl">No data to display</div>
    </div>
</template>

<script setup>
import LineGraph from '@/components/eventsOnTime/graphTypes/LineGraph.vue';
import BarTotalGraph from '@/components/eventsOnTime/graphTypes/BarTotalGraph.vue';
import PieTotalGraph from '@/components/eventsOnTime/graphTypes/PieTotalGraph.vue';
import headnumbers from '@/components/eventsOnTime/graphTypes/HeadNumbers.vue';
import { ref, watchEffect } from 'vue';

const props = defineProps({
    datatypes: Array,
    data: Array,
    graphList: Array,
    unitTable: Object
})

/*
* Convert units to the one in the unit table
*/
function convertUntis(object) {
    if (object.unit === "secondes") {
        if (props.unitTable[object.unit] === "minutes") {
            object.unit = "minutes"
            object.Data = object.Data.map(item => {
                item.value = item.value / 60
                return item
            });
        } else if (props.unitTable[object.unit] === "heures") {
            object.unit = "heures"
            object.Data = object.Data.map(item => {
                item.value = item.value / 60 / 60
                return item
            });
        }
    }
    return object;
}


watchEffect(() => {
    props.data.forEach((object, index) => {
        props.data[index] = convertUntis(object);
    });
});
</script>