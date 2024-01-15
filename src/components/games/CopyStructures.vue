<template>
  <div class="inline-block w-100">
    <h1 class="text-center w-100 text-light">Konstrukt kopieren</h1>
    <div class="flex flex-evenly gap-50px-5px">
      <button v-for="structure in gameData.structures" @click="vote(structure.name)" :disabled="voted === structure.name">
        <figure>
          <img :src="`img/structures/${structure.image}.webp`" :alt="structure.name" />
          <figcaption class="text-center w-100 text-light">{{ structure.name }}</figcaption>
        </figure>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { type Ref, ref } from 'vue'
import { useStateStore } from '@/stores/state'
import { storeToRefs } from 'pinia'
import type { CopyStructuresData } from '@/types/copyStructures'
import { useExtensionStore } from '@/stores/extension'
import { useConfigStore } from '@/stores/configuration'

const voted = ref<string|null>()

const config = useConfigStore()

const state = useStateStore()
// @ts-ignore
const {gameData}: {gameData: Ref<CopyStructuresData>} = storeToRefs(state)

const extension = useExtensionStore()
const axios = extension.axios

function vote (structure: string) {
  voted.value = structure;
  axios.post(config.getApiUrl(`game/14/${structure}`)).catch(error => {
    if (error.response?.status === 409) {
      voted.value = structure;
      return;
    }

    voted.value = null;
  });
}
</script>

<style scoped>
figure {
  margin: 0;
  height: 100%;
}

picture {
  border: 0;
  width: 100%;
  padding: 0
}

img {
  border: 0;
  width: 100%;
  padding: 0
}

button {
  padding: 0;
  border: 0;
  background: none
}

@media screen and (min-width: 500px) {
  button {
    width: 150px;
    height: 150px;
  }
}

@media screen and (max-width: 500px) {
  button {
    width: 100px;
    height: 100px;
  }
}

button:not(:disabled):not(:hover) > figure > img {
  -webkit-filter: grayscale(100%);
}
button:hover > figure > img {
  -webkit-filter: grayscale(50%);
}
</style>