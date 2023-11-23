<template>
    <div>
        <button @click="toggleNumbers()"
            class="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 absolute top-1 right-1 text-gray-500 w-6 h-6 rounded-3xl flex justify-center items-center">
            <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>
        <div v-if="showNumbers" class="absolute top-1 right-8 text-gray-500 border p-2 rounded bg-white shadow">
            <!--
                <div class="text-xs text-gray-400 font-semibold text-left">Width: </div>
            -->
            <button v-for="number in numbers" :key="number" @click="emitValue(number)"
                class="px-2 rounded hover:bg-gray-100">{{ number }}</button>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        width: {
            type: Number,
            required: true,
            validator: (value) => value >= 1 && value <= 3
        }
    },
    data() {
        return {
            showNumbers: false,
            numbers: [1, 2, 3]
        };
    },
    mounted() {
        document.addEventListener('click', this.closeNumbers.bind(this));
    },
    beforeDestroy() {
        document.removeEventListener('click', this.closeNumbers);
    },
    methods: {
        emitValue(value) {
            this.$emit('value-selected', value);
        },
        toggleNumbers() {
            setTimeout(() => {
                console.log('toggle');
                this.showNumbers = !this.showNumbers;
            }, 20);
        },
        closeNumbers() {
            console.log('close')
            this.showNumbers = false;
        },
    }
};
</script>
