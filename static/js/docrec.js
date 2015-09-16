$(function() {
  $('a#search').bind('click', function() {
    $('#loader2').show();
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

// clear the "canvas"
d3.select("#doctorslist table").remove();

var table = d3.select("#doctorslist")
	.append("table")
	.attr('id', 'doctors')
    .style("border-collapse", "collapse")
    .style("width", "100%")
    .style("table-layout", "fixed");

var tr = table.selectAll("a")
    .data(data.topdocs.output)
    .enter()
    .append("a")
       .attr("href", function(d) { return d.url })
       .style("display", "block")
       .style("width", "100%")
    .append("tr")
      .style("display", "block")
      .style("width", "100%")
    .on("mouseover", function(){d3.select(this).style("background-color", "aliceblue")})
    .on("mouseout", function(){d3.select(this).style("background-color", "white")});


tr.append('td')
//  .html(function(d) {return "<a href='" + d.url + "'>" + d.company + "</a>" })
  .append("img")
    .attr("src","../static/pics/doctoricon4.png")
    .attr("alt", "doctors")
    .attr("style", "width:30px;height:30px;")
    .style("vertical-align", "text-top");

// tr.append('td')
//   .html(function(d) {return d.rank })
//     .style("padding", "10px")
//     .style('width', "5%" )
//     .style("vlign" ,"middle");

tr.append('td')
//	.html(function(d) {return "<a href='" + d.url + "'>" + d.company + "</a>" })
	.html(function(d) {return d.name })
    .style("padding", "10px")
    .style('width', "20%" )
    .style("vlign" ,"middle");

tr.append('td')
	.html(function(d) {return d.specialty})
    .style("padding", "10px")
    .style('width', "45%" )
    .style("vlign" ,"middle");

tr.append('td')
	.html(function(d) {return d.add })
    .style("padding", "10px")
    .style('width', "30%" )
    .style("vlign" ,"top");

$('#loader2').hide();

},
  error: function (result) {}
    });
  });
});