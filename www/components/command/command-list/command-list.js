/**
 * Created by Ets Simon on 03/06/2017.
 */

app

  .controller("CommandListCtrl",function($scope,Bills,InfiniteLoad,Auth,Depots,$ionicLoading,Cashiers,AclService,$rootScope){
    show($ionicLoading);
    $scope.saletypes=$rootScope.saletypes;
    $scope.can = AclService.can;
    $scope.can_sell=false;
    if(Auth.isLogged()==true){
      Auth.getContext().then(function(data){
        $scope.user=data;
        $scope.refresh();

        // recuperation du depot

      })
    }
    else{
      console.log("not logged")
    }

    $scope.refresh=function(){
      show($ionicLoading);
      var options={

      };
      if($scope.user.seller.can_sell==0){
        // caisse
        // recuperation du depot
        options={
          "should_paginate":false,
          "_sort":"created_at",
          "_sortDir":"desc",
          "seller-fk":"depot_id="+$scope.user.seller.depot_id,
          _includes: 'product_saletypes.product,customer,seller.user'
        };
      }
      else{

        //console.log("User",user);
         options  ={
          "seller_id":$scope.user.seller.id,
          //"per_page":20,
          "should_paginate":false,
          "_sort":"created_at",
          "_sortDir":"desc",
          _includes: 'product_saletypes.product,customer,seller.user'
        };

      }

      charger_factures(Bills,$scope,options,$ionicLoading);
    }

  });




function charger_factures(Bills,$scope,options,$ionicLoading){
  Bills.getList(options).then(function(data){

    angular.forEach(data,function(v,k){
      v.date= v.created_at.split(" ")[0];
    });

    var tb= _.groupBy(data,'date');
    $scope.bills=[];
    console.log(data);
    angular.forEach(tb,function(v,k){
      $scope.bills.push({
        date:k,
        long_time:moment(k).format("DD MMMM YYYY"),
        factures:v,
        somme: _.reduce(v,function(memo,num){return memo+num.amount;},0)
      })
    });
    hide($ionicLoading);
    //console.log($scope.bills);
  });
}
