window.Twitch.ext.onAuthorized((auth) => {
    if (window.authorized) {
        window.authorized(auth)
    } else {
        window.authorizedData = auth
    }
})

window.Twitch.ext.onContext((context, delta) => {
    const contextData = {context, delta}
    if (window.context) {
        window.context(contextData)
    } else {
        window.contextData = contextData
    }
})

window.Twitch.ext.configuration.onChanged(() => {
    const config = {
        broadcaster: window.Twitch.ext.configuration.broadcaster,
        developer: window.Twitch.ext.configuration.developer,
        global: window.Twitch.ext.configuration.global
    }

    if (window.config) {
        window.config(config)
    } else {
        window.configData = config
    }
})