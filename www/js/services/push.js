/**
 * Push notification handler.
 *
 * Requires that the Cordova push plugin has been installed:
 *   cordova plugin add https://github.com/phonegap-build/PushPlugin.git
 */

var appSettings = require('../../build/app_settings');
var pushConstants = require('./push/constants');


var PushNotificationService = function (
  $rootScope, $state, $cordovaPush, acmGCMPushNotification, acmAPNSPushNotification) {

  var service = {

    getPlatformPushService_: function (devicePlatform) {
      if (devicePlatform === 'ANDROID') {
        return acmGCMPushNotification;
      } else if (devicePlatform === 'IOS') {
        return acmAPNSPushNotification;
      }
    },

    /**
     * Register the device with the notification backend.
     */
    register: function () {
      var platform = ionic.Platform.platform().toUpperCase();
      var devicePushHandler = this.getPlatformPushService_(platform);
      if (!angular.isUndefined(devicePushHandler)) {
        var pushConfig = appSettings['CREDENTIALS'][platform];

        if (platform === 'IOS') {
          angular.extend(pushConfig, {
            'badge': 'true',
            'sound': 'true',
            'alert': 'true'
          });
        } else if (platform === 'ANDROID') {
          // Android uses the local notification interface to pop up notifications, so register the click
          // handler here.
          window.plugin.notification.local.onclick = function (id, state, json) {
            if (id === pushConstants.PUSH_RECEIVED_FOREGROUND_NOTIFICATION_ID) {
              $state.go('acm.homeTabs.home', {}, {reload: true});
            }
          };
        }

        $cordovaPush.register(pushConfig).then(
            devicePushHandler.registrationSuccess, devicePushHandler.registrationError);
      }
    },

    /**
     * Top level handler for push notifications on all platforms.
     *
     * @param {*} event The push notification event.
     */
    handlePushNotification: function (event) {
      var devicePlatform = ionic.Platform.platform().toUpperCase();
      this.getPlatformPushService_(devicePlatform).handleNotification(event);
    }

  };

  /**
   * Listen to push notification events from the event bus.
   */
  $rootScope.$on('pushNotificationReceived', function (event, pushEvent) {
    service.handlePushNotification(pushEvent);
  });

  return service;
};

module.exports = PushNotificationService;
