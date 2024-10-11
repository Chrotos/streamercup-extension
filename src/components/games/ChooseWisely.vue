<template>
  <div id="phaser" />
</template>

<script setup lang="ts">
import * as Phaser from 'phaser';
type GameConfig = Phaser.Types.Core.GameConfig
import Rectangle = Phaser.GameObjects.Rectangle
import { useConfigStore } from '@/stores/configuration'
import { useExtensionStore } from '@/stores/extension'
import { useStateStore } from '@/stores/state'
import { storeToRefs } from 'pinia'
import type { ChooseWiselyData } from '@/types/chooseWisely'
import Pointer = Phaser.Input.Pointer
import { onBeforeUnmount, onMounted } from 'vue'

declare type Clickable = Rectangle & {
  platform?: number
  selected?: boolean
}

const defaultFillStyle = {
  color: 0x6666ff,
  alpha: 0.1 // TODO 0.1
}
const selectedFillStyle = {
  color: Phaser.Display.Color.GetColor(255, 0, 0),
  alpha: 0.5 // TODO 0.5
}

const platformPositions = [
  {
    x: 73,
    y: 305 / 2,
    height: 140,
    width: 140
  },
  {
    x: 224.5,
    y: 305 / 2,
    height: 142,
    width: 142
  },
];

const config = useConfigStore()

const state = useStateStore()
// @ts-ignore
const { gameData }: { gameData: Ref<ChooseWiselyData> } = storeToRefs(state)
const platforms = gameData.value.platforms

const extension = useExtensionStore()
const axios = extension.axios

const clickables: Clickable[] = [];
let area;
let apiUrl = config.getApiUrl('game/19/');

onMounted(() => {
  const gameConfig: GameConfig = {
    type: Phaser.CANVAS,
    width: 300,
    height: 300,
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
        area = this.add.image(300 / 2, 300 / 2, 'area');
        area.setScale(0.12);

        platforms.forEach((platform: number) => {
          if (platformPositions[platform - 1]) {
            let platformPosition = platformPositions[platform - 1];

            if (platformPosition.x && platformPosition.y) {
              let clickArea: Clickable = this.add.rectangle(platformPosition.x, platformPosition.y, platformPosition.width, platformPosition.height, defaultFillStyle.color, defaultFillStyle.alpha);
              clickArea.setInteractive();
              clickArea.platform = platform;

              clickables.push(clickArea);
            }
          }
        })
        // @ts-ignore
        this.add.text(300 / 2, 30, 'Wähle Weise', {font: '40px Arial', fill: '#FFFFFF', align: "center"}).setOrigin(0.5, 0.5);

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

            let id = gameObject.platform;
            //axios.post(`https://streamercup-api.chrotos.net/api/game/19/${id}`).catch(error => {
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

  const game = new Phaser.Game(gameConfig);

  onBeforeUnmount(() => {
    game.destroy(true, false)
  })
})
</script>