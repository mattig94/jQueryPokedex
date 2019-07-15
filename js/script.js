//jQuery replaces DOM-traversal, event handling, and Ajax
//IIFE
var pokemonRepository = (function () {
	var repository = [];
	var apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

	function getAll() {
		return repository;
	}

	function add(pokemon) {
		repository.push(pokemon);
	}

	function addListItem(pokemon) {
		var $pokemonList = $('.pokemon-list');
		var listItem = $('<li></li>');
		var nameButton = $('<button class="main-pokemon-button">' + pokemon.name + '</button>');
		listItem.append(nameButton);
		$pokemonList.append(listItem);
	}

	function loadList()  {
		return $.ajax(apiUrl, {dataType: 'json'})
			.then(function(item) {
				$.each(item.results, function(index, item) {
					var pokemon = {
						name: item.name,
						detailsUrl: item.url
					};
					add(pokemon);
				});
			})
			.catch(function(e) {
				console.log(e);
			});
	}

	return {
		add: add,
		getAll: getAll,
		addListItem: addListItem,
		loadList: loadList,
	}

})();

pokemonRepository.loadList().then(function() {
	pokemonRepository.getAll().forEach(function(pokemon) {
		pokemonRepository.addListItem(pokemon);
	});
});
