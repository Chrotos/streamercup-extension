import {ref} from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
    const branding = ref<string|null>(null) // Valid: twitch

    function getApiBaseUrl() {
        return !isReview() /* && !isTesting()*/ ? 'https://streamercup-api.chrotos.net/api/' : 'https://streamercup-api-mock.chrotos.net/api/';
    }

    function getApiUrl(endpoint: string) {
        return getApiBaseUrl() + endpoint;
    }

    function getSocketAuthorizationUrl() {
        return getApiBaseUrl() + 'socket';
    }

    function getSocketHost() {
        return 'streamercup-socket.chrotos.net';
    }

    function getSocketPort() {
        return 6001;
    }

    function getSocketKey() {
        return 'KEY';
    }

    function isTesting() {
        return ['testing', 'hosted_test', 'ready_for_review', 'uploading'].includes(getState());
    }

    function isApproved() {
        return  ['approved', 'released'].includes(getState());
    }

    function isReview() {
        return ['in_review', 'pending_action'].includes(getState());
    }

    function getState() {
        const params = getQueryParams();
        if (!params.has('state')) {
            return window.location.host.includes('twitch.tv') ? 'hosted_test' : 'testing';
        }

        return params.get('state') ?? 'testing';
    }

    function getQueryParams() {
        const queryString = window.location.search;
        return new URLSearchParams(queryString);
    }

    function configChanged(config: any) {
        if (!config) {
            return
        }

        //const broadcaster = config.broadcaster;
        const developer = config.developer;
        //const global = config.global;

        if (developer?.content) {
            const developerJson = JSON.parse(developer.content);
            branding.value = developerJson?.branding?.toLocaleLowerCase() ?? '';
        }
    }

    return {branding, getApiBaseUrl, getApiUrl, getSocketAuthorizationUrl, getSocketHost, getSocketPort, getSocketKey, isTesting, isApproved, isReview, getState, getQueryParams, configChanged}
})