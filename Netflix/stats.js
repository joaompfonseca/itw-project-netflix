$(document).ready(function () {
    console.log("INFO: DOCUMENT READY!"); console.log("");

    google.load("visualization", "1.1", { packages: ["bar", "corechart"]});
    google.setOnLoadCallback(drawStuff1);
    google.setOnLoadCallback(drawStuff2);
    //Gráfico 1
    function drawStuff1() {
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
                    ["",""],
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
                var chart = new google.charts.Bar(document.getElementById('chart1'));
                chart.draw(data, options);

                console.log("STATS: DONE!");
        }).fail(function () {
            console.log("STATS: FAIL!");
        })
    };

    //Gráfico 2
    function drawStuff2() {
        //Pedido AJAX
        var url = 'http://192.168.160.58/netflix/api/Statistics/TitlesPerCountry'

        $.get(url)
            .done(function (data) {
                var array = data;
                var newArray = [["",""]];
                for (i in array) {
                    newArray.push([array[i].Key, array[i].Value])
                }

                var data = new google.visualization.arrayToDataTable(newArray);
                var options = {
                    legend: { position: 'none' },

                    bars: 'horizontal',
                    bar: { groupWidth: "100%" },
                    sliceVisibilityThreshold: 1 / 300,
                    pieHole: 0.2,
                };
                var chart = new google.visualization.PieChart(document.getElementById('chart2'));
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