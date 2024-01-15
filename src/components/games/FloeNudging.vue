<template>
  <div style="display: inline-block; width: 100%">
    <h1 style="width: 100%; text-align: center">Schollen-Schubser</h1>
    <div style="width: 100%">
      <button v-for="player in gameData.players" @click="vote(player.id)" :disabled="voted === player.id">
          <img :src="player.avatar" :data-disabled="voted === player.id" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStateStore } from '@/stores/state'
import { ref, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { FloeNudgingData } from '@/types/floeNudging'
import { useConfigStore } from '@/stores/configuration'
import { useExtensionStore } from '@/stores/extension'

const config = useConfigStore()

const extension = useExtensionStore()
const axios = extension.axios

const state = useStateStore()
// @ts-ignore
const {gameData}: {gameData: Ref<FloeNudgingData>} = storeToRefs(state)

const voted = ref<number>(-1)

function vote (player: number) {
  voted.value = player;
  axios.post(config.getApiUrl(`game/50/${player}`)).catch(error => {
    if (error.response?.status === 409) {
      voted.value = player;
      return;
    }

    voted.value = -1;
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

img {
  margin: 0;
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
button:not(:disabled):not(:hover) > img {
  -webkit-filter: grayscale(100%);
}
button:hover > img {
  -webkit-filter: grayscale(50%);
}
</style>