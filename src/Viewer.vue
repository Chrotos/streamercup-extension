<template>
  <div v-bind:class="mainClassName" v-if="finishedLoading">
    <div class="bg-dark h-full flex flex-col gap-3">
      <Header />

      <div class="flex h-full justify-center">
        <template v-if="authenticated">
          <template v-if="phase === Phase.Game && gameData && gameId">
            <div class="flex flex-col justify-center">
              <CollectSheeps v-if="gameId === GameID.Schafe_sammeln" :key="GameID.Schafe_sammeln" />
              <ChooseWisely v-else-if="gameId === GameID.Waehle_weise" :key="GameID.Waehle_weise" />
              <ComboCannon v-else-if="gameId === GameID.Kombi_Kanone" :key="GameID.Kombi_Kanone" />
              <CopyStructures v-else-if="gameId === GameID.Konstrukte_kopieren" :key="GameID.Konstrukte_kopieren" />
              <EstimateSheeps v-else-if="gameId === GameID.Schaefchen_schaetzen" :key="GameID.Schaefchen_schaetzen" />
              <FloeNudging v-else-if="gameId === GameID.Schollen_Schubser" :key="GameID.Schollen_Schubser" />
              <FoldFigures v-else-if="gameId === GameID.Figuren_falten" :key="GameID.Figuren_falten" />
              <MatchingPlatform v-else-if="gameId === GameID.Passende_Plattform" :key="GameID.Passende_Plattform" />
              <PuzzlePortrait v-else-if="gameId === GameID.Puzzle_Portrait" :key="GameID.Puzzle_Portrait" />
              <RadiusEraser v-else-if="gameId === GameID.Radius_Radierer" :key="GameID.Radius_Radierer" />
              <SharpPath v-else-if="gameId === GameID.Scharfe_Schneise" :key="GameID.Scharfe_Schneise" />
              <SoundSequence v-else-if="gameId === GameID.Sound_Sequenz" :key="GameID.Sound_Sequenz" />
              <SweetsCatcher v-else-if="gameId === GameID.Suessigkeiten_Schnapper" :key="GameID.Suessigkeiten_Schnapper" />
              <SimonSays v-else-if="gameId === GameID.Simon_says" :key="GameID.Simon_says" />
              <TimeCounter v-else-if="gameId === GameID.Zeit_Zaehler" :key="GameID.Zeit_Zaehler" />
              <TrafficLight v-else-if="gameId === GameID.Achtung_Ampel" :key="GameID.Achtung_Ampel" />
            </div>
          </template>

          <template v-else-if="phase === Phase.Voting">
            <div class="w-full h-full">
              <VotingNew />
            </div>
          </template>
        </template>

        <template v-else>
          <div class="text-center inline vertical-center w-100 h-100">
            <h2>
              Identity Link Required
            </h2>
            <button style="background: none; border: none" id="link-button">
              <img src="@/assets/img/login.png" alt="Link" height="120px" @click="extension.askForAuth"/>
            </button>
          </div>
        </template>
      </div>

      <template v-if="branding">
        <Footer v-bind:branding="branding" />
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import CollectSheeps from '@/components/games/CollectSheeps.vue'
import ChooseWisely from '@/components/games/ChooseWisely.vue'
import ComboCannon from '@/components/games/ComboCannon.vue'
import CopyStructures from '@/components/games/CopyStructures.vue'
import EstimateSheeps from '@/components/games/EstimateSheeps.vue'
import FloeNudging from '@/components/games/FloeNudging.vue'
import FoldFigures from '@/components/games/FoldFigures.vue'
import MatchingPlatform from '@/components/games/MatchingPlatform.vue'
import PuzzlePortrait from '@/components/games/PuzzlePortrait.vue'
import RadiusEraser from '@/components/games/RadiusEraser.vue'
import SharpPath from '@/components/games/SharpPath.vue'
import SoundSequence from '@/components/games/SoundSequence.vue'
import SweetsCatcher from '@/components/games/SweetsCatcher.vue'
import SimonSays from '@/components/games/SimonSays.vue'
import TimeCounter from '@/components/games/TimeCounter.vue'
import TrafficLight from '@/components/games/TrafficLight.vue'
/*
 */
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
import { useStateStore } from '@/stores/state.ts'
import { computed, onMounted } from 'vue'
import { useExtensionStore } from '@/stores/extension'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/configuration'
import { GameID, Phase } from '@/types'
import VotingNew from '@/components/voting/VotingNew.vue'


const state = useStateStore()
const extension = useExtensionStore()
const config = useConfigStore()

const {theme, platform, phase, gameId, gameData, voteData} = storeToRefs(state)
const {branding} = storeToRefs(config)
const {finishedLoading, userId} = storeToRefs(extension)

const mainClassName = computed(() => `viewer ${theme.value} ${platform.value} bg-img h-full`)
const authenticated = computed(() => !!userId.value)

onMounted(() => {
  // TODO remove demo data
  phase.value = Phase.Game
  gameId.value = GameID.Achtung_Ampel
  gameData.value = {
    bridges: [
      1,2,3,4,5,6,7,8,9,10,11,12
    ]
  }
})

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