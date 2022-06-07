import React, {FunctionComponent, useState} from 'react';
import Pokemon from '../models/pokemon';
import './pokemon-card.css';
import formatDate from '../helpers/formadate';
import formatType from '../helpers/formatType';
import { useHistory } from 'react-router-dom';

type Props = {
  pokemon: Pokemon;
  BorderColor?: string;
}

const PokemonCard: FunctionComponent<Props> = ({pokemon, BorderColor = '#009688'}) => {
  
   //gestion couleur 
  const [color, setColor] = useState<string>();
  // hooks de navigation ou recuperation d'objet
  const history = useHistory();
    
  const showBorder = () => {
    setColor(BorderColor)
  }

  const hideBorder = () => {
    setColor('#f5f5f5'); //on remet la bordure en gris
  }
    //gestionnaire d'evenement Pour les details a chaque click
    const goToPokemon = (id: number) => {
      history.push(`/pokemons/${id}`)
    }

  return (
        <div className="col s6 m4" onClick={() => goToPokemon(pokemon.id)} onMouseEnter={showBorder} onMouseLeave={hideBorder}>
        <div className="card horizontal" style={{borderColor: color }}>
          <div className="card-image"> 
            <img src={pokemon.picture} alt={pokemon.name}/>
          </div>
          <div className="card-stacked">
            <div className="card-content">
              <p>{pokemon.name}</p>
              <p><small> {formatDate(pokemon.created)} </small></p>
              {pokemon.types.map(type => (
                <span key={type} className={formatType(type)} >{type}</span>
              ) )}
            </div>
          </div>
        </div> 
      </div>
    );
};

export default PokemonCard;