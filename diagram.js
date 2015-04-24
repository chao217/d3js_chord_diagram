var country = [ "Algeria" , "Argentina" , "Belgium" , "Brazil" ,
 "Chile" , "Colombia" , "Costa Rica" , "France" ,
 "Germany" , "Greece" , "Mexico" , "Netherlands" ,
 "Nigeria" , "Switzerland" , "United States" , "Uruguay"  ];
		
var score = [
  [ 0, 0, 0, 0, 	0, 0, 0, 0, 	1, 0, 0, 0, 	0, 0, 0, 0 ],
  [ 0, 0, 1, 0, 	0, 0, 0, 0, 	0, 0, 0, 4, 	0, 1, 0, 0 ],
  [ 0, 0, 0, 0, 	0, 0, 0, 0, 	0, 0, 0, 0, 	0, 0, 2, 0 ],
  [ 0, 0, 0, 0, 	3, 2, 0, 0, 	1, 0, 0, 0, 	0, 0, 0, 0 ],

  [ 0, 0, 0, 2, 	0, 0, 0, 0, 	0, 0, 0, 0, 	0, 0, 0, 0 ],
  [ 0, 0, 0, 1, 	0, 0, 0, 0, 	0, 0, 0, 0, 	0, 0, 0, 2 ],
  [ 0, 0, 0, 0, 	0, 0, 0, 0, 	0, 5, 0, 3, 	0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 	0, 0, 0, 0, 	0, 0, 0, 0, 	2, 0, 0, 0 ],

  [ 2, 1, 0, 7, 	0, 0, 0, 1, 	0, 0, 0, 0, 	0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 	0, 0, 3, 0, 	0, 0, 0, 0, 	0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 	0, 0, 0, 0, 	0, 0, 0, 1, 	0, 0, 0, 0 ],
  [ 0, 2, 0, 3, 	0, 0, 4, 0, 	0, 0, 2, 0, 	0, 0, 0, 0 ],
  
  [ 0, 0, 0, 0, 	0, 0, 0, 0, 	0, 0, 0, 0, 	0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 	0, 0, 0, 0, 	0, 0, 0, 0, 	0, 0, 0, 0 ],
  [ 0, 0, 1, 0, 	0, 0, 0, 0, 	0, 0, 0, 0, 	0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 	0, 0, 0, 0, 	0, 0, 0, 0, 	0, 0, 0, 0 ],
];
		
var chord_layout = d3.layout.chord()
	.padding(0.03)
	.sortSubgroups(d3.descending)
	.matrix(score);
					 
console.log(chord_layout.groups());
console.log(chord_layout.chords());
		
var width  = 800;
var height = 800;
var innerRadius = width/2 * 0.7;
var outerRadius = innerRadius * 1.1;

var color20 = d3.scale.category20();

var svg = d3.select("#diagram").append("svg")
	.attr("width", width)
	.attr("height", height)
	.append("g")
	.attr("transform", "translate(" + width/2 + "," + height/2 + ")");

var outer_arc =  d3.svg.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius);
		
var g_outer = svg.append("g");
		
g_outer.selectAll("path")
	.data(chord_layout.groups)
	.enter()
	.append("path")
	.style("fill", function(d) { return color20(d.index); })
	.style("stroke", function(d) { return color20(d.index); })
	.attr("d", outer_arc );
			
g_outer.selectAll("text")
	.data(chord_layout.groups)
	.enter()
	.append("text")
	.each( function(d,i){ 
		d.angle = (d.startAngle + d.endAngle) / 2; 
		d.name = country[i];
	})
	.attr("dy",".35em")
	.attr("transform", function(d){
		return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + outerRadius + ",0)" + ( (d.angle > Math.PI) ? "rotate(180)translate(-90)" : "translate(40)");
	})
	.text(function(d){
		return d.name;
	});
				
var inner_chord =  d3.svg.chord()
	.radius(innerRadius);
		
svg.append("g")
	.attr("class", "chord")
	.selectAll("path")
	.data(chord_layout.chords)
	.enter()
	.append("path")
	.attr("d", inner_chord )
	.style("fill", function(d) { return color20(d.source.index); })
	.style("opacity", 1)
	.on("mouseover",function(d,i){
		d3.select(this)
			.style("fill","yellow");
	})
	.on("mouseout",function(d,i) { 
		d3.select(this)
			.transition()
			.duration(1000)
			.style("fill",color20(d.source.index));
	});
			
function groupTicks(d) {
	var k = (d.endAngle - d.startAngle) / d.value;
	console.log(k);
	return d3.range(0, d.value, 1).
		map(function(v, i) {
		return {
			angle: v * k
			+ d.startAngle,
			label: i % 5 ? null : v + "k"
		};
	});
}
var ticks = svg.append("g").selectAll("g")
	.data(chord_layout.groups)
	.enter().append("g").selectAll("g")
	.data(groupTicks)
	.enter().append("g")
	.attr("transform", function(d) {
		return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
				+ "translate(" + outerRadius + ",0)";
	});

ticks.append("line")
	.attr("x1", 1)
	.attr("y1", 0)
	.attr("x2", 5)
	.attr("y2", 0)
	.style("stroke", "#000");
