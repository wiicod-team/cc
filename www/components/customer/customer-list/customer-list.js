/**
 * Created by Ets Simon on 03/06/2017.
 */

app

  .controller("CustomerListCtrl",function($scope,Bills,InfiniteLoad,Auth,Depots,$ionicLoading,Customers,AclService,$rootScope,Sellers){
    show($ionicLoading);
    $scope.saletypes=$rootScope.saletypes;
    $scope.can = AclService.can;
    $scope.can_sell=false;
    $scope.clients=[];
    if(Auth.isLogged()==true){
      Auth.getContext().then(function(data){
        $scope.user=data;
        $scope.refresh();

      })
    }
    else{
      console.log("not logged")
    }

    $scope.refresh=function(){
      $scope.clients=[];
      show($ionicLoading);
      Sellers.get($scope.user.seller.id,{_includes:"customer_types.customers.town",town_id:$scope.user.seller.depot.town_id}).then(function(c){

        // console.log(c);
        angular.forEach(c.data.customer_types,function(v,k){
          angular.forEach(v.customers,function(vv,kk){
            $scope.clients.push(vv);
          });
          hide($ionicLoading);
        });
      },function(q){
        console.log(q);
      });

    }

  });
