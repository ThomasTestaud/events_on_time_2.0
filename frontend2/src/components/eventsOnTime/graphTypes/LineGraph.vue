<template>
    <div :class="'relative justify-center bg-white p-4 border rounded-lg grid-item item-' + width">
        <WidthPicker :width="width" @value-selected="width = $event" />
        <canvas v-if="canvas" class="" ref="graph" height="1" :width="width"></canvas>
    </div>
</template>
  
<script setup>
import { ref, onMounted, watchEffect, nextTick, watch } from 'vue';
import Chart from 'chart.js/auto';
import graphColors from '@/stores/graphColors.json'
import WidthPicker from '@/components/eventsOnTime/WidthPicker.vue'

const props = defineProps({
    datatypes: Array,
    data: Object,
});


const graph = ref(null);
let chart = null;
let ctx = null;
let width = ref(2); //default value of the graph
let canvas = ref(true);


onMounted(() => {
    ctx = graph.value.getContext('2d');
    chart = new Chart(ctx, chartConfig);

    watchEffect(() => {
        replaceChartData(props.data);
    });

    watch(width, (newWidth) => {
        if (newWidth) {
            rewriteCanvas()
        }
    });
});

function rewriteCanvas() {
    canvas.value = false;
    nextTick(() => {
        canvas.value = true;
        nextTick(() => {
            ctx = graph.value.getContext('2d');
            chart = new Chart(ctx, chartConfig);
            chart.update();
        });
    });
}


function replaceChartData(data) {

    if (data.length === 0) {
        chartConfig.data.labels = [];
        chartConfig.data.datasets = [];
        chart.update();
        return;
    }
    chartConfig.data.labels = data[0].Data.map((item) => item.timestamp.slice(8, 10) + '/' + item.timestamp.slice(5, 7));

    chartConfig.data.datasets = data.map((item, index) => {
        return {
            label: item.unit,
            //data: item.Data.map((subitem) => convertUntis(subitem.value, item.unit)),
            data: item.Data.map((subitem) => subitem.value),
            fill: true,
            borderWidth: 2,
            borderColor: graphColors[getIndexColorFromId(data[index].id)].borderColor,
            backgroundColor: graphColors[getIndexColorFromId(data[index].id)].backgroundColor,
        };
    });

    chart.update();
}

function getIndexColorFromId(id) {
    return props.datatypes.findIndex((item) => item.id === id);
}


let chartConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: '',
            data: [],
            fill: true,
            borderWidth: 2,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
        }],
    },

    options: {
        pointStyle: true,
        pointRadius: 1,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 6,
        tension: 0.15,
        scales: {
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0)',
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 0.4)',
                },
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 0.4)',
                },
                beginAtZero: true,
            },
        },
        plugins: {
            legend: false,
        },
    },
};
</script>
  