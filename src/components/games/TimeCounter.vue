<template>
  <div class="flex flex-col items-center gap-8">
    <h1 class="text-center text-3xl">Zeit-Zähler</h1>
    <div class="flex gap-4 items-center">
      <button v-for="condition in gameData.conditions" @click="vote(condition.name)" :disabled="voted === condition.name">
        <figure class="flex flex-col items-center gap-3">
          <img :src="`img/${condition.icon}.png`" :alt="String(condition.name)" :data-disabled="voted === condition.name" />
          <figcaption>{{ condition.name }}</figcaption>
        </figure>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { useConfigStore } from '@/stores/configuration'
import { useStateStore } from '@/stores/state'
import { storeToRefs } from 'pinia'
import { useExtensionStore } from '@/stores/extension'
import { TimeCounterConditionType, type TimeCounterData } from '@/types/timeCounter'

const voted = ref<TimeCounterConditionType>(TimeCounterConditionType.Null)

const config = useConfigStore()

const state = useStateStore()
// @ts-ignore
const {gameData}: {gameData: Ref<TimeCounterData>} = storeToRefs(state)

const extension = useExtensionStore()
const axios = extension.axios

function vote(condition: TimeCounterConditionType) {
  voted.value = condition;
  axios.post(config.getApiUrl(`game/42/${condition}`)).catch(error => {
    if (error.response?.status === 409) {
      voted.value = condition;
      return;
    }

    voted.value = TimeCounterConditionType.Null;
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