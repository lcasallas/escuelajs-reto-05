window.localStorage.clear();
const $app = document.getElementById("app");
const $observe = document.getElementById("observe");
const API = "https://rickandmortyapi.com/api/character/";
var storage = window.localStorage;

const getData = api => {
	fetch(api)
		.then(response => response.json())
		.then(response => {
			const characters = response.results;
			const nextPage = response.info.next;

			storage.setItem("next_fetch", nextPage);

			let output = characters
				.map(character => {
					return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `;
				})
				.join("");
			let newItem = document.createElement("section");
			newItem.classList.add("Items");
			newItem.innerHTML = output;
			$app.appendChild(newItem);
		})
		.catch(error => console.log(error));
};

const loadData = async () => {
	const apinext = storage.getItem("next_fetch");
	const api = apinext !== null ? apinext : API;

	if (api === "") {
		$observe.innerHTML = "<h2> Ya no hay mas personajes...</h2>";
		intersectionObserver.unobserve($observe);
	} else {
		await getData(api);
	}
};

const intersectionObserver = new IntersectionObserver(
	entries => {
		if (entries[0].isIntersecting) {
			loadData();
		}
	},
	{
		rootMargin: "0px 0px 100% 0px"
	}
);

intersectionObserver.observe($observe);
