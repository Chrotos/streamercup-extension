import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ContextData } from '@/stores/extension'
import { useExtensionStore } from '@/stores/extension'
import Pusher from 'pusher-js'
import { useConfigStore } from '@/stores/configuration'
import type { GameData, VoteData } from '@/types'
import { GameID, Phase } from '@/types'

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

    /*
    function processStateMessage(messageName: string, message: any) {
        switch (messageName) {
            case 'voting':
                let newVoting = false;
                if (!voting.value?.title || !voting.value?.options) {
                    if (message?.title && message?.options) {
                        voted.value = false;
                        newVoting = true;
                    }
                }
                voting.value = message ?? {};
                if (newVoting) {
                    //this.countDownTimer();
                }
                //sheep.value = {gates:[]};
                soundSequence.value = {players: []};
                sharpPath.value = {walls: []};
                puzzlePortrait.value = {players: []};
                trafficLight.value = {bridges: []};
                chooseWisely.value = {platforms: []};
                sweetsCatcher.value = {conditions: []};
                floeNudging.value = {players: []};
                estimateSheeps.value = {conditions: []};
                foldFigures.value = {active: false}
                simonSays.value = {conditions: []};
                comboCannon.value = {active: false};
                timeCounter.value = {conditions: []};
                copyStructures.value = {structures: []};
                matchingPlatform.value = {platforms: []};
                break;
            case 'sheep':
                //voting.value = {};
                soundSequence.value = {players: []};
                sharpPath.value = {walls: []};
                puzzlePortrait.value = {players: []};
                trafficLight.value = {bridges: []};
                chooseWisely.value = {platforms: []};
                sweetsCatcher.value = {conditions: []};
                floeNudging.value = {players: []};
                estimateSheeps.value = {conditions: []};
                foldFigures.value = {active: false}
                simonSays.value = {conditions: []};
                comboCannon.value = {active: false};
                timeCounter.value = {conditions: []};
                copyStructures.value = {structures: []};
                matchingPlatform.value = {platforms: []};
                //sheep.value = message ?? {gates:[]};
                break;
            case 'sound_sequence':
                //voting.value = {};
                //sheep.value = {gates:[]};
                sharpPath.value = {walls: []};
                puzzlePortrait.value = {players: []};
                trafficLight.value = {bridges: []};
                chooseWisely.value = {platforms: []};
                sweetsCatcher.value = {conditions: []};
                floeNudging.value = {players: []};
                estimateSheeps.value = {conditions: []};
                foldFigures.value = {active: false}
                simonSays.value = {conditions: []};
                comboCannon.value = {active: false};
                timeCounter.value = {conditions: []};
                copyStructures.value = {structures: []};
                matchingPlatform.value = {platforms: []};
                soundSequence.value = message ?? {players: []};
                break;
            case 'sharp_path':
                //voting.value = {};
                //sheep.value = {gates:[]};
                soundSequence.value = {players: []};
                puzzlePortrait.value = {players: []};
                trafficLight.value = {bridges: []};
                chooseWisely.value = {platforms: []};
                sweetsCatcher.value = {conditions: []};
                floeNudging.value = {players: []};
                estimateSheeps.value = {conditions: []};
                foldFigures.value = {active: false}
                simonSays.value = {conditions: []};
                comboCannon.value = {active: false};
                timeCounter.value = {conditions: []};
                copyStructures.value = {structures: []};
                matchingPlatform.value = {platforms: []};
                sharpPath.value = message ?? {walls: []};
                break;
            case 'puzzle_portrait':
                //voting.value = {};
                //sheep.value = {gates:[]};
                soundSequence.value = {players: []};
                sharpPath.value = {walls: []};
                trafficLight.value = {bridges: []};
                chooseWisely.value = {platforms: []};
                sweetsCatcher.value = {conditions: []};
                floeNudging.value = {players: []};
                estimateSheeps.value = {conditions: []};
                foldFigures.value = {active: false}
                simonSays.value = {conditions: []};
                comboCannon.value = {active: false};
                timeCounter.value = {conditions: []};
                copyStructures.value = {structures: []};
                matchingPlatform.value = {platforms: []};
                puzzlePortrait.value = message ?? {players: []};
                break;
            case 'traffic_light':
                //voting.value = {};
                //sheep.value = {gates:[]};
                soundSequence.value = {players: []};
                sharpPath.value = {walls: []};
                puzzlePortrait.value = {players: []};
                chooseWisely.value = {platforms: []};
                sweetsCatcher.value = {conditions: []};
                floeNudging.value = {players: []};
                estimateSheeps.value = {conditions: []};
                foldFigures.value = {active: false}
                simonSays.value = {conditions: []};
                comboCannon.value = {active: false};
                timeCounter.value = {conditions: []};
                copyStructures.value = {structures: []};
                matchingPlatform.value = {platforms: []};
                trafficLight.value = message ?? {bridges: []};
                break;
            case 'choose_wisely':
                //voting.value = {};
                //sheep.value = {gates:[]};
                soundSequence.value = {players: []};
                sharpPath.value = {walls: []};
                puzzlePortrait.value = {players: []};
                trafficLight.value = {bridges: []};
                sweetsCatcher.value = {conditions: []};
                floeNudging.value = {players: []};
                estimateSheeps.value = {conditions: []};
                foldFigures.value = {active: false}
                simonSays.value = {conditions: []};
                comboCannon.value = {active: false};
                timeCounter.value = {conditions: []};
                copyStructures.value = {structures: []};
                matchingPlatform.value = {platforms: []};
                chooseWisely.value = message ?? {platforms: []};
                break;
            case 'sweets_catcher':
                //voting.value = {};
                //sheep.value = {gates:[]};
                soundSequence.value = {players: []};
                sharpPath.value = {walls: []};
                puzzlePortrait.value = {players: []};
                trafficLight.value = {bridges: []};
                chooseWisely.value = {platforms: []};
                floeNudging.value = {players: []};
                estimateSheeps.value = {conditions: []};
                foldFigures.value = {active: false}
                simonSays.value = {conditions: []};
                comboCannon.value = {active: false};
                timeCounter.value = {conditions: []};
                copyStructures.value = {structures: []};
                matchingPlatform.value = {platforms: []};
                sweetsCatcher.value = message ?? {conditions: []};
                break;
            case 'floe_nudging':
                //voting.value = {};
                //sheep.value = {gates:[]};
                soundSequence.value = {players: []};
                sharpPath.value = {walls: []};
                puzzlePortrait.value = {players: []};
                trafficLight.value = {bridges: []};
                chooseWisely.value = {platforms: []};
                sweetsCatcher.value = {conditions: []};
                estimateSheeps.value = {conditions: []};
                foldFigures.value = {active: false}
                simonSays.value = {conditions: []};
                comboCannon.value = {active: false};
                timeCounter.value = {conditions: []};
                copyStructures.value = {structures: []};
                matchingPlatform.value = {platforms: []};
                floeNudging.value = message ?? {players: []};
                break;
            case 'estimate_sheeps':
                //voting.value = {};
                //sheep.value = {gates:[]};
                soundSequence.value = {players: []};
                sharpPath.value = {walls: []};
                puzzlePortrait.value = {players: []};
                trafficLight.value = {bridges: []};
                chooseWisely.value = {platforms: []};
                sweetsCatcher.value = {conditions: []};
                floeNudging.value = {players: []};
                foldFigures.value = {active: false}
                simonSays.value = {conditions: []};
                comboCannon.value = {active: false};
                timeCounter.value = {conditions: []};
                copyStructures.value = {structures: []};
                matchingPlatform.value = {platforms: []};
                estimateSheeps.value = message ?? {conditions: []};
                break;
            case 'fold_figures':
                //voting.value = {};
                //sheep.value = {gates:[]};
                soundSequence.value = {players: []};
                sharpPath.value = {walls: []};
                puzzlePortrait.value = {players: []};
                trafficLight.value = {bridges: []};
                chooseWisely.value = {platforms: []};
                sweetsCatcher.value = {conditions: []};
                floeNudging.value = {players: []};
                estimateSheeps.value = {conditions: []};
                simonSays.value = {conditions: []};
                comboCannon.value = {active: false};
                timeCounter.value = {conditions: []};
                copyStructures.value = {structures: []};
                matchingPlatform.value = {platforms: []};
                foldFigures.value = message ?? {active: false};
                break
            case 'radius_eraser':
                //voting.value = {};
                //sheep.value = {gates:[]};
                soundSequence.value = {players: []};
                sharpPath.value = {walls: []};
                puzzlePortrait.value = {players: []};
                trafficLight.value = {bridges: []};
                chooseWisely.value = {platforms: []};
                sweetsCatcher.value = {conditions: []};
                floeNudging.value = {players: []};
                estimateSheeps.value = {conditions: []};
                foldFigures.value = {active: false};
                simonSays.value = {conditions: []};
                comboCannon.value = {active: false};
                timeCounter.value = {conditions: []};
                copyStructures.value = {structures: []};
                matchingPlatform.value = {platforms: []};
                radiusEraser.value = message ?? {conditions: []};
                break
            case 'simon_says':
                //voting.value = {};
                //sheep.value = {gates:[]};
                soundSequence.value = {players: []};
                sharpPath.value = {walls: []};
                puzzlePortrait.value = {players: []};
                trafficLight.value = {bridges: []};
                chooseWisely.value = {platforms: []};
                sweetsCatcher.value = {conditions: []};
                floeNudging.value = {players: []};
                estimateSheeps.value = {conditions: []};
                foldFigures.value = {active: false};
                radiusEraser.value = {conditions: []};
                comboCannon.value = {active: false};
                timeCounter.value = {conditions: []};
                copyStructures.value = {structures: []};
                matchingPlatform.value = {platforms: []};
                simonSays.value = message ?? {conditions: []};
                break;
            case 'combo_cannon':
                //voting.value = {};
                //sheep.value = {gates:[]};
                soundSequence.value = {players: []};
                sharpPath.value = {walls: []};
                puzzlePortrait.value = {players: []};
                trafficLight.value = {bridges: []};
                chooseWisely.value = {platforms: []};
                sweetsCatcher.value = {conditions: []};
                floeNudging.value = {players: []};
                estimateSheeps.value = {conditions: []};
                foldFigures.value = {active: false};
                radiusEraser.value = {conditions: []};
                simonSays.value = {conditions: []};
                timeCounter.value = {conditions: []};
                copyStructures.value = {structures: []};
                matchingPlatform.value = {platforms: []};
                comboCannon.value = message ?? {active: false};
                break;
            case 'time_counter':
                //voting.value = {};
                //sheep.value = {gates:[]};
                soundSequence.value = {players: []};
                sharpPath.value = {walls: []};
                puzzlePortrait.value = {players: []};
                trafficLight.value = {bridges: []};
                chooseWisely.value = {platforms: []};
                sweetsCatcher.value = {conditions: []};
                floeNudging.value = {players: []};
                estimateSheeps.value = {conditions: []};
                foldFigures.value = {active: false};
                radiusEraser.value = {conditions: []};
                simonSays.value = {conditions: []};
                comboCannon.value = {active: false};
                copyStructures.value = {structures: []};
                matchingPlatform.value = {platforms: []};
                timeCounter.value = message ?? {conditions: []};
                break;
            case 'copy_structures':
                //voting.value = {};
                //sheep.value = {gates:[]};
                soundSequence.value = {players: []};
                sharpPath.value = {walls: []};
                puzzlePortrait.value = {players: []};
                trafficLight.value = {bridges: []};
                chooseWisely.value = {platforms: []};
                sweetsCatcher.value = {conditions: []};
                floeNudging.value = {players: []};
                estimateSheeps.value = {conditions: []};
                foldFigures.value = {active: false};
                radiusEraser.value = {conditions: []};
                simonSays.value = {conditions: []};
                comboCannon.value = {active: false};
                timeCounter.value = {conditions: []};
                matchingPlatform.value = {platforms: []};
                copyStructures.value = message ?? {structures: []};
                break;
            case 'matching_platform':
                //voting.value = {};
                //sheep.value = {gates:[]};
                soundSequence.value = {players: []};
                sharpPath.value = {walls: []};
                puzzlePortrait.value = {players: []};
                trafficLight.value = {bridges: []};
                chooseWisely.value = {platforms: []};
                sweetsCatcher.value = {conditions: []};
                floeNudging.value = {players: []};
                estimateSheeps.value = {conditions: []};
                foldFigures.value = {active: false};
                radiusEraser.value = {conditions: []};
                simonSays.value = {conditions: []};
                comboCannon.value = {active: false};
                timeCounter.value = {conditions: []};
                copyStructures.value = {structures: []};
                matchingPlatform.value = message ?? {platforms: []};
                break;
        }
    }
     */

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
          //pusher.subscribe('cache-global').bind_global(processStateMessage);
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