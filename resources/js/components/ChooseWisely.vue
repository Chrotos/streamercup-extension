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

const platformPositions = [
  {
    x: 160,
    y: 305,
    height: 260,
    width: 260
  },
  {
    x: 435,
    y: 305,
    height: 260,
    width: 260
  },
];

export default {

  name: 'ChooseWisely',
  data() {
    return {
      voted: -1,
      game: null
    }
  },

  props: ['platforms'],

  beforeDestroy() {
    if (this.game) {
      this.game.destroy(true, false);
    }
  },

  mounted() {
    const clickables = [];
    let area;
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
          this.load.image('area', 'img/choose_wisely.png');
        },
        create: function () {
          area = this.add.image(600 / 2, 600 / 2, 'area');
          area.setScale(0.22);

          platforms.forEach((platform, index) => {
            if (platformPositions[platform - 1]) {
              let platformPosition = platformPositions[platform - 1];
              let width = platformPosition.width;
              let height = platformPosition.height;

              if (platformPosition.x && platformPosition.y) {
                let clickArea = this.add.rectangle(platformPosition.x, platformPosition.y, platformPosition.width, platformPosition.height, defaultFillStyle.color, defaultFillStyle.alpha);
                clickArea.setInteractive();
                clickArea.platform = platform;

                clickables.push(clickArea);
              }
            }
          })
          this.add.text(600 / 2, 30, 'Wähle Weise', {font: '40px Arial', fill: '#FFFFFF', align: "center"}).setOrigin(0.5, 0.5);

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

              let id = gameObject.platform;
              axios.post(`https://streamercup-api.chrotos.net/api/game/19/${id}`).catch(error => {
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