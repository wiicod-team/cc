app
  .controller("LoginCtrl",function($scope,Auth,$state,$cookies){
    $scope.doLogin=function(user){
      console.log(user,$cookies.getObject("user"));
      Auth.login(user).then(function (data) {
        $cookies.putObject("user",data.data.user);
        //console.log($cookies.getObject("user"));
        $state.go('app.home');
      },function(q){console.log(q);})
    };
  })
