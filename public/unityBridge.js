(function () {
    console.log("unityBridge.js loaded.");

    const unityBridge = {
        unityInstance: null,
        sendCodeToReactQueue: [],
        reactCallback: null,
        pointsCallback: null,

        // دالة لتسجيل Unity Instance
        setUnityInstance: function (instance) {
            this.unityInstance = instance;
            console.log("Unity instance set in unityBridge.");
        },

        // دالة لإرسال Code من Unity لـ React
        sendCodeToReact: function (code) {
            console.log("sendCodeToReact called with code:", code);
            if (this.reactCallback) {
                this.reactCallback(code);
            } else {
                console.log("Queuing code from Unity:", code);
                this.sendCodeToReactQueue.push(code);
            }
        },

        // دالة لإرسال النقاط من Unity لـ React
        sendPointsToReact: function (points) {
            console.log("sendPointsToReact called with points:", points);
            if (this.pointsCallback) {
                this.pointsCallback(points);
            } else {
                console.error("Points callback not registered.");
            }
        },

        // دالة لتسجيل Callback بتاع الـ Code من React
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

        // دالة لتسجيل Callback بتاع النقاط من React
        registerPointsCallback: function (callback) {
            console.log("registerPointsCallback called.");
            this.pointsCallback = callback;
        },

        // دالة لإرسال رسائل من React لـ Unity
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

    // تعريف الـ Functions على Window لاستخدامها من Unity و React
    window.unityBridge = unityBridge;
    window.sendCodeToReact = unityBridge.sendCodeToReact.bind(unityBridge);
    window.sendPointsToReact = unityBridge.sendPointsToReact.bind(unityBridge);
    window.registerReactCallback = unityBridge.registerReactCallback.bind(unityBridge);
    window.registerPointsCallback = unityBridge.registerPointsCallback.bind(unityBridge);
    window.unityBridgeLoaded = true;
    console.log("unityBridgeLoaded set to true.");
})();