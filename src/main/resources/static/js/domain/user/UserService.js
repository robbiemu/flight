angular.module(MODULE_NAME).service('UserService', [ 'Auth', '$http', '$location', '$rootScope',
        'SPRING_REGISTER_URI', 'SPRING_LOGIN_URI', 'SPRING_FIND_ITIN_BYUSER_URI',
    function(Auth, $http, $location, $rootScope, SPRING_REGISTER_URI, SPRING_LOGIN_URI, SPRING_FIND_ITIN_BYUSER_URI) {

        const get_itinerary_totals = function (itineraries) {
            for(let i in itineraries) {
                itineraries[i].totals = {}
                console.log("considering itinerary totals")

                let flightTime = 0
                let layoverTime = 0
                let arrivalTime = 0
                for (let f in itineraries[i].flights) {
                    flightTime += itineraries[i].flights[f].flightTime
                    if(arrivalTime > 0) {
                        layoverTime += itineraries[i].flights[f].offset - arrivalTime
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
                    user = $scope.user
                    user.num = 1
                    user.label = $scope.label
                    console.dir(user)
                    $http.post(SPRING_FIND_ITIN_BYUSER_URI, { type: "find_itineraries", settings: { user: $scope.user }})
                        .then((tx_response) => {
                            if(tx_response.status != 200 ) {
                                console.log('tx_response.status != 200 , instead it is ' + tx_response.status)
                                // TODO - notify user that there was a transactional error
                            } else {
                                if (tx_response.data.settings.status === 'Success') {
                                    $scope.itineraries = get_itinerary_totals(tx_response.data.settings.itineraries)

                                    return $scope.itineraries
                                } else {
                                    // TODO - notify user of issue with their login submission
                                }
                            }
                        })
                },

            login: function ($scope) {
                $http.post(SPRING_LOGIN_URI, { type: "login", settings: { user: $scope.user }})
                    .then((tx_response) => {
                        if(tx_response.status != 200 ) {
                            console.log('tx_response.status != 200 , instead it is ' + tx_response.status)
                            // TODO - notify user that there was a transactional error
                        } else {
                            if (tx_response.data.settings.status === 'Success') {
                                $scope.user.isAdmin = false // we have no admin functions, but we could
                                $scope.user.id = tx_response.data.settings.user.id

                                Auth.setUser($scope.user)

                                $rootScope.itineraries = get_itinerary_totals(tx_response.data.settings.user.itineraries)

                                $location.path('/user/' + tx_response.data.settings.user.id)
                            } else {
                                // TODO - notify user of issue with their login submission
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
                            console.log('tx_response.status != 200 , instead it is ' + tx_response.status)
                            // TODO - notify user that there was a transactional error
                        } else {
                            if (tx_response.data.settings.status === 'Success') {

                                $scope.user.isAdmin = false // we have no admin functions, but we could
                                $scope.user.id = tx_response.data.settings.user.id

                                Auth.setUser($scope.user)

                                $scope.itineraries = get_itinerary_totals(tx_response.data.settings.user.itineraries)

                                $location.path('/user/' + tx_response.data.settings.user.id)
                            } else {
                                // TODO - notify user of issue with their registration submission
                            }
                        }
                })
            }
        }
    }
])
