jQuery(document).ready(function() {

    $('.table-hover tr').click(function() {
        href = $(this).attr('href');
        // alert(window.location.host + href);

        window.location.href = href;
    });

});