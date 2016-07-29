angular.module(MODULE_NAME).factory('Map',  [ '$http', '$rootScope', 'Modals', function ($http, $rootScope, Modals) {

    $rootScope.map_vars = {}

    $rootScope.map_vars.colors = [
        {'colorname': 'bondi blue', 'value' : '#00A0B0'},
        {'colorname': 'spice umber', 'value' : '#6A4A3C'},
        {'colorname': 'brick red', 'value' : '#CC333F'},
        {'colorname': 'surbus orange', 'value' : '#EB6841'},
        {'colorname': 'festival yellow', 'value' : '#EDC951'}
    ]

    $rootScope.map_vars.polies = {}
    $rootScope.map_vars.markers = {}
    $rootScope.map_vars.maps = {}
    $rootScope.map_vars.bounds = {}

    function LightenDarkenColor(col,amt) { // unused.. but could be used for more cities
        var usePound = false;
        if ( col[0] == "#" ) {
            col = col.slice(1);
            usePound = true;
        }

        var num = parseInt(col,16);

        var r = (num >> 16) + amt;

        if ( r > 255 ) r = 255;
        else if  (r < 0) r = 0;

        var b = ((num >> 8) & 0x00FF) + amt;

        if ( b > 255 ) b = 255;
        else if  (b < 0) b = 0;

        var g = (num & 0x0000FF) + amt;

        if ( g > 255 ) g = 255;
        else if  ( g < 0 ) g = 0;

        return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
    }

    return {
        addPoly: function (pointA, pointB, color, map) {
            if(map === undefined) {
                map = 'map'
            }
            geodesicPoly = new google.maps.Polyline({
                strokeColor: color,
                strokeOpacity: 1.0,
                strokeWeight: 3,
                geodesic: true,
                map: $rootScope.map_vars.maps[map]
            })

            geodesicPoly.setPath([pointA.getPosition(), pointB.getPosition()]);

            $rootScope.map_vars.polies[map].push(geodesicPoly)
        },

        getPoint: function(name, map) {
            if(map === undefined) {
                map = 'map'
            }
            return $http.get('location/name', {params: { name : name }}).then(function(result) {
                let m = new google.maps.Marker({
                    map : $rootScope.map_vars.maps[map],
                    position : {
                        //Use + to turn string to number
                        lat : +result.data.latitude,
                        lng : +result.data.longitude
                    }
                })
                $rootScope.map_vars.markers[map].push(m)

                return m
            }).catch((e) => {
                Modals.error_alert(e)
            })
        },

        getColor: function(i) {
            return $rootScope.map_vars.colors[i%5].value // we could get tints/shades with the function above
        },

        reAttach: function (map) {
            if($rootScope.map_vars.markers[map] === undefined) {
                return;
            }
            $('#'+map).replaceWith($rootScope.map_vars.maps[map].getDiv())
        },

        cleanUp: function (map) {
            if(map === undefined) {
                map = 'map'
            }

            if($rootScope.map_vars.markers[map] === undefined)
                $rootScope.map_vars.markers[map] = []
            if($rootScope.map_vars.polies[map] === undefined)
                $rootScope.map_vars.polies[map] = []

            for(let m in $rootScope.map_vars.markers[map]) {
                $rootScope.map_vars.markers[map][m].setMap(null)
            }
            $rootScope.map_vars.markers[map] = []

            for(let p in $rootScope.map_vars.polies[map]){
                $rootScope.map_vars.polies[map][p].setMap(null)
            }
            $rootScope.map_vars.polies[map] = []

            console.log('cleaned map: ' + map)
        },

        render_map: function (map){
            $('#'+map).show()
            if(map === undefined) {
                map = 'map'
            }

            this.cleanUp(map)

            if(($rootScope.map_vars.maps[map] !== undefined) &&
                    ($rootScope.map_vars.maps[map].hasOwnProperty('mapTypeId'))) {
                return
            }

            $rootScope.map_vars.maps[map] = new google.maps.Map(document.getElementById(map), {
                zoom: 7,
                center: {lat: 27.6648, lng: -81.5158}
            })
            $rootScope.map_vars.bounds[map] = $rootScope.map_vars.maps[map].getBounds()
        }

    }
}])