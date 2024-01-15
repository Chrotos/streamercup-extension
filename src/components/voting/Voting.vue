<template>
  <h2 style="text-align: center">{{ voteData.title }} : {{ countDown }}</h2>
  <table style="table-layout: fixed">
    <tr>
      <th v-for="option in voteData.options" style="text-align: center" v-bind:key="option.name">
        {{ option.name }}
      </th>
    </tr>
    <tr>
      <td v-for="option in voteData.options" style="text-align: center">
        {{ option.description }}
      </td>
    </tr>
    <tr>
      <td v-for="option in voteData.options" style="text-align: center" v-bind:key="option.name">
        {{ option.votes }}
      </td>
    </tr>
    <tr>
      <template v-if="!voted">
        <td v-for="option in voteData.options" v-bind:key="option.game_id">
          <button @click="vote(option.game_id)" style="display: block; width: 100%">Vote</button>
        </td>
      </template>
    </tr>
  </table>
</template>

<script setup lang="ts">
  import { useStateStore } from '@/stores/state'
  import { storeToRefs } from 'pinia'
  import { ref } from 'vue'
  import moment from 'moment'
  import { useExtensionStore } from '@/stores/extension'

  const state = useStateStore()
  const extension = useExtensionStore()

  const { voteData, voted } = storeToRefs(state)
  const { axios } = storeToRefs(extension)

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

  function vote (gameId) {
    this.voted = true;
    //this.$http.post(`https://streamercup-api.chrotos.net/api/vote/${gameId}`).catch(error => {
    axios.post(this.getApiUrl(`vote/${gameId}`)).catch(error => {
      if (error.response.status === 409) {
        this.voted = true;
        return;
      }
      if (error.response.status === 403) {
        this.voting = null;
      }

      this.voted = false;
    });
  }
</script>