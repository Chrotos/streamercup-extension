import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ContextData } from '@/stores/extension'
import { useExtensionStore } from '@/stores/extension'
import Pusher from 'pusher-js'
import { useConfigStore } from '@/stores/configuration'
import { type GameData, GameID, Phase, type VoteData } from '@/types'
import type { EstimateSheepsData } from '@/types/estimateSheeps'
import type { SoundSequenceData } from '@/types/soundSequence'
import type { SharpPathData } from '@/types/sharpPath'
import type { PuzzlePortraitData } from '@/types/puzzlePortrait'
import type { TrafficLightData } from '@/types/trafficLight'
import type { ChooseWiselyData } from '@/types/chooseWisely'
import type { SweetsCatcherData } from '@/types/sweetsCatcher'
import type { FloeNudgingData } from '@/types/floeNudging'
import type { FoldFiguresData } from '@/types/foldFigures'
import type { RadiusEraserData } from '@/types/radiusEraser'
import type { SimonSaysData } from '@/types/simonSays'
import type { ComboCannonData } from '@/types/comboCannon'
import type { TimeCounterData } from '@/types/timeCounter'
import type { CopyStructuresData } from '@/types/copyStructures'
import type { MatchingPlatformData } from '@/types/matchingPlatform'
import type { EnergyEntropyData } from '@/types/energyEntropy'
import type { PotionPanicData } from '@/types/potionPanic'
import type { TreasureHunterData } from '@/types/treasureHunter'
import type { RapidCurrentData } from '@/types/rapidCurrent'
import type { BeatTheBeastData } from '@/types/beatTheBeast'
import type { MonsterSlaughterData } from '@/types/monsterSlaughter'
import type { HallwayHasteData } from '@/types/hallwayHaste'
import type { CollectSheepsData } from '@/types/collectSheeps'

export const useStateStore = defineStore('state', () => {
    const config = useConfigStore()
    const extension = useExtensionStore()

    let pusher: Pusher|null = null

    // TODO remove demo data
    const phase = ref<Phase>(Phase.Pause)

    const voteData = ref<null|VoteData>()
    const gameId = ref<null|GameID>(GameID.Empty)
    const gameData = ref<null|GameData>()

    const voted = ref(false)
    const countDown = ref(0)
    const theme = ref('light')
    const platform = ref('web')

    function processStateMessage(messageName: string, message: any) {
        switch (messageName) {
            case 'voting':
                if (!voteData.value?.title || !voteData.value?.options) {
                    if (message?.title && message?.options) {
                        voted.value = false;
                    }
                }
                voteData.value = message

                if (voteData.value?.options) {
                    phase.value = Phase.Voting
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'sheep':
                gameData.value = message

                if ((gameData.value as CollectSheepsData)?.gates?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Schafe_sammeln
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'sound_sequence':
                gameData.value = message

                if ((gameData.value as SoundSequenceData)?.players?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Sound_Sequenz
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'sharp_path':
                gameData.value = message

                if ((gameData.value as SharpPathData)?.walls?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Scharfe_Schneise
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'puzzle_portrait':
                gameData.value = message

                if ((gameData.value as PuzzlePortraitData)?.players?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Puzzle_Portrait
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'traffic_light':
                gameData.value = message

                if ((gameData.value as TrafficLightData)?.bridges?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Achtung_Ampel
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'choose_wisely':
                gameData.value = message

                if ((gameData.value as ChooseWiselyData)?.platforms?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Waehle_weise
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'sweets_catcher':
                gameData.value = message

                if ((gameData.value as SweetsCatcherData)?.conditions?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Suessigkeiten_Schnapper
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'floe_nudging':
                gameData.value = message

                if ((gameData.value as FloeNudgingData)?.players?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Schollen_Schubser
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'estimate_sheeps':
                gameData.value = message

                if ((gameData.value as EstimateSheepsData)?.conditions?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Schaefchen_schaetzen
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'fold_figures':
                gameData.value = message

                if ((gameData.value as FoldFiguresData)?.active) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Figuren_falten
                } else {
                    phase.value = Phase.Pause
                }
                break
            case 'radius_eraser':
                gameData.value = message

                if ((gameData.value as RadiusEraserData)?.conditions?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Radius_Radierer
                } else {
                    phase.value = Phase.Pause
                }
                break
            case 'simon_says':
                gameData.value = message

                if ((gameData.value as SimonSaysData)?.conditions?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Simon_says
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'combo_cannon':
                gameData.value = message

                if ((gameData.value as ComboCannonData)?.active) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Kombi_Kanone
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'time_counter':
                gameData.value = message

                if ((gameData.value as TimeCounterData)?.conditions?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Zeit_Zaehler
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'copy_structures':
                gameData.value = message

                if ((gameData.value as CopyStructuresData)?.structures?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Konstrukte_kopieren
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'matching_platform':
                gameData.value = message

                if ((gameData.value as MatchingPlatformData)?.platforms?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Passende_Plattform
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'energy_entropy':
                gameData.value = message

                if ((gameData.value as EnergyEntropyData)?.active) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Energie_Entropie
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'potion_panic':
                gameData.value = message

                if ((gameData.value as PotionPanicData)?.potions?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Potion_Panik
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'treasure_hunter':
                gameData.value = message

                if ((gameData.value as TreasureHunterData)?.conditions?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Schatz_Sammler
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'rapid_current':
                gameData.value = message

                if ((gameData.value as RapidCurrentData)?.conditions?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Schnelle_Stroemung
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'beat_the_beast':
                gameData.value = message

                if ((gameData.value as BeatTheBeastData)?.question) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Bestien_Bangen
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'monster_slaughter':
                gameData.value = message

                if ((gameData.value as MonsterSlaughterData)?.arena_effects) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Monster_Metzeln
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'hallway_haste':
                gameData.value = message

                if ((gameData.value as HallwayHasteData)?.players?.length > 0) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Hallway_Haste
                } else {
                    phase.value = Phase.Pause
                }
                break;
        }
    }


    function connectSocket(userId: string|null) {
        pusher = new Pusher(config.getSocketKey(), {
            wsHost: config.getSocketHost(),
            wsPort: config.getSocketPort(),
            cluster: '',
            forceTLS: false,
            disableStats: true,
            enabledTransports: ['ws', 'wss'],
            channelAuthorization: {
                transport: 'ajax',
                endpoint: config.getSocketAuthorizationUrl(),
                headers: {
                    Authorization: extension.axios.defaults.headers.common.Authorization
                }
            },
        });

        if (userId) {
          pusher.subscribe('presence-' + userId).bind_global(onPrivateMessage);
          pusher.subscribe('cache-global').bind_global(processStateMessage);
        }
    }

    function onPrivateMessage (messageName: string, message: any) {
        switch (messageName) {
            case "state":
                voted.value = message.voted;
                break;
        }
    }

    function contextUpdate (context: ContextData) {
        theme.value = context.context.theme
        platform.value = getPlatform()
    }

    function isMobile() {
        return getPlatform() === 'mobile'
    }

    function isWeb() {
        return getPlatform() === 'web'
    }

    function getPlatform(): string {
        const params = getQueryParams()
        if (!params.has('platform')) {
            return 'mobile'
        }

        return params.get('platform') ?? 'mobile'
    }

    function getQueryParams() {
        const queryString = window.location.search
        return new URLSearchParams(queryString)
    }

    return {voted, countDown, theme, platform, phase, gameId, gameData, voteData, contextUpdate, connectSocket}
});