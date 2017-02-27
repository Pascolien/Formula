scheduler.config.year_x = 4;
scheduler.config.year_y = 3;
scheduler.config.year_mode_name = "year";
scheduler.xy.year_top = 0;
scheduler.templates.year_date = scheduler.date
		.date_to_str(scheduler.locale.labels.year_tab + " %Y");
scheduler.templates.year_month = scheduler.date.date_to_str("%F");
scheduler.templates.year_scale_date = scheduler.date.date_to_str("%D");
scheduler.templates.year_tooltip = function(A, C, B) {
	return B.text
};
(function() {
	var F = function() {
		return scheduler._mode == scheduler.config.year_mode_name
	};
	scheduler.dblclick_dhx_month_head = function(J) {
		if (F()) {
			var I = (J.target || J.srcElement);
			if (I.parentNode.className.indexOf("dhx_before") != -1
					|| I.parentNode.className.indexOf("dhx_after") != -1) {
				return false
			}
			var K = this.templates
					.xml_date(I.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
							.getAttribute("date"));
			K.setDate(parseInt(I.innerHTML, 10));
			var H = this.date.add(K, 1, "day");
			if (!this.config.readonly && this.config.dblclick_create) {
				this.addEventNow(K.valueOf(), H.valueOf(), J)
			}
		}
	};
	var C = scheduler.changeEventId;
	scheduler.changeEventId = function() {
		C.apply(this, arguments);
		if (F()) {
			this.year_view(true)
		}
	};
	var B = scheduler.render_data;
	var G = scheduler.date.date_to_str("%Y/%m/%d");
	var E = scheduler.date.str_to_date("%Y/%m/%d");
	scheduler.render_data = function(H) {
		if (!F()) {
			return B.apply(this, arguments)
		}
		for ( var I = 0; I < H.length; I++) {
			this._year_render_event(H[I])
		}
	};
	var A = scheduler.clear_view;
	scheduler.clear_view = function() {
		if (!F()) {
			return A.apply(this, arguments)
		}
		for ( var H = 0; H < D.length; H++) {
			D[H].className = "dhx_month_head";
			D[H].setAttribute("date", "")
		}
		D = []
	};
	scheduler.hideToolTip = function() {
		if (this._tooltip) {
			this._tooltip.style.display = "none";
			this._tooltip.date = new Date(9999, 1, 1)
		}
	};
	scheduler.showToolTip = function(I, O, M, N) {
		if (this._tooltip) {
			if (this._tooltip.date.valueOf() == I.valueOf()) {
				return
			}
			this._tooltip.innerHTML = ""
		} else {
			var L = this._tooltip = document.createElement("DIV");
			L.className = "dhx_tooltip";
			document.body.appendChild(L);
			L.onclick = scheduler._click.dhx_cal_data
		}
		var H = this.getEvents(I, this.date.add(I, 1, "day"));
		var K = "";
		for ( var J = 0; J < H.length; J++) {
			K += "<div class='dhx_tooltip_line' event_id='" + H[J].id + "'>";
			K += "<div class='dhx_tooltip_date'>"
					+ (H[J]._timed ? this.templates.event_date(H[J].start_date)
							: "") + "</div>";
			K += "<div class='dhx_event_icon icon_details'>&nbsp;</div>";
			K += this.templates.year_tooltip(H[J].start_date, H[J].end_date,
					H[J])
					+ "</div>"
		}
		this._tooltip.style.display = "";
		this._tooltip.style.top = "0px";
		if (document.body.offsetWidth - O.left - this._tooltip.offsetWidth < 0) {
			this._tooltip.style.left = O.left - this._tooltip.offsetWidth
					+ "px"
		} else {
			this._tooltip.style.left = O.left + N.offsetWidth + "px"
		}
		this._tooltip.date = I;
		this._tooltip.innerHTML = K;
		if (document.body.offsetHeight - O.top - this._tooltip.offsetHeight < 0) {
			this._tooltip.style.top = O.top - this._tooltip.offsetHeight
					+ N.offsetHeight + "px"
		} else {
			this._tooltip.style.top = O.top + "px"
		}
	};
	scheduler._init_year_tooltip = function() {
		dhtmlxEvent(scheduler._els.dhx_cal_data[0], "mouseover", function(H) {
			if (!F()) {
				return
			}
			var H = H || event;
			var I = H.target || H.srcElement;
			if ((I.className || "").indexOf("dhx_year_event") != -1) {
				scheduler.showToolTip(E(I.getAttribute("date")), getOffset(I),
						H, I)
			} else {
				scheduler.hideToolTip()
			}
		});
		this._init_year_tooltip = function() {
		}
	};
	scheduler.attachEvent("onSchedulerResize", function() {
		if (F()) {
			this.year_view(true);
			return false
		}
		return true
	});
	scheduler._get_year_cell = function(J) {
		var H = J.getMonth() + 12
				* (J.getFullYear() - this._min_date.getFullYear())
				- this.week_starts._month;
		var I = this._els.dhx_cal_data[0].childNodes[H];
		var J = this.week_starts[H] + J.getDate() - 1;
		return I.childNodes[2].firstChild.rows[Math.floor(J / 7)].cells[J % 7].firstChild
	};
	var D = [];
	scheduler._mark_year_date = function(H) {
		var I = this._get_year_cell(H);
		I.className = "dhx_month_head dhx_year_event";
		I.setAttribute("date", G(H));
		D.push(I)
	};
	scheduler._unmark_year_date = function(H) {
		this._get_year_cell(H).className = "dhx_month_head"
	};
	scheduler._year_render_event = function(H) {
		var I = H.start_date;
		if (I.valueOf() < this._min_date.valueOf()) {
			I = this._min_date
		} else {
			I = this.date.date_part(new Date(I))
		}
		while (I < H.end_date) {
			this._mark_year_date(I);
			I = this.date.add(I, 1, "day");
			if (I.valueOf() >= this._max_date.valueOf()) {
				return
			}
		}
	};
	scheduler.year_view = function(I) {
		if (I) {
			var H = scheduler.xy.scale_height;
			scheduler.xy.scale_height = -1
		}
		scheduler._els.dhx_cal_header[0].style.display = I ? "none" : "";
		scheduler.set_sizes();
		if (I) {
			scheduler.xy.scale_height = H
		}
		scheduler._table_view = I;
		if (this._load_mode && this._load()) {
			return
		}
		if (I) {
			scheduler._init_year_tooltip();
			scheduler._reset_year_scale();
			scheduler.render_view_data()
		} else {
			scheduler.hideToolTip()
		}
	};
	scheduler._reset_year_scale = function() {
		this._cols = [];
		this._colsS = {};
		var R = [];
		var Y = this._els.dhx_cal_data[0];
		var W = this.config;
		Y.innerHTML = "";
		var L = Math.floor(parseInt(Y.style.width) / W.year_x);
		var K = Math.floor((parseInt(Y.style.height) - scheduler.xy.year_top)
				/ W.year_y);
		if (K < 190) {
			K = 190;
			L = Math
					.floor((parseInt(Y.style.width) - scheduler.xy.scroll_width)
							/ W.year_x)
		}
		var P = L - 11;
		var I = 0;
		var J = document.createElement("div");
		var Z = this.date.week_start(new Date());
		for ( var U = 0; U < 7; U++) {
			this._cols[U] = Math.floor(P / (7 - U));
			this._render_x_header(U, I, Z, J);
			Z = this.date.add(Z, 1, "day");
			P -= this._cols[U];
			I += this._cols[U]
		}
		J.lastChild.className += " dhx_scale_bar_last";
		var H = this.date[this._mode + "_start"](this.date.copy(this._date));
		var Q = H;
		for ( var U = 0; U < W.year_y; U++) {
			for ( var T = 0; T < W.year_x; T++) {
				var V = document.createElement("DIV");
				V.style.cssText = "position:absolute";
				
				V.setAttribute("date", this.templates.xml_format(H));
				V.innerHTML = "<div class='dhx_year_month'></div><div class='dhx_year_week'>"
						+ J.innerHTML
						+ "</div><div class='dhx_year_body'></div>";
				V.childNodes[0].innerHTML = this.templates.year_month(H);
				var X = this.date.week_start(H);
				this._reset_month_scale(V.childNodes[2], H, X);
				var O = V.childNodes[2].firstChild.rows;
				for ( var S = O.length; S < 6; S++) {
					O[0].parentNode.appendChild(O[0].cloneNode(true));
					for ( var N = 0; N < O[S].childNodes.length; N++) {
						O[S].childNodes[N].className = "dhx_after"
					}
				}
				Y.appendChild(V);
				var M = Math.round((K - 190) / 2);
				V.style.marginTop = M + "px";
				this.set_xy(V, L - 10, K - M - 10, L * T + 5, K * U + 5
						+ scheduler.xy.year_top);
				R[U * W.year_x + T] = (H.getDay()
						- (this.config.start_on_monday ? 1 : 0) + 7) % 7;
				H = this.date.add(H, 1, "month")
			}
		}
		this._els.dhx_cal_date[0].innerHTML = this.templates[this._mode
				+ "_date"](Q, H, this._mode);
		this.week_starts = R;
		R._month = Q.getMonth();
		this._min_date = Q;
		this._max_date = H
	}
})();