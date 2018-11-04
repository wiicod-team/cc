/**
 * Created by Edward NANDA on 08/07/2018.
 */

app
  .controller("ObjectifDetailCtrl",function($scope,Auth,$stateParams,Bills,ToastApi,Sellers,$ionicLoading,SaleTargets,$filter,$rootScope){
    show($ionicLoading);
    var user_id=$stateParams.user_id;
    var category_id=$stateParams.category_id;
    $scope.category_name=$stateParams.category_name;

    // recuperation de l'objectif
    SaleTargets.getList({category_id:category_id}).then(function(data){
      $scope.o=data[0];
    });

    $scope.refresh=function(){
      console.log(user_id,category_id);
      var option={
        should_paginate:false,
        category_id:category_id,
        _includes:"bill_product_saletypes.product_saletype.product"
      };

      // recuperation des ventes ayant cette catégorie

      Bills.getList(option).then(function(data){
        //console.log(data[0]);
        $scope.realisation=0;
        angular.forEach(data,function(v,k){
          //console.log(v.bill_product_saletypes);
          angular.forEach(v.bill_product_saletypes,function(b,l){
            // ici prix et quantité
            if(b.product_saletype.product.category_id==category_id){
              $scope.realisation+= b.quantity*b.product_price_was;
            }
          })
        });
        console.log($scope.realisation,$scope.category);
        hide($ionicLoading);
      })
    };

    $scope.refresh();

  });

