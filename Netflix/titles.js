$(document).ready(function () {
    function ViewModel() {
        //Vars
        var self = this;
        var load = false;
       
        //Arrays
        pages = [];
        ids = [];
        pagesizes = [
            { number: "10", value: 10 },
            { number: "25", value: 25 },
            { number: "50", value: 50 },
            { number: "100", value: 100 },
            { number: "250", value: 250 },
            { number: "500", value: 500 }
        ];

        //Binds
        self.baseUri = ko.observable('http://192.168.160.58/netflix/api/titles/');
        self.Type = ko.observable("Pesquisar títulos...");
        self.id = ko.observable();
        self.Unlock = ko.observable(true);
        self.Query = ko.observable();
        self.Titles = ko.observable();
        self.TotalTitles = ko.observable();
        self.Pages = ko.observable();
        self.TotalPages = ko.observable();
        self.CurrentPage = ko.observable();
        self.PageSize = ko.observable();
        self.HasPrevious = ko.observable();
        self.HasNext = ko.observable();
        self.FirstPage = ko.observable();
        self.LastPage = ko.observable();
        self.releaseYear = ko.observable('');

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


        //Load Titles List
        $.ajax({
            url: "http://192.168.160.58/netflix/api/Titles?page=1&pagesize=10",
            success: function (data) {
                self.TotalTitles(data.TotalTitles);
                self.TotalPages(data.TotalPages);
                self.CurrentPage(data.CurrentPage);
                self.PageSize(data.PageSize);
                self.HasPrevious(data.HasPrevious);
                self.HasNext(data.HasNext);
                self.id(data.Id);
                for (i = 1; i <= self.TotalPages(); i++) {
                    pages.push({ number: i.toString(), value: i });
                };
                self.titles = data.Titles;
                for (a = 0; a < data.Titles.length; a++) {
                    $.ajax({
                        async:false,    
                        url: "http://192.168.160.58/netflix/api/Titles/" + titles[a].Id,
                        success: function (data) {
                            self.titles[a].releaseYear = data.ReleaseYear ;
                        }
                    });
                    console.log(self.titles[a]);
                };
                self.Titles(self.titles);
                self.Pages(pages);
            }
        });


        //Update Titles List
        self.UpdateList = function () {
            if (load) {
                pages = [];
                var page = self.CurrentPage();
                var pagesize = self.PageSize();
                var uri = 'http://192.168.160.58/netflix/api/Titles?page=' + page + '&pagesize=' + pagesize;
                $.ajax({
                    url: uri,
                    success: function (data) {
                        self.Titles(data.Titles);
                        self.TotalPages(data.TotalPages);
                        self.HasPrevious(data.HasPrevious);
                        self.HasNext(data.HasNext);

                        for (i = 1; i <= self.TotalPages(); i++) {
                            pages.push({ number: i.toString(), value: i });
                        };
                        self.titles = data.Titles;
                        for (a = 0; a < data.Titles.length; a++) {
                            $.ajax({
                                async: false,
                                url: "http://192.168.160.58/netflix/api/Titles/" + titles[a].Id,
                                success: function (data) {
                                    self.titles[a].releaseYear = data.ReleaseYear;
                                }
                            });
                            console.log(self.titles[a]);
                        };
                        self.Titles(self.titles);
                        self.Pages(pages);

                    }
                });
            };
            load = true
        };

        //Update Titles Search
        self.UpdateSearch = function () {
            if (load && self.Query() == '') {
                self.Refresh();
            }
            if (load && self.Query().length > 2) {
                self.Unlock(false);
                var q = self.Query();
                var uri = 'http://192.168.160.58/netflix/api/Search/Titles?name=' + q;
                $.ajax({
                    url: uri,
                    success: function (data) {
                        self.Titles(data);
                    }
                });
            };
            load = true;
        };
    }
    ko.applyBindings(ViewModel());

    //Search Autocomplete
    $.getJSON('http://192.168.160.58/netflix/api/Titles?page=1&pagesize=27391')
        .done(function (data) {
            tips = [];
            lst = data.Titles;
            i = 0;
            while (tips.length != 27391) {
                tips.push(lst[i].Name);
                i++;
            }
            $("#search").autocomplete({
                delay: 0,
                minLength: 3,
                source: tips
            });
        });

    //ShowLoading
    function showLoading() {
        $('#modal').modal('show');
    };
    //HideLoading
    function hideLoading() {
        $('#modal').on('shown.bs.modal', function (e) {
            setTimeout(function () {
                $("#modal").modal('hide');
            }, 1000);
        })
    };
});

