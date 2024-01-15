<template>
  <footer class="w-100 text-center fixed left-0 bottom-0 border-solid border-t-[2px] bg-accent w-full flex justify-center">
    <img v-if="branding === 'twitch'" class="object-scale-down w-[80%] py-[10px] px-0" src="../assets/img/branding/Twitch_PoweredBy_Horizontal_White.png" />
  </footer>
</template>

<script setup>
const {branding} = defineProps({
  branding: String
})
</script>

<style scoped>

</style>