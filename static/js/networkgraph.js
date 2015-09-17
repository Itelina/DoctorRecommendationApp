$(function() {
  $('a#search').bind('click', function() {
    $('#loader').show();
    $('#graphdesc').hide();
    $('#graphdemo').hide();
    $('#loader2').show();
    $('#topdocdesc').hide();
    $('#topdocdemo').hide();
    $('#grapherror').hide()

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

      var width = 650,
          height = 380;

      // clear the "canvas"
      d3.select("#network svg").remove();

      var svg = d3.select("#network").append("svg")
          .attr("width", width)
          .attr("height", height);

      var force = d3.layout.force()
          .gravity(.02)
          .distance(13)
          .charge(-2.5)
          .alpha(0.8)
          .size([width, height]);

      force
          .nodes(data.network.nodes)
          .links(data.network.links)
          .start();

      var link = svg.selectAll(".link")
          .data(data.network.links)
        .enter().append("line")
          .attr("class", "link");

      var node = svg.selectAll(".node")
          .data(data.network.nodes)
        .enter().append("g")
          .attr("class", "node")
          .attr("data-name", function(d){return d.name ;})
          .call(force.drag);

      node.append("image")
          .attr("xlink:href", function(d) { if (d.type === "referring") {return "http://static.squarespace.com/static/52803c95e4b0a13e700c5f6c/t/528d8d0ce4b05976643a6961/1385008397926/light-blue-circle.png"; } else { return "http://i34.tinypic.com/zwaxs8.png";} })
          .attr("x", -5)
          .attr("y", -5)
          .attr("class", "defaultcircle")
          .attr("width", 8)
          .attr("height", 8);

      node.append("image")
          .attr("xlink:href", "http://www.venatu.com/images/ge/red-circle.png")
          .attr("x", -9)
          .attr("y", -9)
          .attr("class", "selectedcircle")
          .attr("width", 16)
          .attr("height", 16)
          .style("display", "none");

      node.append("text")
          .attr("dx", 10)
          .attr("dy", ".5em")
          .text(function(d) { return d.name ;})
          .style("opacity", 0);

      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        d3.selectAll("g").on("mouseover", function(){d3.select(this).select("text").style("opacity", 0.75)})
          .on("mouseout", function(){d3.select(this).select("text").style("opacity", 0)});
        });

      $('#loader').hide();
      $('#legend').show();

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
      .attr("class", "doctor")
      .attr("data-target", function(d) {return d.name })
    .on("mouseover", function(){d3.select(this).style("background-color", "aliceblue")})
    .on("mouseout", function(){d3.select(this).style("background-color", "white")});


tr.append('td')
  .html(function(d) {return d.rank })
    .style("padding", "0px")
    .style('width', "5px" )
    .style("vlign" ,"middle");

tr.append('td')
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
//  .html(function(d) {return "<a href='" + d.url + "'>" + d.company + "</a>" })
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
  error: function (result) {
    $('#loader').hide();
    $('#loader2').hide();
    $('#grapherror').show();

  }
    });
  });

  $('body').on('mouseover', '.doctor', function() {
    var name = $(this).data("target");
    $('g[data-name="' + name + '"').find('text').css('opacity', 1);
  }).on('mouseout', '.doctor', function() {
    var name = $(this).data("target");
    $('g[data-name="' + name + '"').find('text').css('opacity', 0);    
  });

  $('body').on('click', '.node', function() {
    $('.node').find('.selectedcircle').hide();
    $(this).find('.selectedcircle').show();

    $('.doctor').removeClass('selectednode');
    var name = $(this).data("name");
    var $doctor = $('tr[data-target="' + name +'"');
    var $doctors = $('#doctorslist');
    $doctors.scrollTop($doctor.offset().top - $doctors.offset().top + $doctors.scrollTop());
    $doctor.addClass('selectednode');
  });
});
