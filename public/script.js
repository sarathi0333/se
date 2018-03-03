$(document).ready(function() {
    $('#errMsg').hide();
    $('#dContainer,#aContainer,#errMsgfram,#output-container').hide();

});

var files = [];
var dir = '';
// choose folder option
// $('#get_file').click(function() {
//     $('#my_file').click();
//     $('#my_file').change(() => {
//         var file    = $('#my_file');
//         var reader  = new FileReader();
//         var fileURL = reader.readAsDataURL(file);
//         console.log(fileURL);
//         $('#dir').val = fileURL;
//     })  
// });

$('#dirSubmit').click(() => {
    dir = $('#dir').val();
    var pattern = /[a-zA-Z]:/gi;
    if (!dir) {
        $('#errMsg').show();
        $('#dir').removeAttr('value');
    } 
    // else if (!pattern.test(dir)) {
    //     $('#errMsg').show();
    //     $('#dir').removeAttr('value');
    // } 
    else {
        console.log(dir);
        $('#errMsg').hide();
        $('#dirSubmit').attr("disabled", true);
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
    var patt = /\.doc$/i;
    var skill = $('#skill').val();
    console.log(skill);
    if(!skill) {
        $('#errMsgfram').show();
    }
    else if (skill) {
        $('#errMsgfram').hide();
        $('#skillSubmit').attr("disabled", true);
        $('#output-container').show();
        $('#sucTitle').append(`${skill} skill matched files:`)
        $('#failTitle').append("unmatched files")
        files.forEach((elem, index) => {
            if(patt.test(elem)) {
                $(`#fl${index}`).append('<span id = "spin'+index+'" style = "padding-left: 20px; color: green; float: right;"><i class="fas fa-spinner fa-spin"></i></span>');
                $.post('/api/file', { skill, file:elem, dir }, function(response,status) {
                    if(status == "success") {
                        $(`#spin${index}`).remove();
                        if(response.tech) {
                            $(`#fl${index}`).append('<span id = "spin'+index+'" style = "padding-left: 20px; color: green; float: right;"><i class="fas fa-check-circle"></i></span>');
                            $('#outSucFil').append(`<span style="padding:5px;"> ${response.file}, </span>`)                            
                        } else {
                            $(`#fl${index}`).append('<span id = "spin'+index+'" style = "padding-left: 20px; color: #fd7614; float: right;"><i class="fas fa-exclamation-circle"></i></span>');                            
                            $('#outFaiFil').append(`<span style="padding:5px;">${response.file}, </span>`)
                        }
                    }
                })
            }
            else if (!patt.test(elem)){
                $(`#fl${index}`).append('<span style = "padding-left: 20px; float: right; color: red;"><i class="fas fa-ban"></i></span>');
            }  
        });
    }
})

$('#reset').click(() => {
    location.reload();
})

function displayfiles(response) {
    $('#dContainer,#aContainer').show();
    $('#dContainer').empty();
    $.each(response, function(i, file) {
        $('#dContainer').append(`<p id='fl${i}'>${file}</p>`)
    })
}
