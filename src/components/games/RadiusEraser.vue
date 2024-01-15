<template>
  <div style="display: inline-block; width: 100%">
    <h1 style="width: 100%; text-align: center">Radius-Radierer</h1>
    <div style="margin: auto; width: 66%">
      <button v-for="condition in gameData.conditions" @click="vote(condition.name)" :disabled="voted === condition.name" style="margin-bottom: 50px">
        <figure>
          <img :src="`img/${condition.icon}.png`" :alt="String(condition.name)" :data-disabled="voted === condition.name" />
          <figcaption style="text-align: center; width: 100%">{{ condition.name }}</figcaption>
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