d3.pie = function(id, width, height) {
	var svg = d3.select(id).append("svg").append("g")
	svg.append("g").attr("class", "slices");
	svg.append("g").attr("class", "labels");
	svg.append("g").attr("class", "lines");
	var radius = Math.min(width, height) / 2;
	var pie = d3.layout.pie().sort(null).value(function(d) {
		return d.value;
	});
	var arc = d3.svg.arc().outerRadius(radius * 0.8).innerRadius(radius * 0.4);
	var outerArc = d3.svg.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);
	svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	var key = function(d) {
		return d.data.label;
	};

	this.change = function(data) {
		var op = d3.scale.linear().domain([0, d3.max(data, function(d){ return d.value })]).range([0, 1]);

		/* ------- PIE SLICES -------*/
		var slice = svg.select(".slices").selectAll("path.slice").data(pie(data), key);
		slice.enter().insert("path")
		.style("fill", "#FF5732").attr('stroke', '#fff').attr('stroke-width', 1)
		.attr("class", "slice");
		slice.transition().duration(800).attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		}).styleTween("fill-opacity", function(d) {
			return function(t) {
				return op(d.data.value);
			};
		});
		slice.exit().remove();

		/* ------- TEXT LABELS -------*/
		var text = svg.select(".labels").selectAll("text").data(pie(data), key);
		text.enter().append("text").attr("dy", ".35em").text(function(d) {
			return d.data.label;
		});

		function midAngle(d) {
			return d.startAngle + (d.endAngle - d.startAngle) / 2;
		}
		text.transition().duration(800).attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate(" + pos + ")";
			};
		}).styleTween("text-anchor", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start" : "end";
			};
		}).styleTween("fill-opacity", function(d) {
			return function(t) {
				return op(d.data.value) < .06 ? 0 : 1;
			}
		});
		text.exit().remove();

		/* ------- SLICE TO TEXT POLYLINES -------*/
		var polyline = svg.select(".lines").selectAll("polyline").data(pie(data), key);
		polyline.enter().append("polyline");
		polyline.transition().duration(800).attrTween("points", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};
		}).styleTween("opacity", function(d) {
			return function(t) {
				return op(d.data.value) < .06 ? 0 : .3;
			}
		});
		polyline.exit().remove();
	}
}