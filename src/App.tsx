import React, { FunctionComponent } from "react";
import PokemonList from "./pages/pokemon-list";
import PokemonsDetail from "./pages/pokemon-detail";
import { Link, BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PageNotFound from "./pages/pageNotFound";
import PokemonEdit from "./pages/pokemon-edit";
import PokemonAdd from "./pages/pokemon-add";
import Login from "./pages/login";
import PrivateRoute from "./components/PrivateRoute";

const App: FunctionComponent = () => {
  //composant ecrit sous forme de fonction

  return (
    <Router>
      <div>
        {/* barre de navigation commun a tous les composants */}
        <nav>
          <div className="nav-wrapper teal">
            <Link to="/" className="brand-logo center">
              Pokedex
            </Link>
          </div>
        </nav>
        {/* le systeme de gestion des routes de notre application */}
        <Switch>
          <PrivateRoute exact path="/" component={PokemonList} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/pokemons" component={PokemonList} />
          <PrivateRoute exact path="/pokemon/add" component={PokemonAdd} />
          <PrivateRoute path="/pokemons/edit/:id" component={PokemonEdit} />
          <PrivateRoute path="/pokemons/:id" component={PokemonsDetail} />
          <Route component={PageNotFound} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
