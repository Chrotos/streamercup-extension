<template>
  <div style="display: inline-block; width: 100%">
    <h1 style="width: 100%; text-align: center">Schnelle Ströhmung</h1>
    <div style="margin: auto; width: 60%">
      <button v-for="condition in gameData.conditions" v-bind:key="condition.display_name" @click="vote(condition.name)" :disabled="voted === condition.name">
        <figure>
          <img :src="`img/${condition.icon}.png`" :alt="String(condition.name)" :data-disabled="voted === condition.name" />
          <figcaption style="text-align: center; width: 100%">{{ condition.display_name }}</figcaption>
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
import { RapidCurrentConditionType, type RapidCurrentData } from '@/types/rapidCurrent'

const voted = ref<RapidCurrentConditionType>(RapidCurrentConditionType.Null)

const config = useConfigStore()

const state = useStateStore()
// @ts-ignore
const {gameData}: {gameData: Ref<RapidCurrentData>} = storeToRefs(state)

const extension = useExtensionStore()
const axios = extension.axios

function vote(condition: RapidCurrentConditionType) {
  voted.value = condition;
  axios.post(config.getApiUrl(`game/25/${condition}`)).catch(error => {
    if (error.response?.status === 409) {
      voted.value = condition;
      return;
    }

    voted.value = 0;
  })
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