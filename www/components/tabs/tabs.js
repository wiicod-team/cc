/**
 * Created by Ets Simon on 03/06/2017.
 */

app

  .controller("TabsCtrl",function($scope,$state,Auth,$ionicHistory){
    $scope.state=$state.current.name;

    $scope.logout = function () {
      Auth.logout().then(function () {
        $state.go('auth.login');
        $ionicHistory.clearCache()
      });
    }
  });
