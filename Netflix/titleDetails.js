var vm = function (dataType, dataText, id) {
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
    //Update dataType Listing
    self.UpdateList = function () {
        var url = 'http://192.168.160.58/netflix/api/' + dataType + '/' + id;

        //Pedido AJAX;
        console.log("LIST: Id: "+ id);
        $.getJSON(url)
            .done(function (data) {
                console.log(data)
                self.Name(data.Name);
                self.DateAdded(data.DateAdded);
                self.Description(data.Description);
                self.Duration(data.Duration);
                self.ReleaseYear(data.ReleaseYear);
                self.Rating(data.Rating); // Id, Code, Title
                self.Type(data.Type); //Id, Name, Titles
                self.Actors(data.Actors); //For each - Id, Name, Titles
                self.Countries(data.Countries); //For each - Id, Name, Titles
                self.Directors(data.Directors); //For each - Id, Name, Titles
                self.Categories(data.Categories); //For each - Id, Name, Titles

                console.log("LIST: DONE!");
            })
            .fail(function () {
                console.log("LIST: FAIL!");
            });
    };

    //-----Load Inicial
    console.log("INFO: A primeira listagem dos dados é duplicada devido ao modo como a página funciona..."); console.log("");
    self.UpdateList();
}

$(document).ready(function () {
    console.log("INFO: DOCUMENT READY!"); console.log("");

    //-----titleBannerById
    function bannerById(id) {
        var url = 'https://cors-anywhere.herokuapp.com/https://www.netflix.com/pt/title/' + id; //https://thingproxy.freeboard.io/fetch/

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