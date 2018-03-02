$(document).ready(function() {
    $('#errMsg').hide();
    $('#fContainer,#aContainer').hide();
});

var files = [];
var dir = '';

$('#dirSubmit').click((e) => {
    dir = $('#dir').val();
    var pattern = /[a-zA-Z]:/gi;
    if (!dir) {
        $('#errMsg').show();
        $('#dir').removeAttr('value');
    } else if (!pattern.test(dir)) {
        $('#errMsg').show();
        $('#dir').removeAttr('value');
    } else {
        console.log(dir);
        $('#errMsg').hide();
        $.post('/api/search', { dir }, function(response) {
            if (response.docFile) {
                displayfiles(response.docFile);
                files = files.concat(response.docFile);
            } else
                alert("No doc file available");
        });
    }
})

$('#skillSubmit').click(() => {
    var skill = $('#skill').val();
    if (skill) {
        $.post('/api/file', { skill, files, dir }, function(response) {

        })
    }
})

function displayfiles(response) {
    $('#fContainer,#aContainer').show();
    $('#dContainer').empty();
    $.each(response, function(i, file) {
        $('#dContainer').append("<p>" + file + "</p>")
    })
}
