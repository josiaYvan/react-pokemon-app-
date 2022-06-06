// import Pokemon from "../models/pokemon";
// // CRUD

// export default class PokemonService {
//   static getPokemons(): Promise<Pokemon[]> {
//     //recupere les pokemons par une promesse de type pokemon[]
//     return fetch("http://localhost:3001/pokemons")
//       .then((response) => response.json())
//       .catch((error) => this.handleError(error));
//   }

//   static getPokemon(id: number): Promise<Pokemon | null> {
//     //recupere un seul pokemon via son id et renvoie un pokemon ou une valeur de type null si l'api n'a pas l'id.
//     return fetch(`http://localhost:3001/pokemons/${id}`)
//       .then((response) => response.json())
//       .then((data) => (this.isEmpty(data) ? null : data))
//       .catch((error) => this.handleError(error)); //permet de recuperer les erreurs
//   }

//   static isEmpty(data: Object): boolean {
//     //pour savoir si on return pokmeon ou null
//     return Object.keys(data).length === 0; //verifie si la valeur de l'objet retourne un pokemon ou un null
//   }

//   static handleError(error: Error): void {
//     console.log(error); //afficher only dans le consol l' erreur
//   }

//   //save les modification
//   //put persister pour modifier l'api
//   static updatePokemon(pokemon: Pokemon): Promise<Pokemon> {
//     return fetch(`http://localhost:3001/pokemons/${pokemon.id}`, {
//       method: "PUT", //definir le type de requette
//       body: JSON.stringify(pokemon), // JSON.stringify(objetParams) : ceci transforme un objet en string en parallele
//       headers: { "Content-Type": "application/json" },
//     }) //entete de la requette, pour preciser qu'il s'agit de donnee au format json
//       .then((response) => response.json())
//       .catch((error) => this.handleError(error));
//   }
//   static deletePokemon(pokemon: Pokemon): Promise<{}> {
//     return fetch(`http://localhost:3001/pokemons/${pokemon.id}`, {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//     })
//       .then((response) => response.json())
//       .catch((error) => this.handleError(error));
//   }

//   //ajout d'un new pokemon
//   static addPokemon(pokemon: Pokemon): Promise<Pokemon> {
//     delete pokemon.created;

//     return fetch(`http://localhost:3001/pokemons`, {
//       method: "POST",
//       body: JSON.stringify(pokemon),
//       headers: { "Content-Type": "application/json" },
//     })
//       .then((response) => response.json())
//       .catch((error) => this.handleError(error));
//   }

//   //pour la recherche
//   static searchPokemon(term: string): Promise<Pokemon[]> {
//     // fonction retourne un tableau de pokemon
//     return fetch(`http://localhost:3001/pokemons?q=${term}`)
//       .then((response) => response.json())
//       .catch((error) => this.handleError(error));
//   }
// }
// //static means que les methodes ne sont rattachées qu'à elle meme.
import Pokemon from "../models/pokemon";
import POKEMONS from "../models/mock-pokemon";
  
export default class PokemonService {
  
  static pokemons:Pokemon[] = POKEMONS; //pour sve l'etat des pokemons
  
  static isDev = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development'); //on l'environnement dans laquelle on se trouve
  
  static getPokemons(): Promise<Pokemon[]> {
    if(this.isDev) { //verifie si on est dans l'env de developpement
      return fetch('http://localhost:3001/pokemons') //on fait appel à l'api ou il envoie la liste des pokemons
      .then(response => response.json())
      .catch(error => this.handleError(error));
    }
  
    return new Promise(resolve => { //sinon on retourne une promesse similaire à l'api, cad les donneés sont les memes mai la source de donnée est differente
      resolve(this.pokemons);
    });
  }
  
  static getPokemon(id?: number): Promise<Pokemon|null> {
    if(this.isDev) {
      return fetch(`http://localhost:3001/pokemons/${id}`)//l'api return un pokemo avec l'identifiant
      .then(response => response.json())
      .then(data => this.isEmpty(data) ? null : data)
      .catch(error => this.handleError(error));
    }
  
    return new Promise(resolve => {    
      resolve(this.pokemons.find(pokemon => id === pokemon.id));//retourne le meme pokemon mais mais venant du constant des pokemons
    }); 
  }
  
  static updatePokemon(pokemon: Pokemon): Promise<Pokemon> {
    if(this.isDev) {
      return fetch(`http://localhost:3001/pokemons/${pokemon.id}`, {
        method: 'PUT',
        body: JSON.stringify(pokemon),
        headers: { 'Content-Type': 'application/json'}
      })
      .then(response => response.json())
      .catch(error => this.handleError(error));
    }
  
    return new Promise(resolve => {
      const { id } = pokemon;
      const index = this.pokemons.findIndex(pokemon => pokemon.id === id);
      this.pokemons[index] = pokemon;
      resolve(pokemon);
    }); 
  }
  
  static deletePokemon(pokemon: Pokemon): Promise<{}> {
    if(this.isDev) {
      return fetch(`http://localhost:3001/pokemons/${pokemon.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json'}
      })
      .then(response => response.json())
      .catch(error => this.handleError(error));
    }
  
    return new Promise(resolve => {    
      const { id } = pokemon;
      this.pokemons = this.pokemons.filter(pokemon => pokemon.id !== id);
      resolve({});
    }); 
  }
  
  static addPokemon(pokemon: Pokemon): Promise<Pokemon> {
    pokemon.created = new Date(pokemon.created);
  
    if(this.isDev) {
      return fetch(`http://localhost:3001/pokemons`, {
        method: 'POST',
        body: JSON.stringify(pokemon),
        headers: { 'Content-Type': 'application/json'}
      })
      .then(response => response.json())
      .catch(error => this.handleError(error));
    }
  
    return new Promise(resolve => {    
      this.pokemons.push(pokemon);
      resolve(pokemon);
    }); 
  }
  
  static searchPokemon(term: string): Promise<Pokemon[]> {
    if(this.isDev) {
      return fetch(`http://localhost:3001/pokemons?q=${term}`)
      .then(response => response.json())
      .catch(error => this.handleError(error));
    }
  
    return new Promise(resolve => {    
      const results = this.pokemons.filter(pokemon => pokemon.name.includes(term));
      resolve(results);
    });
  
  }
  
  static isEmpty(data: Object): boolean {
    return Object.keys(data).length === 0;
  }
  
  static handleError(error: Error): void {
    console.error(error);
  }
}

