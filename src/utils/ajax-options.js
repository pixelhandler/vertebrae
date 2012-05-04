// Ajax options
// ------------
// useful for adding jQuery.ajax options to a (model/collection) fetch call

define(function() {

    var options;

    options = {
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-encoding", "gzip, deflate");
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
        }
    };

    return options;
});
