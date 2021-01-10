var vm = function (dataType, dataText, id) {
    var self = this;

    //-----Arrays

    //-----Binds
    //Basic
    self.DataType = ko.observable(dataType);
    self.DataText = ko.observable(dataText);
    self.Unlock = ko.observable(true);
    self.Query = ko.observable('');
    self.Type = ko.observable();
    self.TotalType = ko.observable();
    self.Pages = ko.observable();
    self.TotalPages = ko.observable();
    self.CurrentPage = ko.observable('1');
    self.PageSize = ko.observable('10');
    self.HasPrevious = ko.observable();
    self.HasNext = ko.observable();
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
        self.Unlock(true);
        self.UpdateList();
    };

    //Custom
    self.Sorting = ko.observable(dataType);
    self.Year = ko.observable();
    self.UnlockYear = ko.computed(function () {
        if (self.Sorting() == 'TitlesByYear') {
            return 'visible';
        } else {
            return 'hidden';
        };
    });

    //Update dataType Listing
    self.UpdateList = function () {
        var page = self.CurrentPage();
        var pageSize = self.PageSize();
        var sorting = self.Sorting();
        var year = self.Year();
        if (sorting == 'TitlesByYear') {
            var url = 'http://192.168.160.58/netflix/api/' + sorting + '?year=' + year + '&page=' + page + '&pagesize=' + pageSize;
            var msg = "LIST: filtro: " + sorting + " (" + year + ") , página: " + page + ", tamanho: " + pageSize + "...";
        } else {
            var url = 'http://192.168.160.58/netflix/api/' + sorting + '?page=' + page + '&pagesize=' + pageSize;
            var msg = "LIST: filtro: " + sorting + ", página: " + page + ", tamanho: " + pageSize + "...";
        };

        //Pedido AJAX;
        console.log(msg);
        $.getJSON(url)
            .done(function (data) {
                self.TotalType(data['Total' + dataType]);
                self.TotalPages(data.TotalPages);
                self.HasPrevious(data.HasPrevious);
                self.HasNext(data.HasNext);
                self.Type(data[dataType]);

                var pages = [];
                for (i = 1; i <= self.TotalPages(); i++) {
                    pages.push({ number: i.toString(), value: i });
                };
                self.Pages(pages);

                console.log("LIST: DONE!");
            })
            .fail(function () {
                console.log("LIST: FAIL!");
            });
    };

    //Update dataType Search
    self.UpdateSearch = function () {
        if (self.Query().length > 2) {
            self.Unlock(false);
            var q = self.Query();
            var url = 'http://192.168.160.58/netflix/api/Search/' + dataType + '?name=' + q;

            //Pedido AJAX
            console.log("SEARCH: termo '" + q + "'...");
            $.getJSON(url)
                .done(function (data) {
                    self.Type(data);

                    console.log("SEARCH: DONE!");
                })
                .fail(function () {
                    console.log("SEARCH: FAIL!");
                });
            ;
        };
    };

    //-----Load Inicial
    console.log("INFO: A primeira listagem dos dados é duplicada devido ao modo como a página funciona..."); console.log("");
    self.UpdateList();
}

$(document).ready(function () {
    console.log("INFO: DOCUMENT READY!"); console.log("");

    //-----titleBannerById
    function bannerById(id) {
        var url = 'https://thingproxy.freeboard.io/fetch/https://www.netflix.com/pt/title/' + id; //https://cors-anywhere.herokuapp.com/
        $.get(url, function (data) {
            var posLink = data.search('nflxso.net/dnm/api/v6') + 22;
            var imgLink = data.slice(posLink - 48, posLink + 134);
            $('#banner').css('background-image', 'url('+imgLink+')');
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
    console.log("INFO: Modo de apresentação: " + dataText); console.log("");
    //---------------------------------------------------------------------//
    showLoading();
    $(document).ajaxComplete(hideLoading);
    var id = getUrlParameter('id');
    console.log("INFO: Id: " + id);
    bannerById(id);
    ko.applyBindings(new vm(dataType, dataText, id));
    //--------------------------------

});