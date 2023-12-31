<template>
    <div v-bind:class="mainClassName" v-if="finishedLoading">
      <CollectSheeps v-if="sheep.gates?.length" v-bind:sheep="sheep" :key="'unique'" />
      <SharpPath v-if="sharpPath.walls?.length" v-bind:walls="sharpPath.walls" :key="'unique'" />
      <SoundSequence v-if="soundSequence?.players?.length" v-bind:sequence="soundSequence" :key="'unique'" />
      <PuzzlePortrait v-if="puzzlePortrait?.players?.length" v-bind:sequence="puzzlePortrait" :key="'unique'" />
      <TrafficLight v-if="trafficLight?.bridges?.length" v-bind:bridges="trafficLight.bridges" :key="'unique'" />
      <ChooseWisely v-if="chooseWisely?.platforms?.length" v-bind:platforms="chooseWisely.platforms" :key="'unique'" />
      <SweetsCatcher v-if="sweetsCatcher?.conditions?.length" v-bind:conditions="sweetsCatcher.conditions" :key="'unique'" />
      <FloeNudging v-if="floeNudging?.players?.length" v-bind:players="floeNudging.players" :key="'unique'" />
      <EstimateSheeps v-if="estimateSheeps?.conditions?.length" v-bind:conditions="estimateSheeps.conditions" :key="'unique'" />
      <FoldFigures v-if="foldFigures?.active" :key="'unique'" />
      <RadiusEraser v-if="radiusEraser?.conditions?.length" v-bind:conditions="radiusEraser.conditions" :key="'unique'" />
      <SimonSays v-if="simonSays?.conditions?.length" v-bind:conditions="simonSays.conditions" :key="'unique'" />
      <ComboCannon v-if="comboCannon?.active" :key="'unique'" />
      <TimeCounter v-if="timeCounter?.conditions?.length" v-bind:conditions="timeCounter.conditions" :key="'unique'" />
      <CopyStructures v-if="copyStructures?.structures?.length" v-bind:structures="copyStructures.structures" :key="'unique'" />
      <MatchingPlatform v-if="matchingPlatform?.platforms?.length" v-bind:platforms="matchingPlatform.platforms" :key="'unique'" />

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
      <div v-if="nothingShown || !auth.isLoggedIn()" style="width: 100%; text-align: center">
        <h1>STREAMERCUP</h1>
        <h2 v-if="nothingShown && auth.isLoggedIn()">Waiting for next Game</h2>
      </div>
      <div v-if="!auth.isLoggedIn()" style="width: 100%; text-align: center">
        <h3>
          Identity Link Required
        </h3>
        <button style="background: none; border: none" id="link-button">
          <img src="img/login.png" alt="Link" height="65px" @click="askForAuth"/>
        </button>
      </div>
    </div>
</template>

<script>
import Twitch from '../mixins/Twitch';
import CollectSheeps from '../components/CollectSheeps.vue';
import SoundSequence from "../components/SoundSequence.vue";
import SharpPath from "../components/SharpPath.vue";
import PuzzlePortrait from "../components/PuzzlePortrait.vue";
import TrafficLight from "../components/TrafficLight.vue";
import ChooseWisely from "../components/ChooseWisely.vue";
import SweetsCatcher from "../components/SweetsCatcher.vue";
import FloeNudging from "../components/FloeNudging.vue";
import EstimateSheeps from "../components/EstimateSheeps.vue";
import FoldFigures from "../components/FoldFigures.vue";
import RadiusEraser from "../components/RadiusEraser.vue";
import SimonSays from "../components/SimonSays.vue";
import ComboCannon from "../components/ComboCannon.vue";
import TimeCounter from "../components/TimeCounter.vue";
import CopyStructures from "../components/CopyStructures.vue";
import Pusher from "pusher-js";
import * as PusherTypes from 'pusher-js';
import Configuration from "../mixins/Configuration";
import MatchingPlatform from "../components/MatchingPlatform.vue";

export default {
    name: 'Viewer',
    components: {
      MatchingPlatform,
      CopyStructures, TimeCounter, ComboCannon, SimonSays, RadiusEraser, FoldFigures, EstimateSheeps,
      FloeNudging, SweetsCatcher, ChooseWisely, TrafficLight, PuzzlePortrait, SharpPath, SoundSequence, CollectSheeps
    },

    mixins: [
        Twitch,
        Configuration
    ],

    computed: {
        votingEnd() {
            return this.voting?.end_date;
        },
        mainClassName() {
            return `viewer ${this.theme} ${this.platform}`;
        },
    },

    data () {
        return {
            voting: {},
            voted: false,
            countDown: 0,
            sheep: {gates: []},
            sharpPath: {walls: []},
            soundSequence: {players: []},
            puzzlePortrait: {players: []},
            trafficLight: {bridges: []},
            chooseWisely: {platforms: []},
            sweetsCatcher: {conditions: []},
            floeNudging: {players: []},
            estimateSheeps: {conditions: []},
            foldFigures: {active: false},
            radiusEraser: {conditions: []},
            simonSays: {conditions: []},
            comboCannon: {active: false},
            timeCounter: {conditions: []},
            copyStructures: {structures: []},
            matchingPlatform: {platforms: []},
            theme: 'light',
            platform: 'web',
            nothingShown: false
        }
    },

    mounted () {

    },

    beforeUpdate() {
        this.nothingShown = !(this.sheep.gates?.length || this.sharpPath.walls?.length || this.soundSequence?.players?.length
                              || this.puzzlePortrait?.players?.length || this.trafficLight?.bridges?.length || this.chooseWisely?.platforms?.length
                              || this.sweetsCatcher?.conditions?.length || this.floeNudging?.players?.length || this.estimateSheeps?.conditions?.length
                              || this.foldFigures?.active || this.radiusEraser?.conditions?.length || this.simonSays?.conditions?.length
                              || this.comboCannon?.active || this.timeCounter?.conditions?.length || this.copyStructures?.structures?.length
                              || this.matchingPlatform?.platforms?.length || this.voting?.title && !!this.voting?.options?.length);
    },

    methods: {
          vote (gameId) {
            this.voted = true;
              //this.$http.post(`https://streamercup-api.chrotos.net/api/vote/${gameId}`).catch(error => {
              this.$http.post(this.getApiUrl(`vote/${gameId}`)).catch(error => {
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
              this.connectSocket();
              if (this.auth.isLoggedIn()) {
                  window.pusher.subscribe('presence-' + this.auth.getUserId()).bind_global(this.onPrivateMessage);
                  window.pusher.subscribe('cache-global').bind_global(this.onGlobalMessage);
              }

              this.finishedLoading = true;
          },

          contextUpdate (context, delta) {
            this.theme = context.theme;
            this.platform = this.getPlatform();
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
                  this.puzzlePortrait = {players: []};
                  this.trafficLight = {bridges: []};
                  this.chooseWisely = {platforms: []};
                  this.sweetsCatcher = {conditions: []};
                  this.floeNudging = {players: []};
                  this.estimateSheeps = {conditions: []};
                  this.foldFigures = {active: false}
                  this.simonSays = {conditions: []};
                  this.comboCannon = {active: false};
                  this.timeCounter = {conditions: []};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = {platforms: []};
                  break;
                case 'sheep':
                  this.voting = {};
                  this.soundSequence = {players: []};
                  this.sharpPath = {walls: []};
                  this.puzzlePortrait = {players: []};
                  this.trafficLight = {bridges: []};
                  this.chooseWisely = {platforms: []};
                  this.sweetsCatcher = {conditions: []};
                  this.floeNudging = {players: []};
                  this.estimateSheeps = {conditions: []};
                  this.foldFigures = {active: false}
                  this.simonSays = {conditions: []};
                  this.comboCannon = {active: false};
                  this.timeCounter = {conditions: []};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = {platforms: []};
                  this.sheep = message ?? {gates:[]};
                  break;
                case 'sound_sequence':
                  this.voting = {};
                  this.sheep = {gates:[]};
                  this.sharpPath = {walls: []};
                  this.puzzlePortrait = {players: []};
                  this.trafficLight = {bridges: []};
                  this.chooseWisely = {platforms: []};
                  this.sweetsCatcher = {conditions: []};
                  this.floeNudging = {players: []};
                  this.estimateSheeps = {conditions: []};
                  this.foldFigures = {active: false}
                  this.simonSays = {conditions: []};
                  this.comboCannon = {active: false};
                  this.timeCounter = {conditions: []};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = {platforms: []};
                  this.soundSequence = message ?? {players: []};
                  break;
                case 'sharp_path':
                  this.voting = {};
                  this.sheep = {gates:[]};
                  this.soundSequence = {players: []};
                  this.puzzlePortrait = {players: []};
                  this.trafficLight = {bridges: []};
                  this.chooseWisely = {platforms: []};
                  this.sweetsCatcher = {conditions: []};
                  this.floeNudging = {players: []};
                  this.estimateSheeps = {conditions: []};
                  this.foldFigures = {active: false}
                  this.simonSays = {conditions: []};
                  this.comboCannon = {active: false};
                  this.timeCounter = {conditions: []};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = {platforms: []};
                  this.sharpPath = message ?? {walls: []};
                  break;
                case 'puzzle_portrait':
                  this.voting = {};
                  this.sheep = {gates:[]};
                  this.soundSequence = {players: []};
                  this.sharpPath = {walls: []};
                  this.trafficLight = {bridges: []};
                  this.chooseWisely = {platforms: []};
                  this.sweetsCatcher = {conditions: []};
                  this.floeNudging = {players: []};
                  this.estimateSheeps = {conditions: []};
                  this.foldFigures = {active: false}
                  this.simonSays = {conditions: []};
                  this.comboCannon = {active: false};
                  this.timeCounter = {conditions: []};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = {platforms: []};
                  this.puzzlePortrait = message ?? {players: []};
                  break;
                case 'traffic_light':
                  this.voting = {};
                  this.sheep = {gates:[]};
                  this.soundSequence = {players: []};
                  this.sharpPath = {walls: []};
                  this.puzzlePortrait = {players: []};
                  this.chooseWisely = {platforms: []};
                  this.sweetsCatcher = {conditions: []};
                  this.floeNudging = {players: []};
                  this.estimateSheeps = {conditions: []};
                  this.foldFigures = {active: false}
                  this.simonSays = {conditions: []};
                  this.comboCannon = {active: false};
                  this.timeCounter = {conditions: []};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = {platforms: []};
                  this.trafficLight = message ?? {bridges: []};
                  break;
                case 'choose_wisely':
                  this.voting = {};
                  this.sheep = {gates:[]};
                  this.soundSequence = {players: []};
                  this.sharpPath = {walls: []};
                  this.puzzlePortrait = {players: []};
                  this.trafficLight = {bridges: []};
                  this.sweetsCatcher = {conditions: []};
                  this.floeNudging = {players: []};
                  this.estimateSheeps = {conditions: []};
                  this.foldFigures = {active: false}
                  this.simonSays = {conditions: []};
                  this.comboCannon = {active: false};
                  this.timeCounter = {conditions: []};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = {platforms: []};
                  this.chooseWisely = message ?? {platforms: []};
                  break;
                case 'sweets_catcher':
                  this.voting = {};
                  this.sheep = {gates:[]};
                  this.soundSequence = {players: []};
                  this.sharpPath = {walls: []};
                  this.puzzlePortrait = {players: []};
                  this.trafficLight = {bridges: []};
                  this.chooseWisely = {platforms: []};
                  this.floeNudging = {players: []};
                  this.estimateSheeps = {conditions: []};
                  this.foldFigures = {active: false}
                  this.simonSays = {conditions: []};
                  this.comboCannon = {active: false};
                  this.timeCounter = {conditions: []};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = {platforms: []};
                  this.sweetsCatcher = message ?? {conditions: []};
                  break;
                case 'floe_nudging':
                  this.voting = {};
                  this.sheep = {gates:[]};
                  this.soundSequence = {players: []};
                  this.sharpPath = {walls: []};
                  this.puzzlePortrait = {players: []};
                  this.trafficLight = {bridges: []};
                  this.chooseWisely = {platforms: []};
                  this.sweetsCatcher = {conditions: []};
                  this.estimateSheeps = {conditions: []};
                  this.foldFigures = {active: false}
                  this.simonSays = {conditions: []};
                  this.comboCannon = {active: false};
                  this.timeCounter = {conditions: []};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = {platforms: []};
                  this.floeNudging = message ?? {players: []};
                  break;
                case 'estimate_sheeps':
                  this.voting = {};
                  this.sheep = {gates:[]};
                  this.soundSequence = {players: []};
                  this.sharpPath = {walls: []};
                  this.puzzlePortrait = {players: []};
                  this.trafficLight = {bridges: []};
                  this.chooseWisely = {platforms: []};
                  this.sweetsCatcher = {conditions: []};
                  this.floeNudging = {players: []};
                  this.foldFigures = {active: false}
                  this.simonSays = {conditions: []};
                  this.comboCannon = {active: false};
                  this.timeCounter = {conditions: []};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = {platforms: []};
                  this.estimateSheeps = message ?? {conditions: []};
                  break;
                case 'fold_figures':
                  this.voting = {};
                  this.sheep = {gates:[]};
                  this.soundSequence = {players: []};
                  this.sharpPath = {walls: []};
                  this.puzzlePortrait = {players: []};
                  this.trafficLight = {bridges: []};
                  this.chooseWisely = {platforms: []};
                  this.sweetsCatcher = {conditions: []};
                  this.floeNudging = {players: []};
                  this.estimateSheeps = {conditions: []};
                  this.simonSays = {conditions: []};
                  this.comboCannon = {active: false};
                  this.timeCounter = {conditions: []};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = {platforms: []};
                  this.foldFigures = message ?? {active: false};
                  break
                case 'radius_eraser':
                  this.voting = {};
                  this.sheep = {gates:[]};
                  this.soundSequence = {players: []};
                  this.sharpPath = {walls: []};
                  this.puzzlePortrait = {players: []};
                  this.trafficLight = {bridges: []};
                  this.chooseWisely = {platforms: []};
                  this.sweetsCatcher = {conditions: []};
                  this.floeNudging = {players: []};
                  this.estimateSheeps = {conditions: []};
                  this.foldFigures = {active: false};
                  this.simonSays = {conditions: []};
                  this.comboCannon = {active: false};
                  this.timeCounter = {conditions: []};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = {platforms: []};
                  this.radiusEraser = message ?? {conditions: []};
                  break
                case 'simon_says':
                  this.voting = {};
                  this.sheep = {gates:[]};
                  this.soundSequence = {players: []};
                  this.sharpPath = {walls: []};
                  this.puzzlePortrait = {players: []};
                  this.trafficLight = {bridges: []};
                  this.chooseWisely = {platforms: []};
                  this.sweetsCatcher = {conditions: []};
                  this.floeNudging = {players: []};
                  this.estimateSheeps = {conditions: []};
                  this.foldFigures = {active: false};
                  this.radiusEraser = {conditions: []};
                  this.comboCannon = {active: false};
                  this.timeCounter = {conditions: []};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = {platforms: []};
                  this.simonSays = message ?? {conditions: []};
                  break;
                case 'combo_cannon':
                  this.voting = {};
                  this.sheep = {gates:[]};
                  this.soundSequence = {players: []};
                  this.sharpPath = {walls: []};
                  this.puzzlePortrait = {players: []};
                  this.trafficLight = {bridges: []};
                  this.chooseWisely = {platforms: []};
                  this.sweetsCatcher = {conditions: []};
                  this.floeNudging = {players: []};
                  this.estimateSheeps = {conditions: []};
                  this.foldFigures = {active: false};
                  this.radiusEraser = {conditions: []};
                  this.simonSays = {conditions: []};
                  this.timeCounter = {conditions: []};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = {platforms: []};
                  this.comboCannon = message ?? {active: false};
                  break;
                case 'time_counter':
                  this.voting = {};
                  this.sheep = {gates:[]};
                  this.soundSequence = {players: []};
                  this.sharpPath = {walls: []};
                  this.puzzlePortrait = {players: []};
                  this.trafficLight = {bridges: []};
                  this.chooseWisely = {platforms: []};
                  this.sweetsCatcher = {conditions: []};
                  this.floeNudging = {players: []};
                  this.estimateSheeps = {conditions: []};
                  this.foldFigures = {active: false};
                  this.radiusEraser = {conditions: []};
                  this.simonSays = {conditions: []};
                  this.comboCannon = {active: false};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = {platforms: []};
                  this.timeCounter = message ?? {conditions: []};
                  break;
                case 'copy_structures':
                  this.voting = {};
                  this.sheep = {gates:[]};
                  this.soundSequence = {players: []};
                  this.sharpPath = {walls: []};
                  this.puzzlePortrait = {players: []};
                  this.trafficLight = {bridges: []};
                  this.chooseWisely = {platforms: []};
                  this.sweetsCatcher = {conditions: []};
                  this.floeNudging = {players: []};
                  this.estimateSheeps = {conditions: []};
                  this.foldFigures = {active: false};
                  this.radiusEraser = {conditions: []};
                  this.simonSays = {conditions: []};
                  this.comboCannon = {active: false};
                  this.timeCounter = {conditions: []};
                  this.matchingPlatform = {platforms: []};
                  this.copyStructures = message ?? {structures: []};
                  break;
                case 'matching_platform':
                  this.voting = {};
                  this.sheep = {gates:[]};
                  this.soundSequence = {players: []};
                  this.sharpPath = {walls: []};
                  this.puzzlePortrait = {players: []};
                  this.trafficLight = {bridges: []};
                  this.chooseWisely = {platforms: []};
                  this.sweetsCatcher = {conditions: []};
                  this.floeNudging = {players: []};
                  this.estimateSheeps = {conditions: []};
                  this.foldFigures = {active: false};
                  this.radiusEraser = {conditions: []};
                  this.simonSays = {conditions: []};
                  this.comboCannon = {active: false};
                  this.timeCounter = {conditions: []};
                  this.copyStructures = {structures: []};
                  this.matchingPlatform = message ?? {platforms: []};
                  break;
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

          connectSocket() {
            window.pusher = new Pusher(this.getSocketKey(), {
              wsHost: this.getSocketBaseUrl(),
              wsPort: this.getSocketPort(),
              cluster: '',
              forceTLS: false,
              disableStats: true,
              enabledTransports: ['ws', 'wss'],
              channelAuthorization: {
                transport: 'ajax',
                endpoint: this.getSocketAuthorizationUrl(),
                headersProvider: () => window.axios.defaults.headers.common
              },
            });
          }
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