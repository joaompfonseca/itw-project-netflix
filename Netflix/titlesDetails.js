﻿var vm = function (dataType, dataText, id) {
    var self = this;

    //-----Binds
    //Basic
    self.DataType = ko.observable(dataType);
    self.DataText = ko.observable(dataText);
    self.Id = ko.observable(id);
    self.Name = ko.observable();
    self.DateAdded = ko.observable();
    self.Description = ko.observable();
    self.Duration = ko.observable();
    self.ReleaseYear = ko.observable();
    self.Rating = ko.observable();
    self.Type = ko.observable();
    self.Actors = ko.observable();
    self.Countries = ko.observable();
    self.Directors = ko.observable();
    self.Categories = ko.observable();

    self.ActorsImg = ko.observableArray();
    self.ActorsDetailsTitles = ko.observable();

    //Favoritos - Atores
    self.FavouriteActors = function () {
        var type = this;
        var id = 'Actors_' + this.Id;
        if (id in amplify.store()) {
            amplify.store(id, null);
            $('#' + id).html("<i class='fa fa-heart-o' style=''></i>");
        } else {
            amplify.store(id, type);
            $('#' + id).html("<i class='fa fa-heart' style='color: red'></i>");
        }
    };

    //Favoritos - Titles
    self.FavouriteTitles = function () {
        var type = this;
        var id = 'Titles_' + this.Id;
        if (id in amplify.store()) {
            amplify.store(id, null);
            $('#' + id).html("<i class='fa fa-heart-o' style=''></i>");
        } else {
            amplify.store(id, type);
            $('#' + id).html("<i class='fa fa-heart' style='color: red'></i>");
        }
    };


    //Update dataType Listing
    self.UpdateList = function () {
        var url = 'http://192.168.160.58/netflix/api/' + dataType + '/' + id;

        //Pedido AJAX;
        console.log("LIST: Id: "+ id);
        $.getJSON(url)
            .done(function (data) {
                self.Name(data.Name);
                self.DateAdded(new Date(data.DateAdded).toLocaleDateString());
                self.Description(data.Description);
                self.Duration(data.Duration);
                self.ReleaseYear(data.ReleaseYear);
                self.Rating(data.Rating); // Id, Code, Title
                self.Type(data.Type); //Id, Name, Titles
                self.Actors(data.Actors); //For each - Id, Name, Titles
                self.Countries(data.Countries); //For each - Id, Name, Titles
                self.Directors(data.Directors); //For each - Id, Name, Titles
                self.Categories(data.Categories); //For each - Id, Name, Titles

                //Favoritos - Atores
                var lst = data.Actors;
                for (i = 0; i < lst.length; i++) {
                    var id = 'Actors_' + lst[i].Id;
                    if (id in amplify.store()) {
                        $('#' + id).html("<i class='fa fa-heart' style='color: red'></i>");
                    } else {
                        $('#' + id).html("<i class='fa fa-heart-o' style=''></i>");
                    };
                };

                //Imagens dos Atores
                var actors = self.Actors();
                var actorsQ = [];

                for (actor in actors) {
                    var name = actors[actor].Name;
                    var newName = name.split(" ");
                    name = "";
                    for (i = 0; i < newName.length - 1; i++) {
                        name += newName[i] + "+"
                    };
                    name += newName[i];
                    actorsQ.push(name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/['"]+/g, '%27'))
                };
                if (actorsQ.length > 0) {
                    var i = 0;
                    var actorsImg = [];
                    function addActorImg() {
                        var url = 'https://thingproxy.freeboard.io/fetch/http://www.adorocinema.com/busca/?q=';
                        var name = actorsQ[i];
                        var id = actors[i].Id;
                        //Pedido AJAX
                        $.get(url + name)
                            .done(function (data) {
                                var posLink = data.search('acsta.net/c_162_216/');
                                if (posLink != -1) {
                                    var imgLink = data.slice(posLink - 19, posLink + 55).replace(/['"]+/g, '');
                                    if ((!imgLink.includes("jpg")) && (!imgLink.includes("png"))) {
                                        imgLink += "jpg";
                                    }
                                    if (!imgLink.includes("empty")) {
                                        $('#' + id).attr('src', imgLink);
                                        actorsImg.push({ Id: id, Img: imgLink })
                                        console.log("ACT_IMG: DONE!")
                                    }
                                }
                            })
                            .fail(function () {
                                console.log("ACT_IMG: FAIL!")
                            });
                        i++
                        if (i < actorsQ.length) {
                            addActorImg();
                        }
                    }

                    self.ActorsImg(actorsImg);
                    addActorImg();
                }
                //-----

                console.log("LIST: DONE!");
            })
            .fail(function () {
                console.log("LIST: FAIL!");
            });
    };

    //-----actorsDetailsModal
    $(document).on("click", ".actorsDetails", function () {
        var id = $(this).attr('id');
        var actorsImg = self.ActorsImg();
        var imgLink = "../Custom/images/missingPerson.jpg";

        for (i in actorsImg) {
            if (actorsImg[i].Id.toString() == id) {
                imgLink = actorsImg[i].Img;
            };
        };

        var url = 'http://192.168.160.58/netflix/api/Actors/' + id;

        //Pedido AJAX;
        console.log("LIST: Id: " + id);
        $.getJSON(url)
            .done(function (data) {
                self.ActorsDetailsTitles(data.Titles);

                $('#actorsDetailsId').text('(' + data.Id + ') ' + data.Name);
                //Favoritos - Titles
                var lst = data.Titles;
                for (i = 0; i < lst.length; i++) {
                    var id = 'Titles_' + lst[i].Id;
                    if (id in amplify.store()) {
                        $('#' + id).html("<i class='fa fa-heart' style='color: red'></i>");
                    } else {
                        $('#' + id).html("<i class='fa fa-heart-o' style=''></i>");
                    };
                };

                console.log("LIST: DONE!");
            })
            .fail(function () {
                console.log("LIST: FAIL!");
            });

        $('#actorsDetailsImg').attr('src', imgLink);
        $('#actorsDetailsModal').modal('show');
    });

    //-----Load Inicial
    console.log("INFO: A primeira listagem dos dados é duplicada devido ao modo como a página funciona..."); console.log("");
    self.UpdateList();
}

$(document).ready(function () {
    console.log("INFO: DOCUMENT READY!"); console.log("");

    //-----titleBannerById
    function bannerById(id) {
        var url = 'https://thingproxy.freeboard.io/fetch/http://www.netflix.com/pt/title/' + id; //https://cors-anywhere.herokuapp.com/ // https://thingproxy.freeboard.io/fetch/

        //Pedido AJAX
        console.log("BANNER: Id: " + id)
        $.get(url)
            .done(function (data) {
                var posLink = data.search('nflxso.net/dnm/api/v6') + 22;
                var imgLink = data.slice(posLink - 48, posLink + 134);
                $('#banner').css('background-image', 'url(' + imgLink + ')');
                console.log("BANNER: DONE!")
            })
            .fail(function () {
                $('#banner').css('background-image', 'url(../Custom/images/banner.png)');
                console.log("BANNER: FAIL!")
            });
    };

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

    //-----GetUrlParameters
    function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    //----------VALORES A ALTERAR QUANDO MUDAR O TIPO DE PÁGINA!!!----------//
    var dataType = 'Titles';   //Tipo de Dados
    var dataText = 'Título';   //Texto Visível
    console.log("INFO: Tipo de dados: " + dataType);
    console.log("INFO: Modo de apresentação: " + dataText);
    //---------------------------------------------------------------------//
    showLoading();
    $(document).ajaxComplete(hideLoading);
    var id = getUrlParameter('id');
    console.log("INFO: Id: " + id); console.log("");
    bannerById(id);
    ko.applyBindings(new vm(dataType, dataText, id));
    //--------------------------------

});