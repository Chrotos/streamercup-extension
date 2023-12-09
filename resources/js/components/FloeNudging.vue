<template>
  <div style="display: inline-block; width: 100%">
    <h1 style="width: 100%; text-align: center">Schollen-Schubser</h1>
    <div style="width: 100%">
      <button v-for="player in players" @click="vote(player.id)" :disabled="voted === player.id">
          <img :src="player.avatar" :data-disabled="voted === player.id" />
      </button>
    </div>
  </div>
</template>

<script>

import Configuration from "../mixins/Configuration";

export default {

  name: 'FloeNudging',
  data() {
    return {
      voted: null
    }
  },

  props: ['players'],

  mixins: [
      Configuration
  ],

  mounted() {

  },

  methods: {
    vote (player) {
      this.voted = player;
      this.$http.post(this.getApiUrl(`game/50/${player}`)).catch(error => {
        if (error.response?.status === 409) {
          this.voted = player;
          return;
        }

        this.voted = null;
      });
    },
  }
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