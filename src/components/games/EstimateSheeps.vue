<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-center text-3xl">Schäfchen schätzen</h1>
    <div class="flex gap-4">
      <button v-for="condition in gameData.conditions" @click="vote(condition.name)" :disabled="voted === condition.name">
        <figure class="flex flex-col gap-3">
          <img :src="`img/${condition.icon}.png`" :alt="condition.name" :data-disabled="voted === condition.name" />
          <figcaption>{{ condition.name }}</figcaption>
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