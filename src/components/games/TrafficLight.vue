<template>
  <div class="flex flex-col justify-center gap-3 dark:drop-shadow-[0px_0px_1px_white]">
    <div class="flex justify-center">
      <div class="text-2xl">Achtung Ampel</div>
    </div>

    <canvas ref="phaser" />
  </div>
</template>

<script setup lang="ts">
import * as Phaser from 'phaser';
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
type GameConfig = Phaser.Types.Core.GameConfig
import Rectangle = Phaser.GameObjects.Rectangle
import Pointer = Phaser.Input.Pointer
import { useConfigStore } from '@/stores/configuration'
import { useStateStore } from '@/stores/state'
import { storeToRefs } from 'pinia'
import { useExtensionStore } from '@/stores/extension'
import type { TrafficLightData } from '@/types/trafficLight'

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
    y: 95,
    height: 23,
    width: 60
  },
  {
    x: 60,
    y: 200,
    height: 23,
    width: 82
  },
  {
    x: 160,
    y: 105,
    height: 23,
    width: 82
  },
  {
    x: 198,
    y: 190,
    height: 23,
    width: 70
  },
  {
    x: 302,
    y: 85,
    height: 23,
    width: 70
  },
  {
    x: 285,
    y: 208,
    height: 23,
    width: 70
  },
  {
    x: 450,
    y: 95,
    height: 23,
    width: 67
  },
  {
    x: 420,
    y: 200,
    height: 23,
    width: 82
  },
  {
    x: 556,
    y: 115,
    height: 23,
    width: 70
  },
  {
    x: 553,
    y: 182,
    height: 23,
    width: 72
  },
];

declare type Clickable = Rectangle & {
  bridge?: number
  selected?: boolean
}

const phaser = ref(null)

const config = useConfigStore()

const state = useStateStore()
// @ts-ignore
const { gameData }: { gameData: Ref<TrafficLightData> } = storeToRefs(state)
const bridges = gameData.value.bridges

const extension = useExtensionStore()
const axios = extension.axios

let area;
const clickables: Clickable[] = [];
let apiUrl = config.getApiUrl('game/3/');

onMounted(() => {
  const config: GameConfig = {
    type: Phaser.CANVAS,
    width: 600,
    height: 300,
    // @ts-ignore
    canvas: phaser.value,
    transparent: true,
    scale: {
      mode: Phaser.Scale.FIT,
    },
    banner: false,
    scene: {
      preload: function () {
        this.load.image('area', 'img/traffic_light.png');
      },
      create: function () {
        area = this.add.image(600 / 2, 300 / 2, 'area');
        area.setScale(0.33);

        bridges.forEach((bridge) => {
          if (bridgePositions[bridge - 1]) {
            let bridgePosition = bridgePositions[bridge - 1];
            let width = bridgePosition.width;
            let height = bridgePosition.height;

            if (bridgePosition.x && bridgePosition.y) {
              let clickArea: Clickable = this.add.rectangle(bridgePosition.x, bridgePosition.y, bridgePosition.width, bridgePosition.height, defaultFillStyle.color, defaultFillStyle.alpha);
              clickArea.setInteractive();
              clickArea.bridge = bridge;

              clickables.push(clickArea);
            }
          }
        })

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

            let id = gameObject.bridge;
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