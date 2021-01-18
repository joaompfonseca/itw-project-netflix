$(document).ready(function () {
    console.log("INFO: DOCUMENT READY!"); console.log("");

    //Gráfico
    google.load("visualization", "1.1", { packages: ["bar"] });
    google.setOnLoadCallback(drawStuff);
    function drawStuff() {
        //Pedido AJAX
        var url = 'http://192.168.160.58/netflix/api/Statistics'

        $.get(url)
            .done(function (data) {
                var titles = data.Titles;
                var actors = data.Actors;
                var directors = data.Directors;
                var categories = data.Categories;
                var countries = data.Countries;

                var data = new google.visualization.arrayToDataTable([
                    ["Tipo", ''],
                    ["Títulos", titles],
                    ["Atores", actors],
                    ["Diretores", directors],
                    ["Categorias", categories],
                    ["Países", countries]
                ]);
                var options = {
                    legend: { position: 'none' },

                    bars: 'vertical',
                    bar: { groupWidth: "100%" },
                    colors: ['#ffffff'],
                };
                var chart = new google.charts.Bar(document.getElementById('chart'));
                chart.draw(data, options);

                console.log("STATS: DONE!");
        }).fail(function () {
            console.log("STATS: FAIL!");
        })
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

    showLoading();
    hideLoading();
});