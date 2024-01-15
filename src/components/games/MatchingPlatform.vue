<template>
  <div id="phaser" />
</template>

<script setup lang="ts">
import * as Phaser from 'phaser';
import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { useConfigStore } from '@/stores/configuration'
import { useStateStore } from '@/stores/state'
import { storeToRefs } from 'pinia'
import type { ChooseWiselyData } from '@/types/chooseWisely'
import { useExtensionStore } from '@/stores/extension'
import type { MatchingPlatformData } from '@/types/matchingPlatform'
import Rectangle = Phaser.GameObjects.Rectangle
import GameConfig = Phaser.Types.Core.GameConfig
import Pointer = Phaser.Input.Pointer

declare type Clickable = Rectangle & {
  wall?: string
}

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

const config = useConfigStore()

const state = useStateStore()
// @ts-ignore
const { gameData }: { gameData: Ref<MatchingPlatformData> } = storeToRefs(state)
const platforms = gameData.value.platforms

const extension = useExtensionStore()
const axios = extension.axios

let apiUrl = config.getApiUrl('game/47/');
const clickables: Clickable[] = [];

onMounted(() =>{
  let area;

  const config: GameConfig = {
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
          switch (index.substring(0, index.indexOf('_')).toLowerCase()) {
            case 'top':
              rotation = Math.PI;
              break
            case 'down':
              if (rotation === -1) {
                rotation = 0;
              }
              break;
            case 'left':
              rotation = Math.PI / 2;
              break
            case 'right':
              if (rotation === -1) {
                rotation = Math.PI * 1.5;
              }
              break;
          }

          if (wallPosition.x && wallPosition.y) {
            let clickArea: Clickable = this.add.rectangle(wallPosition.x, wallPosition.y, wallPosition.width, wallPosition.height, defaultFillStyle.color, defaultFillStyle.alpha);
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
</script>

<style scoped>

</style>