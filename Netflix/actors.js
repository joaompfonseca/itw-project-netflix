$(document).ready(function () {
    function ViewModel() {
        //Vars
        var self = this;
        var uri = "http://192.168.160.58/netflix/api/Actors";

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
            self.Update();
        };
        self.PreviousPage = function () {
            self.CurrentPage(self.CurrentPage() - 1);
            self.Update();
        };
        self.FirstPage = function () {
            self.CurrentPage(1);
            self.Update();
        }
        self.LastPage = function () {
            self.CurrentPage(self.TotalPages());
            self.Update();
        }
        //Load Table
        $.ajax({
            url: "http://192.168.160.58/netflix/api/Actors?page=1&pagesize=10",
            success: function (data) {
                console.log(data);
                self.Actors(data.Actors);
                self.TotalActors(data.TotalActors);
                self.TotalPages(data.TotalPages);
                self.HasPrevious(data.HasPrevious);
                self.HasNext(data.HasNext);

                for (i = 1; i <= self.TotalPages(); i++) {
                    pages.push({ number: i.toString(), value: i });
                }
                self.Pages(pages);
            }
        });


        //Update Table
        self.Update = function () {
            var page = self.CurrentPage();
            var pagesize = self.PageSize();
            uri = uri + '?page=' + page + '&pagesize=' + pagesize;
            pages = [];
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
            })
            uri = "http://192.168.160.58/netflix/api/Actors";
        }

        
    }
    ko.applyBindings(ViewModel());
})