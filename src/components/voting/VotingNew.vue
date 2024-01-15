<template>
  <h2 class="w-full text-center text-xl">{{ voteData?.title }}</h2>
  <p class="w-full text-center text-xs">{{ countDown }}</p>
  <ul role="list" class="grid grid-cols-2 gap-6 justify-center">
    <template v-if="!voted">
      <template v-for="option in voteData?.options" v-bind:key="option.game_id">
        <voting-card class="cursor-pointer" v-bind:model-value="option" @click="vote(option.game_id)"></voting-card>
      </template>
    </template>
  </ul>
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