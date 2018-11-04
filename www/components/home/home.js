/**
 * Created by Ets Simon on 03/06/2017.
 */

app

  .controller("HomeCtrl",function($scope,Auth,Bills,$interval,$cookies,Depots,$state,$ionicLoading,AclService,$rootScope){
    show($ionicLoading);
    $scope.can = AclService.can;
    var j=new Date();
    $scope.can_sell=false;
    var now=(j.getYear()+1900)+'-'+(j.getMonth()+1);
    var today=now+"-"+ j.getDate()+" 00:00:00,"+now+"-"+j.getDate()+" 23:59:59";
    $scope.current=moment(new Date());
    $scope.current=$scope.current.format("DD MMMM YYYY");
    $scope.commande_memo=$cookies.getObject("commande_memo")==undefined?0:$cookies.getObject("commande_memo");
    $interval(function(){
      $scope.commande_memo=$cookies.getObject("commande_memo")==undefined?0:$cookies.getObject("commande_memo");
    },5000);

    Auth.getContext().then(function(data){
      console.log(data);
      $scope.user=data;
      if($scope.user.seller!=undefined){
        $scope.can_sell=true;
      }
      //verification si la caisse du depot est ouverte
      $scope.open=$scope.user.seller.depot.is_open;
      console.log($scope.open,"open");
      // verifie d abord si un seller

      // calcul du chiffre d'affaire de la journée
      Bills.getList({seller_id:$scope.user.seller.id,"status-bt":"1,4","created_at-bt":today}).then(function(f){
        $scope.ca= _.reduce(f,function(memo, num){
          return memo+num.amount;
        },0);
        $cookies.putObject("facture",f);
      });

      // mise à jour du CA chaque 15 secondes
      $interval(function(){
        $scope.user=data;
        Bills.getList({seller_id:$scope.user.seller.id,"status-bt":"1,3","created_at-bt":today}).then(function(f){
          $scope.ca= _.reduce(f,function(memo, num){
            return memo+num.amount;
          },0);
        });
        // console.log("CA mis à jours");
      },15000);
      //console.log($scope.p);

      // recuperation du depot
      Depots.get($scope.user.seller.depot.id,{_includes:"saletypes"}).then(function(d){
        console.log('depot',d);
        $scope.depot_id= d.data.id;

        $scope.saletypes= d.data.saletypes;
        $rootScope.saletypes= d.data.saletypes[0].id;
        hide($ionicLoading);
      },function(q){
        console.log(q);
      });
    },function(q){
      console.log(q);
    });

    $scope.logout = function () {
      Auth.logout().then(function () {
        $cookies.putObject("user",undefined);
        $state.go('auth.login');
      });
    }
  });


