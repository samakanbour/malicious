d3.bubble = function(data, options) {
	var tree = {name: "data", children: []}
	var groups = {}

	data.map(function(r) {
		var groupName = r.name
		groups[groupName] = true
	})

	Object.keys(groups).map(function(groupName) {
		var groupMembers = []
		data.map(function(r) {
			if (r.name !== groupName) return
			groupMembers.push({name: r.name, size: Math.max(r.qatar, r.world), qatar: r.qatar, world: r.world})
		})
		tree.children.push({name: groupName, children: groupMembers})
	})

	var format = d3.format(",d");

	function radius(r){
		var rad1 = d3.scale.linear().domain([0, 500]).range([0, 20]);
		var rad2 = d3.scale.linear().domain([500, 1000]).range([20, 40]);
		var rad3 = d3.scale.linear().domain([1000, 10000]).range([40, 60]);
		var rad4 = d3.scale.linear().domain([10000, 50000]).range([60, 80]);
		return r < 500 ? rad1(r) : r < 1000 ? rad2(r) : r < 10000 ? rad3(r) : rad4(r);
	}

	var layout = d3.layout.pack()
	    .sort(null)
	    .radius(radius)
	    .size([options.width, options.height])
	    .padding(1.5);

	var svg = d3.select(options.div).append("svg")
	    .attr("width", options.width)
	    .attr("height", options.height)
	    .attr("class", "bubble");

	var flattened = classes(tree)

	var node = svg.selectAll(".node")
	    .data(layout.nodes(flattened)
	    .filter(function(d) { return !d.children; }))
	  	.enter().append("g")
	    .attr("class", "node")
	    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	node.append("title")
	    .text(function(d) { return d.name + ": " + format(d.value); });

	node.append("circle")
		.style('opacity', 0)
		.attr('r', 0)
	    .style("fill", function(d) { return '#ff8165'; });

	node.append("text")
	    .attr("dy", ".3em")
	    .style('opacity', 0)
	    .style("fill", "#fff")
	    .style("text-anchor", "middle")
	    .text(function(d) { return d.name.substring(0, d.r / 3).split(".")[0]; });

	// Returns a flattened hierarchy containing all leaf nodes under the root.
	function classes(root) {
	  var classes = [];

	  function recurse(name, node) {
	    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
	    else classes.push({name: node.name, value: node.size, qatar: node.qatar, world: node.world});
	  }

	  recurse(null, root);
	  return {children: classes};
	}

	d3.select(self.frameElement).style("height", options.height + "px");

	this.show = function(l) {
		var o = d3.scale.linear().domain([0, 40]).range([.3, 1]);
		var circles = d3.select(options.div).selectAll('circle');
		var labels = d3.select(options.div).selectAll('text');
		circles
			.transition()
			.ease('sin')
			.duration(100)
			.delay(function(d, i) { return 2 * i; })
			.attr('r', function(d) {
				d.r = radius(d[l]);
				return d.r;
       		})
			.style('opacity', function(d) { return o(d.r) });
		
		labels
    		.transition()
        	.delay(function(d, i) { return 5 * Math.random() * data.length; })
        	.duration(100)
        	.style('opacity', function(d){
        		return d.r > 0 ? 1 : 0;
        	});
	}

	this.hide = function(){
		var circles = d3.select(options.div).selectAll('circle');
		var labels = d3.select(options.div).selectAll('text');
		circles.style('opacity', 0).attr('r', 0);
		labels.style('opacity', 0);
	}
}