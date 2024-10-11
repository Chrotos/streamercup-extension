<template>
  <div class="flex flex-col gap-1">

    <div class="flex justify-center">
      <div class="text-xl px-2 py-0.5 dark:drop-shadow-[0px_0px_1px_white]">{{ voteData?.title }}</div>
    </div>

    <div class="flex justify-center">
      <div class="text-xs px-2 py-0.5">{{ countDown }}</div>
    </div>

    <div class="flex justify-evenly">
      <template v-for="option in voteData?.options" v-bind:key="option.game_id">
        <voting-card class="w-[20ch] pt-2" :option="option" @click="vote(option.game_id)"></voting-card>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStateStore } from '@/stores/state'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import moment from 'moment'
import { useExtensionStore } from '@/stores/extension'
import VotingCard from '@/components/voting/VotingCard.vue'
import { useConfigStore } from '@/stores/configuration'
import { Phase } from '@/types'

const config = useConfigStore()
const state = useStateStore()
const extension = useExtensionStore()

const { phase, voteData, voted } = storeToRefs(state)
const axios = extension.axios

function calculateDifference(): number {
  return moment(voteData.value?.end_date).diff(moment())
}

function updateCountDown() {
  if (voteData.value?.end_date) {
    let difference = calculateDifference()
    if (difference < 0) {
      difference = 0
    }
    countDown.value = moment(difference).format('mm:ss')

    setTimeout(updateCountDown, 1000)
  }
}

const countDown = ref("")
updateCountDown()

function vote (gameId: string) {
  if (voted.value) {
    return
  }

  voted.value = true;
  axios.post(config.getApiUrl(`vote/${gameId}`)).catch(error => {
    if (error.response.status === 409) {
      voted.value = true;
      return;
    }
    if (error.response.status === 403) {
      phase.value = Phase.Pause
      voteData.value = null
    }

    voted.value = false;
  });
}
</script>