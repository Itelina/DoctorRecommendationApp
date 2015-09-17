$(function() {
  $('a#search').bind('click', function() {
    $('#loader2').show();
    $('#topdocdesc').hide();
    $('#topdocdemo').hide();
    $.ajax({
         type: "POST",
         contentType: "application/json; charset=utf-8",
         url: "/networkapi",
         dataType: "json",
         async: true,
         data: JSON.stringify({
            city: $('#tags').val(),
            type1: $('select[name="type"] option:selected').val(),
            class1: $('select[name="classification"] option:selected').val(),
            spec1: $('select[name="specialization"] option:selected').val(),
            type2: $('select[name="type2"] option:selected').val(),
            class2: $('select[name="classification2"] option:selected').val(),
            spec2: $('select[name="specialization2"] option:selected').val()
          }),
         success:function (data) {



},
  error: function (result) {

  }
    });
  });
});