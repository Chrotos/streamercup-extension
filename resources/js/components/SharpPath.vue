<template>
  <div id="phaser" />
</template>

<script>
import * as Phaser from 'phaser';
import Configuration from "../mixins/Configuration";

const defaultFillStyle = {
  color: 0x6666ff,
  alpha: 0.3
}
const selectedFillStyle = {
  color: Phaser.Display.Color.GetColor(255, 0, 0),
  alpha: 0.7
}

const wallPositions = {
  'TOP_DOWN_1': {
    x: 473,
    y: 48,
    height: 48,
    width: 60
  },
  'DOWN_TOP_1': {
    x: 473,
    y: 552,
    height: 48,
    width: 60
  },
  'TOP_DOWN_2': {
    x: 388,
    y: 48,
    height: 48,
    width: 60
  },
  'DOWN_TOP_2': {
    x: 388,
    y: 552,
    height: 48,
    width: 60
  },
  'TOP_DOWN_3': {
    x: 300,
    y: 48,
    height: 48,
    width: 60
  },
  'DOWN_TOP_3': {
    x: 300,
    y: 552,
    height: 48,
    width: 60
  },
  'TOP_DOWN_4': {
    x: 216,
    y: 48,
    height: 48,
    width: 60
  },
  'DOWN_TOP_4': {
    x: 216,
    y: 552,
    height: 48,
    width: 60
  },
  'TOP_DOWN_5': {
    x: 130,
    y: 48,
    height: 48,
    width: 60
  },
  'DOWN_TOP_5': {
    x: 130,
    y: 552,
    height: 48,
    width: 60
  },
  'LEFT_RIGHT_6': {
    x: 48,
    y: 129,
    height: 60,
    width: 48
  },
  'RIGHT_LEFT_6': {
    x: 551,
    y: 129,
    height: 60,
    width: 48
  },
  'LEFT_RIGHT_7': {
    x: 48,
    y: 214,
    height: 60,
    width: 48
  },
  'RIGHT_LEFT_7': {
    x: 551,
    y: 214,
    height: 60,
    width: 48
  },
  'LEFT_RIGHT_8': {
    x: 48,
    y: 300,
    height: 60,
    width: 48
  },
  'RIGHT_LEFT_8': {
    x: 551,
    y: 300,
    height: 60,
    width: 48
  },
  'LEFT_RIGHT_9': {
    x: 48,
    y: 387,
    height: 60,
    width: 48
  },
  'RIGHT_LEFT_9': {
    x: 551,
    y: 387,
    height: 60,
    width: 48
  },
  'LEFT_RIGHT_10': {
    x: 48,
    y: 474,
    height: 60,
    width: 48
  },
  'RIGHT_LEFT_10': {
    x: 551,
    y: 474,
    height: 60,
    width: 48
  },
};

export default {

  name: 'SharpPath',
  data() {
    return {
      voted: -1,
      game: null
    }
  },

  props: ['walls'],

  mixins: [
      Configuration,
  ],

  beforeDestroy() {
    if (this.game) {
      this.game.destroy(true, false);
    }
  },

  mounted() {
    let apiUrl = this.getApiUrl('game/37/');

    let area;
    const clickables = [];
    let walls = this.walls;

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
          this.load.image('area', 'img/sharp_path_complete.png');
        },
        create: function () {
          area = this.add.image(600 / 2, 600 / 2, 'area');
          area.setScale(0.4);
          area.setRotation(Math.PI);

          walls.forEach((wall, index) => {
            if (wallPositions[wall]) {
              let wallPosition = wallPositions[wall];

              let rotation = -1;
              let width, height;
              switch (wall.substring(0, wall.indexOf('_')).toLowerCase()) {
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
                clickArea.wall = wall;

                clickables.push(clickArea);
              }
            }
          })
          this.add.text(600 / 2, 30, 'Scharfe Schneise', {font: '40px Arial', fill: '#FFFFFF', align: "center"}).setOrigin(0.5, 0.5);

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