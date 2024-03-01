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

                if ((gameData.value as EstimateSheepsData)?.conditions) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Schaefchen_schaetzen
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'sound_sequence':
                gameData.value = message

                if ((gameData.value as SoundSequenceData)?.players) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Sound_Sequenz
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'sharp_path':
                gameData.value = message

                if ((gameData.value as SharpPathData)?.walls) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Scharfe_Schneise
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'puzzle_portrait':
                gameData.value = message

                if ((gameData.value as PuzzlePortraitData)?.players) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Puzzle_Portrait
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'traffic_light':
                gameData.value = message

                if ((gameData.value as TrafficLightData)?.bridges) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Achtung_Ampel
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'choose_wisely':
                gameData.value = message

                if ((gameData.value as ChooseWiselyData)?.platforms) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Waehle_weise
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'sweets_catcher':
                gameData.value = message

                if ((gameData.value as SweetsCatcherData)?.conditions) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Suessigkeiten_Schnapper
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'floe_nudging':
                gameData.value = message

                if ((gameData.value as FloeNudgingData)?.players) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Schollen_Schubser
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'estimate_sheeps':
                gameData.value = message

                if ((gameData.value as EstimateSheepsData)?.conditions) {
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

                if ((gameData.value as RadiusEraserData)?.conditions) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Radius_Radierer
                } else {
                    phase.value = Phase.Pause
                }
                break
            case 'simon_says':
                gameData.value = message

                if ((gameData.value as SimonSaysData)?.conditions) {
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

                if ((gameData.value as TimeCounterData)?.conditions) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Zeit_Zaehler
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'copy_structures':
                gameData.value = message

                if ((gameData.value as CopyStructuresData)?.structures) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Konstrukte_kopieren
                } else {
                    phase.value = Phase.Pause
                }
                break;
            case 'matching_platform':
                gameData.value = message

                if ((gameData.value as MatchingPlatformData)?.platforms) {
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

                if ((gameData.value as PotionPanicData)?.potions) {
                    phase.value = Phase.Game
                    gameId.value = GameID.Potion_Panik
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
                headersProvider: () => extension.axios.defaults.headers.common
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

    return {voted, countDown, theme, platform, phase, gameId, gameData, voteData, /*processStateMessage,*/ contextUpdate, connectSocket}
});