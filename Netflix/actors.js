$(document).ready(function () {
    function ViewModel() {
        var self = this;

        self.actor = ko.observable()

        $.ajax({
            type: "GET",
            url: "http://192.168.160.58/netflix/api/Actors",
            success: function (data) {
                console.log(data)
                self.actor(data.Actors)
            }
        })
    }
    ko.applyBindings(ViewModel());
})