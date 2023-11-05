export default {
    methods: {
        getApiBaseUrl() {
            return !this.isReview() ? 'https://streamercup-api.chrotos.net/api/' : 'https://streamercup-api-mock.chrotos.net/api/';
        },

        getSocketBaseUrl() {
            return 'streamercup-socket.chrotos.net';
        },

        getApiUrl(endpoint) {
            return this.getApiBaseUrl() + endpoint;
        },

        getSocketAuthorizationUrl() {
            return this.getApiBaseUrl() + 'socket';
        },

        getSocketHost() {
            return 'streamercup-socket.chrotos.net';
        },

        getSocketPort() {
            return 6001;
        },

        getSocketKey() {
            return 'KEY';
        },

        isTesting() {
            return this.getState() in ['testing', 'hosted_test', 'ready_for_review', 'uploading'];
        },

        isApproved() {
            return this.getState() in ['approved', 'released'];
        },

        isReview() {
            return this.getState() in ['in_review', 'pending_action'];
        },

        getState() {
            let params = this.getQueryParams();
            if (!params.has('state')) {
                return window.location.host.includes('twitch.tv') ? 'hosted_test' : 'testing';
            }

            return params.get('state');
        },

        getQueryParams() {
            let queryString = window.location.search;
            return new URLSearchParams(queryString);
        },
    }
}