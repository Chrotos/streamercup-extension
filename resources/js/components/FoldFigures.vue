<template>
  <div style="display: inline-block; width: 100%">
    <h1 style="width: 100%; text-align: center">Figuren falten</h1>
    <table style="margin: auto; width: 50%">
      <tr>
        <!-- Upper Left = empty -->
        <td />
        <!-- Upper Center -->
        <td>
          <button @click="vote(4)" :disabled="voted === 4">
            <figure>
              <img :src="`img/mhf_arrowup.png`" alt="up" :data-disabled="voted === 4" />
            </figure>
          </button>
        </td>
        <!-- Upper Right = empty -->
        <td />
      </tr>
      <tr>
        <!-- Middle Left -->
        <td>
          <button @click="vote(1)" :disabled="voted === 1">
            <figure>
              <img :src="`img/mhf_arrowup.png`" alt="left" :data-disabled="voted === 1" style="transform: rotate(-90deg)" />
            </figure>
          </button>
        </td>
        <!-- Middle Center = empty -->
        <td />
        <!-- Middle Right -->
        <td>
          <button @click="vote(2)" :disabled="voted === 2">
            <figure>
              <img :src="`img/mhf_arrowup.png`" alt="right" :data-disabled="voted === 2" style="transform: rotate(90deg)" />
            </figure>
          </button>
        </td>
      </tr>
      <tr>
        <!-- Lower Left = empty -->
        <td />
        <!-- Lower Center -->
        <td>
          <button @click="vote(3)" :disabled="voted === 3">
            <figure>
              <img :src="`img/mhf_arrowup.png`" alt="down" :data-disabled="voted === 3" style="transform: rotate(180deg)" />
            </figure>
          </button>
        </td>
        <!-- Lower Right = empty -->
        <td />
      </tr>
    </table>
  </div>
</template>

<script>

import Configuration from "../mixins/Configuration";

export default {

  name: 'FoldFigures',
  data() {
    return {
      voted: 0
    }
  },

  mixins: [
      Configuration
  ],

  mounted() {

  },

  methods: {
    vote (condition) {
      this.voted = condition;
      this.$http.post(this.getApiUrl(`game/35/${condition}`)).catch(error => {
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
  width: 64px;
}
tr {
  width: 64px;
}

figure {
  margin: 0;
}

img {
  border: 0;
  width: 64px;
  padding: 0
}

button {
  width: 64px;
  height: 64px;
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