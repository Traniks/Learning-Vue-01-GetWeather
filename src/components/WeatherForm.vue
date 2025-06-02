<script setup>
    defineProps(['city', 'error']);

    const emit = defineEmits(['update:city', 'submit']);
    function onSubmit(e) {
        emit('submit', e);
    }
</script>

<template>
    <form class="flex items-center w-full justify-between gap-5" @submit.prevent="onSubmit">
        <input type="text"
            class="text border transition duration-300 border-white rounded-lg p-2 w-full outline-emerald-700 focus:outline-3"
            :value="city" @input="emit('update:city', $event.target.value)" placeholder="Введите город" />
        <button type="submit" :disabled="error"
            class="w-[200px] px-2 py-3 bg-emerald-500 rounded-2xl hover:bg-emerald-700 transition-colors duration-300 cursor-pointer disabled:opacity-60">Получить
            данные</button>
    </form>
</template>