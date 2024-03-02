import axios from 'axios'
import {defineStore} from "pinia";
import { ref } from 'vue'
import Authorized = Twitch.ext.Authorized
import Context = Twitch.ext.Context
import { useStateStore } from '@/stores/state'
import { useConfigStore } from '@/stores/configuration'

declare global {
    interface Window {
        axios: any
        authorized: Function
        authorizedData: any
        context: Function
        contextData: Context
        config: Function
        configData: Config
    }
}

export interface ContextData {
    context: Context|null
    delta: any|null
}

export interface Config {
    broadcaster: any|null
    developer: any|null
    global: any|null
}

export const useExtensionStore = defineStore('extension', () => {
    const state = useStateStore()
    const config = useConfigStore()

    const axiosInstance = ref(axios)
    axiosInstance.value.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

    const twitch = ref<any>(window.Twitch ? window.Twitch.ext : null)

    const channelId = ref<string|null>()
    const opaqueId = ref<string|null>()
    const role = ref<string|null>()
    const token = ref<string|null>()

    const userId = ref<string|null>(null)
    const finishedLoading = ref<boolean>(false)

    // Authorized hook
    function onAuthorized(auth: Authorized) {
        setToken(auth.token,auth.userId)
        axiosInstance.value.defaults.headers.common.Authorization = 'Bearer ' + token.value;

        if (!finishedLoading.value) {
            finishedLoading.value = true
            state.connectSocket(userId.value)
        }
    }
    window.authorized = onAuthorized
    if (window.authorizedData) {
        onAuthorized(window.authorizedData)
    }

    // Context Hook
    function onContext(contextData: ContextData) {
        state.contextUpdate(contextData)
    }
    window.context = onContext
    if (window.contextData) {
        onContext(window.contextData.context)
    }

    // Config Hook
    function onConfigChanged(configData: Config) {
        config.configChanged(configData)
    }
    window.config = onConfigChanged
    if (window.configData) {
        onConfigChanged(window.configData)
    }

    function setToken(accessToken: string, opaque_id: string) {
        let channel_id = '';
        let user_role = '';
        let user_id = '';

        try {
            const parts = accessToken.split('.');
            const decoded: any = JSON.parse(window.atob(parts[1]));

            channel_id = decoded.channel_id;
            user_role = decoded.role;
            user_id = decoded.user_id;
        } catch (e) {
            accessToken = '';
            opaque_id = '';
        }

        channelId.value = channel_id;
        opaqueId.value = opaque_id;
        role.value = user_role;
        token.value = accessToken;
        userId.value = user_id;
    }

    function askForAuth() {
        twitch.value.actions.requestIdShare()
    }

    return {twitch, channelId, opaqueId, role, token, userId, finishedLoading, axios: axiosInstance, askForAuth}
})