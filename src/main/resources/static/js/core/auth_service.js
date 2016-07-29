angular.module(MODULE_NAME).factory('Auth', function () {
    var user

    return {
        setUser : function (aUser) {
            user = aUser;
        },
        isLoggedIn : function () {
            return (user)? user: false;
        },
        isAdmin : function () {
            return (user)? user.isAdmin: false;
        },
        getId : function () {
            return (user)? user.id: ''
        },
        getUser : function () {
            return (user)? user: {}
        }
    }
})