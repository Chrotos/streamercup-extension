<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-center text-3xl">Radius-Radierer</h1>
    <div class="flex gap-4">
      <button v-for="condition in gameData.conditions" v-bind:key="condition.name" @click="vote(condition.name)" :disabled="voted === condition.name">
        <figure class="flex flex-col gap-3">
          <img :src="`img/${condition.icon}.png`" :alt="String(condition.name)" :data-disabled="voted === condition.name" />
          <figcaption style="text-align: center; width: 100%">{{ condition.display_name }}</figcaption>
        </figure>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/stores/configuration'
import { useExtensionStore } from '@/stores/extension'
import { type Ref, ref } from 'vue'
import { useStateStore } from '@/stores/state'
import { storeToRefs } from 'pinia'
import { RadiusEraserConditionType, type RadiusEraserData } from '@/types/radiusEraser'

const config = useConfigStore()

const extension = useExtensionStore()
const axios = extension.axios

const state = useStateStore()
// @ts-ignore
const { gameData }: { gameData: Ref<RadiusEraserData> } = storeToRefs(state)

const voted = ref<RadiusEraserConditionType>(RadiusEraserConditionType.Null)

function vote(condition: RadiusEraserConditionType) {
  voted.value = condition;
  axios.post(config.getApiUrl(`game/39/${condition}`)).catch(error => {
    if (error.response?.status === 409) {
      voted.value = condition;
      return;
    }

    voted.value = RadiusEraserConditionType.Null;
  });
}
</script>

<style scoped>
table {
  width: 100%;
}
td {
  width: 100px;
}
tr {
  width: 100px;
}

figure {
  margin: 0;
}

img {
  border: 0;
  width: 100px;
  padding: 0
}

button {
  width: 100px;
  height: 100px;
  padding: 0;
  border: 0;
  background: none
}
button:not(:disabled):not(:hover) > figure > img {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}
button:hover > figure > img {
  -webkit-filter: grayscale(50%);
  filter: grayscale(50%);
}
</style>