$(document).ready(function () {
    console.log("INFO: DOCUMENT READY!"); console.log("");

    //Gráfico
    google.load("visualization", "1.1", { packages: ["bar"] });
    google.setOnLoadCallback(drawStuff);
    function drawStuff() {
        var data = new google.visualization.arrayToDataTable([
            ["Tipo",''],
            ["Títulos", 6234],
            ["Atores", 27391],
            ["Diretores", 3654],
            ["Categorias", 42],
            ["Países", 110]
        ]);
        var options = {
            legend: { position: 'none' },

            bars: 'vertical',
            bar: { groupWidth: "100%" },
            colors: ['#ffffff'],
        };
        var chart = new google.charts.Bar(document.getElementById('chart'));
        chart.draw(data, options);
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