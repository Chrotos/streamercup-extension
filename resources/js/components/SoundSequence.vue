<template>
  <div id="phaser" />
</template>

<script>
import * as Phaser from 'phaser';
import Configuration from "../mixins/Configuration";

const startX = 100;
const endX = 500;
const cardY = 200;
const zoneY =  400;
const zoneDim = 40;
const gapWidth = 10;

export default {

  name: 'SoundSequence',
  data() {
    return {
      game: null
    }
  },

  props: ['sequence'],

  mixins: [
      Configuration
  ],

  beforeDestroy() {
    if (this.game) {
      this.game.destroy(true, false);
    }
  },

  mounted() {
    let apiUrl = this.getApiUrl('game/13/');

    let area;
    const zones = [];
    const cards = [];
    const order = [];
    const players = this.sequence.players;
    const gaps = (players.length - 1);
    const steps = (endX - startX - (gaps * gapWidth)) / players.length;

    const config = {
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
            let zone = this.add.zone(zoneX, zoneY, zoneDim, zoneDim).setRectangleDropZone(zoneDim, zoneDim);
            zone.slot = index + 1;
            zones.push(zone);

            let graphics = this.add.graphics();
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);

            const cardX = startX + steps * index + index * gapWidth;
            let card = this.add.image(cardX, cardY, 'player' + (index + 1)).setInteractive().setScale(0.4);
            card.player = index + 1;
            cards.push(card);

            this.input.setDraggable(card);
          })
          this.add.text(600 / 2, 30, 'Sound-Sequenz', {font: '40px Arial', fill: '#FFFFFF', align: "center"}).setOrigin(0.5, 0.5);

          cards.forEach(card => this.children.bringToTop(card));

          this.input.on('drop', (pointer, gameObject, dropZone) => {
            // if slot already filled
            if (order[dropZone.slot - 1] && order[dropZone.slot - 1] !== gameObject.player) {
              // get player
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
                x = gameObject.input.dragStartX;
                y = gameObject.input.dragStartY;
              }

              // updated previous card's coordinates
              dropped.x = x;
              dropped.y = y;

              if (zone) {
                // if dragged from zone
                dropped.zone = zone;
                order[zone - 1] = dropped.player;
              } else {
                // if dragged from origin
                delete dropped.zone;
              }
            } else if (gameObject.zone) {
              order[gameObject.zone - 1] = 0;
            }

            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            gameObject.zone = dropZone.slot;
            // Set player in order
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

          this.input.on('drag', (pointer, gameObject, dragX, dragY) =>
          {
            gameObject.x = dragX;
            gameObject.y = dragY;
          });

          this.input.on('dragend', (pointer, gameObject, dropped) =>
          {
            if (!dropped)
            {
              gameObject.x = gameObject.input.dragStartX;
              gameObject.y = gameObject.input.dragStartY;
            }
          });
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