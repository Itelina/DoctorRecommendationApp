$(function() {
  $('a#search').bind('click', function() {
    $('#loader').show();
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
          .call(force.drag);

      node.append("image")
          .attr("xlink:href", function(d) { if (d.type === "referring") {return "http://static.squarespace.com/static/52803c95e4b0a13e700c5f6c/t/528d8d0ce4b05976643a6961/1385008397926/light-blue-circle.png"; } else { return "http://i34.tinypic.com/zwaxs8.png";} })
          .attr("x", -5)
          .attr("y", -5)
          .attr("width", 8)
          .attr("height", 8);

      node.append("text")
          .attr("dx", 10)
          .attr("dy", ".35em")
          .text(function(d) { return d.name ;})
          .style("opacity", 0);

      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        d3.selectAll("g").on("mouseover", function(){d3.select(this).select("text").style("opacity", 0.5)})
          .on("mouseout", function(){d3.select(this).select("text").style("opacity", 0)});
        });

      $('#loader').hide();

      },
  error: function (result) {}
    });
  });
});
