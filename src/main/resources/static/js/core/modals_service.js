angular.module(MODULE_NAME).factory('Modals', [ '$http', function ($http) {
    return {
        error_alert: function (e) {
            if('data' in e) {
                e = e.data
            }
            console.dir(e)
            ($.alert({
                title: e.status + e.error,
                content: e.exception + '<br /> Message: ' + e.message,
            }))()
        },
        notify (msg) {
            console.dir(msg)
            msg.backgroundDismiss = true
            $.alert(msg)
        }
    }
}])