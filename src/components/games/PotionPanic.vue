<template>
  <template v-if="gameData.potions?.length > 0">
    <div class="w-full">
      <div class="text-center w-100 text-xl">
        Potion Panik
      </div>
      <div class="flex flex-col items-center pt-12 gap-16">
        <div class="w-20">
          <img class="rounded-full shadow-[0px_0px_20px_0px] shadow-zinc-600 object-cover" :src="gameData.player.avatar" alt="" />
        </div>
        <div class="flex flex-evenly ml-7 mr-7 gap-2 pb-4 flex-wrap justify-center">
          <template v-for="potion in gameData.potions" :key="potion.id">
            <div :class="['cursor-pointer border-2 bg-light w-14 h-14 flex', {
            'border-red-500 scale-105' : voted === potion.id
          }, {
            'border-accent hover:border-red-500 hover:scale-105 transition-transform duration-200' : voted !== potion.id
          }]" @click="vote(potion.id)">
              <img class="object-cover" :src="potion.image" alt="" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useStateStore } from '@/stores/state'
import { storeToRefs } from 'pinia'
import { useExtensionStore } from '@/stores/extension'
import { useConfigStore } from '@/stores/configuration'
import type { PotionPanicData } from '@/types/potionPanic'

const voted = ref<number|null>()

const config = useConfigStore()

const state = useStateStore()
// @ts-ignore
const {gameData}: {gameData: Ref<PotionPanicData>} = storeToRefs(state)

const extension = useExtensionStore()
const axios = extension.axios

function vote (potion: number) {
  voted.value = potion;
  axios.post(config.getApiUrl(`game/48/${potion}`)).catch(error => {
    if (error.response?.status === 409) {
      voted.value = potion;
      return;
    }

    voted.value = null;
  });
}

watch(gameData, (newValue) => {
  if (!newValue?.potions || newValue.potions.length < 1) {
    voted.value = null
  }
})
</script>