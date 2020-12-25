$(document).ready(function () {
    function ViewModel() {
        //Set Vars
        var self = this;
        var uri = "http://192.168.160.58/netflix/api/Actors";

        //Load Table
        $.ajax({
            url: "http://192.168.160.58/netflix/api/Actors?page=1&pagesize=10",
            success: function (data) {
                self.actor(data.Actors);
            }
        })

        //Binds
        pagesizes = [
            { name: "10", value: 10 },
            { name: "25", value: 25 },
            { name: "50", value: 50 },
            { name: "100", value: 100 },
            { name: "250", value: 250 },
            { name: "500", value: 500 }
        ]

        self.actor = ko.observable()
        self.pagesize = ko.observable()

        self.update = function () {
            var pagesize = self.pagesize()['value']
            console.log(self.pagesize()['value'])
            uri = uri + '?page=1&pagesize=' + pagesize;
            $.ajax({
                url: uri,
                success: function (data) {
                    console.log(data);
                    self.actor(data.Actors);
                }
            })
            uri = "http://192.168.160.58/netflix/api/Actors";
        }
    }
    ko.applyBindings(ViewModel());
})