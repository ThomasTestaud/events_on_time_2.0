<template>
  <div :class="'flex flex-wrap relative bg-white p-4 border rounded-lg grid-item item-' + width">
    <WidthPicker :width="width" @value-selected="width = $event" />

    <template v-for="element in props.data">

      <div class="p-2">
        <p class="text-gray-600 text-left font-semibold">{{ element.name }}</p>
        <div class="flex items-end">
          <span class="text-3xl font-semibold">{{ calculateSum(element.Data) }}</span>
          <span class="text-xl font-semibold ml-1">{{ element.unit }}</span>
        </div>
        <div :style="'border: 2px solid ' + getColorFromId(element.id) + '; border-radius: 2px;'"></div>
      </div>

    </template>

  </div>
</template>

<script setup>
import graphColors from '@/stores/graphColors.json'
import WidthPicker from '@/components/eventsOnTime/WidthPicker.vue'
import { ref } from 'vue'

let width = ref(3); //default value of the graph


const props = defineProps({
  datatypes: Array,
  data: Object,
});

function calculateSum(data) {
  return Math.floor(data.reduce((sum, subitem) => sum + subitem.value, 0));
}

function getColorFromId(id) {
  const colors = graphColors.map((item) => item.borderColor);
  return colors[props.datatypes.findIndex((item) => item.id === id)];
}

</script>
