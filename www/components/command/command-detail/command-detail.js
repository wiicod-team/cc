/**
 * Created by Ets Simon on 03/06/2017.
 */

app

  .controller("CommandDetailCtrl",function($scope,Bills,$stateParams,BillProductSaleTypes,$ionicLoading,Cashiers,Auth,$cordovaInAppBrowser,$filter,ToastApi,AclService){
    show($ionicLoading);
    $scope.can = AclService.can;
    var id=$stateParams.id;
    BillProductSaleTypes.getList({bill_id:id,_includes:'product_saletype.product,bill.customer,bill.seller.user,bill.cashier.user'}).then(function(data){
      $scope.bills=data;
      console.log(data);
      $scope.statut=data[0].bill.status;
    });
    $scope.can_sign=false;

    if(Auth.isLogged()==true){
      Auth.getContext().then(function(data){
        $scope.user=data;
        Cashiers.getList({depot_id:1}).then(function(data){
          console.log(data);
          angular.forEach(data,function(v,k){
            if($scope.user.id== v.user_id){
              $scope.can_sign=true;
              $scope.cashier_id= v.id;
              hide($ionicLoading);
            }
            else{
              console.log("Aucun")
            }
          });
          console.log($scope.statut,$scope.can_sign);
        });
      })
    }


    $scope.openPDF=function(url){
      var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'no'
      };
      $cordovaInAppBrowser.open(url, '_blank', options)
        .then(function(event) {

        })
    };

    $scope.cashIn=function(b){
      // route pour la validation du ticket
      console.log(b.id);
      Bills.getList({"should_paginate":false}).then(function (data) {
        var bill=$filter('filter')(data,{id: b.id},true)[0];
        console.log(data,bill);
        bill.status=3;
        bill.cashier_id=$scope.cashier_id;
        bill.put().then(function(f){
          console.log("update",f);
          $scope.statut= f.status;
          ToastApi.success({msg:"Commande soldée"})
        },function(q){
          console.log(q);
        });
      })
    };

    Bills.getList({
      //"per_page":20,
      "should_paginate":false,
      "_sort":"created_at",
      "_sortDir":"desc",
      _includes: 'product_saletypes.product,customer,seller.user'}).then(function(data){
      console.log(data);
    });

    $scope.prepare=function(b){
      // route pour la validation du ticket
      console.log(b.id,"prepare");
      Bills.getList({"should_paginate":false}).then(function (data) {
        console.log(data);
        var bill=$filter('filter')(data,{id: b.id},true)[0];
        console.log(data,bill);
        bill.status=2;
        bill.put().then(function(f){
          console.log("update",f);
          $scope.statut= "waiting_cashier_approval";
          ToastApi.success({msg:"Commande préparée"})
        },function(q){
          console.log(q);
        });
      })
    }

  });
