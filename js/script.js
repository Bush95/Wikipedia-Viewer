var $search = $('#search');
var $search_icon = $('.search-icon');
var $search_input = $('.search-input');
var search_active_class = 'search-active';
var search_ontop_class = 'search-ontop';

var $result = $('#results');
var $loading = $('#loading');
var is_ontop = false;

var wiki_url = function (phrase) { //repleace spaces in phrase and return it with the url link to wiki
	phrase = phrase.split(' ').join('+');
	var wikilink = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + phrase + "&format=json&callback=wikiCallback";
	return wikilink;
};

var wiki_ajax_request = function () {
	$.ajax({
		url: wiki_url($search_input.val()),
		dataType: 'jsonp',
		beforeSend: function () {
			$result.fadeOut(300);
			$loading.fadeIn(300);
		},
		success: function (output) {
			//reset
			$search.removeClass(search_active_class);
			$search_input.val('');
			$loading.fadeOut(100);
			$result.html('');
			if (!is_ontop) {
				is_ontop = true;
				$search.toggleClass(search_ontop_class);
			}
			//creating doom
			var $header = $('<header></header>');
			var $h2 = $('<h2></h2>');
			$h2.addClass('result_header');
			$h2.append('Search result for &#8221;' + output[0] + '&#8221;:');
			$h2.appendTo($header);
			$header.appendTo($result);
			//adding every result
			if (output[1].length > 0) {
				for (var i = 0; i < output[1].length; i++) {
					var $a = $('<a></a>');
					var $article = $('<article></article>');
					var $header = $('<header></header>');
					var $h3 = $('<h3></h3>');
					var $p = $('<p></p>');
					$a.attr('href', output[3][i]);
					$a.addClass('wiki_result');
					$h3.append(output[1][i]);
					$p.append(output[2][i]);
					$h3.appendTo($header);
					$header.appendTo($article);
					$p.appendTo($article);
					$article.appendTo($a);
					$result.append($a);
				}
			} else {
				$result.html('No result found')
			}
			$result.fadeIn(1000);
		},
		error: function () {
			$result.html('An Error Occurred Loading This Content. Try again');
		}
	});
};

var addListeners = function () {

	$search_icon.on('click', function () {
		$search.toggleClass(search_active_class);
		$search_input.focus();
	});

	$search.on('submit', function (e) {
		e.preventDefault();
		wiki_ajax_request();
	});
};

$(document).ready(function () {
	addListeners();
});