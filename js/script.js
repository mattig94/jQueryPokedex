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
		var listItem = $('<li></li>');
		var nameButton = $(
			'<button class="main-pokemon-button">' + pokemon.name + '</button>'
		);
		listItem.append(nameButton);
		$pokemonList.append(listItem);
		//open modal
		nameButton.click(function() {
			showDetails(pokemon);
		});
	}

	function showDetails(item) {
		pokemonRepository.loadDetails(item).then(function() {
			createDetails(item);
			//show the modal
			$('#modal-container').addClass('is-visible');
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
				item.types = Object.keys(details.types);
			})
			.catch(function(e) {
				console.log(e);
			});
	}

	//create modal
	function createDetails(item) {
		//variables
		var $modalContainer = $('#modal-container');
		var modal = $('<div class="modal"></div>');
		var closeButton = $('<button class="modal-close">close</button>');
		var imgElement = $(
			'<img src="' + item.imageUrl + '" alt="Picture of ' + item.name + '">'
		);
		var nameTitle = $('<h2>' + item.name + '</h2>');
		var heightElement = $('<p>Height: ' + item.height + '</p>');
		//var typeElement = $('<p></p>');

		//clear contents
		$modalContainer.empty();

		//add contents
		modal.append(closeButton);
		modal.append(imgElement);
		modal.append(nameTitle);
		modal.append(heightElement);
		//modal.append(typeElement);
		$modalContainer.append(modal);
	}

	//basic function to hide modal
	function hideModal() {
		$('#modal-container').removeClass('is-visible');
	}

	//closing modal
	$('body').click(e => {
		var target = $(e.target);
		if (target.is($('.modal-close'))) {
			hideModal();
		}
	});

	$('body').keydown(e => {
		if (e.which === 27 && $('#modal-container').hasClass('is-visible')) {
			hideModal();
		}
	});

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
