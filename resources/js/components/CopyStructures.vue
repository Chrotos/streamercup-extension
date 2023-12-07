<template>
  <div style="display: inline-block; background-color: black; width: 100%">
    <h1 style="width: 100%; text-align: center">Konstrukte kopieren</h1>
    <div style="margin-left: 1%; width: 100%">
      <button v-for="structure in structures" @click="vote(structure.name)" :disabled="voted === structure.name" style="margin-bottom: 50px">
        <figure>
          <img :src="`img/structures/${structure.image}.webp`" :alt="structure.name" />
          <figcaption style="color: white; text-align: center; width: 100%">{{ structure.name }}</figcaption>
        </figure>
      </button>
    </div>
  </div>
</template>

<script>

import Configuration from "../mixins/Configuration";

export default {

  name: 'CopyStructures',
  data() {
    return {
      voted: null
    }
  },

  props: ['structures'],

  mixins: [
      Configuration
  ],

  mounted() {

  },

  methods: {
    vote (structure) {
      this.voted = structure;
      //this.$http.post(`https://streamercup-api.chrotos.net/api/game/14/${structure}`).catch(error => {
      this.$http.post(this.getApiUrl(`game/14/${structure}`)).catch(error => {
        if (error.response?.status === 409) {
          this.voted = structure;
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
  width: 150%;
}
td {
  width: 150px;
}
tr {
  width: 150px;
}

figure {
  margin: 0;
}

picture {
  border: 0;
  width: 150px;
  padding: 0
}

img {
  border: 0;
  width: 150px;
  padding: 0
}

button {
  width: 150px;
  height: 150px;
  padding: 0;
  margin-right: 10px;
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