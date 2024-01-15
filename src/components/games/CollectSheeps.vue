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
          let clickable: Clickable = this.add.rectangle(gate.x, gate.y, width, height, defaultFillStyle.color, defaultFillStyle.alpha);
          clickable.setInteractive();
          clickable.gate = index;
          clickables.push(clickable);
        })

        this.add.text(600 / 2, 20, 'Schafe sammeln', {font: '40px Arial', fill: '#000000', align: "center"}).setOrigin(0.5, 0.5);

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