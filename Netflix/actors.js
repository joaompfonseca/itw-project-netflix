$(document).ready(function () {
    function ViewModel() {
        //Vars
        var self = this;
        var load = false;

        //Arrays
        pages = [];
        pagesizes = [
            { number: "10", value: 10 },
            { number: "25", value: 25 },
            { number: "50", value: 50 },
            { number: "100", value: 100 },
            { number: "250", value: 250 },
            { number: "500", value: 500 }
        ];

        //Binds
        self.Type = ko.observable("Pesquisar atores...");
        self.Unlock = ko.observable(true);
        self.Query = ko.observable();
        self.Actors = ko.observable();
        self.TotalActors = ko.observable();
        self.Pages = ko.observable();
        self.TotalPages = ko.observable();
        self.CurrentPage = ko.observable();
        self.PageSize = ko.observable();
        self.HasPrevious = ko.observable();
        self.HasNext = ko.observable();
        self.FirstPage = ko.observable();
        self.LastPage = ko.observable();

        self.NextPage = function () {
            self.CurrentPage(self.CurrentPage() + 1);
            self.UpdateList();
        };
        self.PreviousPage = function () {
            self.CurrentPage(self.CurrentPage() - 1);
            self.UpdateList();
        };
        self.FirstPage = function () {
            self.CurrentPage(1);
            self.UpdateList();
        };
        self.LastPage = function () {
            self.CurrentPage(self.TotalPages());
            self.UpdateList();
        };
        self.Refresh = function () {
            self.Query("");
            self.Unlock(true);
            self.UpdateList();
        };

        //Load Actors List
        $.ajax({
            url: "http://192.168.160.58/netflix/api/Actors?page=1&pagesize=10",
            success: function (data) {
                console.log(data);
                self.Actors(data.Actors);
                self.TotalActors(data.TotalActors);
                self.TotalPages(data.TotalPages);
                self.CurrentPage(data.CurrentPage);
                self.HasPrevious(data.HasPrevious);
                self.HasNext(data.HasNext);

                for (i = 1; i <= self.TotalPages(); i++) {
                    pages.push({ number: i.toString(), value: i });
                }
                self.Pages(pages);
            }
        });

        //Update Actors List
        self.UpdateList = function () {
            if (load) {
                pages = [];
                var page = self.CurrentPage();
                var pagesize = self.PageSize();
                var uri = 'http://192.168.160.58/netflix/api/Actors?page=' + page + '&pagesize=' + pagesize;
                $.ajax({
                    url: uri,
                    success: function (data) {
                        console.log(data);
                        self.Actors(data.Actors);
                        self.TotalPages(data.TotalPages);
                        self.HasPrevious(data.HasPrevious);
                        self.HasNext(data.HasNext);

                        for (i = 1; i <= self.TotalPages(); i++) {
                            pages.push({ number: i.toString(), value: i });
                        }
                        self.Pages(pages);
                    }
                });
            };
            load = true
        };

        //Update Actors Search
        self.UpdateSearch = function () {
            if (load) {
                self.Unlock(false);
                var q = self.Query();
                var uri = 'http://192.168.160.58/netflix/api/Search/Actors?name=' + q;
                $.ajax({
                    url: uri,
                    success: function (data) {
                        console.log(data);
                        self.Actors(data);
                    }
                });
            };
            load = true
        };
    }
    ko.applyBindings(ViewModel());
    console.log("Finished Loading!");
});