<script lang="ts"а  setup>
import { computed } from 'vue'

const props = defineProps(['city', 'error', 'inputPlaceholder', 'buttonText'])
const emit = defineEmits(['update:city', 'submit'])

function onSubmit(e: Event) {
    emit('submit', e);
}

function onInput(e: Event) {
    const target = e.target as HTMLInputElement | null
    if (!target) return
    emit('update:city', target.value)
}

const isDisabled = computed(() =>
    props.error || !props.city || props.city.trim().length < 2
)
</script>

<template>
    <form class="w-full flex items-center justify-between gap-5 flex-col md:flex-row" @submit.prevent="onSubmit">
        <input type="text"
            class="w-full p-2 md:w-[65%] border transition duration-300 border-white rounded-lg outline-emerald-700 focus:outline-3"
            :value="city" @input="onInput" :placeholder="inputPlaceholder" />
        <button type="submit" :disabled="isDisabled"
            class="w-full md:w-[35%] px-2 py-3 bg-emerald-500 rounded-2xl hover:bg-emerald-700 transition-colors duration-300 cursor-pointer disabled:opacity-60">{{
            buttonText }}</button>
    </form>
</template>