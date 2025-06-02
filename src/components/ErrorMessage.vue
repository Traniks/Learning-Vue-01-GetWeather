<script setup>
    defineProps(['errorText']);
</script>

<template>
    <p class="text-red-600">{{ errorText }}</p>
</template>