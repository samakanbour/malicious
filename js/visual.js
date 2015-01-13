var pie;
$(document).ready(function() {
	d3Sankey(getSankeyData(data.categories), '#interest');
	d3Spider(data.wot.reputation, "#spider1");
	d3Spider(data.wot.safety, "#spider2");
	d3Matrix(dataMatrix(data.url), "#category");
	d3Bars(dataBars(data.url), "#malicious article", 'count');
	dataWord(words.qatar, "#search article", colors[0]);
	pie = new d3.pie("#subcategory", 700, 400);
	pie.change(dataPie(data.url).qatar);
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
	"People_and_Society": "Society",
	"Sports": "Sports",
	"Reference": "Reference",
	"Travel": "Travel",
	"Games": "Games",
	"Autos_and_Vehicles": "Autos_&_Vehicles",
	"Shopping": "Shopping",
	"Finance": "Finance",
	"Career_and_Education": "Education",
	"Business_and_Industry": "Business",
	"Computer_and_Electronics": "Computer",
	"Arts_and_Entertainment": "Entertainment",
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
		width = 650 - margin.left - margin.right,
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
		w: 450,
		h: 450,
		levels: 6,
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
			var type = e.wsafe > 0 ? 1 : e.vsafe > 2 ? 1 : 0;
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

function dataPie(data){
	var subs = {qatar:{}, world:{}};
	for (c in data) {
		for (url in data[c]) {
			var e = data[c][url];
			var sub = e.subcategory;
			var type = e.wsafe > 0 ? 1 : e.vsafe > 2 ? 1 : 0;
			if (type > 0) {
				if (!(sub in subs[c])) {
					subs[c][sub] = 0;
				}
				subs[c][sub] += 1
			}
		}
	}
	var result = {qatar:[], world:[]};
	for (c in subs) {
		for (s in subs[c]) {
			if (s != 'None') {
				result[c].push({label:s.replace(/_/g, ' '), value:subs[c][s]})
			}
		}
	}
	for (c in result) {
		result[c].sort(function(a, b) {
			return b.value - a.value;
		});
	}
	return result;
}

function dataBars(data) {
	var barlist = [	'vt', '101', '103', '104', '105', '202', 
					'201', '203', '204', '205', '206', '207', '102'];
	var bardict = {};
	var total = {qatar: {count:0, reach:0}, world: {count:0, reach:0}, common: {count:0, reach:0} };
	var unsafe = {qatar: {count:0, reach:0}, world: {count:0, reach:0}, common: {count:0, reach:0} };
	for (b in barlist) {
		bardict[barlist[b]] = { qatar: {count:0, reach:0}, world: {count:0, reach:0}, common: {count:0, reach:0} };
	}
	var wv = [0, 0, 0];
	var categories = [];
	var n = 2;

	for (c in data) {
		for (url in data[c]) {
			var e = data[c][url]
			var type = e.wsafe > 0 ? 1 : e.vsafe > n ? 1 : 0;		
			total[c].count += 1;
			total[c].reach += e.reach;
			unsafe[c].count += type > 0 ? 1 : 0;
			unsafe[c].reach += type > 0 ? e.reach : 0;

			bardict['vt'][c].count += e.vsafe > n ? 1 : 0;
			bardict['vt'][c].reach += e.vsafe > n ? e.reach : 0;
			for (m in e.status){
				if (barlist.indexOf(e.status[m]) > -1) {
					bardict[e.status[m]][c].count += 1;
					bardict[e.status[m]][c].reach += e.reach;
				}
			}
			
			wv[0] += e.wsafe > 0 ? 1 : 0;
			wv[1] += e.vsafe > n ? 1 : 0;
			wv[2] += e.wsafe > 0 && e.vsafe > n ? 1 : 0;
			if (c == 'qatar' && url in data.world) {
				total.common.count += 1;
				total.common.reach += e.reach;
				unsafe.common.count += type > 0 ? 1 : 0;
				unsafe.common.reach += type > 0 ? e.reach : 0;

				bardict['vt'].common.count += e.vsafe > n ? 1 : 0;
				for (m in e.status){
					if (barlist.indexOf(e.status[m]) > -1) {
						bardict[e.status[m]].common.count += 1;
					}
				}
				wv[0] -= e.wsafe > 0 ? 1 : 0;
				wv[1] -= e.vsafe > n ? 1 : 0;
				wv[2] -= e.wsafe > 0 && e.vsafe > n ? 1 : 0;
			}
		}
	}
	var agree = total.qatar.count + total.world.count - total.common.count - wv[0] - wv[1] + wv[2];
	var agreep = agree / (total.qatar.count + total.world.count - total.common.count) * 100;
	var bars = [];
	for (b in barlist) {
		bardict[barlist[b]].qatar.reach = bardict[barlist[b]].qatar.reach / total.qatar.reach;
		bardict[barlist[b]].world.reach = bardict[barlist[b]].world.reach / total.world.reach;
		bars.push(bardict[barlist[b]])
	}
	unsafe.qatar.reach = (unsafe.qatar.reach / total.qatar.reach * 100).toFixed(2);
	unsafe.world.reach = (unsafe.world.reach / total.world.reach * 100).toFixed(2);
	return { bars: bars, agree:agreep, unsafe:unsafe };
}

function dataCountries(data) {
	var countries = {qatar: {}, world:{}};
	var total = {qatar:0, world:0}
	var n = 2;

	for (c in data) {
		for (url in data[c]) {
			var e = data[c][url];
			var country = country_code[e.country];
			var type = e.wsafe > 0 ? 1 : e.vsafe > n ? 1 : 0;
			if (country && country != 'None') {
				if (!(country in countries[c])) {
					countries[c][country] = {}
					countries[c][country].count = 0
				}
				countries[c][country].count += type > 0 ? e.reach : 0;
				total[c] += e.reach;
			}
		}
	}
	for (c in countries) {
		for (country in countries[c]) {
			countries[c][country].count = (countries[c][country].count / total[c] * 100).toFixed(5);
		}
	}
	return countries;
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
	var texts = { qatar: {count:'Qatar malicious sites', reach:'Qatar users affected'}, world: {count:'World malicious sites', reach:'World users affected'} }
	$("#qatar-num").html(z == 'count'? data.unsafe.qatar[z] : data.unsafe.qatar[z] + " %");
	$("#world-num").html(z == 'count'? data.unsafe.world[z] : data.unsafe.world[z] + " %");
	$("#qatar-txt").html(texts.qatar[z]);
	$("#world-txt").html(texts.world[z]);
	$("#qwnum").html( ((data.unsafe.qatar[z] - data.unsafe.world[z]) / data.unsafe.world[z] * 100).toFixed(0) + " %");
	$("#agree").html(data.agree.toFixed(2));

	var labels = [	'Virus*', 'Malware', 'Phishing', 'Scam', 'Potentially Illegal', 'Privacy Risks', 
					'Unethical', 'Suspicious', 'Hate / Discrimination', 'Spam', 'Unwanted Programs', 
					'Ads / Pop-ups', 'Poor Customer Experience'];
	var barHeight = 20;
	var max = 0;
	for (d in data.bars) {
		max = data.bars[d].qatar[z] > max ? data.bars[d].qatar[z] : max;
		max = data.bars[d].world[z] > max ? data.bars[d].world[z] : max;
	}
	var w = d3.scale.linear().domain([0, max]).range([0, 230]);
	var svg = d3.select(id).append("svg").attr("width", 650).attr("height", data.bars.length * (barHeight + 15)).append("g");
	svg.append('defs').append('pattern').attr('id', 'colorHatch').attr('patternUnits', 'userSpaceOnUse').attr('width', 4).attr('height', 4)
	.append('path').attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2').attr('stroke', '#9F0251').attr('stroke-width', 2);
	svg.append('defs').append('pattern').attr('id', 'whiteHatch').attr('patternUnits', 'userSpaceOnUse').attr('width', 4).attr('height', 4)
	.append('path').attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2').attr('stroke', '#fff').attr('stroke-width', 2);

	var line = svg.append("line").attr("x1", 325).attr("x2", 325).attr("y1", 0).attr("y2", (data.bars.length - 1) * (barHeight + 15)).attr('stroke-width', 2);
	if (z == 'count') {
		line.attr('stroke', '#555');
	} else {
		line.attr('stroke', '#fff');
	}

	var bar = svg.selectAll("g").data(data.bars).enter().append("g").attr("transform", function(d, i) {
		return "translate(0," + (i * (barHeight + 15)) + ")";
	});

	bar.append("rect").attr("height", barHeight).attr("fill", "#9F0251").attr('stroke', '#fff').attr('stroke-width', 2)
	.attr("x", function(d) { return (-325 - w(d.common[z])/2) })
	.attr("y", -barHeight)
	.attr("transform", "rotate(180)")
	.attr("width", 0).transition().attr("width", function(d) { return w(d.qatar[z]) }).duration(1000);
	
	bar.append("rect").attr("height", barHeight).attr("fill", "#0099FF").attr('stroke', '#fff').attr('stroke-width', 2)
	.attr("x", function(d) { return 325 - w(d.common[z])/2 })
	.attr("width", 0).transition().attr("width", function(d) { return w(d.world[z]) }).duration(1000);
	
	bar.append("rect").attr("height", barHeight).attr('fill', 'url(#colorHatch)').attr('stroke', '#fff').attr('stroke-width', 2)
	.attr("x", function(d) { return 325 - w(d.common[z])/2 })
	.attr("width", 0).transition().attr("width", function(d) { return w(d.common[z]) }).duration(1000);
	
	bar.append("text").attr("class", "g-title").attr("x", function(d) { return 325 - w(d.qatar[z]) + w(d.common[z])/2 - 5 })
	.attr("y", 15).style("text-anchor", "end").text(function(d) { return z == "count" ? d.qatar[z] : (d.qatar[z] * 100).toFixed(2) });
	bar.append("text").attr("class", "g-title").attr("x", function(d) { return 325 + w(d.world[z]) - w(d.common[z])/2 + 5 })
	.attr("y", 15).style("text-anchor", "start").text(function(d) { return z == "count" ? d.world[z] : (d.world[z] * 100).toFixed(2) });

	bar.append("text").attr("class", function(d, i) { return i < 4 ? "g-title malicious" : "g-title"})
	.attr("y", 15).text(function(d, i) {
		return labels[i];
	});
}

d3WorldMap = function(countries, z) {
	$("#map").html("");
	$("#map-bars").html("");
	var max = 0;
	var bars = [];
	for (c in countries[z]) { max = countries[z][c].count > max ? countries[z][c].count : max; }
	var m = d3.scale.quantile().domain([1, max]).range([0, 1, 2, 3]);
	for (c in countries[z]) {
		countries[z][c].fillKey = countries[z][c].count > 0 ? 'malicious' + m(countries[z][c].count) : 'defaultFill';
		if (countries[z][c].count > 0) {
			bars.push({name: c, reach: countries[z][c].count});
		}
	}
	var map = new Datamap({
		element: document.getElementById("map"),
		projection: 'mercator',
		fills: {
			defaultFill: "#FF5732",
			malicious0:	'rgba(255, 255, 255, .7)',
			malicious1:	'rgba(255, 255, 255, .8)',
			malicious2:	'rgba(255, 255, 255, .9)',
			malicious3: 'rgba(255, 255, 255, 1)',
		},
		data: countries[z],
		geographyConfig: {
			popupOnHover: false, //disable the popup while hovering
			highlightOnHover: false
		}
	});

	bars.sort(function(a, b) {
		return b.reach - a.reach;
	});
	var b = d3.scale.linear().domain([0, d3.max(bars, function(d){ return d.reach })]).range([5, 100]);
	var bar = d3.select("#map-bars").append("svg").attr("width", 150).attr("height", 500)
	.append("g").selectAll("g").data(bars).enter().append("g")
	.attr("transform", function(d, i) {
		return "translate(10," + (i * 20 + 30) + ")";
	});
	bar.append("text").attr("class", "g-title").text(function(d) {
		return d.name;
	}).style("fill", "#fff");
	bar.append("line").attr("x1", 24).attr("y1", -1).attr("y2", -1).style("stroke", "#fff").attr('stroke-width', 1)
	.attr("x2", 24).transition().attr("x2", function(d) {
		return (24 + b(d.reach));
	}).duration(1000);
	bar.append("text").attr("class", "g-title").text(function(d) {
		return (+d.reach).toFixed(2);
	}).style("fill", "#fff").attr("x", function(d) {
		return (26 + b(d.reach));
	});

}

function dataWord(data, id, color){
	var max = 0;
	for (d in data) { max = data[d] > max ? data[d] : max; }
	var min = max;
	for (d in data) { min = data[d] < min ? data[d] : min; }
	var w = d3.scale.quantize().domain([min, max/15]).range([10, 12, 14, 16, 18, 20]);
	d3.layout.cloud().size([700, 700]).words(Object.keys(data).map(function(d) {
		return {
			text: d,
			size: w(data[d]),
			color: color,
			rotate: ~~(Math.random() * 5) * 30 - 60,
			cloud: id
		};
	})).fontSize(function(d) { 
		return d.size; 
	}).on("end", d3WordCloud).start();
}

d3WordCloud = function(data) {
	$(data[0].cloud).html("");
	d3.select(data[0].cloud).append("svg").attr("width", 700).attr("height", 700)
	.append("g").attr("transform", "translate(350,350)").selectAll("text").data(data).enter().append("text").style("font-size", function(d) {
		return d.size + "px";
	}).attr("text-anchor", "middle").attr("transform", function(d) {
		return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
	}).text(function(d) {
		return d.text;
	}).attr('fill', function(d){
		return d.color;
	});
}