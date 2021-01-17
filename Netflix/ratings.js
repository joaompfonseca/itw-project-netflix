var vm = function (dataType, dataText) {
    var self = this;

    //-----Arrays
    sorting = [
        { method: 'Por nome', value: dataType },
        { method: 'Favoritos', value: 'Favourites' }
    ];

    //-----Binds
    //Basic
    self.DataType = ko.observable(dataType);
    self.DataText = ko.observable(dataText);
    self.Unlock = ko.observable(true);
    self.Query = ko.observable('');
    self.Type = ko.observable();
    self.TotalType = ko.observable('14');
    self.Refresh = function () {
        self.Unlock(true);
        self.UpdateList();
    };

    self.Sorting = ko.observable(dataType);

    //Favoritos - Types
    self.Favourite = function () {
        var type = this;
        var id = dataType + '_' + this.Id;
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

    self.HideFilters = ko.computed(function () {
        if (!self.Unlock()) {
            return 'hidden';
        } else {
            return 'visible';
        };
    });

    self.TypesTitles = ko.observable();
    self.TypesTitlesLength = ko.observable();

    //Update dataType Listing
    self.UpdateList = function () {
        var sorting = self.Sorting();
        if (sorting == 'Favourites') {
            //-----Listar favoritos
            var favArray = amplify.store(); //Buscar favoritos
            var favVals = [];

            //Adicionar o dicionário com os valores {"Id": ..., "Name": ...} de cada favorito a uma lista nova
            for (var key in favArray) {
                if (key.includes(dataType)) {
                    favVals.push(favArray[key]);
                }
            };
            self.Type(favVals); //Listar os favoritos
            self.TotalType(favVals.length);

            //Definir a cor dos botões
            for (i = 0; i < favVals.length; i++) {
                var id = dataType + '_' + favVals[i].Id;
                $('#' + id).html("<i class='fa fa-heart' style='color: red'></i>");
            };

            return;
        } else {
            var url = 'http://192.168.160.58/netflix/api/' + sorting;
            var msg = "LIST: filtro: " + sorting;
        };

        //Pedido AJAX
        console.log(msg);
        $.getJSON(url)
            .done(function (data) {
                self.Type(data);
                self.TotalType(data.length);

                //Favoritos
                var lst = data
                for (i = 0; i < lst.length; i++) {
                    var id = dataType + '_' + lst[i].Id;
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
    };

    //-----typesModal
    $(document).on("click", ".typesDetails", function () {
        var id = $(this).attr('id');

        var url = 'http://192.168.160.58/netflix/api/' + dataType + '/' + id;

        //Pedido AJAX;
        console.log("LIST: Id: " + id);
        $.getJSON(url)
            .done(function (data) {
                self.TypesTitles(data.Titles);
                self.TypesTitlesLength(data.Titles.length);

                $('#typesId').text('(' + data.Id + ') ' + data.Classe);
                $('#typesDesc').text(data.Description);
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

        $('#typesModal').modal('show');
    });

    //-----Load Inicial
    console.log("INFO: A primeira listagem dos dados é duplicada devido ao modo como a página funciona..."); console.log("");
    self.UpdateList();
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

    //----------VALORES A ALTERAR QUANDO MUDAR O TIPO DE PÁGINA!!!----------//
    var dataType = 'Ratings';   //Tipo de Dados
    var dataText = 'Classificações';   //Texto Visível
    var totalPages = '14';  //Número de Elementos Autocomplete
    console.log("INFO: Tipo de dados: " + dataType);
    console.log("INFO: Modo de apresentação: " + dataText); console.log("");
    //---------------------------------------------------------------------//
    showLoading();
    $(document).ajaxComplete(hideLoading);
    ko.applyBindings(new vm(dataType, dataText));
});