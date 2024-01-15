<template>
  <div id="phaser" />
</template>

<script setup lang="ts">
import * as Phaser from 'phaser';
import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { useConfigStore } from '@/stores/configuration'
import { useStateStore } from '@/stores/state'
import { storeToRefs } from 'pinia'
import { useExtensionStore } from '@/stores/extension'
import type { SoundSequenceData } from '@/types/soundSequence'
import GameConfig = Phaser.Types.Core.GameConfig
import Pointer = Phaser.Input.Pointer

const startX = 100;
const endX = 500;
const cardY = 200;
const zoneY =  400;
const zoneDim = 40;
const gapWidth = 10;

declare type Zone = Phaser.GameObjects.Zone & {
  slot?: number
}
declare type Card = Phaser.GameObjects.Image & {
  player?: number
  zone?: number
}

const config = useConfigStore()

const state = useStateStore()
// @ts-ignore
const { gameData }: { gameData: Ref<SoundSequenceData> } = storeToRefs(state)
const players = gameData.value.players

const extension = useExtensionStore()
const axios = extension.axios

const apiUrl = config.getApiUrl('game/13/')

onMounted(() => {
  const zones: Zone[] = [];
  const cards: Card[] = [];
  const order: number[] = [];
  const gaps = (players.length - 1);
  const steps = (endX - startX - (gaps * gapWidth)) / players.length;

  const config: GameConfig = {
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
        for (let i = 0; i < players.length; i++) {
          this.load.image('player' + (i + 1), players[i]);
        }
      },
      create: function () {
        players.forEach((player, index) => {
          const zoneX = startX + steps * index + index * gapWidth;
          let zone: Zone = this.add.zone(zoneX, zoneY, zoneDim, zoneDim).setRectangleDropZone(zoneDim, zoneDim);
          zone.slot = index + 1;
          zones.push(zone);

          let graphics = this.add.graphics();
          graphics.lineStyle(2, 0xffff00);
          graphics.strokeRect(zone.x - zone.input?.hitArea.width / 2, zone.y - zone.input?.hitArea.height / 2, zone.input?.hitArea.width, zone.input?.hitArea.height);

          const cardX = startX + steps * index + index * gapWidth;
          let card: Card = this.add.image(cardX, cardY, 'player' + (index + 1)).setInteractive().setScale(0.4);
          card.player = index + 1;
          cards.push(card);

          this.input.setDraggable(card);
        })
        this.add.text(600 / 2, 30, 'Sound-Sequenz', {font: '40px Arial', fill: '#FFFFFF', align: "center"}).setOrigin(0.5, 0.5);

        cards.forEach(card => this.children.bringToTop(card));

        this.input.on('drop', (pointer: Pointer, gameObject: Card, dropZone: Zone) => {
          // if slot already filled
          // @ts-ignore
          if (order[dropZone.slot - 1] && order[dropZone.slot - 1] !== gameObject.player) {
            // get player
            // @ts-ignore
            let player = order[dropZone.slot - 1];
            // get card by player
            let dropped = cards.find(card => card.player === player);

            let x,y,zone;
            if (gameObject.zone) {
              // Started at drop zone
              x = zones[gameObject.zone - 1].x;
              y = zones[gameObject.zone - 1].y;
              zone = gameObject.zone;
            } else {
              // Started at origin
              // @ts-ignore
              x = gameObject.input.dragStartX;
              // @ts-ignore
              y = gameObject.input.dragStartY;
            }

            // updated previous card's coordinates
            // @ts-ignore
            dropped.x = x;
            // @ts-ignore
            dropped.y = y;

            if (zone) {
              // if dragged from zone
              // @ts-ignore
              dropped.zone = zone;
              // @ts-ignore
              order[zone - 1] = dropped.player;
            } else {
              // if dragged from origin
              // @ts-ignore
              delete dropped.zone;
            }
          } else if (gameObject.zone) {
            order[gameObject.zone - 1] = 0;
          }

          gameObject.x = dropZone.x;
          gameObject.y = dropZone.y;
          // @ts-ignore
          gameObject.zone = dropZone.slot;
          // Set player in order
          // @ts-ignore
          order[gameObject.zone - 1] = gameObject.player;

          for (let i = 0; i < players.length; i++) {
            if (!order[i]) {
              return;
            }
          }

          axios.post(apiUrl, null, {
            params: {
              order: order.join('')
            }
          });
        });

        this.input.on('drag', (pointer: Pointer, gameObject: Card, dragX: number, dragY: number) =>
        {
          gameObject.x = dragX;
          gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer: Pointer, gameObject: Card, dropped: boolean) =>
        {
          if (!dropped)
          {
            // @ts-ignore
            gameObject.x = gameObject.input.dragStartX;
            // @ts-ignore
            gameObject.y = gameObject.input.dragStartY;
          }
        });
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