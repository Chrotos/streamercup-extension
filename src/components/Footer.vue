<template>
  <div class="w-full text-center border-solid border-t-[2px] bg-accent flex justify-center max-h-12">
    <img v-if="branding === 'twitch'" class="object-scale-down py-[10px] px-0" src="../assets/img/branding/Twitch_PoweredBy_Horizontal_White.png" />
  </div>
</template>

<script setup lang="ts">
const {branding} = defineProps({
  branding: String
})
</script>
