/**
 * Created by Edward NANDA on 08/07/2018.
 */

app
  .controller("ObjectifListCtrl",function($scope,Auth,$stateParams,SaleTargets,ToastApi,Sellers,$ionicLoading,$cookies,$filter,$rootScope){
    show($ionicLoading);
    var user_id=$stateParams.user_id;
    $scope.user_id=user_id;

    $scope.refresh=function(){
      var option={
        should_paginate:false,
        _includes:"category,user",
        user_id:user_id
      };

      SaleTargets.getList(option).then(function(data){
        console.log(data);
        $scope.targets=data;
      },function(q){
        console.log(q);
      })
    };

    $scope.refresh();

  });

