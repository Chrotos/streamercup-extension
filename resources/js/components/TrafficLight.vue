<template>
  <div id="phaser" />
</template>

<script>
import * as Phaser from 'phaser';

const defaultFillStyle = {
  color: 0x6666ff,
  alpha: 0.1
}
const selectedFillStyle = {
  color: Phaser.Display.Color.GetColor(255, 0, 0),
  alpha: 0.5
}

const bridgePositions = [
  {
    x: 60,
    y: 245,
    height: 23,
    width: 60
  },
  {
    x: 60,
    y: 350,
    height: 23,
    width: 82
  },
  {
    x: 160,
    y: 255,
    height: 23,
    width: 82
  },
  {
    x: 198,
    y: 340,
    height: 23,
    width: 70
  },
  {
    x: 302,
    y: 235,
    height: 23,
    width: 70
  },
  {
    x: 285,
    y: 358,
    height: 23,
    width: 70
  },
  {
    x: 450,
    y: 245,
    height: 23,
    width: 67
  },
  {
    x: 420,
    y: 350,
    height: 23,
    width: 82
  },
  {
    x: 556,
    y: 265,
    height: 23,
    width: 70
  },
  {
    x: 553,
    y: 332,
    height: 23,
    width: 72
  },
];

const clickables = [];
let game;

export default {

  name: 'TrafficLight',
  data() {
    return {
      voted: -1
    }
  },

  props: ['bridges'],

  beforeDestroy() {
    if (this.game) {
      this.game.destroy(true, false);
    }
  },

  mounted() {
    let area;
    let bridges = this.bridges;

    const config = {
      type: Phaser.CANVAS,
      width: 600,
      height: 600,
      parent: 'phaser',
      transparent: true,
      scale: {
        mode: Phaser.Scale.FIT
      },
      banner: false,
      scene: {
        preload: function () {
          this.load.image('area', 'img/traffic_light.png');
        },
        create: function () {
          area = this.add.image(600 / 2, 600 / 2, 'area');
          area.setScale(0.33);

          bridges.forEach((bridge, index) => {
            if (bridgePositions[bridge - 1]) {
              let bridgePosition = bridgePositions[bridge - 1];
              let width = bridgePosition.width;
              let height = bridgePosition.height;

              if (bridgePosition.x && bridgePosition.y) {
                let clickArea = this.add.rectangle(bridgePosition.x, bridgePosition.y, bridgePosition.width, bridgePosition.height, defaultFillStyle.color, defaultFillStyle.alpha);
                clickArea.setInteractive();
                clickArea.bridge = bridge;

                clickables.push(clickArea);
              }
            }
          })
          this.add.text(600 / 2, 30, 'Achtung Ampel', {font: '40px Ariel', fill: '#FFFFFF', align: "center"}).setOrigin(0.5, 0.5);

          this.input.setPollOnMove();
          this.input.setTopOnly(true);
          this.input.on('gameobjectover', function (pointer, gameObject) {
            if (gameObject.selected) {
              return;
            }

            if (gameObject.type === 'Rectangle') {
              gameObject.setFillStyle(defaultFillStyle.color, selectedFillStyle.alpha);
            }
          })

          this.input.on('gameobjectout', function (pointer, gameObject) {
            if (gameObject.selected) {
              return;
            }

            if (gameObject.type === 'Rectangle') {
              gameObject.setFillStyle(defaultFillStyle.color, defaultFillStyle.alpha);
            }
          })

          this.input.on('gameobjectup', function (pointer, gameObject) {
            if (gameObject.type === 'Rectangle') {
              // unselect old one
              clickables.forEach(clickable => {
                clickable.setFillStyle(defaultFillStyle.color, defaultFillStyle.alpha);
                clickable.selected = false;
              })

              let id = gameObject.bridge;
              axios.post(`https://streamercup-api.chrotos.net/api/game/3/${id}`).catch(error => {
                gameObject.setFillStyle(defaultFillStyle.color, defaultFillStyle.alpha);
                gameObject.selected = false;
              });
              gameObject.setFillStyle(selectedFillStyle.color, selectedFillStyle.alpha);
              gameObject.selected = true;
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