<template>
  <div id="phaser" />
</template>

<script>
import * as Phaser from 'phaser';
import Configuration from "../mixins/Configuration";

const defaultFillStyle = {
  color: 0x6666ff,
  //alpha: 0.3
  alpha: 1
}
const selectedFillStyle = {
  color: Phaser.Display.Color.GetColor(255, 0, 0),
  alpha: 0.7
}

const platform = {
  x: 130,
  y: 130,
  dimensions: 268 * 0.423
};

const wallPositions = {
  'TOP_DOWN_1': {
    x: 472,
    y: 48,
    height: 48,
    width: 60
  },
  'DOWN_TOP_1': {
    x: 472,
    y: 552,
    height: 48,
    width: 60
  },
  'TOP_DOWN_2': {
    x: 358,
    y: 48,
    height: 48,
    width: 60
  },
  'DOWN_TOP_2': {
    x: 358,
    y: 552,
    height: 48,
    width: 60
  },
  'TOP_DOWN_3': {
    x: 243,
    y: 48,
    height: 48,
    width: 60
  },
  'DOWN_TOP_3': {
    x: 243,
    y: 552,
    height: 48,
    width: 60
  },
  'TOP_DOWN_4': {
    x: 131,
    y: 48,
    height: 48,
    width: 60
  },
  'DOWN_TOP_4': {
    x: 131,
    y: 552,
    height: 48,
    width: 60
  },
  'LEFT_RIGHT_5': {
    x: 48,
    y: 129,
    height: 60,
    width: 48
  },
  'RIGHT_LEFT_5': {
    x: 551,
    y: 129,
    height: 60,
    width: 48
  },
  'LEFT_RIGHT_6': {
    x: 48,
    y: 241,
    height: 60,
    width: 48
  },
  'RIGHT_LEFT_6': {
    x: 551,
    y: 241,
    height: 60,
    width: 48
  },
  'LEFT_RIGHT_7': {
    x: 48,
    y: 357,
    height: 60,
    width: 48
  },
  'RIGHT_LEFT_7': {
    x: 551,
    y: 357,
    height: 60,
    width: 48
  },
  'LEFT_RIGHT_8': {
    x: 48,
    y: 470,
    height: 60,
    width: 48
  },
  'RIGHT_LEFT_8': {
    x: 551,
    y: 470,
    height: 60,
    width: 48
  },
};

export default {

  name: 'MatchingPlatform',
  data() {
    return {
      voted: -1,
      game: null
    }
  },

  props: ['platforms'],

  mixins: [
      Configuration,
  ],

  beforeDestroy() {
    if (this.game) {
      this.game.destroy(true, false);
    }
  },

  mounted() {
    let apiUrl = this.getApiUrl('game/47/');

    let area;
    const clickables = [];
    let platforms = this.platforms;

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
          this.load.image('area', 'img/matching_platform_complete.png');
        },
        create: function () {
          area = this.add.image(600 / 2, 600 / 2, 'area');
          area.setScale(0.4);
          area.setRotation(Math.PI);

          // region wall positions
          for (const [index, wallPosition] of Object.entries(wallPositions)) {
            let rotation = -1;
            let width, height;
            switch (index.substring(0, index.indexOf('_')).toLowerCase()) {
              case 'top':
                rotation = Math.PI;
              case 'down':
                height = 550;
                width = 80;
                if (rotation === -1) {
                  rotation = 0;
                }
                break;
              case 'left':
                rotation = Math.PI / 2;
              case 'right':
                height = 20;
                width = 300;
                if (rotation === -1) {
                  rotation = Math.PI * 1.5;
                }
                break;
            }

            if (wallPosition.x && wallPosition.y) {
              let clickArea = this.add.rectangle(wallPosition.x, wallPosition.y, wallPosition.width, wallPosition.height, defaultFillStyle.color, defaultFillStyle.alpha);
              clickArea.setInteractive();
              clickArea.wall = index;

              clickables.push(clickArea);
            }
          }
          // endregion

          for (let index = 0; index < platforms.length; index++) {
            let dimensions = platform.dimensions;
            let x = platform.x + (index % 4) * dimensions;
            let y = platform.y + (Math.floor(index / 4)) * dimensions;

            this.add.rectangle(x, y, dimensions, dimensions, platforms[index]);
          }
          this.add.text(600 / 2, 15, 'Passende Plattform', {font: '40px Arial', fill: '#FFFFFF', align: "center"}).setOrigin(0.5, 0.5);

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

              let id = gameObject.wall;
              axios.post(apiUrl + id).catch(error => {
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