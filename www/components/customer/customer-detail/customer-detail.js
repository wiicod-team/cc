/**
 * Created by Ets Simon on 03/06/2017.
 */

app

  .controller("CustomerDetailCtrl",function($scope,Bills,InfiniteLoad,Auth,Depots,$ionicLoading,Customers,NgMap,$cordovaGeolocation,$stateParams){
    show($ionicLoading);
    var id=$stateParams.id

    if(Auth.isLogged()==true){
      Auth.getContext().then(function(data){
        $scope.user=data;
        Customers.get(id,{_includes:"town"}).then(function(data){
          $scope.client=data.data;
          console.log($scope.client);
          var m=data.data;

          NgMap.getMap().then(function(map) {
            $cordovaGeolocation
              .getCurrentPosition({timeout: 10000, enableHighAccuracy: true})
              .then(function (position) {
                $scope.position = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                $scope.lat=$scope.position.lat;
                $scope.lng=$scope.position.lng;

                var d=distance($scope.position,{lat: m.latitude,lng:m.longitude});
                if(d>1000)
                  $scope.distance=""+Number((d/1000)).toFixed(2)+" km";
                else
                  $scope.distance= Number((d)).toFixed(2)+" m";
              }, function(err) {
                // error
                console.log(err);
              }
            );

            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
          });
        });

        // recuperation du depot

      })
    }
    else{
      console.log("not logged")
    }

  });



function rad(x) {
  return x * Math.PI / 180;
}

function distance(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;


  return d; // returns the distance in meter
}
