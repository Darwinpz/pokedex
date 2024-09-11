$(document).ready( function () {

    var table = $('#table_puntajes').DataTable({

        "ajax":{
            "url":"/ver_puntajes",
            "method": "post"
        },
        "ordering": false,
        "columns":[
            {"data":"_id"},
            {"data":"rol"},
            {"data":"nombre"},
            {"data":"puntaje"},
            {"data":"fecha_accion"}
        ],
        "columnDefs":[
            {
                target: 0,
                visible: false,
                searchable: false
            }
        ],
        "language":{"url":"https://cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json" },
        "pageLength": 10,
        "lengthMenu": [10,20,30]

    });

    setInterval( function () {
        table.ajax.reload();
    }, 3000 )

});