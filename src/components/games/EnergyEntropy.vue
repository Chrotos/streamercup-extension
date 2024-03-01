<template>
  <div class="w-full">
    <template v-if="gameData.active">
      <div class="grid grid-cols-5 text-center h-[18rem]">

        <div class="col-span-1 flex flex-col">
          <div class="basis-1/2 flex justify-center">
            <button :class="['align-middle w-full', {
              'bg-twitch-selected' : voted === 1
            }, {
              'hover:bg-twitch-selected' : voted !== 1
            }]" @click="vote(1)">
              <div class="flex flex-col items-center gap-4">
                <img :src="'img/wrench-solid.svg'" class="invert w-16" />
                <div>
                  Issues
                </div>
              </div>
            </button>
          </div>
          <div class="basis-1/2 flex justify-center border-t-2">
            <button :class="['align-middle hover:bg-twitch-selected w-full', {
              'bg-twitch-selected' : voted === 3
            }, {
              'hover:bg-twitch-selected' : voted !== 3
            }]" @click="vote(3)">
              <div class="flex flex-col items-center gap-4">
                <img :src="'img/bucket-solid.svg'" class="invert w-16" />
                <div>
                  Wet Floor
                </div>
              </div>
            </button>
          </div>
        </div>

        <div class="col-span-3">
          <img class="object-fill overflow-hidden h-full" :src="'img/background/energy_entropy.png'" alt="">
        </div>

        <div class="col-span-1 flex flex-col">
          <div class="basis-1/2 flex justify-center">
            <button :class="['align-middle hover:bg-twitch-selected w-full', {
              'bg-twitch-selected' : voted === 2
            }, {
              'hover:bg-twitch-selected' : voted !== 2
            }]" @click="vote(2)">
              <div class="flex flex-col items-center gap-4">
                <img :src="'img/house-crack-solid.svg'" class="invert w-16" />
                <div>
                  Quake
                </div>
              </div>
            </button>
          </div>
          <div class="basis-1/2 flex justify-center border-t-2">
            <button :class="['align-middle hover:bg-twitch-selected w-full', {
              'bg-twitch-selected' : voted === 4
            }, {
              'hover:bg-twitch-selected' : voted !== 4
            }]" @click="vote(4)">
              <div class="flex flex-col items-center gap-4">
                <img :src="'img/clock-solid.svg'" class="invert w-16" />
                <div>
                  Overtime
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { useStateStore } from '@/stores/state'
import { storeToRefs } from 'pinia'
import { useExtensionStore } from '@/stores/extension'
import { useConfigStore } from '@/stores/configuration'
import type { EnergyEntropyData } from '@/types/energyEntropy'

const voted = ref<number|null>()

const config = useConfigStore()

const state = useStateStore()
// @ts-ignore
const {gameData}: {gameData: Ref<EnergyEntropyData>} = storeToRefs(state)

const extension = useExtensionStore()
const axios = extension.axios

function vote (condition: number) {
  voted.value = condition;
  axios.post(config.getApiUrl(`game/49/${condition}`)).catch(error => {
    if (error.response?.status === 409) {
      voted.value = condition;
      return;
    }

    voted.value = null;
  });
}
</script>