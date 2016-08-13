var ngAppControllers = angular.module('ngAppControllers', []);

function getScope() {
	return angular.element(('body div')).scope();
}

ngAppControllers.controller('networkController', ['$scope','$http','$routeParams', '$location', function ($scope, $http, $routeParams, $location) {

	$scope.startHelp = function() {introJs().start();};
	$scope.hover_message = "";
	$scope.player_data = {};
	$scope.top_n_val = "";
	$scope.search_player = "";
	$scope.server_returner = "";
	$scope.animation_speed = 1000;
	$scope.keyed_data = {};
	$scope.just_searched = false;
	$scope.hidesearch = $routeParams.hidesearch;
	$scope.modalwindow = $routeParams.modalwindow;
	var loc_prefix = '/tennisiq';
	if (location.hostname == 'localhost') {
		loc_prefix = '';
	}

	$scope.frame_player1 = $routeParams.player1;
	$scope.frame_player2 = $routeParams.player2;

	if (typeof $routeParams.player1=="undefined") {
		$scope.player1_compare = "Rafael Nadal";
		$scope.player1=loc_prefix+"/#/home/?player=Rafael Nadal&topn=20&ser_ret=server&hidesearch=true";
		$scope.player1_row2=loc_prefix+"/#/home/?player=Andy Murray&topn=20&ser_ret=server&hidesearch=true";
	} else {
		$scope.player1_compare = $scope.frame_player1;
		$scope.player1=loc_prefix+"/#/home/?player="+$scope.frame_player1+"&topn=20&ser_ret=server&hidesearch=true";
		$scope.player2_row2=loc_prefix+"/#/home/?player="+$scope.frame_player1+"&topn=20&ser_ret=returner&hidesearch=true";
	}
	if (typeof $routeParams.player2=="undefined") {
		$scope.player2_compare = "Andy Murray"
		$scope.player2=loc_prefix+"/#/home/?player=Andy Murray&topn=20&ser_ret=returner&hidesearch=true";
		$scope.player2_row2=loc_prefix+"/#/home/?player=Rafael Nadal&topn=20&ser_ret=returner&hidesearch=true";
	} else {
		$scope.player1_compare = $scope.frame_player2;
		$scope.player2=loc_prefix+"/#/home/?player="+$scope.frame_player2+"&topn=20&ser_ret=returner&hidesearch=true";
		$scope.player1_row2=loc_prefix+"/#/home/?player="+$scope.frame_player2+"&topn=20&ser_ret=server&hidesearch=true";
	}

	$scope.update_compare1 = function() {
		console.log($scope.player1_compare);
		$scope.frame_player1 = $scope.player1_compare;
		$scope.updateP1();
	};
	$scope.update_compare2 = function() {
		$scope.frame_player2 = $scope.player2_compare;
		$scope.updateP2();
	};

	$scope.updateP1 = function() {
		console.log($scope.frame_player1);
		$scope.player1=loc_prefix+"/#/home/?player="+$scope.frame_player1+"&topn=5&ser_ret=server&hidesearch=true";
		$scope.player2_row2=loc_prefix+"/#/home/?player="+$scope.frame_player1+"&topn=5&ser_ret=returner&hidesearch=true";
		document.getElementById('iframe1').contentWindow.location.reload(true);
		document.getElementById('iframe4').contentWindow.location.reload(true);
		document.getElementById('modal_iframe1').contentWindow.location.reload(true);
		document.getElementById('modal_iframe4').contentWindow.location.reload(true);
	};
	$scope.updateP2 = function() {
		$scope.player2=loc_prefix+"/#/home/?player="+$scope.frame_player2+"&topn=5&ser_ret=returner&hidesearch=true";
		$scope.player1_row2=loc_prefix+"/#/home/?player="+$scope.frame_player2+"&topn=5&ser_ret=server&hidesearch=true";
		document.getElementById('iframe2').contentWindow.location.reload(true);
		document.getElementById('iframe3').contentWindow.location.reload(true);
		document.getElementById('modal_iframe2').contentWindow.location.reload(true);
		document.getElementById('modal_iframe3').contentWindow.location.reload(true);
	};


	$scope.player_list = ['Novak Djokovic','Viktor Troicki','Federico Delbonis','Denis Istomin','Sam Groth','Andrey Kuznetsov','Nikoloz Basilashvili','Lukas Rosol','Dustin Brown','Thomas Fabbiano',
	'Robin Haase','Teymuraz Gabashvili','Yen-Hsun Lu','Victor Estrella Burgos','Jerzy Janowicz','Malek Jaziri','Vasek Pospisil','Grigor Dimitrov','Darian King','Guido Pella','Jack Sock','Borna Coric','Ricardas Berankis','Brian Baker','Damir Dzumhur',
	'Thanasi Kokkinakis','Denis Kudla','Mirza Basic','Jordan Thompson','Illya Marchenko','Jan-Lennard Struff','Alberto Ramos-Vinolas',
	'Juan Martin del Potro','Andy Murray','Rafael Nadal','David Ferrer','David Goffin','Roberto Bautista Agut','Pablo Cuevas','Benoit Paire',
	'Thomaz Bellucci','Rogerio Dutra Silva','Joao Sousa','Radu Albot','Paolo Lorenzi','Fabio Fognini','Gilles Muller','Jo-Wilfried Tsonga','Gael Monfils',
	'Marin Cilic','Steve Johnson','Philipp Kohlschreiber','Taro Daniel','Gilles Simon','John Millman','Yuichi Sugita','Dudi Sela','Gastao Elias',
	'Andrej Martin','Juan Monaco','Kyle Edmund','Andreas Seppi','Evgeny Donskoy','Kei Nishikori'];

	$scope.search_history = [];

  window.onload = function() {
		if (!localStorage.hasRunOnce) {
			$scope.startHelp();
		}
		localStorage.hasRunOnce = true;
	};

	$scope.visit_history = function(history_object) {
		console.log(history_object);
		$scope.search_player = history_object.player;
		$scope.top_n_val = history_object.topn;
		$scope.server_returner = history_object.ser_ret;
		$scope.just_searched = true;
		$scope.svg_loaded($scope.search_player);
	}

	d3.xml("./static/img/network.svg", "image/svg+xml", function(error, xml) {
		if (error) throw error;
		document.getElementById('network-container').appendChild(xml.documentElement);
		$scope.net = d3.select('#tennis_network');
		$scope.net.selectAll('path').transition().duration(500).style('stroke-width',0).style('stroke-opacity',1);
		$scope.net.style('opacity',0);


		if ($routeParams.ser_ret=='returner'||$routeParams.ser_ret=='server') {
			$scope.top_n_val = $routeParams.topn;
			$scope.search_player = $routeParams.player;
			$scope.server_returner = $routeParams.ser_ret;
			$scope.$apply();
			$scope.svg_loaded($scope.search_player);
		}

		$('select').material_select();
		//$scope.svg_loaded('Rafael Nadal');
	});

	$scope.svg_loaded = function(player) {

		$scope.keyed_data = {};
		$scope.net.transition().duration(1000).style('opacity',1);
		//$scope.net.selectAll('path').transition().duration(500).style('stroke-width',0).style('stroke-opacity',1);
		if (player!=$scope.player_data.player) {
				$http({
					method: 'GET',
					url: 'https://dev16788.service-now.com/api/8380/tennis_iq/heatmap/'+player
				}).then(function successCallback(response) {
					$scope.player_data = response.data.result;
					console.log($scope.player_data);
					$scope.update_network();
				}, function errorCallback(response) {
					console.log(response);
				});
		} else {
			$scope.update_network();
		}
	};

	$scope.updateHistory = function(player,topn,ser_ret) {
		if ($scope.just_searched) {
			$scope.just_searched = false;
		} else {
			var hist_obj = {};
			hist_obj.player = player;
			hist_obj.topn = topn;
			hist_obj.ser_ret = ser_ret;
			if ($scope.search_history.length==5) {
				$scope.search_history.shift();
			}
			$scope.search_history.push(hist_obj);
		}
	}

	$scope.update_network = function() {
		if ($scope.player_data.player.length==0) {
			return;
		}
		if ($scope.top_n_val.length==0) {
				return;
		}
		if ($scope.server_returner.length==0) {
				return;
		}

		$('select').material_select('destroy');
		$('select').material_select();
		$location.search('player', $scope.player_data.player);
		$location.search('topn', $scope.top_n_val);
		$location.search('ser_ret', $scope.server_returner);

		$scope.hero_img_side = {'right':'2vw'};

		$scope.updateHistory($scope.player_data.player, $scope.top_n_val, $scope.server_returner);

		var player_name_array = $scope.player_data.player.split(' ');
		var server_name = 'OPPONENT';
		var returner_name = player_name_array[player_name_array.length-1].toUpperCase();

		var this_server_stroke_color = '#EFEFEF';
		var this_returner_stroke_color = '#95C9D6';
		var this_server_sb_ser_color = '#e1e1e1';
		var this_server_sbd_ser_color = '#bfbfbf';
		var this_server_sb_ret_color = '#b0d5e1';
		var this_server_sbd_ret_color = '#5ca9c0';

		if ($scope.server_returner=='server') {
			server_name = player_name_array[player_name_array.length-1].toUpperCase();
			returner_name = 'OPPONENT';
			this_server_stroke_color = '#95C9D6';
			this_returner_stroke_color = '#EFEFEF';
			this_server_sb_ser_color = '#b0d5e1';
			this_server_sbd_ser_color = '#5ca9c0';
			this_server_sb_ret_color = '#e1e1e1';
			this_server_sbd_ret_color = '#bfbfbf';
			$scope.hero_img_side = {'right':'calc(98vw - 300px)'};
			if ($scope.hidesearch) {
				$scope.hero_img_side = {'right':'calc(100vw-125px)'};
			}
		}

		d3.select("#player_server").text(server_name);
		d3.select("#player_returner").text(returner_name);
		d3.select("#sb_ser_win").transition().duration($scope.animation_speed).style('fill',this_server_sb_ser_color);
		d3.select("#sbd_ser_win").transition().duration($scope.animation_speed).style('fill',this_server_sbd_ser_color);
		d3.select("#sb_ret_win").transition().duration($scope.animation_speed).style('fill',this_server_sb_ret_color);
		d3.select("#sbd_ret_win").transition().duration($scope.animation_speed).style('fill',this_server_sbd_ret_color);
		//e1e1e1,bfbfbf
		//b0d5e1,5ca9c0

		var this_dataset = $scope.player_data[$scope.server_returner]['top_'+$scope.top_n_val];
		for (var i = 0; i<this_dataset.length; i++) {
			var this_score = this_dataset[i]
			var this_width;
			var this_ret_width;
			if ($scope.server_returner=='server') {
				this_width = this_score.prob_win;
				this_ret_width = 1-this_score.prob_win;
			} else {
				this_width = 1-this_score.prob_win;
				this_ret_width = this_score.prob_win;
			}
			$scope.keyed_data['ser_p_'+this_score.score_self+'_'+this_score.score_oppt] = this_width;
			$scope.keyed_data['ret_p_'+this_score.score_self+'_'+this_score.score_oppt] = this_ret_width;
			$scope.keyed_data['zscore_'+this_score.score_self+'_'+this_score.score_oppt] = this_score.zscore;
			var stroke_multiplier = 30;
			var this_opacity = 1;//this_score.zscore/2;
			/* TODO: Linear color scale on circle, not stroke*/
			/* TOOD: When server is picked, 1- on reciever, and vice versa */
			//rgba(65,175,127,1)

			var this_score_bubble = $scope.net.select('#sb_'+this_score.score_self+'_'+this_score.score_oppt);
			var this_ser_stroke = $scope.net.select('#ser_'+this_score.score_self+'_'+this_score.score_oppt);
			var this_rec_stroke = $scope.net.select('#rec_'+this_score.score_self+'_'+this_score.score_oppt);

			this_rec_stroke
				.transition().duration($scope.animation_speed)//.delay(i*90)
				.style('stroke',this_returner_stroke_color)//.delay(i*15)
				.style('stroke-width',stroke_multiplier*this_ret_width).transition().duration($scope.animation_speed)
				.style('stroke-opacity',this_opacity);

			this_ser_stroke
				.transition().duration($scope.animation_speed)//.delay(i*90)
				.style('stroke',this_server_stroke_color)//.delay(i*15)
				.style('stroke-width',stroke_multiplier*this_width).transition().duration($scope.animation_speed)
				.style('stroke-opacity',this_opacity);

			this_score_bubble.attr('zscore',this_score.zscore);
			this_score_bubble.attr('probability',this_score.prob_win);
			this_score_bubble.attr('player',this_score.player);

			this_score_bubble
				.transition().duration($scope.animation_speed)
				.style('fill',$scope.zScore2Color(this_score.zscore, true));

			if (this_score.zscore==-1) {
				this_score_bubble.transition().duration($scope.animation_speed)
				.style('fill','gainsboro');
			}

			var this_zscore_key = 'ser_p_'+this_score.score_self+"_"+this_score.score_oppt;

			//TODO: Need to pass all elements into a keyed angular object that can be accessed outside of scope
			this_score_bubble
				.on('mouseover', function() {
					var player_val = getScope().player_data.player;
					var top_n_val = getScope().top_n_val;
					var prob_val = Math.floor(100*this.getAttribute('probability'));
					var zscore_val = this.getAttribute('zscore');
					var percentile_val = Math.floor(zscore_val/2*100);
					getScope().hover_anim = "animated fadeInDown";
					if (zscore_val!=-1) {
						getScope().highlight_scale(zscore_val).width = "100px";
						//getScope().highlight_scale(zscore_val).border = "solid 2px white";
						getScope().highlight_scale(zscore_val)['border-top-right-radius'] = "25px";
						getScope().highlight_scale(zscore_val)['border-bottom-right-radius'] = "25px";
						getScope().highlight_scale(zscore_val)['box-shadow'] = "0px 0px 5px white";
						//getScope().highlight_scale(zscore_val).transform = "translateY(-30px)";
					}
					if (zscore_val>1) {
						getScope().hover_message = player_val + " has a " + prob_val + "% chance of winning this point against top "+top_n_val+" ranked tennis players, which means he is in the " + percentile_val + " percentile of all players";
					} else {
						getScope().hover_message = player_val + " has a " + prob_val + "% chance of winning this point against top "+top_n_val+" ranked tennis players, which means he is in the " + percentile_val + " percentile of all players";
						//getScope().hover_message = player_val + " has a " + prob_val + "% chance of winning this point, which means he is worse than " + (100-percentile_val) + "% of the top "+top_n_val+" players";
					}
					if (zscore_val==-1) {
						getScope().hover_message = "Not enough data for this game situation";
					}
					//d3.selectAll('#'+this.id).transition().duration(200).style('r',40);
					getScope().$apply();
				});

			this_score_bubble
				.on('mouseout', function() {
					var zscore_val = this.getAttribute('zscore');
					getScope().hover_anim = "animated fadeOutUp";
					if (zscore_val!=-1) {
						getScope().highlight_scale(zscore_val).width = "25px";
						//getScope().highlight_scale(zscore_val).border = "none";
						getScope().highlight_scale(zscore_val)['box-shadow'] = "none";
						getScope().highlight_scale(zscore_val)['border-top-right-radius'] = "0";
						getScope().highlight_scale(zscore_val)['border-bottom-right-radius'] = "0";
						//getScope().highlight_scale(zscore_val).transform = "translateY(0)";
					}
					//d3.selectAll('#'+this.id).transition().duration(200).style('r',31.345188);
					getScope().$apply();
				});

		}
		$('select').material_select();
		Materialize.updateTextFields();
	};

	$scope.zScore2Color = function(zscore, use_hsv) {
		var bad_score = {
			"r":$scope.bad[0],
			"g":$scope.bad[1],
			"b":$scope.bad[2],
			"a":$scope.bad[3]
		}
		var good_score = {
			"r":$scope.good[0],
			"g":$scope.good[1],
			"b":$scope.good[2],
			"a":$scope.good[3]
		}

		var bad_hsv = rgb2hsv(parseInt(bad_score.r), parseInt(bad_score.g), parseInt(bad_score.b));
		var good_hsv = rgb2hsv(parseInt(good_score.r), parseInt(good_score.g), parseInt(good_score.b));

		var percent = zscore/2;

		var return_color = {
			"r":Math.floor(bad_score.r + percent * (good_score.r - bad_score.r)),
			"g":Math.floor(bad_score.g + percent * (good_score.g - bad_score.g)),
			"b":Math.floor(bad_score.b + percent * (good_score.b - bad_score.b))
		};
		var return_color_hsv = {
			"h":Math.floor(bad_hsv.h + percent * (good_hsv.h - bad_hsv.h)),
			"s":Math.floor(bad_hsv.s + percent * (good_hsv.s - bad_hsv.s)),
			"v":Math.floor(bad_hsv.v + percent * (good_hsv.v - bad_hsv.v))
		}
		if (use_hsv) {
			var this_rgb = HSVtoRGB(return_color_hsv.h/360, return_color_hsv.s/100, return_color_hsv.v/100);
			return $scope.rgbToHex(this_rgb.r, this_rgb.g, this_rgb.b);
		}
		return $scope.rgbToHex(return_color.r, return_color.g, return_color.b);
	};

	$scope.componentToHex = function(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	$scope.rgbToHex = function(r, g, b) {
		return "#" + $scope.componentToHex(r) + $scope.componentToHex(g) + $scope.componentToHex(b);
	}


	$('#first_name').autocomplete({
		serviceUrl: 'https://dev16788.service-now.com/api/8380/tennis_iq/playerlist',
		deferRequestBy: 300,
    transformResult: function(response) {
        return {
            suggestions: $.map(JSON.parse(response).result.suggestions, function(dataItem) {
                return { value: dataItem.value, data: dataItem.data };
            })
        };
    },
		lookupLimit:10,
		onSearchStart: function(query){$scope.loading=true},
		onSearchComplete: function(query){$scope.loading=false},
		onSelect: function (suggestion) {
			$scope.search_player = suggestion.data;
			$scope.$apply();
			$scope.svg_loaded(suggestion.data);
		},
		showNoSuggestionNotice: true,
		noSuggestionNotice: 'Sorry, no matching names'
	});

	function HSVtoRGB(h, s, v) {
	    var r, g, b, i, f, p, q, t;
	    if (arguments.length === 1) {
	        s = h.s, v = h.v, h = h.h;
	    }
	    i = Math.floor(h * 6);
	    f = h * 6 - i;
	    p = v * (1 - s);
	    q = v * (1 - f * s);
	    t = v * (1 - (1 - f) * s);
	    switch (i % 6) {
	        case 0: r = v, g = t, b = p; break;
	        case 1: r = q, g = v, b = p; break;
	        case 2: r = p, g = v, b = t; break;
	        case 3: r = p, g = q, b = v; break;
	        case 4: r = t, g = p, b = v; break;
	        case 5: r = v, g = p, b = q; break;
	    }
	    return {
	        r: Math.round(r * 255),
	        g: Math.round(g * 255),
	        b: Math.round(b * 255)
	    };
	}

	function rgb2hsv () {
	    var rr, gg, bb,
	        r = arguments[0] / 255,
	        g = arguments[1] / 255,
	        b = arguments[2] / 255,
	        h, s,
	        v = Math.max(r, g, b),
	        diff = v - Math.min(r, g, b),
	        diffc = function(c){
	            return (v - c) / 6 / diff + 1 / 2;
	        };

	    if (diff == 0) {
	        h = s = 0;
	    } else {
	        s = diff / v;
	        rr = diffc(r);
	        gg = diffc(g);
	        bb = diffc(b);

	        if (r === v) {
	            h = bb - gg;
	        }else if (g === v) {
	            h = (1 / 3) + rr - bb;
	        }else if (b === v) {
	            h = (2 / 3) + gg - rr;
	        }
	        if (h < 0) {
	            h += 1;
	        }else if (h > 1) {
	            h -= 1;
	        }
	    }
	    return {
	        h: Math.round(h * 360),
	        s: Math.round(s * 100),
	        v: Math.round(v * 100)
	    };
	}

	function hexToRgb(hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	}

	$scope.bad = [255, 91, 91,1];
	$scope.good = [112, 220, 94, 1];
	$scope.bad_color = "#FF5722";
	$scope.good_color = "#4CAF50";
	$scope.boxes = [];
	$scope.numboxes = 50;
	$scope.calcGradient = function() {
		$scope.boxes = [];
		$scope.boxes_hsv = [];

		var this_bad_color = hexToRgb($scope.bad_color);
		$scope.bad = [this_bad_color.r,this_bad_color.g,this_bad_color.b,1];
		var this_good_color = hexToRgb($scope.good_color);
		$scope.good = [this_good_color.r,this_good_color.g,this_good_color.b,1];

		for (var i = 0; i<$scope.numboxes; i++) {
			var thisScore = 2*(i/$scope.numboxes);
			var style_object = {};
			style_object["background-color"] = $scope.zScore2Color(thisScore, true);
			style_object["width"] = "25px";
			style_object["transform"] = "translateY(0)";
			$scope.boxes.push({'background-color':$scope.zScore2Color(thisScore)});
			$scope.boxes_hsv.push(style_object);
		}
	}
	$scope.calcGradient();

	$scope.highlight_scale = function(zscore) {
		if (zscore==-1) {
			return;
		}
		var scale_index = Math.floor(($scope.numboxes-1)*zscore/2);
		return $scope.boxes_hsv[scale_index];

	}

}])


ngAppControllers.controller('homeController', ['$scope','$http', '$routeParams', function($scope, $http, $routeParams) {
	//Example of a basic controller, includes ability to make HTTP requests
	$scope.player = $routeParams.player;
	$scope.loading = true;

	$scope.selectedOption = "";

	$scope.heatmap_grid = [
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0]
	];

	$http.get('https://dev13895.service-now.com/tennis_heatmaps.do')
		.success(function(data){
			$scope.players = data;
			$scope.initializeAutocomplete();
			console.log(data);
			//setTimeout(function(){ applySelect(); }, 100);
		});

	$scope.getData = function(player) {
		console.log(player);
		$scope.data = null;
		$http.get('https://dev13895.service-now.com/tennis_heatmaps.do?player=' + player)
			.success(function(data){
				$scope.data = data;

				$scope.generate_heatmap();
				$scope.heatItUp();
			});
	};

	$scope.initializeAutocomplete = function () {
		$('#autocomplete_tennis_player').autocomplete({
			lookup: $scope.players.data,
			onSearchStart: function(query){$scope.loading=true},
			onSearchComplete: function(query){$scope.loading=false},
			onSelect: function (suggestion) {
				console.log(suggestion)
			},
			showNoSuggestionNotice: true,
			noSuggestionNotice: 'Sorry, no matching names'
		});
	};

	$scope.message = "";

	$scope.mouseOver = function(data) {
		$scope.message = data;
	};

	$scope.heatItUp = function() {
		for (var i = 0; i<$scope.data.heatmap_data.length; i++) {
			var thisPoint = $scope.data.heatmap_data[i];
			var x_val = thisPoint[0];
			var y_val = thisPoint[1];
			var p_val = thisPoint[2];
			$scope.heatmap_grid[y_val][x_val] = p_val;
		}
		console.log($scope.heatmap_grid);
	}

	function applySelect() {
			$(document).ready(function() {
				$scope.$apply();
				$('select').material_select();
			});
	}


	$scope.generate_heatmap = function() {
		$('#container').highcharts({

			 chart: {
					 type: 'heatmap',
					 marginTop: 40,
					 marginBottom: 20,
					 marginRight: 150,
					 marginLeft: 150,
					 animation:true,
					 plotBorderWidth: 1
			 },


			 title: {
					 text: $scope.data.player + '\'s win probabilities in every match situation'
			 },

			 xAxis: {
					 categories: ['0','15','30','40','ADV'],
					 title: "Djokovic"
			 },

			 yAxis: {
					 categories: ['0','15','30','40','ADV'],
					 title: "null"
			 },

			 colorAxis: {
					 min: 0,
					 minColor: '#FFFFFF',
					 //minColor: Highcharts.getOptions().colors[4],
					 maxColor: Highcharts.getOptions().colors[1]
			 },

			 legend: {
					 align: 'left',
					 layout: 'vertical',
					 margin: 0,
					 verticalAlign: 'top',
					 y: 25,
					 symbolHeight: 280
			 },

			 tooltip: {
					 formatter: function () {
						 	//console.log(this.point);
							 return '<b>' + this.series.yAxis.categories[this.point.y] + ' - ' +
									 this.series.xAxis.categories[this.point.x] + '</b><br/><h3>' + Math.floor(this.point.value*100) + "%</h3> Win Probability";
					 }
			 },

			 series: [{
					 name: 'Sales per employee',
					 borderWidth: 0,
					 //data: [[0,0,0.70009738],[0,1,0.65259743],[0,2,0.66355139],[0,3,0.6388889],[1,0,0.66342139],[1,1,0.67945826],[1,2,0.67136151],[1,3,0.65591395],[2,0,0.7148847],[2,1,0.73913044],[2,2,0.68871593],[2,3,0.67375886],[3,0,0.6979472],[3,1,0.6690141],[3,2,0.68867922],[3,3,0.67987806],[3,4,0.60000002],[4,3,0.68161434]],
					 data: $scope.data.heatmap_data,
					 dataLabels: {
							 enabled: false,
							 color: '#000000'
					 }
			 }]

	 });
	}


}]);


ngAppControllers.controller('urlParamsController', ['$scope', '$routeParams', function($scope, $routeParams) {
	//Example of a basic controller, includes ability to pull route parameters ($routeParams.name defined in app.js routing configuration)
	$scope.data = $routeParams.name + " from URL parameter";
}]);
