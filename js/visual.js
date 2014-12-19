$(document).ready(function() {
	d3Sankey(getSankeyData(data.categories), '#interest');
	d3Spider(data.wot.reputation, "#spider1");
	d3Spider(data.wot.safety, "#spider2");
	d3Matrix(dataMatrix(data.url), "#category");
	d3Bars(dataBars(data.url), "#malicious", 'count');
});

var CATEGORY_TITLES = {
	"News_and_Media": "News_&_Media",
	"Beauty_and_Fitness": "Beauty_&_Fitness",
	"Gambling": "Gambling",
	"Food_and_Drink": "Food_&_Drink",
	"Science": "Science",
	"Books_and_Literature": "Literature",
	"Law_and_Government": "Law_&_Govern",
	"Adult": "Adult",
	"Health": "Health",
	"People_and_Society": "People_&_Society",
	"Sports": "Sports",
	"Reference": "Reference",
	"Travel": "Travel",
	"Games": "Games",
	"Autos_and_Vehicles": "Autos_&_Vehicles",
	"Shopping": "Shopping",
	"Finance": "Finance",
	"Career_and_Education": "Education",
	"Business_and_Industry": "Business_&_Indus",
	"Computer_and_Electronics": "Computer_&_Elect",
	"Arts_and_Entertainment": "Arts_&_Entertain",
	"Internet_and_Telecom": "Internet_&_Tel",
	"Home_and_Garden": "Home_&_Garden",
	"Recreation_and_Hobbies": "Hobbies",
	"None": "Uncategorized"
}
var colors = ['#9F0251', '#0099FF', '#FF5732'];

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
	var svg = d3.select(id).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
	.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
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
		color: function(e){ return colors[e] }
	}
	RadarChart.draw(id, data, options);
}

function dataMatrix(data) {
	var result = [];
	var categories = [];
	for (c in data) {
		for (url in data[c]) {
			var e = data[c][url]
			var category = CATEGORY_TITLES[e.category];
			if (categories.indexOf(category) == -1) {
				categories.push(category);
				result.push({
					key: category,
					values: {
						world: [],
						qatar: []
					}
				})
			}
			var type = e.wsafe > 0 ? 1 : e.vsafe > 1 ? 1 : 0;
			result[categories.indexOf(category)].values[c].push({ url: url, type: type });
		}
	}
	var clean = []
	for (c in result) {
		var qcount = result[c].values.qatar.filter(function(value) { 
			return value.type == 1;
		}).length;
		var wcount = result[c].values.world.filter(function(value) { 
			return value.type == 1;
		}).length;
		if (!(qcount == 0 && wcount == 0)) {
			clean.push(result[c]);
		}
	}
	clean.sort(function(a, b) {
		return b.values.qatar.filter(function(value) {
			return value.type == 1;
		}).length - a.values.qatar.filter(function(value) {
			return value.type == 1;
		}).length;
	});
	for (c in clean) {
		clean[c].values.qatar.sort(function(a, b) {
			return b.type - a.type;
		});
		clean[c].values.world.sort(function(a, b) {
			return b.type - a.type;
		});
	}
	return clean;
}

function dataBars(data) {
	var barlist = [	'101', '103', '104', '105', '202', 
					'201', '203', '204', '205', '206', '207', '102'];
	var bardict = {};
	var total = {qatar: {count:0, reach:0}, world: {count:0, reach:0}, common: {count:0, reach:0} };
	var unsafe = {qatar: {count:0, reach:0}, world: {count:0, reach:0}, common: {count:0, reach:0} };
	for (b in barlist) {
		bardict[barlist[b]] = {qatar: {count:0, reach:0}, world: {count:0, reach:0}, common: {count:0, reach:0} };
	}
	var wv = [0, 0, 0];
	var categories = [];
	for (c in data) {
		for (url in data[c]) {
			var e = data[c][url]
			var type = e.wsafe > 0 ? 1 : e.vsafe > 1 ? 1 : 0;			
			total[c].count += 1;
			total[c].reach += e.reach;
			unsafe[c].count += type > 0 ? 1 : 0;
			unsafe[c].reach += type > 0 ? e.reach : 0;
			for (m in e.malicious){
				if (barlist.indexOf(e.malicious[m]) > -1) {
					bardict[e.malicious[m]][c].count += 1;
					bardict[e.malicious[m]][c].reach += e.reach;
				}
			}
			var n = 1;
			wv[0] += e.wsafe > 0 ? 1 : 0;
			wv[1] += e.vsafe > n ? 1 : 0;
			wv[2] += e.wsafe > 0 && e.vsafe > n ? 1 : 0;
			if (c == 'qatar' && url in data.world) {
				total.common.count += 1;
				total.common.reach += e.reach;
				unsafe.common.count += type > 0 ? 1 : 0;
				unsafe.common.reach += type > 0 ? e.reach : 0;
				for (m in e.malicious){
					if (barlist.indexOf(e.malicious[m]) > -1) {
						bardict[e.malicious[m]].common.count += 1;
						bardict[e.malicious[m]].common.reach += e.reach;
					}
				}
				wv[0] -= e.wsafe > 0 ? 1 : 0;
				wv[1] -= e.vsafe > n ? 1 : 0;
				wv[2] -= e.wsafe > 0 && e.vsafe > n ? 1 : 0;
			}
		}
	}
	var bars = [];
	for (b in barlist) {
		bars.push(bardict[barlist[b]])
	}
	return bars;
}

d3Matrix = function(data, name) {
	var barWidth = 1;
	var barHeight = 11;
	var y = d3.scale.linear().domain([0, data.length]).range([0, data.length * ((barHeight + 1) * 2 + 10)]);
	var x = d3.scale.linear().domain([0, 1]).range([0, barWidth + 1]);
	var padding = 80;
	var width = 0;
	for (c in data) {
		var ww = data[c].values.world.length * (barWidth + 1) + 5 + padding;
		var qw = data[c].values.qatar.length * (barWidth + 1) + 5 + padding;
		width = ww > width ? ww : width;
		width = qw > width ? qw : width;
	}
	var svg = d3.select(name).append("svg").attr("width", width + 50).attr("height", data.length * ((barHeight + 1) * 2 + 10) + 20).append("g");
	var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
		return d.url;
	});
	svg.call(tip);
	var category = svg.selectAll("g").data(data).enter().append("g").attr("transform", function(d, i) {
		return "translate(0," + y(i) + ")";
	});
	var qpick = category.append("g").attr("class", "g-pick").selectAll("g").data(function(d) {
		return d.values.qatar;
	}).enter().append("g").style("fill", function(d) {
		return d.type == 0 ? colors[0] : colors[2];
	}).attr("transform", function(d, i) {
		return "translate("+ (x(i) + padding) +",10)";
	}).on("click", function(d) {
		window.open('http://www.similarweb.com/website/' + d.url, '_blank');
	}).on('mouseover', tip.show).on('mouseout', tip.hide);
	qpick.append("rect").attr("height", barHeight).attr("width", barWidth);
	
	var wpick = category.append("g").attr("class", "g-pick").selectAll("g").data(function(d) {
		return d.values.world;
	}).enter().append("g").style("fill", function(d) {
		return d.type == 0 ? colors[1] : colors[2];
	}).attr("transform", function(d, i) {
		return "translate("+ (x(i) + padding) +",22)"
	}).on("click", function(d) {
		window.open('http://www.similarweb.com/website/' + d.url, '_blank');
	}).on('mouseover', tip.show).on('mouseout', tip.hide);
	wpick.append("rect").attr("height", barHeight).attr("width", barWidth);

	category.append("text").attr("class", "g-title")
	.attr("x", padding - 5).attr("y", 20).style('text-anchor', 'end')
	.text(function(d) { return d.key.split('_').join(' '); });
	
	category.append("text").attr("class", "g-number").text(function(d) {
		return d.values.qatar.filter(function(value) {
			return value.type == 1;
		}).length;
	}).attr("x", function(d) {
		var len = d.values.qatar.length * (barWidth + 1) + 5 + padding;
		// return len < 800 ? len : 790;
		return len;
	}).attr("y", 18);

	category.append("text").attr("class", "g-number").text(function(d) {
		return d.values.world.filter(function(value) {
			return value.type == 1;
		}).length;
	}).attr("x", function(d) {
		var len = d.values.world.length * (barWidth + 1) + 5 + padding;
		return len;
		// return len < 800 ? len : 790;
	}).attr("y", 32);
}

d3Bars = function(data, id, z) {
	var labels = [	'Malware', 'Phishing', 'Scam', 'Illegal', 'Privacy Risks', 
					'Unethical', 'Suspicious', 'Hate / Discrimination', 'Spam', 'Unwanted Programs', 'Ads / Pop-ups', 'Poor Customer Experience'];
	var barHeight = 20;
	var max = 0;
	for (d in data) {
		max = data[d].qatar[z] > max ? data[d].qatar[z] : max;
		max = data[d].world[z] > max ? data[d].world[z] : max;
	}
	var w = d3.scale.linear().domain([0, max]).range([0, 400]);
	var svg = d3.select(id).append("svg").attr("width", 800).attr("height", 500).append("g");
	svg.append('defs').append('pattern').attr('id', 'colorHatch').attr('patternUnits', 'userSpaceOnUse').attr('width', 4).attr('height', 4)
	.append('path').attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2').attr('stroke', '#9F0251').attr('stroke-width', 2);
	svg.append('defs').append('pattern').attr('id', 'whiteHatch').attr('patternUnits', 'userSpaceOnUse').attr('width', 4).attr('height', 4)
	.append('path').attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2').attr('stroke', '#fff').attr('stroke-width', 2);

	var bar = svg.selectAll("g").data(data).enter().append("g").attr("transform", function(d, i) {
		return "translate(0," + (i * (barHeight + 10)) + ")";
	});

	bar.append("rect").attr("height", barHeight).attr("fill", "#9F0251")
	.attr("x", function(d) { return 400 - w(d.qatar[z]) + w(d.common[z])/2 })
	.attr("width", 0).transition().attr("width", function(d) { return w(d.qatar[z]) }).duration(1000);
	
	bar.append("rect").attr("height", barHeight).attr("fill", "#0099FF")
	.attr("x", function(d) { return 400 - w(d.common[z])/2 })
	.attr("width", 0).transition().attr("width", function(d) { return w(d.world[z]) }).duration(1000);
	
	bar.append("rect").attr("height", barHeight).attr('fill', 'url(#colorHatch)')
	.attr("x", function(d) { return 400 - w(d.common[z])/2 })
	.attr("width", 0).transition().attr("width", function(d) { return w(d.common[z]) }).duration(1000);
	
	bar.append("text").attr("class", "g-title").attr("x", function(d) { return 400 - w(d.qatar[z]) + w(d.common[z])/2 - 10 })
	.attr("y", 14).style("text-anchor", "end").text(function(d) { return d.qatar[z] });
	bar.append("text").attr("class", "g-title").attr("x", function(d) { return 400 + w(d.world[z]) - w(d.common[z])/2 + 10 })
	.attr("y", 14).style("text-anchor", "start").text(function(d) { return d.world[z] });
}