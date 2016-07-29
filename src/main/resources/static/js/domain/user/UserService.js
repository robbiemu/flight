angular.module(MODULE_NAME).service('UserService', [ 'Auth', 'Modals', 'Map', '$http', '$location', '$rootScope',
        'SPRING_REGISTER_URI', 'SPRING_LOGIN_URI', 'SPRING_FIND_ITIN_BYUSER_URI',
    function(Auth, Modals, Map, $http, $location, $rootScope, SPRING_REGISTER_URI, SPRING_LOGIN_URI, SPRING_FIND_ITIN_BYUSER_URI) {

        const get_itinerary_totals = function (itineraries) {
            for(let i in itineraries) {
                itineraries[i].totals = {}
                let flightTime = 0
                let layoverTime = 0
                let arrivalTime = 0
                for (let f in itineraries[i].flights) {
                    flightTime += itineraries[i].flights[f].flightTime
                    if(arrivalTime > 0) {
                        layoverTime += itineraries[i].flights[f].offset - arrivalTime
                    }
                    if((+f) < itineraries[i].flights.length - 1){
                        itineraries[i].flights[f].layover =
                            itineraries[i].flights[(+f) + 1].offset -
                            (itineraries[i].flights[f].offset + itineraries[i].flights[f].flightTime)
                    }
                    arrivalTime = itineraries[i].flights[f].flightTime +
                        itineraries[i].flights[f].offset
                }
                itineraries[i].totals.flightTime = flightTime
                itineraries[i].totals.layoverTime = layoverTime
            }

            return itineraries
        }

        return {
                get_user_itineraries: function ($scope) {
                    $http.post(SPRING_FIND_ITIN_BYUSER_URI, { type: "find_itineraries", settings: { user: Auth.getUser() }})
                        .then((tx_response) => {
                            if(tx_response.status != 200 ) {
                                Modals.error_alert(e)
                            } else {
                                if (tx_response.data.settings.status === 'Success') {
                                    $scope.itineraries = get_itinerary_totals(tx_response.data.settings.itineraries)

                                    return $scope.itineraries
                                } else {
                                    console.dir(tx_response.data.settings)
                                    Modals.notify({title: 'Error getting itineraries', content: tx_response.data.settings.message})
                                }
                            }
                        })
                },

            login: function ($scope) {
                $http.post(SPRING_LOGIN_URI, { type: "login", settings: { user: $scope.user }})
                    .then((tx_response) => {
                        if(tx_response.status != 200 ) {
                            Modals.error_alert(e)
                        } else {
                            if (tx_response.data.settings.status === 'Success') {
                                $scope.user.isAdmin = false // we have no admin functions, but we could
                                $scope.user.id = tx_response.data.settings.user.id

                                Auth.setUser($scope.user)

                                $location.path('/user/' + tx_response.data.settings.user.id)
                            } else {
                                console.dir(tx_response.data.settings)
                                Modals.notify({title: 'Error logging in', content: tx_response.data.settings.message})
                            }
                        }
                })
            },

            register: function ($scope) {
                user = $scope.user
                user.num = 1
                user.label = $scope.label
                $http.post(SPRING_REGISTER_URI, { type: "register", settings: { user: $scope.user }})
                    .then((tx_response) => {
                        if (tx_response.status != 200) {
                            Modals.error_alert(e)
                        } else {
                            if (tx_response.data.settings.status === 'Success') {
                                $scope.user.isAdmin = false // we have no admin functions, but we could
                                $scope.user.id = tx_response.data.settings.user.id

                                Modals.notify({title: 'Welcome to Flight Tracking Project', content: '<img class="csi" src="http://www.cooksys.com/wp-content/uploads/2015/09/cook-logo-h_270x129.png" /><br /><p>Book flights to your heart’s content!</p>'})

                                Auth.setUser($scope.user)

                                $location.path('/user/' + tx_response.data.settings.user.id)
                            } else {
                                console.dir(tx_response.data.settings)
                                Modals.notify({title: 'Error in registration', content: tx_response.data.settings.message})
                            }
                        }
                })
            },

            renderMap: function($scope) {
                $('span.flight').css("color", "black")
                Map.render_map('itinerary_map')
                $scope.itineraries[$scope.selected_itinerary.index].flights.forEach((f, i) => {
                    Map.getPoint(f.origin, 'itinerary_map').then((pointA) => {
                        Map.getPoint(f.destination, 'itinerary_map').then((pointB) => {
                            color = Map.getColor(i)
                            $('.flight_' + f.id ).css("color", color)
                            Map.addPoly(pointA, pointB, color, 'itinerary_map')
                        })
                    })
                })
                $('#itinerary_map').show()

                $('#itinerary_map').css({"right": 0, "display": "initial"})

            }
        }
    }
])
