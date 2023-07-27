import axios from 'axios';
import Pusher from "pusher-js";
import * as PusherTypes from 'pusher-js';

const APP_KEY = 'KEY';
const WS_HOST = '127.0.0.1';
const WS_PORT = 6001;
const AUTHORIZATION_ENDPOINT = 'http://127.0.0.1:8000/api/socket';

window.logger = process.env.NODE_ENV === 'development' ? console.log.bind(console) : () => { };

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
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
