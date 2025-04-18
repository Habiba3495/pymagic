(function () {
    console.log("unityBridge.js loaded.");

    const unityBridge = {
        unityInstance: null,
        sendCodeToReactQueue: [],
        reactCallback: null,

        setUnityInstance: function (instance) {
            this.unityInstance = instance;
            console.log("Unity instance set in unityBridge.");
        },

        sendCodeToReact: function (code) {
            console.log("sendCodeToReact called with code:", code);
            if (this.reactCallback) {
                this.reactCallback(code);
            } else {
                console.log("Queuing code from Unity:", code);
                this.sendCodeToReactQueue.push(code);
            }
        },

        registerReactCallback: function (callback) {
            console.log("registerReactCallback called.");
            this.reactCallback = callback;
            if (this.sendCodeToReactQueue.length > 0) {
                console.log("Processing queued codes:", this.sendCodeToReactQueue);
                this.sendCodeToReactQueue.forEach((code) => {
                    callback(code);
                });
                this.sendCodeToReactQueue = [];
            }
        },

        sendMessageToUnity: function (gameObjectName, methodName, parameter) {
            if (this.unityInstance) {
                console.log(`Sending message to Unity: ${gameObjectName}.${methodName}(${parameter})`);
                try {
                    this.unityInstance.SendMessage(gameObjectName, methodName, parameter);
                } catch (e) {
                    console.error("Error sending message to Unity: ", e);
                }
            } else {
                console.error("Unity instance not set.");
            }
        }
    };

    window.unityBridge = unityBridge;
    window.sendCodeToReact = unityBridge.sendCodeToReact.bind(unityBridge);
    window.registerReactCallback = unityBridge.registerReactCallback.bind(unityBridge);
    window.unityBridgeLoaded = true;
    console.log("unityBridgeLoaded set to true.");
})();