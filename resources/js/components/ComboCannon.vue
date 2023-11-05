<template>
  <div id="phaser" />
</template>

<script>
import * as Phaser from 'phaser';
import Configuration from "../mixins/Configuration";

const diceDimension = 150;
const diceFactor = diceDimension / 64;
//const diceY = 480 / 2;
//const diceX = 600 / 2 //- diceDimension / 2;
//const diceY = 480 / 2 //- diceDimension / 2;

export default {

  name: 'ComboCannon',
  data() {
    return {
      game: null
    }
  },

  props: [],

  mixins: [
      Configuration
  ],

  beforeDestroy() {
    if (this.game) {
      this.game.destroy(true, false);
    }
  },

  mounted() {
    let apiUrl = this.getApiUrl('game/36/');

    let area;
    let dices = [];
    let currentDiceNumbers = [1,1,1,1];
    let timeToShuffle = 100;
    let rolled = false;

    const config = {
      type: Phaser.CANVAS,
      width: 600,
      height: 480,
      parent: 'phaser',
      scale: {
        mode: Phaser.Scale.FIT
      },
      banner: false,
      scene: {
        preload: function () {
          for (let i = 1; i <= 6; i++) {
            this.load.image(String(i), `img/dice/${i}.png`);
          }
        },

        create: function () {
          for (let i = 0; i < 4; i++) {
            let diceX = 180 + (600 - 100) / 2 * (i % 2);
            let diceY = 160 + (480 - 120) / 2 * (Math.floor(i / 2));
            dices.push(this.add.image(diceX, diceY, currentDiceNumbers[i]).setScale(diceFactor));
          }

          this.add.text(600 / 2, 30, 'Kombi Kanone', {font: '40px Arial', fill: '#FFFFFF', align: "center"}).setOrigin(0.5, 0.5);

          let button = this.add.text(600 / 2, 480 / 2, 'Werfen!', {font: '35px Arial', fill: '#FFFFFF', align: "center"}).setOrigin(0.5, 0.5).setInteractive();
          button.on('pointerup', function () {
            rolled = true;
            button.destroy();

            //axios.post('https://streamercup-api.chrotos.net/api/game/36/', null, {
            axios.post(apiUrl, null, {
              params: {
                dices: currentDiceNumbers.join('')
              }
            });
          })
        },

        update: function (time, delta) {
          if (rolled) {
            return;
          }

          timeToShuffle -= delta;

          if (timeToShuffle <= 0) {
            for (let i = 0; i < currentDiceNumbers.length; i++) {
              currentDiceNumbers[i] = Math.ceil(Math.random() * 6);
              dices[i].setTexture(String(currentDiceNumbers[i]));
            }
            timeToShuffle = 100;
          }
        },
      }
    }

    this.game = new Phaser.Game(config);
  },

  methods: {
  }
}
</script>

<style scoped>

</style>