$(document).ready(function() {
	d3Sankey(getSankeyData(data.categories), '#interest');
	d3Spider(data.wot.reputation, "#spider1");
	d3Spider(data.wot.safety, "#spider2");
});

d3Sankey = function (data, id) {
	var margin = {
			top: 1,
			right: 1,
			bottom: 1,
			left: 1
		},
		width = 800 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;
	var max = 0;
	for (d in data.nodes) { max = data.nodes[d].rank > max ? data.nodes[d].rank : max; }
	var min = max;
	for (d in data.nodes) { min = data.nodes[d].rank < min ? data.nodes[d].rank : min; }
	var range = [];
	for (i = 0; i < height - 10; i+= 12){
		range.push(i);
	}
	var y = d3.scale.quantize().domain([min, max - 200]).range(range);
	var color = d3.scale.category20();
	var svg = d3.select(id).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var sankey = d3.sankey().nodeWidth(5).nodePadding(10).size([width, height]);
	var path = sankey.link();
	sankey.nodes(data.nodes).links(data.links).layout(32);
	var link = svg.append("g").selectAll(".link").data(data.links).enter().append("path").attr("class", "link")
	.attr("d", path).style("stroke-width", function(d) {
		return Math.max(1, d.dy);
	}).sort(function(a, b) {
		return b.dy - a.dy;
	});
	var ypos = {};
	var ytak = {};
	var node = svg.append("g").selectAll(".node").data(data.nodes).enter().append("g").attr("class", "node").attr("transform", function(d) {
		if (!(d.x in ypos)) {
			ypos[d.x] = [];
			ytak[d.x] = [];
		}
		d.y = y(d.rank);
		if (ypos[d.x].indexOf(d.y) > 0) {
			d.y += 12;
		}
		ypos[d.x].push(d.y);
		return "translate(" + d.x + "," + d.y + ")";
	});
	node.append("rect").attr("height", function(d) {
			return d.dy;
		}).attr("width", sankey.nodeWidth()).style("fill", function(d) {
			return d.color = color(d.name.replace(/ .*/, ""));
		});
	node.append("text").attr("x", -6).attr("y", function(d) {
		return d.dy / 2;
	}).attr("dy", ".35em").attr("text-anchor", "end").attr("transform", null)
	.text(function(d) {
		if (ytak[d.x].indexOf(d.y) == -1) {
			ytak[d.x].push(d.y);
			return d.name;
		}
		ytak[d.x].push(d.y);
		return '';		
	}).filter(function(d) {
		return d.x < width / 2;
	}).attr("x", 6 + sankey.nodeWidth()).attr("text-anchor", "start");
	
	sankey.relayout();
    link.attr("d", path);
}

function getSankeyData(types) {
	var qranks = [];
	var granks = [];
	for (type in types) {
		qranks.push(types[type].qrank);
		granks.push(types[type].wrank);
	}
	qranks.sort(function(a, b) {
		return a - b
	});
	granks.sort(function(a, b) {
		return a - b
	});
	for (type in types) {
		var qrank = types[type].qrank;
		types[type].qr = qranks.indexOf(qrank) + 1;
		var wrank = types[type].wrank;
		types[type].wr = granks.indexOf(wrank) + 1;
	}
	var nodes = [];
	var links = [];
	for (type in types) {
		nodes.push({}, {});
	}
	for (type in types) {
		var source = (types[type].wr - 1) * 2;
		var target = (types[type].qr - 1) * 2 + 1;
		nodes[source] = {
			"name": type.split('_').join(' '),
			"rank": Math.round(types[type].qrank)
		};
		nodes[target] = {
			"name": type.split('_').join(' '),
			"rank": Math.round(types[type].wrank)
		};
		links.push({
			"source": source,
			"target": target,
			"value": 1
		});
	}
	return {
		"nodes": nodes,
		"links": links
	};
}

d3Spider = function (data, id) {
	var options = {
		w: 500,
		h: 500,
		maxValue: .8,
		levels: 5,
		ExtraWidthX: 300,
		color: function(e){ return ['#9F0251', '#0099FF'][e] }
	}
	RadarChart.draw(id, data, options);
}