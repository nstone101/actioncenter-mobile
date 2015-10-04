/**
 * Displays action items scraped from Atom feed.
 *
 */

var ActionCtrl = function($scope, $http, x2js, $ionicModal, $ionicLoading) {

  $ionicLoading.show({template: '<ion-spinner icon="ripple" class="spinner-energized"></ion-spinner>', noBackdrop: true, hideOnStateChange: true});
  $http.get('https://act.eff.org/action.atom', {
      cache: false,
  })
  .then(function(response) {
      $ionicLoading.hide();
      $scope.data = {};
      var xmlDoc = x2js.parseXmlString(response.data);
      var json = x2js.xml2json(xmlDoc);
      $scope.data.actionItems = json.feed.entry;
  });

  $scope.showActionModal = function(actionItem){
    $scope.data.actionItem = actionItem;
    $ionicModal.fromTemplateUrl('templates/actionModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  }

  $scope.deleteItem = function(){
  }

}

module.exports = ActionCtrl;
