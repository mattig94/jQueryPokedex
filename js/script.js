//jQuery replaces DOM-traversal, event handling, and Ajax
//IIFE
var pokemonRepository = (function() {
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
		var nameButton = $(
			'<button type="button" class="main-pokemon-button btn btn-info list-group-item list-group-item-action text-capitalize" data-toggle="modal" data-target="#pokemon-details">' +
				pokemon.name +
				'</button>'
		);
		$pokemonList.append(nameButton);
		//open modal
		nameButton.click(function() {
			showDetails(pokemon);
		});
	}

	function showDetails(item) {
		pokemonRepository.loadDetails(item).then(function() {
			createDetails(item);
		});
	}

	function loadList() {
		return $.ajax(apiUrl, { dataType: 'json' })
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

	function loadDetails(item) {
		var url = item.detailsUrl;
		return $.ajax(url, { dataType: 'json' })
			.then(function(details) {
				//add details to the item
				item.imageUrl = details.sprites.front_default;
				item.height = details.height;
				item.weight = details.weight;
			})
			.catch(function(e) {
				console.log(e);
			});
	}

	//create modal
	function createDetails(item) {
		//variables
		var $modalBody = $('.modal-body');
		var modal = $('<div></div>');
		var imgElement = $(
			'<img src="' + item.imageUrl + '" alt="Picture of ' + item.name + '">'
		);
		var nameTitle = $('<h2 class="text-capitalize">' + item.name + '</h2>');
		var heightElement = $('<p>Height: ' + item.height / 10 + ' meters</p>');
		var weightElement = $('<p>Weight: ' + item.weight / 10 + ' kilograms</p>');

		//clear contents
		$modalBody.empty();

		//add contents
		modal.append(imgElement);
		modal.append(nameTitle);
		modal.append(heightElement);
		modal.append(weightElement);
		$modalBody.append(modal);
	}

	return {
		add: add,
		getAll: getAll,
		addListItem: addListItem,
		loadList: loadList,
		loadDetails: loadDetails
	};
})();

pokemonRepository.loadList().then(function() {
	pokemonRepository.getAll().forEach(function(pokemon) {
		pokemonRepository.addListItem(pokemon);
	});
});
