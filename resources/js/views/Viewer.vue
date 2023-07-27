<template>
    <div class="viewer">
        <h2>Hello, World!</h2>
        <p>Would you care to cycle a color?</p>
        <div id="list">
        </div>
    </div>
</template>

<script>
import Twitch from '../mixins/Twitch';

export default {
    name: 'Viewer',

    mixins: [
        Twitch
    ],

    data () {
        return {

        }
    },

    mounted () {

    },

    methods: {
        boot () {
            logger('Enabling...');

            if (this.auth.isLoggedIn()) {
              window.pusher.subscribe('presence-' + this.auth.getUserId()).bind_global(this.onPrivateMessage);
            } else {
              this.askForAuth();
            }
            window.pusher.subscribe('global').bind_global(this.onGlobalMessage);

            this.finishedLoading = true;
        },

        logError (error) {
            logger('EBS request returned '+error.status+' ('+error+')');
        },

        onGlobalMessage (message) {

        },

        onPrivateMessage (message) {

        },
    }
}
</script>
