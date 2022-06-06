import * as React from "react";
import PokemonForm from "../components/pokemon-form";
import Pokemon from "../models/pokemon";

const PokemonAdd: React.FunctionComponent = () => {
  const [id] = React.useState<number>(new Date().getTime()); // generer id unique à chaque; à chaque milliseconde on ne pourra pas ajouter deux pokemons en meme temps·
  const [pokemon] = React.useState<Pokemon>(new Pokemon(id));

  return (
    <div className="row">
      <h2 className="header center">Ajouter un pokémon</h2>
      <PokemonForm pokemon={pokemon} isEditForm={false}></PokemonForm>
    </div>
  );
};

export default PokemonAdd;
