import React, { FunctionComponent, useState, useEffect } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import Pokemon from "../models/pokemon";
import formatDate from "../helpers/formadate";
import formatType from "../helpers/formatType";
import PokemonService from "../services/pokemon-service";
import Loader from "../components/loader";

//pour recuperer les identifiants venant de l' url
type Params = { id: string };

const PokemonsDetail: FunctionComponent<RouteComponentProps<Params>> = ({
  match,
}) => {
  // save l' etat du pokemon selectionné dans pokemon
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  //   lance boucle pour chercher l'id du pokemon qui correpond dans l'url
  useEffect(() => {
    PokemonService.getPokemon(+match.params.id).then((pokemon) =>
      setPokemon(pokemon)
    );
    // cet useEffect agit si il y a changement au niveau de l'url(observable)
  }, [match.params.id]);

  return (
    <div>
      {pokemon ? ( //operateur ternaire s' il y a pokemon donc affiche
        <div className="row">
          <div className="col s12 m8 offset-m2">
            <h2 className="header center">{pokemon.name}</h2>
            <div className="card hoverable">
              <div className="card-image">
                <img
                  src={pokemon.picture}
                  alt={pokemon.name}
                  style={{ width: "250px", margin: "0 auto" }}
                />
                {/* // */}
                <Link
                  to={`/pokemons/edit/${pokemon.id}`}
                  className="btn btn-floating halfway-fab waves-effect waves-light"
                >
                  <i className="material-icons">edit</i>
                </Link>
              </div>
              <div className="card-stacked">
                <div className="card-content">
                  <table className="bordered striped">
                    <tbody>
                      <tr>
                        <td>Nom</td>
                        <td>
                          <strong>{pokemon.name}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>Points de vie</td>
                        <td>
                          <strong>{pokemon.hp}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>Dégâts</td>
                        <td>
                          <strong>{pokemon.cp}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>Types</td>
                        <td>
                          {pokemon.types.map((type) => (
                            <span key={type} className={formatType(type)}>
                              {type}
                            </span>
                          ))}
                        </td>
                      </tr>
                      <tr>
                        <td>Date de création</td>
                        <td>{formatDate(pokemon.created)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="card-action">
                  {/* appel de link */}
                  <Link to="/">Retour</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        //   sinon du ternaire
        <h4 className="center">
          {" "}
          <Loader />{" "}
        </h4>
      )}
    </div>
  );
};

export default PokemonsDetail;
