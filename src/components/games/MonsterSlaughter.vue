<template>
  <div class="w-full flex flex-col gap-2 items-center">
    <h1 class="text-2xl">Monster Metzeln</h1>

    <div class="flex flex-col items-center gap-4 w-full">

      <template v-if="gameData.boss_names?.length">
        <div class="flex flex-col gap-2 items-center w-full">
          <h2 class="text-xl">Bosse</h2>

          <div class="flex w-full gap-5 w-full">
            <template v-for="(bossName, index) in gameData.boss_names" :key="index + 1">
              <button :disabled="votedBoss === index + 1" @click="vote(index + 1, 0, 0)" class="bg-accent rounded-md w-full border border-white px-3 py-1">
                <span class="text-white text-center w-full">
                  {{ bossName }}
                </span>
              </button>
            </template>
          </div>
        </div>
      </template>

      <template v-if="gameData.arena_effects?.length">
        <div class="flex flex-col gap-2 items-center w-full">
          <h2 class="text-xl">Arena Effekte</h2>

          <div class="flex w-full gap-5">
            <template v-for="(arenaEffect, index) in gameData.arena_effects" :key="index + 1">
              <button :disabled="votedArena === index + 1" @click="vote(0, index + 1, 0)" class="bg-accent rounded-md w-full border border-white px-3 py-1">
              <span class="text-white text-center w-full">
                {{ arenaEffect.name }}
              </span>
              </button>
            </template>
          </div>
        </div>
      </template>

      <template v-if="gameData.shop_effects?.length">
        <div class="flex flex-col gap-2 items-center w-full">
          <h2 class="text-xl">Shop Effekte</h2>

          <div class="flex w-full gap-5">
            <template v-for="(shopEffect, index) in gameData.shop_effects" :key="index + 1">
              <button :disabled="votedShop === index + 1" @click="vote(0, 0, index + 1)" class="bg-accent rounded-md w-full border border-white px-3 py-1">
              <span class="text-white text-center w-full">
                {{ shopEffect.name }}
              </span>
              </button>
            </template>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">

import { type Ref, ref } from 'vue'
import { useConfigStore } from '@/stores/configuration'
import { useStateStore } from '@/stores/state'
import { storeToRefs } from 'pinia'
import { useExtensionStore } from '@/stores/extension'
import type { MonsterSlaughterData } from '@/types/monsterSlaughter'

const votedBoss = ref<number>()
const votedArena = ref<number>()
const votedShop = ref<number>()

const config = useConfigStore()

const state = useStateStore()
// @ts-ignore
const {gameData}: {gameData: Ref<MonsterSlaughterData>} = storeToRefs(state)

const extension = useExtensionStore()
const axios = extension.axios

function vote(boss: number, arena: number, shop: number) {
  if (boss > 0) {
    votedBoss.value = boss
  }

  if (arena > 0) {
    votedArena.value = arena
  }

  if (shop > 0) {
    votedShop.value = shop
  }

  if (!votedArena.value || votedArena.value < 1 || !votedShop.value || votedShop.value < 1) {
    return
  }

  if (gameData.value?.boss_names?.length &&  (!votedBoss.value || votedBoss.value < 1)) {
    return
  }

  axios.post(config.getApiUrl('game/16'), null, {
    params: {
      boss: votedBoss.value,
      arena: votedArena.value,
      shop: votedShop.value
    }
  }).catch(error => {
    if (error.response?.status === 409) {
      votedBoss.value = boss
      votedArena.value = arena
      votedShop.value = shop
      return;
    }

    votedBoss.value = 0
    votedArena.value = 0
    votedShop.value = 0
  })
}
</script>

<style scoped>
button:hover, button:disabled {
  -webkit-filter: brightness(150%);
  filter: brightness(150%);
}
</style>