<template>
  <div id="phaser" />
</template>

<script setup lang="ts">
import * as Phaser from 'phaser';
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { useConfigStore } from '@/stores/configuration'
import { useStateStore } from '@/stores/state'
import { storeToRefs } from 'pinia'
import { useExtensionStore } from '@/stores/extension'
import { type SharpPathData, SharpPathWall } from '@/types/sharpPath'
import GameConfig = Phaser.Types.Core.GameConfig
import Rectangle = Phaser.GameObjects.Rectangle
import Pointer = Phaser.Input.Pointer

const defaultFillStyle = {
  color: 0x6666ff,
  alpha: 0.3
}
const selectedFillStyle = {
  color: Phaser.Display.Color.GetColor(255, 0, 0),
  alpha: 0.7
}

const wallPositions: { [key in SharpPathWall]: { x: number, y: number, height: number, width: number } } = {
  [SharpPathWall.TOP_DOWN_1]: {
    x: 282,
    y: 50,
    height: 22,
    width: 30
  },
  [SharpPathWall.DOWN_TOP_1]: {
    x: 282,
    y: 290,
    height: 22,
    width: 30
  },
  [SharpPathWall.TOP_DOWN_2]: {
    x: 242,
    y: 50,
    height: 22,
    width: 30
  },
  [SharpPathWall.DOWN_TOP_2]: {
    x: 242,
    y: 290,
    height: 22,
    width: 30
  },
  [SharpPathWall.TOP_DOWN_3]: {
    x: 200,
    y: 50,
    height: 22,
    width: 30
  },
  [SharpPathWall.DOWN_TOP_3]: {
    x: 200,
    y: 290,
    height: 22,
    width: 30
  },
  [SharpPathWall.TOP_DOWN_4]: {
    x: 160,
    y: 50,
    height: 22,
    width: 30
  },
  [SharpPathWall.DOWN_TOP_4]: {
    x: 160,
    y: 290,
    height: 22,
    width: 30
  },
  [SharpPathWall.TOP_DOWN_5]: {
    x: 119,
    y: 50,
    height: 22,
    width: 30
  },
  [SharpPathWall.DOWN_TOP_5]: {
    x: 119,
    y: 290,
    height: 22,
    width: 30
  },
  [SharpPathWall.LEFT_RIGHT_6]: {
    x: 80,
    y: 89,
    height: 30,
    width: 22
  },
  [SharpPathWall.RIGHT_LEFT_6]: {
    x: 320,
    y: 89,
    height: 30,
    width: 22
  },
  [SharpPathWall.LEFT_RIGHT_7]: {
    x: 80,
    y: 129,
    height: 30,
    width: 22
  },
  [SharpPathWall.RIGHT_LEFT_7]: {
    x: 320,
    y: 129,
    height: 30,
    width: 22
  },
  [SharpPathWall.LEFT_RIGHT_8]: {
    x: 80,
    y: 170,
    height: 30,
    width: 22
  },
  [SharpPathWall.RIGHT_LEFT_8]: {
    x: 320,
    y: 170,
    height: 30,
    width: 22
  },
  [SharpPathWall.LEFT_RIGHT_9]: {
    x: 80,
    y: 211,
    height: 30,
    width: 22
  },
  [SharpPathWall.RIGHT_LEFT_9]: {
    x: 320,
    y: 211,
    height: 30,
    width: 22
  },
  [SharpPathWall.LEFT_RIGHT_10]: {
    x: 80,
    y: 252,
    height: 30,
    width: 22
  },
  [SharpPathWall.RIGHT_LEFT_10]: {
    x: 320,
    y: 252,
    height: 30,
    width: 22
  }
}

declare type Clickable = Rectangle & {
  wall?: SharpPathWall
  selected?: boolean
}

const config = useConfigStore()

const state = useStateStore()
// @ts-ignore
const { gameData }: { gameData: Ref<SharpPathData> } = storeToRefs(state)
const walls = gameData.value.walls

const extension = useExtensionStore()
const axios = extension.axios

const apiUrl = config.getApiUrl('game/37/')

onMounted(() => {
  let area;
  const clickables: Clickable[] = [];

  const config: GameConfig = {
    type: Phaser.CANVAS,
    width: 400,
    height: 300,
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
        area = this.add.image(400 / 2, 300 / 2 + 20, 'area');
        area.setScale(0.19);
        area.setRotation(Math.PI);

        walls.forEach((wall, index) => {
          if (wallPositions[wall]) {
            let wallPosition = wallPositions[wall];

            let rotation = -1;
            let width, height;
            switch (String(wall).substring(0, String(wall).indexOf('_')).toLowerCase()) {
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
              let clickArea: Clickable = this.add.rectangle(wallPosition.x, wallPosition.y, wallPosition.width, wallPosition.height, defaultFillStyle.color, defaultFillStyle.alpha);
              clickArea.setInteractive();
              clickArea.wall = wall;

              clickables.push(clickArea);
            }
          }
        })
        this.add.text(400 / 2, 15, 'Scharfe Schneise', {font: '30px Arial', fill: '#FFFFFF', align: "center"}).setOrigin(0.5, 0.5);

        this.input.setPollOnMove();
        this.input.setTopOnly(true);
        this.input.on('gameobjectover', function (pointer: Pointer, gameObject: Clickable) {
          if (gameObject.selected) {
            return;
          }

          if (gameObject.type === 'Rectangle') {
            gameObject.setFillStyle(defaultFillStyle.color, selectedFillStyle.alpha);
          }
        })

        this.input.on('gameobjectout', function (pointer: Pointer, gameObject: Clickable) {
          if (gameObject.selected) {
            return;
          }

          if (gameObject.type === 'Rectangle') {
            gameObject.setFillStyle(defaultFillStyle.color, defaultFillStyle.alpha);
          }
        })

        this.input.on('gameobjectup', function (pointer: Pointer, gameObject: Clickable) {
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

  const game = new Phaser.Game(config);

  onBeforeUnmount(() => {
    game.destroy(true, false)
  })
})

/*
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
 */
</script>

<style scoped>

</style>