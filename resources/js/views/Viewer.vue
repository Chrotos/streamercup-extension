<template>
    <div v-bind:class="mainClassName">
      <CollectSheeps v-if="sheep.gates?.length" v-bind:sheep="sheep" />
      <SharpPath v-if="sharpPath.walls?.length" v-bind:walls="sharpPath.walls" />
      <SoundSequence v-if="soundSequence?.players.length" v-bind:sequence="soundSequence" />
      <div v-if="voting?.title && voting?.options">
        <h2 style="text-align: center">{{ voting.title }} : {{ countDown }}s</h2>
        <table style="table-layout: fixed">
          <tr>
            <th v-for="option in voting.options" style="text-align: center">
              {{ option.name }}
            </th>
          </tr>
          <tr>
            <td v-for="option in voting.options" style="text-align: center">
              {{ option.description }}
            </td>
          </tr>
          <tr>
            <td v-for="option in voting.options" style="text-align: center">
              {{ option.votes }}
            </td>
          </tr>
          <tr>
            <td v-if="!voted" v-for="option in voting.options">
              <button @click="vote(option.game_id)" style="display: block; width: 100%">Vote</button>
            </td>
          </tr>
        </table>
      </div>
    </div>
</template>

<script>
import Twitch from '../mixins/Twitch';
import CollectSheeps from '../components/CollectSheeps.vue';
import SoundSequence from "../components/SoundSequence.vue";
import SharpPath from "../components/SharpPath.vue";

export default {
    name: 'Viewer',
    components: {SharpPath, SoundSequence, CollectSheeps},

    mixins: [
        Twitch
    ],

    computed: {
        votingEnd() {
            return this.voting?.end_date;
        },
        mainClassName() {
            return `viewer ${this.theme} ${this.platform}`;
        }
    },

    data () {
        return {
            voting: {},
            voted: false,
            countDown: 0,
            sheep: {gates: []},
            sharpPath: {walls: []},
            soundSequence: {players: []},
            theme: 'light',
            platform: 'web',
        }
    },

    mounted () {

    },

    methods: {
        vote (gameId) {
          this.voted = true;
            this.$http.post(`https://streamercup-api.chrotos.net/api/vote/${gameId}`).catch(error => {
              if (error.response.status === 409) {
                this.voted = true;
                return;
              }
              if (error.response.status === 403) {
                this.voting = null;
              }

              this.voted = false;
            });
        },

        boot () {
            logger('Enabling...');

            if (this.auth.isLoggedIn()) {
              window.pusher.subscribe('presence-' + this.auth.getUserId()).bind_global(this.onPrivateMessage);
            } else {
              this.askForAuth();
            }
            window.pusher.subscribe('cache-global').bind_global(this.onGlobalMessage);

            this.finishedLoading = true;
        },

        contextUpdate (context, delta) {
            this.theme = context.theme;
            this.platform = this.getPlatform();
        },

        logError (error) {
            logger('EBS request returned '+error.status+' ('+error+')');
        },

        onGlobalMessage (messageName, message) {
            switch (messageName) {
              case 'voting':
                let newVoting = false;
                if (!this.voting?.title || !this.voting?.options) {
                  if (message?.title && message?.options) {
                    this.voted = false;
                    newVoting = true;
                  }
                }
                this.voting = message ?? {};
                if (newVoting) {
                  this.countDownTimer();
                }
                this.sheep = {gates:[]};
                this.soundSequence = {players: []};
                this.sharpPath = {walls: []};
                break;
              case 'sheep':
                this.voting = {};
                this.sheep = message ?? {gates:[]};
                this.soundSequence = {players: []};
                this.sharpPath = {walls: []};
                break;
              case 'sound_sequence':
                this.voting = {};
                this.sheep = {gates:[]};
                this.soundSequence = message ?? {players: []};
                this.sharpPath = {walls: []};
                break;
              case 'sharp_path':
                this.voting = {};
                this.sheep = {gates:[]};
                this.soundSequence = {players: []};
                this.sharpPath = message ?? {walls: []};
            }
        },

        onPrivateMessage (messageName, message) {
            switch (messageName) {
              case "state":
                this.voted = message.voted;
                break;
            }
        },

        countDownTimer() {
            if (this.votingEnd) {
                this.countDown = Math.floor((Date.parse(this.votingEnd) - new Date()) / 1000);
                if (this.countDown < 0) {
                  this.countDown = 0;
                }

                setTimeout(() => {
                    this.countDown = Math.floor((Date.parse(this.votingEnd) - new Date()) / 1000);
                    if (this.countDown < 0) {
                        this.countDown = 0;
                    } else {
                        this.countDownTimer();
                    }
                }, 1000);
            }
        },
    }
}
</script>
<style>
  table {
    width: 100%;
  }
  td {
    width: 33.33%;
  }
  .viewer {
    height: 100%;
  }
</style>