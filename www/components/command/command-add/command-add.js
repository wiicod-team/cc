/**
 * Created by Ets Simon on 03/06/2017.
 */

app

  .controller("CommandAddCtrl",function($scope,InfiniteLoad,Auth,$stateParams,Stocks,ToastApi,Sellers,$ionicLoading,$state,$filter,$rootScope){
    show($ionicLoading);
    var depot_id=$stateParams.depot;
    var saletype=$stateParams.saletype;

    $scope.commande={total:0,produits:[]};



    if(Auth.isLogged()==true){
      Auth.getContext().then(function(data){
        //console.log(data);
        $scope.user=data;

        // recuperation des tables /clients
        $scope.customers=[];
        Sellers.get($scope.user.seller.id,{_includes:"customer_types.customers",town_id:$scope.user.seller.depot.town_id}).then(function(c){
          //console.log(c);
          angular.forEach(c.data.customer_types,function(v,k){
            angular.forEach(v.customers,function(vv,kk){
              $scope.customers.push(vv);
            })

          });
          //console.log("f",$scope.clients);
        },function(q){
          console.log(q);
        });

        // recuperation des produits
        var options = {
          depot_id : depot_id,
          'product_saletype-fk' : 'saletype_id='+saletype,
          _includes: 'product_saletype.product.category',
          should_paginate:false
        };
        Stocks.getList(options).then(function(stocks){
          $scope.stocks = stocks;
          // groupage par category
          var tb= _.groupBy(stocks,"product_saletype.product.category.name");
          $scope.products=[];
          angular.forEach(tb,function(v,k){
            $scope.products.push({
              category:k,
              products:v
            })
          });
          hide($ionicLoading);
        },function(q){
          console.log(q);
        });
      })
    }
    else{
      console.log("not logged")
    }

    $scope.addProduct=function(p){
      if(p.quantity>0){
        var t= _.find($scope.commande.produits,function(produit){
          if(p.id==produit.id){
            return p;
          }
        });

        if(t==null){
          //nouveau produits comme
          p.command_quantity=1;
          $scope.commande.produits.push(p);
        }
        else{
          if(t.quantity>t.command_quantity)
          {
            t.command_quantity+=1;
          }
          else{
            ToastApi.error({msg:$translate.instant("COMMANDE.ARG_23")});
          }
        }
        //p.command_quantity= t.command_quantity;
        $scope.commande.total=prix_total($scope.commande.produits);
        $scope.if_payer=true;
      }
      else{
        ToastApi.error({msg:$translate.instant("COMMANDE.ARG_23")});
      }

    };

    $scope.removeProduct=function(p) {
      if(p.command_quantity>0){
        var index= _.indexOf($scope.commande.produits,p);
        $scope.commande.produits[index].command_quantity--;
        if(p.command_quantity==0){
          $scope.commande.produits.splice(index,1)
          ToastApi.success({msg:"Supprimé"});
        }
      }
      $scope.commande.total=prix_total($scope.commande.produits);
    };


    $scope.cancel=function(){
      $scope.commande={};
      angular.forEach($scope.products,function(v,k){
        angular.forEach(v.products,function(i,o){
          i.command_quantity=0;
        });
      })
    };

    $scope.buy=function(){
      var bill={};
      var c=$scope.commande;

      bill.status=0;

      bill.deadline= new Date();

      bill.discount= 0;
      bill.customer_name= $filter("filter")($scope.customers,{id: c.customer_id},true)[0].name;
      bill.customer_id= c.customer_id;
      bill.paymentmethod_id= 3; //espece
      bill.seller_id=$scope.user.seller.id;
      console.log(bill);
      // enregistrement de la facture
      var memo={
        commande:$scope.commande,
        bill:bill
      };
      $rootScope.memo=memo;
      $state.go("app.command-check");

    };
  });

function prix_total(produits){
  var total=0;
  _.each(produits,function(p){
    total+= p.command_quantity* p.product_saletype.price;
  });
  return total;
}
