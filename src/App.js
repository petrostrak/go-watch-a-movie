import React, {Fragment} from "react";
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import { useParams, useRouteMatch } from "react-router-dom/cjs/react-router-dom.min";
import Admin from './components/Admin';
import Categories from "./components/Categories";
import Home from "./components/Home";
import Movies from './components/Movies';

export default function App() {
  return (
    <Router>
      <div className='container'>
        <div className='row'>
          <h1 className='mt-3'>
            Go Watch a Movie!
          </h1>
          <hr className='mb-3'></hr>
        </div>

        <div className='row'>
          <div className='col-md-2'>
            <nav>
              <ul className='list-group'>
                <li className='list-group-item'>
                  <Link to={"/"}>Home</Link>
                </li>
                <li className='list-group-item'>
                  <Link to={"/movies"}>Movies</Link>
                </li>
                <li className='list-group-item'>
                  <Link to={"/by-category"}>Categories</Link>
                </li>
                <li className='list-group-item'>
                  <Link to={"/admin"}>Manage Catalogue</Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className='col-md-10'>
            <Switch>
              <Route path={"/movies/:id"}>
                <Movie />
              </Route>
              <Route path="/movies">
                <Movies />
              </Route>
              <Route exact path={"/by-category"}>
                <CategoryPage />
              </Route>
              <Route 
                exact 
                path={"/by-category/drama"} 
                render={(props) => <Categories {...props} title={`Drama`} />}
              />
              <Route 
                exact 
                path={"/by-category/comedy"} 
                render={(props) => <Categories {...props} title={`Comedy`} />}
              />
              <Route path="/admin">
                <Admin />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

function Movie() {
  let {id} = useParams();

  return <h2>Movie id {id}</h2>
}

function CategoryPage() {

  // path lets us build routepaths that are
  // relative to the parent route. And url lets
  // us build relative links.
  let {path, url} = useRouteMatch();


  return (
    <div>
      <h2>Categories</h2>
      <ul>
        <li><Link to={`${path}/comedy`}>Comedy</Link></li>
        <li><Link to={`${path}/drama`}>Drama</Link></li>
      </ul>
    </div>
  );
}