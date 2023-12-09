<template>
  <div style="display: inline-block; width: 100%">
    <h1 style="width: 100%; text-align: center">Süßigkeiten-Schnapper</h1>
    <div style="margin: auto; width: 60%">
      <button v-for="condition in conditions" @click="vote(condition.name)" :disabled="voted === condition.name">
        <figure>
          <img :src="`img/${condition.icon}.png`" :alt="condition.name" :data-disabled="voted === condition.name" />
          <figcaption style="text-align: center; width: 100%">{{ condition.name }}</figcaption>
        </figure>
      </button>
    </div>
  </div>
</template>

<script>

import Configuration from "../mixins/Configuration";

export default {

  name: 'SweetsCatcher',
  data() {
    return {
      voted: null
    }
  },

  props: ['conditions'],

  mixins: [
      Configuration
  ],

  mounted() {

  },

  methods: {
    vote (condition) {
      this.voted = condition;
      this.$http.post(this.getApiUrl(`game/10/${condition}`)).catch(error => {
        if (error.response?.status === 409) {
          this.voted = condition;
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

figure {
  margin: 0;
}

img {
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
button:not(:disabled):not(:hover) > figure > img {
  -webkit-filter: grayscale(100%);
}
button:hover > figure > img {
  -webkit-filter: grayscale(50%);
}
</style>