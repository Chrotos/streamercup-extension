<template>
  <div id="phaser" />
</template>

<script>
import * as Phaser from 'phaser';

const defaultFillStyle = {
  color: 0x6666ff,
  alpha: 0.7
}
const selectedFillStyle = {
  color: Phaser.Display.Color.GetColor(255, 0, 0),
  alpha: 0.7
}

const gates = [
  {
    x: 130,
    y: 170,
    rotate: true
  },
  {
    x: 480,
    y: 170,
    rotate: true
  },
  {
    x: 130,
    y: 330,
    rotate: true
  },
  {
    x: 480,
    y: 330,
    rotate: true
  },
  {
    x: 230,
    y: 70,
    rotate: false
  },
  {
    x: 230,
    y: 430,
    rotate: false
  },
  {
    x: 380,
    y: 70,
    rotate: false
  },
  {
    x: 380,
    y: 430,
    rotate: false
  },
];

const clickables = [];
let game;

export default {

  name: 'CollectSheeps',
  data() {
    return {
      voted: -1
    }
  },

  props: ['sheep'],

  beforeDestroy() {
    if (this.game) {
      this.game.destroy(true, false);
    }
  },

  mounted() {
    let area;

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
          this.load.image('area', 'img/collect_sheeps.png');
        },
        create: function () {
          area = this.add.image(600 / 2, 480 / 2, 'area');
          area.setScale(0.45);
          area.setRotation(Math.PI);

          gates.forEach((gate, index) => {
            let width = !gate.rotate ? 50 : 35;
            let height = !gate.rotate ? 35 : 50;
            let clickable = this.add.rectangle(gate.x, gate.y, width, height, defaultFillStyle.color, defaultFillStyle.alpha);
            clickable.setInteractive();
            clickable.gate = index;
            clickables.push(clickable);
          })

          this.add.text(600 / 2, 20, 'Schafe Sammeln', {font: '40px Ariel', fill: '#000000', align: "center"}).setOrigin(0.5, 0.5);

          this.input.setPollOnMove();
          this.input.on('gameobjectover', function (pointer, gameObject) {
            if (gameObject.type === 'Rectangle') {
              gameObject.setScale(1.05);
            }
          })

          this.input.on('gameobjectout', function (pointer, gameObject) {
            if (gameObject.type === 'Rectangle') {
              gameObject.setScale(1);
            }
          })

          this.input.on('gameobjectup', function (pointer, gameObject) {
            if (gameObject.type === 'Rectangle') {
              // unselect old one
              clickables.forEach(clickable => {
                clickable.setFillStyle(defaultFillStyle.color, defaultFillStyle.alpha);
              })

              let id = gameObject.gate;
              axios.post(`https://streamercup-api.chrotos.net/api/game/1/${id}`).catch(error => {
                gameObject.setFillStyle(defaultFillStyle.color, defaultFillStyle.alpha);
              });
              gameObject.setFillStyle(selectedFillStyle.color, selectedFillStyle.alpha);
            }
          })
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