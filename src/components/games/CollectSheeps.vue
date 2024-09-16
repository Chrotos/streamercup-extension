<template>
  <div id="phaser" />
</template>

<script setup lang="ts">
import * as Phaser from 'phaser';
import { useConfigStore } from '@/stores/configuration'
import GameConfig = Phaser.Types.Core.GameConfig
import Pointer = Phaser.Input.Pointer
import Rectangle = Phaser.GameObjects.Rectangle
import { useExtensionStore } from '@/stores/extension'
import '@/assets/img/collect_sheeps.png'
import { onBeforeUnmount, onMounted } from 'vue'

declare type Clickable = Rectangle & {
  gate?: number
}

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
    x: 65,
    y: 97,
    rotate: true
  },
  {
    x: 300,
    y: 100,
    rotate: true
  },
  {
    x: 65,
    y: 205,
    rotate: true
  },
  {
    x: 300,
    y: 205,
    rotate: true
  },
  {
    x: 130,
    y: 35,
    rotate: false
  },
  {
    x: 130,
    y: 270,
    rotate: false
  },
  {
    x: 233,
    y: 35,
    rotate: false
  },
  {
    x: 233,
    y: 270,
    rotate: false
  },
];

const config = useConfigStore()

//const state = useStateStore()
//const { gameData } = storeToRefs(state)

const extension = useExtensionStore()
const axios = extension.axios

let area;
const clickables: Clickable[] = [];
let apiUrl = config.getApiUrl('game/1/');

onMounted(() => {
  const gameConfig: GameConfig = {
    type: Phaser.CANVAS,
    width: 350,
    height: 300,
    parent: 'phaser',
    scale: {
      mode: Phaser.Scale.FIT
    },
    banner: false,
    transparent: true,
    scene: {
      preload: function () {
        this.load.image('area', 'img/collect_sheeps.png');
      },
      create: function () {
        area = this.add.image(350 / 2, 290 / 2, 'area');
        area.setScale(0.30);
        area.setRotation(Math.PI);

        gates.forEach((gate, index) => {
          let width = !gate.rotate ? 30 : 25;
          let height = !gate.rotate ? 25 : 40;
          let clickable: Clickable = this.add.rectangle(gate.x, gate.y, width, height, defaultFillStyle.color, defaultFillStyle.alpha);
          clickable.setInteractive();
          clickable.gate = index;
          clickables.push(clickable);
        })

        this.add.text(350 / 2, 300 / 2, 'Schafe sammeln', {font: '30px Arial', fill: '#FFFFFF', align: "center"}).setOrigin(0.5, 0.5);

        this.input.setPollOnMove();
        this.input.on('gameobjectover', function (pointer: Pointer, gameObject: Clickable) {
          if (gameObject.type === 'Rectangle') {
            gameObject.setScale(1.05);
          }
        })

        this.input.on('gameobjectout', function (pointer: Pointer, gameObject: Clickable) {
          if (gameObject.type === 'Rectangle') {
            gameObject.setScale(1);
          }
        })

        this.input.on('gameobjectup', function (pointer: Pointer, gameObject: Clickable) {
          if (gameObject.type === 'Rectangle') {
            clickables.forEach(clickable => {
              clickable.setFillStyle(defaultFillStyle.color, defaultFillStyle.alpha);
            })

            let id = gameObject.gate;
            axios.post(apiUrl + id).catch(() => {
              gameObject.setFillStyle(defaultFillStyle.color, defaultFillStyle.alpha);
            });
            gameObject.setFillStyle(selectedFillStyle.color, selectedFillStyle.alpha);
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