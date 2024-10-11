<template>
  <div class="w-full flex flex-col gap-7 items-center">
    <h1 class="text-2xl">Bestien Bangen</h1>
    <div class="flex flex-col items-center gap-5 w-full">
      <div class="bg-accent rounded-md w-full text-white border border-white px-3 py-2 max-w-[80%] text-center">
        {{ gameData.question.question }}
      </div>
      <div class="flex flex-col gap-2 w-full max-w-[80%]">
        <template v-for="(answer, index) in gameData.question.answers" :key="index + 1">
          <button :disabled="voted === index + 1" @click="vote(index + 1)" class="bg-accent rounded-md w-full border border-white px-3 py-1">
            <span class="text-white text-center w-full">
              {{ answer }}
            </span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { type Ref, ref } from 'vue'
import { useConfigStore } from '@/stores/configuration'
import { useStateStore } from '@/stores/state'
import { storeToRefs } from 'pinia'
import { useExtensionStore } from '@/stores/extension'
import type { BeatTheBeastData } from '@/types/beatTheBeast'

const voted = ref<number>()

const config = useConfigStore()

const state = useStateStore()
// @ts-ignore
const {gameData}: {gameData: Ref<BeatTheBeastData>} = storeToRefs(state)

const extension = useExtensionStore()
const axios = extension.axios

function vote(condition: number) {
  voted.value = condition;
  axios.post(config.getApiUrl(`game/43/${condition}`)).catch(error => {
    if (error.response?.status === 409) {
      voted.value = condition;
      return;
    }

    voted.value = 0;
  })
}
</script>

<style scoped>
button:hover, button:disabled {
  -webkit-filter: brightness(150%);
  filter: brightness(150%);
}
</style>