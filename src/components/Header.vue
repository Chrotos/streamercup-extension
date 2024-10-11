<template>
  <div class="bg-accent flex flex-row justify-center w-full text-2xl">
    <h1 class="m-0 relative inline py-[2px] header-border">STREAMERCUP</h1>
  </div>
</template>

<style scoped>
.header-border::before {
  z-index: 1;
  left: -5px;
  position: absolute;
  content: "";
  border: solid 2px;
  width: calc(100% + 10px);
  height: calc(100% - 2px);
}
</style>