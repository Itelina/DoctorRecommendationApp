$(function() {
    var availableTags = cities.cities;
    $( "#tags" ).autocomplete({
      source: availableTags
    });
  });