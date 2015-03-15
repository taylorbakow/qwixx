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
		if (n < 2) {
			return n;
		} 

		return n + getGamePoints(n - 1);
	}

	function getFailurePoints() {
		var nrFailures = $(".row .failure.crossed-out").size();
		var points = nrFailures * 5;
		$(".row.results .result.failures").html(points);

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
		var failures = getFailurePoints();

		var result = red + yellow + green + blue + failures;

		$(".row.results .result.finalResult").html(result);
        currentResult = result;
        storeHighscore(result);
	}

	function reset() {
		// undo reset
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

	function roll($dice) {
		$dice.removeClass("d1 d2 d3 d4 d5 d6");
		var diceNumber = 1 + Math.floor(Math.random() * 6);

		$dice.addClass("d" + diceNumber);
	}

	function rollDices() {
		$(".dice").each(function() {
			var $this = $(this);
			for (var i = 0; i < 15; i++) {
				setTimeout(function() {
					roll($this);
				}, i * 20);
			}
		});
	}
    
    function showHighscore() {
        if (supportsLocalStorage()) {
            //alert("Qwixx Highscore: " + localStorage.qwixx_highscore); 
    $( "#highscore_dialog" ).find(".highscore_value").html(localStorage.qwixx_highscore);
    $( "#highscore_dialog" ).dialog({
      modal: true,
      buttons: {
        "Reset": function() {
            localStorage.qwixx_highscore = 0;
            $( this ).dialog( "close" );
        },
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
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

	$(".field, .failure").bind("tap", function() {
		var $this = $(this);
		if (!$this.hasClass("unclickable")) {
			$(this).toggleClass("crossed-out");
			calculatePoints();	
			makeUnclickable($this);
		} 
	});
    
    function storeHighscore(newHighscore) {
if (supportsLocalStorage()) {
            if (newHighscore > localStorage.qwixx_highscore) {
                if ($(".results").hasClass("crossed-out")) {
                    localStorage.qwixx_highscore = newHighscore;
                    showHighscore(); 
                }
            }
        }
    }

	$(".result").bind("tap", function(e) {
		var $this = $(this);
		if ($this.hasClass("finalResult")) {
            var $results = $this.closest(".results");
            if (!$results.hasClass("crossed-out")) {
                $results.addClass("crossed-out");
                storeHighscore(currentResult);
            } else {
                 $results.removeClass("crossed-out");
            }
            
		} else if ($this.hasClass("failures")) {
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
    
    $(".highscore").bind("tap", function() {
        var $this = $(this);
		showHighscore();
        makeUnclickable($this);
	});

	$(".dices").bind("tap", function() {
        var $this = $(this);
		rollDices();
        makeUnclickable($this);
	});

	$(".dice").html('<div class="dot d1"></div><div class="dot d2"></div><div class="dot d3"></div>' +
					'<div class="dot d4"></div><div class="dot d5"></div><div class="dot d6"></div>' +
					'<div class="dot d7"></div><div class="dot d8"></div><div class="dot d9"></div>');
	calculatePoints();
});