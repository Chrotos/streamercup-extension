<template>
  <div style="display: inline-block; width: 100%">
    <h1 style="width: 100%; text-align: center">Schäfchen schätzen</h1>
    <div style="margin: auto; width: 66%; padding-bottom: 40px">
      <button v-for="condition in gameData.conditions" @click="vote(condition.name)" :disabled="voted === condition.name">
        <figure>
          <img :src="`img/${condition.icon}.png`" :alt="condition.name" :data-disabled="voted === condition.name" />
          <figcaption style="text-align: center; width: 100%">{{ condition.name }}</figcaption>
        </figure>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStateStore } from '@/stores/state'
import { ref, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { EstimateSheepsConditionType, type EstimateSheepsData } from '@/types/estimateSheeps'
import { useConfigStore } from '@/stores/configuration'
import { useExtensionStore } from '@/stores/extension'

const config = useConfigStore()

const extension = useExtensionStore()
const axios = extension.axios

const state = useStateStore()
// @ts-ignore
const {gameData}: {gameData: Ref<EstimateSheepsData>} = storeToRefs(state)

const voted = ref<EstimateSheepsConditionType|null>(null)

function vote (condition: EstimateSheepsConditionType) {
  voted.value = condition;
  axios.post(config.getApiUrl(`game/4/${condition}`)).catch(error => {
    if (error.response?.status === 409) {
      voted.value = condition;
      return;
    }

    voted.value = null;
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
}
button:hover > figure > img {
  -webkit-filter: grayscale(50%);
}
</style>