var vm = function (dataType, dataText) {
    var self = this;

    //-----Arrays
    pagesizes = [
        { number: "14", value: 14 },
        { number: "35", value: 35 }
    ];
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
    self.TotalType = ko.observable();
    self.Pages = ko.observable();
    self.TotalPages = ko.observable();
    self.CurrentPage = ko.observable('1');
    self.PageSize = ko.observable('14');
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

    self.HideControls = ko.computed(function () {
        if ((self.Sorting() == 'Favourites') || !self.Unlock()) {
            return 'hidden';
        } else {
            return 'visible';
        };
    });
    self.HideFilters = ko.computed(function () {
        if (!self.Unlock()) {
            return 'hidden';
        } else {
            return 'visible';
        };
    });

    self.TypesImg = ko.observableArray();
    self.TypesTitles = ko.observable();

    //Imagens dos Types
    function typesImg() {
        var types = self.Type();
        var typesQ = [];
        for (type in types) {
            var name = types[type].Name;
            var newName = name.split(" ");
            name = "";
            for (i = 0; i < newName.length - 1; i++) {
                name += newName[i] + "+"
            };
            name += newName[i];
            typesQ.push(name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/['"]+/g, '%27'))
        };

        var i = 0;
        var typesImg = [];
        function addTypeImg() {
            var url = 'https://thingproxy.freeboard.io/fetch/http://www.adorocinema.com/busca/?q=';
            var name = typesQ[i];
            var id = types[i].Id;
            //Pedido AJAX
            $.get(url + name)
                .done(function (data) {
                    var posLink = data.search('acsta.net/c_162_216/');
                    var endLink = data.indexOf('" ', posLink);
                    if (posLink != -1) {
                        var imgLink = data.slice(posLink - 19, endLink).replace(/['"]+/g, '');
                        if (!imgLink.includes("empty")) {
                            $('#' + id).attr('src', imgLink);
                            typesImg.push({ Id: id, Img: imgLink });
                            console.log("TYPE_IMG: DONE!");
                        };
                    };
                })
                .fail(function () {
                    console.log("TYPE_IMG: FAIL!");
                });
            i++
            if (i < typesQ.length) {
                addTypeImg();
            }
        }
        addTypeImg();
        self.TypesImg(typesImg);
    }

    //Update dataType Listing
    self.UpdateList = function () {
        var page = self.CurrentPage();
        var pageSize = self.PageSize();
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

            //Imagens dos Types
            typesImg();

            return;
        } else {
            var url = 'http://192.168.160.58/netflix/api/' + sorting + '?page=' + page + '&pagesize=' + pageSize;
            var msg = "LIST: filtro: " + sorting + ", página: " + page + ", tamanho: " + pageSize + "...";
        };

        //Pedido AJAX
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

                //Favoritos
                var lst = data[dataType]
                for (i = 0; i < lst.length; i++) {
                    var id = dataType + '_' + lst[i].Id;
                    if (id in amplify.store()) {
                        $('#' + id).html("<i class='fa fa-heart' style='color: red'></i>");
                    } else {
                        $('#' + id).html("<i class='fa fa-heart-o' style=''></i>");
                    };
                };

                //Imagens dos Types
                typesImg();

                console.log("LIST: DONE!");
            })
            .fail(function () {
                console.log("LIST: FAIL!");
            });
    };

    //-----typesModal
    $(document).on("click", ".typesDetails", function () {
        var id = $(this).attr('id');
        var typesImg = self.TypesImg();
        var imgLink = "../Custom/images/missingPerson.jpg";

        for (i in typesImg) {
            if (typesImg[i].Id.toString() == id) {
                imgLink = typesImg[i].Img;
            };
        };

        var url = 'http://192.168.160.58/netflix/api/' + dataType + '/' + id;

        //Pedido AJAX;
        console.log("LIST: Id: " + id);
        $.getJSON(url)
            .done(function (data) {
                self.TypesTitles(data.Titles);

                $('#typesId').text('(' + data.Id + ') ' + data.Name);
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

        $('#typesImg').attr('src', imgLink);
        $('#typesModal').modal('show');
    });

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

                    //Imagens dos Types
                    typesImg();

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

    //-----Autocomplete
    autocomplete = function (dataType, totalPages) {
        var url = 'http://192.168.160.58/netflix/api/' + dataType + '?page=1&pagesize=' + totalPages;

        //Pedido AJAX
        console.log("AUTO: " + totalPages + " sugestões...");
        $.getJSON(url)
            .done(function (data) {
                var lst = data[dataType];
                tips = [];
                for (i = 0; i < totalPages; i++) {
                    tips.push(lst[i].Name);
                }
                $("#search").autocomplete({
                    delay: 0,
                    minLength: 3,
                    source: tips
                });

                console.log("AUTO: DONE!"); console.log("");
                console.log("INFO: DOCUMENT LOADED!"); console.log("");
            })
            .fail(function () {
                console.log("AUTO: FAIL!")
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

    //----------VALORES A ALTERAR QUANDO MUDAR O TIPO DE PÁGINA!!!----------//
    var dataType = 'Directors';   //Tipo de Dados
    var dataText = 'Diretores';   //Texto Visível
    var totalPages = '3654';  //Número de Elementos Autocomplete
    console.log("INFO: Tipo de dados: " + dataType);
    console.log("INFO: Modo de apresentação: " + dataText); console.log("");
    //---------------------------------------------------------------------//
    showLoading();
    $(document).ajaxComplete(hideLoading);
    ko.applyBindings(new vm(dataType, dataText));
    autocomplete(dataType, totalPages);
});