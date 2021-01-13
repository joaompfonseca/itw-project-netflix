var vm = function (dataType, dataText) {
    var self = this;

    //-----Arrays
    pagesizes = [
        { number: "10", value: 10 },
        { number: "25", value: 25 },
        { number: "50", value: 50 },
        { number: "100", value: 100 },
        { number: "250", value: 250 },
        { number: "500", value: 500 }
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

    //Update dataType Listing
    self.UpdateList = function () {
        var page = self.CurrentPage();
        var pageSize = self.PageSize();
        var url = 'http://192.168.160.58/netflix/api/' + dataType + '?page=' + page + '&pagesize=' + pageSize;

        //Pedido AJAX
        console.log("LIST: página: " + page + ", tamanho: " + pageSize + "...");
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
    var dataType = 'Countries';   //Tipo de Dados
    var dataText = 'Países';   //Texto Visível
    var totalPages = '110';  //Número de Elementos Autocomplete
    console.log("INFO: Tipo de dados: " + dataType);
    console.log("INFO: Modo de apresentação: " + dataText); console.log("");
    //---------------------------------------------------------------------//
    showLoading();
    $(document).ajaxComplete(hideLoading);
    ko.applyBindings(new vm(dataType, dataText));
    autocomplete(dataType, totalPages);
});