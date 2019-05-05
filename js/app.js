$(function() {
    
    var currentResult = 0,
	   lastWrapperClasses = "wrapper";

    function supportsSvg() {
        return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
    }
    
    function supportsLocalStorage() {
        return (typeof(localStorage) !== "undefined");
    }
    
    if (supportsSvg()) {
        $("#svgResetImg").attr("src", $("#svgResetImg").attr("xlink:href"));
    }
    
    if (!supportsLocalStorage()) {
        $("body").addClass("noLocalStorage");
    } else {
        if (!localStorage.qwixx_highscore) {
            localStorage.qwixx_highscore = 0;
        }
    }
    
    
    
	function writeNumbers(color, asc) {
		var jqueryColorFinder = ".row" + color + " .border";
		for (var i = 2; i<=12; i++) {
			if (asc) {
				$(jqueryColorFinder).append("<div class=\"field\">" + i + "<div class=\"cross\">X</div></div>");
			} else {
				$(jqueryColorFinder).append("<div class=\"field\">" + (14 - i) + "<div class=\"cross\">X</div></div>");
			}
		}
		$(jqueryColorFinder).append("<div class=\"field last-field\"><div class=\"cross\">X</div></div>");
	}

	function getGamePoints(n) {
		console.log(n);
		if (n < 2) {
			return n;
		} 
		return n + getGamePoints(n - 1);
	}

	function getscratchPoints() {
		var nrscratchs = $(".row .scratch.crossed-out").size();
		var points = nrscratchs * 5;
		$(".row.results .result.scratchs").html(points);

		return points * (-1);
	}

	function calculatePointsFor(color) {
		var jqueryColorFinder = ".row" + color + " .field.crossed-out";
		var points = getGamePoints($(jqueryColorFinder).size());
		jqueryColorFinder = ".row.results .result" + color;
		$(jqueryColorFinder).html(points);

		return points;
	}

	function calculatePoints() {
		var red = calculatePointsFor(".red");	
		var yellow = calculatePointsFor(".yellow");	
		var green = calculatePointsFor(".green");	
		var blue = calculatePointsFor(".blue");	
		var scratchs = getscratchPoints();

		var result = red + yellow + green + blue + scratchs;

		$(".row.results .result.finalResult").html(result);
        currentResult = result;
	}

	function reset() {
		if ($(".crossed-out").size() === 0) {
			$(".cross-removed").addClass("crossed-out").removeClass("cross-removed");	
			$(".finished-removed").addClass("finished").removeClass("finished-removed");	
			$(".wrapper").attr("class", lastWrapperClasses);
		} else {
			$(".cross-removed").removeClass("cross-removed");
			$(".crossed-out").addClass("cross-removed").removeClass("crossed-out");	
			console.log($(".wrapper").attr("class"));
			lastWrapperClasses = $(".wrapper").attr("class");
			$(".wrapper").attr("class", "wrapper");
		}
	}

	writeNumbers(".red", true);
	writeNumbers(".yellow", true);
	writeNumbers(".green", false);
	writeNumbers(".blue", false);

	function makeUnclickable($item) {
		$item.addClass("unclickable");
		setTimeout(function() {
			$item.removeClass("unclickable");
		}, 350);
	}

	$(".field, .scratch").bind("tap", function() {
		var $this = $(this);
		if (!$this.hasClass("unclickable")) {
			$(this).toggleClass("crossed-out");
			calculatePoints();	
			makeUnclickable($this);
		} 
	});

	$(".result").bind("tap", function(e) {
		var $this = $(this);
		if ($this.hasClass("finalResult")) {
            var $results = $this.closest(".results");
            if (!$results.hasClass("crossed-out")) {
                $results.addClass("crossed-out");
            } else {
                 $results.removeClass("crossed-out");
            }
            
		} else if ($this.hasClass("scratchs")) {
			$this.toggleClass("crossed-out");
        } else {
			if ($this.hasClass("red")) {
				$(".wrapper").toggleClass("red-finished");
			}
			if ($this.hasClass("green")) {
				$(".wrapper").toggleClass("green-finished");
			}
			if ($this.hasClass("yellow")) {
				$(".wrapper").toggleClass("yellow-finished");
			}
			if ($this.hasClass("blue")) {
				$(".wrapper").toggleClass("blue-finished");
			}
		}
        makeUnclickable($this);
	});

	$(".reset").bind("tap", function() {
        var $this = $(this);
		reset();
        makeUnclickable($this);
	});
    
	calculatePoints();
});