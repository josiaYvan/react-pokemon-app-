import React, { FunctionComponent, useState } from "react";
import Pokemon from "../models/pokemon";
import formatType from "../helpers/formatType";
import { useHistory } from "react-router-dom";
import PokemonService from "../services/pokemon-service";

// propos du composant
type Props = {
  pokemon: Pokemon;
  isEditForm: boolean;
};
// pour modeliser les champs dans les formulaires
//si le champ saisie present des valeurs, erreurs, valide
type Field = {
  value?: any;
  error?: string;
  isValid?: boolean;
};
// liste de champs de f ormulaire
type Form = {
  picture: Field;
  name: Field;
  hp: Field;
  cp: Field;
  types: Field;
};

const PokemonForm: FunctionComponent<Props> = ({ pokemon, isEditForm }) => {
  //historique de page
  const history = useHistory();

  //   state des champs du formulaire
  const [form, setForm] = useState<Form>({
    picture: { value: pokemon.picture },
    name: { value: pokemon.name, isValid: true },
    hp: { value: pokemon.hp, isValid: true },
    cp: { value: pokemon.cp, isValid: true },
    types: { value: pokemon.types, isValid: true },
  });

  // methode pour preremplir (cocher) le type de pokemon
  const hasType = (type: string): boolean => {
    return form.types.value.includes(type);
  };
  //liaison des formulaires au state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    //fusion de 2 objets propriete de droite ecrase le gauche
    const newField: Field = { [fieldName]: { value: fieldValue } };

    // copie de l' ancien avec la modification apporter par l'use sur le hcamp concerner
    setForm({ ...form, ...newField });
  };
  // pour save la modification des types de pokemon
  const selectType = (
    type: string,
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const checked = e.target.checked;
    let newField: Field;

    if (checked) {
      //si l' utilisateur coche un type, à l' ajoute a la liste de pokemon.
      const newType: string[] = form.types.value.concat([type]);
      newField = { value: newType };
    } else {
      //si l' user decoche un type, on le retire de la liste des types de pokemon
      const newType: string[] = form.types.value.filter(
        (currentType: string) => currentType !== type
      );
      newField = { value: newType };
    }

    setForm({ ...form, ...{ types: newField } });
  };

  //methode pour gerer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //bloque le comportement natif du formulaire pour le gerer nous meme
    //recupere le resultat de la validation des champs
    const isFormValid = validateForm();
    //redirection si only formulaire valide
    if (isFormValid) {
      //prise en compte de l'ajout d'image de pokemon
      pokemon.picture = form.picture.value;
      pokemon.name = form.name.value;
      pokemon.hp = form.hp.value;
      pokemon.cp = form.cp.value;
      pokemon.types = form.types.value;
      // save les modifications puis redirige l' user vers la page detail du pokemon

      //appel du formulaire selon isEditPokemon
      //si true on appel updatePokemon
      isEditForm ? updatePokemon() : addPokemon();
    }
  };

  //ajout de methode pour l'ajout
  const addPokemon = () => {
    PokemonService.addPokemon(pokemon).then(() =>
      history.push(`/pokemons/`)
    );
  };

  const updatePokemon = () => {
    PokemonService.updatePokemon(pokemon).then(() =>
      history.push(`/pokemons/${pokemon.id}`)
    );
  };

  //pour la supression de pokemon
  const deletePokemon = () => {
    PokemonService.deletePokemon(pokemon).then(() => history.push(`/pokemons`));
  };

  //n' afficher l'image que si ajout
  const isAddForm = () => {
    return !isEditForm;
  };

  const validateForm = () => {
    let newForm: Form = form;

    //validator url
    if (isAddForm()) {
      //regle de validation de formulaire
      const start =
        "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/";
      const end = ".png";

      if (
        !form.picture.value.startsWith(start) ||
        !form.picture.value.endsWith(end)
      ) {
        const erroMsg: string = "L' url n'est pas valide.";
        const newField: Field = {
          value: form.picture.value,
          error: erroMsg,
          isValid: false,
        };
        newForm = { ...form, ...{ picture: newField } };
      } else {
        const newField: Field = {
          value: form.picture.value,
          error: "",
          isValid: true,
        };
        newForm = { ...form, ...{ picture: newField } };
      }
    }

    //validator name
    if (!/^[a-zA-Zàéè ]{3,25}$/.test(form.name.value)) {
      const errorMsg: string = "le nom du pokemon est requis (1-25).";
      const newField: Field = {
        value: form.name.value,
        error: errorMsg,
        isValid: false,
      };
      newForm = { ...newForm, ...{ name: newField } };
    } else {
      const newField: Field = {
        value: form.name.value,
        error: "",
        isValid: true,
      };
      newForm = { ...newForm, ...{ name: newField } };
    }

    //validator hp
    if (!/^[0-9]{1,3}$/.test(form.hp.value)) {
      //si la condition est avlider, on met a jour le state
      const errorMsg: string =
        "les points de vie du pokemon sont compris entre 0 à 99.";
      const newField: Field = {
        value: form.hp.value,
        error: errorMsg,
        isValid: false,
      };
      newForm = { ...newForm, ...{ hp: newField } };
    } else {
      const newField: Field = {
        value: form.hp.value,
        error: "",
        isValid: true,
      };
      newForm = { ...newForm, ...{ hp: newField } };
    }

    //validator cp
    if (!/^[0-9]{1,3}$/.test(form.cp.value)) {
      const errorMsg: string =
        "les dégats du pokemon sont compris entre 0 à 99";
      const newField: Field = {
        value: form.cp.value,
        error: errorMsg,
        isValid: false,
      };
      newForm = { ...newForm, ...{ cp: newField } };
    } else {
      const newField: Field = {
        value: form.cp.value,
        error: "",
        isValid: true,
      };
      newForm = { ...newForm, ...{ cp: newField } };
    }

    //si le formulaire est valid on met a jour le formulaire et return un boolean true, vice versa
    setForm(newForm);
    return newForm.name.isValid && newForm.hp.isValid && newForm.cp.isValid;
  };

  //pour la validation du champ type
  //renvoie un boolean pour savoir si une case a cocher doit etre veroiller ou non
  const isTypesValid = (type: string): boolean => {
    //pour  empecher de deselectionner les deja cocher
    if (form.types.value.length === 1 && hasType(type)) {
      return false;
    }

    //impossible de cocher plus de trois cases mais peut deselectionner les deja precocher pour la modification
    // hasType ici ne verouille pas les cases a cocher
    if (form.types.value.length >= 3 && !hasType(type)) {
      return false;
    }

    return true;
    //pour conclure:
    //on ne peut cocher plus de trois cases et deselectionner la seule derniere case cochée pour ne pas avoir un pokemon sans type
  };

  const types: string[] = [
    "Plante",
    "Feu",
    "Eau",
    "Insecte",
    "Normal",
    "Electrik",
    "Poison",
    "Fée",
    "Vol",
    "Combat",
    "Psy",
  ];

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="row">
        <div className="col s12 m8 offset-m2">
          <div className="card hoverable">
            {/* // l'image est only afficher si edition */}
            {isEditForm && (
              <div className="card-image">
                <img
                  src={pokemon.picture}
                  alt={pokemon.name}
                  style={{ width: "250px", margin: "0 auto" }}
                />
                <span className="btn-floating halfway-fab waves-effect waves-light">
                  <i onClick={deletePokemon} className="material-icons">
                    delete
                  </i>
                </span>
              </div>
            )}
            <div className="card-stacked">
              <div className="card-content">
                {/* Pokemon picture */}
                {isAddForm() && (
                  <div className="form-group">
                    <label htmlFor="name">Image</label>
                    {/* champ prerepmplis avc l' attribut value */}
                    <input
                      id="picture"
                      name="picture"
                      type="text"
                      className="form-control"
                      value={form.picture.value}
                      onChange={(e) => handleInputChange(e)}
                    ></input>
                    {/* error */}
                    {form.picture.error && (
                      <div className="card-panel red accent-1">
                        {" "}
                        {form.picture.error}{" "}
                      </div>
                    )}
                  </div>
                )}
                {/* Pokemon name */}
                <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  {/* champ prerepmplis avc l' attribut value */}
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-control"
                    value={form.name.value}
                    onChange={(e) => handleInputChange(e)}
                  ></input>
                  {/* error */}
                  {form.name.error && (
                    <div className="card-panel red accent-1">
                      {" "}
                      {form.name.error}{" "}
                    </div>
                  )}
                </div>

                {/* Pokemon hp */}
                <div className="form-group">
                  <label htmlFor="hp">Point de vie</label>
                  <input
                    id="hp"
                    name="hp"
                    type="number"
                    className="form-control"
                    value={form.hp.value}
                    onChange={(e) => handleInputChange(e)}
                  ></input>
                  {/* error */}
                  {form.hp.error && (
                    <div className="card-panel red accent-1">
                      {" "}
                      {form.hp.error}{" "}
                    </div>
                  )}
                </div>
                {/* Pokemon cp */}
                <div className="form-group">
                  <label htmlFor="cp">Dégâts</label>
                  <input
                    id="cp"
                    name="cp"
                    type="number"
                    className="form-control"
                    value={form.cp.value}
                    onChange={(e) => handleInputChange(e)}
                  ></input>
                  {/* error */}
                  {form.cp.error && (
                    <div className="card-panel red accent-1">
                      {" "}
                      {form.cp.error}{" "}
                    </div>
                  )}
                </div>
                {/* Pokemon types */}
                <div className="form-group">
                  <label>Types</label>
                  {types.map((type) => (
                    <div key={type} style={{ marginBottom: "10px" }}>
                      <label>
                        <input
                          id={type}
                          type="checkbox"
                          value={type}
                          checked={hasType(type)}
                          className="filled-in"
                          onChange={(e) => selectType(type, e)}
                          disabled={!isTypesValid(type)}
                        ></input>
                        {/* si le type n' est pas vallide, verrouiller la case */}
                        <span>
                          <p className={formatType(type)}>{type}</p>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-action center">
                {/* Submit button */}
                <button type="submit" className="btn">
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PokemonForm;
