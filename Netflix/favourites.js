var vm = function () {
    var self = this;

    self.TotalFavourites = ko.observable();

    self.Titles = ko.observable();
    self.TotalTitles = ko.observable();

    self.Actors = ko.observable();
    self.TotalActors = ko.observable();
    self.ActorsDetailsTitles = ko.observable();
    self.ActorsDetailsTitlesLength = ko.observable();

    self.Directors = ko.observable();
    self.TotalDirectors = ko.observable();
    self.DirectorsDetailsTitles = ko.observable();
    self.DirectorsDetailsTitlesLength = ko.observable();

    self.Categories = ko.observable();
    self.TotalCategories = ko.observable();
    self.CategoriesDetailsTitles = ko.observable();
    self.CategoriesDetailsTitlesLength = ko.observable();

    self.Ratings = ko.observable();
    self.TotalRatings = ko.observable();
    self.RatingsDetailsTitles = ko.observable();
    self.RatingsDetailsTitlesLength = ko.observable();

    self.Countries = ko.observable();
    self.TotalCountries = ko.observable();
    self.CountriesDetailsTitles = ko.observable();
    self.CountriesDetailsTitlesLength = ko.observable();

    //Favoritos - Titles
    self.FavouriteTitles = function () {
        var type = this;
        var id = 'Titles_' + this.Id;
        if (id in amplify.store()) {
            amplify.store(id, null);
            $('.' + id).html("<i class='fa fa-heart-o' style=''></i>");
        } else {
            amplify.store(id, type);
            $('.' + id).html("<i class='fa fa-heart' style='color: red'></i>");
        }
    };

    //Favoritos - Actors
    self.FavouriteActors = function () {
        var type = this;
        var id = 'Actors_' + this.Id;
        if (id in amplify.store()) {
            amplify.store(id, null);
            $('.' + id).html("<i class='fa fa-heart-o' style=''></i>");
        } else {
            amplify.store(id, type);
            $('.' + id).html("<i class='fa fa-heart' style='color: red'></i>");
        }
    };

    //Favoritos - Directors
    self.FavouriteDirectors = function () {
        var type = this;
        var id = 'Directors_' + this.Id;
        if (id in amplify.store()) {
            amplify.store(id, null);
            $('.' + id).html("<i class='fa fa-heart-o' style=''></i>");
        } else {
            amplify.store(id, type);
            $('.' + id).html("<i class='fa fa-heart' style='color: red'></i>");
        }
    };

    //Favoritos - Categories
    self.FavouriteCategories = function () {
        var type = this;
        var id = 'Categories_' + this.Id;
        if (id in amplify.store()) {
            amplify.store(id, null);
            $('.' + id).html("<i class='fa fa-heart-o' style=''></i>");
        } else {
            amplify.store(id, type);
            $('.' + id).html("<i class='fa fa-heart' style='color: red'></i>");
        }
    };

    //Favoritos - Ratings
    self.FavouriteRatings = function () {
        var type = this;
        var id = 'Ratings_' + this.Id;
        if (id in amplify.store()) {
            amplify.store(id, null);
            $('.' + id).html("<i class='fa fa-heart-o' style=''></i>");
        } else {
            amplify.store(id, type);
            $('.' + id).html("<i class='fa fa-heart' style='color: red'></i>");
        }
    };

    //Favoritos - Countries
    self.FavouriteCountries = function () {
        var type = this;
        var id = 'Countries_' + this.Id;
        if (id in amplify.store()) {
            amplify.store(id, null);
            $('.' + id).html("<i class='fa fa-heart-o' style=''></i>");
        } else {
            amplify.store(id, type);
            $('.' + id).html("<i class='fa fa-heart' style='color: red'></i>");
        }
    };

    //Favoritos - Listagem
    function listFavourites(dataType, dataText) {
        var favArray = amplify.store();
        var favVals = [];

        for (var key in favArray) {
            if (key.includes(dataType)) {
                favVals.push(favArray[key]);
            }
        };

        if (favVals.length == 0) {
            $('#' + dataType.toLowerCase()).html("<h1 class='text-center mt-5'>Sem "+dataText.toLowerCase()+" para apresentar!</h1>");

        };

        switch (dataType){
            case "Titles":
                self.Titles(favVals);
                self.TotalTitles(favVals.length);
                break;
            case "Actors":
                self.Actors(favVals);
                self.TotalActors(favVals.length);
                break;
            case "Directors":
                self.Directors(favVals);
                self.TotalDirectors(favVals.length);
                break;
            case "Categories":
                self.Categories(favVals);
                self.TotalCategories(favVals.length);
                break;
            case "Ratings":
                self.Ratings(favVals);
                self.TotalRatings(favVals.length);
                break;
            case "Countries":
                self.Countries(favVals);
                self.TotalCountries(favVals.length);
                break;
        };
    };

    //Favoritos - Apagar tudo
    $(document).on("click", "#deleteAll", function () {
        var favArray = amplify.store();

        for (var key in favArray) {
            amplify.store(key,null)
        };

        listFavourites("Titles", "Títulos");
        listFavourites("Actors", "Atores");
        listFavourites("Directors", "Diretores");
        listFavourites("Categories", "Categorias");
        listFavourites("Ratings", "Classificações");
        listFavourites("Countries", "Países");
    });

    //-----actorsDetailsModal
    $(document).on("click", ".actorsDetails", function () {
        var id = $(this).attr('id');

        var url = 'http://192.168.160.58/netflix/api/Actors/' + id;

        //Pedido AJAX;
        console.log("LIST: Id: " + id);
        $.getJSON(url)
            .done(function (data) {
                self.ActorsDetailsTitles(data.Titles);
                self.ActorsDetailsTitlesLength(data.Titles.length);

                $('#actorsDetailsId').text('(' + data.Id + ') ' + data.Name);
                //Favoritos - Titles
                var lst = data.Titles;
                for (i = 0; i < lst.length; i++) {
                    var id = 'Titles_' + lst[i].Id;
                    if (id in amplify.store()) {
                        $('.' + id).html("<i class='fa fa-heart' style='color: red'></i>");
                    } else {
                        $('.' + id).html("<i class='fa fa-heart-o' style=''></i>");
                    };
                };

                console.log("LIST: DONE!");
            })
            .fail(function () {
                console.log("LIST: FAIL!");
            });

        $('#actorsDetailsModal').modal('show');
    });

    //-----directorsDetailsModal
    $(document).on("click", ".directorsDetails", function () {
        var id = $(this).attr('id');

        var url = 'http://192.168.160.58/netflix/api/Directors/' + id;

        //Pedido AJAX;
        console.log("LIST: Id: " + id);
        $.getJSON(url)
            .done(function (data) {
                self.DirectorsDetailsTitles(data.Titles);
                self.DirectorsDetailsTitlesLength(data.Titles.length);

                $('#directorsDetailsId').text('(' + data.Id + ') ' + data.Name);
                //Favoritos - Titles
                var lst = data.Titles;
                for (i = 0; i < lst.length; i++) {
                    var id = 'Titles_' + lst[i].Id;
                    if (id in amplify.store()) {
                        $('.' + id).html("<i class='fa fa-heart' style='color: red'></i>");
                    } else {
                        $('.' + id).html("<i class='fa fa-heart-o' style=''></i>");
                    };
                };

                console.log("LIST: DONE!");
            })
            .fail(function () {
                console.log("LIST: FAIL!");
            });

        $('#directorsDetailsModal').modal('show');
    });

    //-----countriesModal
    $(document).on("click", ".countriesDetails", function () {
        var id = $(this).attr('id');

        var url = 'http://192.168.160.58/netflix/api/Countries/' + id;

        //Pedido AJAX;
        console.log("LIST: Id: " + id);
        $.getJSON(url)
            .done(function (data) {
                self.CountriesDetailsTitles(data.Titles);
                self.CountriesDetailsTitlesLength(data.Titles.length);

                $('#countriesDetailsId').text('(' + data.Id + ') ' + data.Name);
                //Favoritos - Titles
                var lst = data.Titles;
                for (i = 0; i < lst.length; i++) {
                    var id = 'Titles_' + lst[i].Id;
                    if (id in amplify.store()) {
                        $('.' + id).html("<i class='fa fa-heart' style='color: red'></i>");
                    } else {
                        $('.' + id).html("<i class='fa fa-heart-o' style=''></i>");
                    };
                };

                console.log("LIST: DONE!");
            })
            .fail(function () {
                console.log("LIST: FAIL!");
            });

        $('#countriesDetailsModal').modal('show');
    });

    //-----categoriesModal
    $(document).on("click", ".categoriesDetails", function () {
        var id = $(this).attr('id');

        var url = 'http://192.168.160.58/netflix/api/Categories/' + id;

        //Pedido AJAX;
        console.log("LIST: Id: " + id);
        $.getJSON(url)
            .done(function (data) {
                self.CategoriesDetailsTitles(data.Titles);
                self.CategoriesDetailsTitlesLength(data.Titles.length);

                $('#categoriesDetailsId').text('(' + data.Id + ') ' + data.Name);
                //Favoritos - Titles
                var lst = data.Titles;
                for (i = 0; i < lst.length; i++) {
                    var id = 'Titles_' + lst[i].Id;
                    if (id in amplify.store()) {
                        $('.' + id).html("<i class='fa fa-heart' style='color: red'></i>");
                    } else {
                        $('.' + id).html("<i class='fa fa-heart-o' style=''></i>");
                    };
                };

                console.log("LIST: DONE!");
            })
            .fail(function () {
                console.log("LIST: FAIL!");
            });

        $('#categoriesDetailsModal').modal('show');
    });

    //-----ratingsModal
    $(document).on("click", ".ratingsDetails", function () {
        var id = $(this).attr('id');

        var url = 'http://192.168.160.58/netflix/api/Ratings/' + id;

        //Pedido AJAX;
        console.log("LIST: Id: " + id);
        $.getJSON(url)
            .done(function (data) {
                self.RatingsDetailsTitles(data.Titles);
                self.RatingsDetailsTitlesLength(data.Titles.length);

                $('#ratingsDetailsId').text('(' + data.Id + ') ' + data.Classe);
                $('#ratingsDetailsDesc').text(data.Description);
                //Favoritos - Titles
                var lst = data.Titles;
                for (i = 0; i < lst.length; i++) {
                    var id = 'Titles_' + lst[i].Id;
                    if (id in amplify.store()) {
                        $('.' + id).html("<i class='fa fa-heart' style='color: red'></i>");
                    } else {
                        $('.' + id).html("<i class='fa fa-heart-o' style=''></i>");
                    };
                };

                console.log("LIST: DONE!");
            })
            .fail(function () {
                console.log("LIST: FAIL!");
            });

        $('#ratingsDetailsModal').modal('show');
    });

    //-----Load Inicial
    listFavourites("Titles","Títulos");
    listFavourites("Actors","Atores");
    listFavourites("Directors","Diretores");
    listFavourites("Categories","Categorias");
    listFavourites("Ratings","Classificações");
    listFavourites("Countries","Países");
}

$(document).ready(function () {
    console.log("INFO: DOCUMENT READY!"); console.log("");

    //-----PageLoading
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

    showLoading();
    hideLoading();
    ko.applyBindings(new vm());
});