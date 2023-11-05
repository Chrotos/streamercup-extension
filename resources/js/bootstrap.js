import axios from 'axios';

//const APP_KEY = 'KEY';
//const WS_HOST = 'streamercup-socket.chrotos.net';
//const WS_PORT = 6001;
//const AUTHORIZATION_ENDPOINT = 'https://streamercup-api.chrotos.net/api/socket';

window.logger = process.env.NODE_ENV === 'development' ? console.log.bind(console) : () => { };

/*
window.pusher = new Pusher(APP_KEY, {
    wsHost: WS_HOST,
    wsPort: WS_PORT,
    cluster: '',
    forceTLS: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    channelAuthorization: {
        transport: 'ajax',
        endpoint: AUTHORIZATION_ENDPOINT,
        headersProvider: () => window.axios.defaults.headers.common
    },
});
 */

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';