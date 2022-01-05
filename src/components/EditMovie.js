import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import './EditMovie.css';
import Input from './form-components/Input';
import Select from './form-components/Select';
import TextInput from './form-components/TextInput';
import Alert from './ui-components/Alert';

export default class EditMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: {
        id: 0,
        title: "",
        release_date: "",
        runtime: "",
        mpaa_rating: "",
        rating: "",
        description: "",
      },
      mpaaOptions: [
        { id: "G", value: "G" },
        { id: "PG", value: "PG" },
        { id: "PG13", value: "PG13" },
        { id: "R", value: "R" },
        { id: "NC17", value: "NC17" },
      ],
      isLoaded: false,
      error: null,
      errors: [],
      alert: {
        type: "d-none",
        message: "",
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (evt) => {
    evt.preventDefault();

    // client side validation
    let errors = [];
    if (this.state.movie.title === "") {
        errors.push("title");
    }

    if (this.state.movie.release_date === "") {
      errors.push("release_date");
    }

    if (this.state.movie.runtime === "") {
      errors.push("runtime");
    }

    if (this.state.movie.mpaa_rating === "") {
      errors.push("mpaa_rating");
    }

    if (this.state.movie.rating === "") {
      errors.push("rating");
    }

    this.setState({errors: errors});

    if (errors.length > 0) {
        return false;
    }

    const data = new FormData(evt.target);
    const payload = Object.fromEntries(data.entries());
    console.log(payload);

    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(payload),
    }

    fetch('http://localhost:4000/v1/admin/editmovie', requestOptions)
        .then((response) => response.json())
        .then(data => {
            if (data.error) {
              this.setState({
                alert: {type: "alert-danger",
                message: data.error.message},
              })
            } else {
              this.setState({
                alert: {type: "alert-success",
                message: "Changes saved!"},
              })
            }
        })
  };

  handleChange = (evt) => {
    let value = evt.target.value;
    let name = evt.target.name;
    this.setState((prevState) => ({
      movie: {
        ...prevState.movie,
        [name]: value,
      },
    }));
  };

  hasErrors(key) {
      return this.state.errors.indexOf(key) !== -1;
  }

	  componentDidMount() {
	    const id = this.props.match.params.id;
	    if (id > 0) {
	      fetch("http://localhost:4000/v1/movie/" + id)
		.then((response) => {
		  if (response.status !== "200") {
		    let err = Error;
		    err.Message = "Invalid response code: " + response.status;
		    this.setState({ error: err });
		  }
		  return response.json();
		})
		.then((json) => {
		  const releaseDate = new Date(json.movie.release_date);

		  this.setState(
		    {
		      movie: {
		        id: id,
		        title: json.movie.title,
		        release_date: releaseDate.toISOString().split("T")[0],
		        runtime: json.movie.runtime,
		        mpaa_rating: json.movie.mpaa_rating,
		        rating: json.movie.rating,
		        description: json.movie.description,
		      },
		      isLoaded: true,
		    },
		    (error) => {
		      this.setState({
		        isLoaded: true,
		        error,
		      });
		    }
		  );
		});
	    } else {
	      this.setState({ isLoaded: true });
	    }
	  }

    confirmDelete = (e) => {
      console.log('would delete movie id', this.state.movie.id)
    }

  render() {
    let { movie, isLoaded, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <p>Loading...</p>;
    } else {
      return (
        <Fragment>
          <h2>Add/Edit Movie</h2>
          <Alert 
            alertType={this.state.alert.type}
            alertMessage={this.state.alert.message}
          />
          <hr />
          <form onSubmit={this.handleSubmit}>
            <input
              type="hidden"
              name="id"
              id="id"
              value={movie.id}
              onChange={this.handleChange}
            />

            <Input
              title={"Title"}
              className={this.hasErrors("title") ? "is-invalid" : ""}
              type={"text"}
              name={"title"}
              value={movie.title}
              handleChange={this.handleChange}
              errorDiv={this.hasErrors("title") ? "text-danger" : "d-none"}
              errorMsg={"Please enter a title"}
            />

            <Input
              title={"Release Date"}
              className={this.hasErrors("release_date") ? "is-invalid" : ""}
              type={"date"}
              name={"release_date"}
              value={movie.release_date}
              handleChange={this.handleChange}
              errorDiv={this.hasErrors("release_date") ? "text-danger" : "d-none"}
              errorMsg={"Please enter the release date"}
            />

            <Input
              title={"Runtime"}
              className={this.hasErrors("runtime") ? "is-invalid" : ""}
              type={"text"}
              name={"runtime"}
              value={movie.runtime}
              handleChange={this.handleChange}
              errorDiv={this.hasErrors("runtime") ? "text-danger" : "d-none"}
              errorMsg={"How long is the movie?"}
            />

            <Select
              title={"MPAA Rating"}
              className={this.hasErrors("mpaa_rating") ? "is-invalid" : ""}
              name={"mpaa_rating"}
              options={this.state.mpaaOptions}
              value={movie.mpaa_rating}
              handleChange={this.handleChange}
              placeholder={"Choose..."}
              errorDiv={this.hasErrors("mpaa_rating") ? "text-danger" : "d-none"}
              errorMsg={"Please enter the mpaa rating"}
            />

            <Input
              title={"Rating"}
              className={this.hasErrors("rating") ? "is-invalid" : ""}
              type={"text"}
              name={"rating"}
              value={movie.rating}
              handleChange={this.handleChange}
              errorDiv={this.hasErrors("rating") ? "text-danger" : "d-none"}
              errorMsg={"Please enter the rating"}
            />

            <TextInput
              title={"Description"}
              name={"description"}
              value={movie.description}
              rows={"3"}
              handleChange={this.handleChange}
            />

            <hr />

            <button className="btn btn-primary">Save</button>
            <Link to='/admin' className='btn btn-warning ms-1'>Cancel</Link>
            {movie.id > 0 && (
              <a href='#!' onClick={() => this.confirmDelete()} className='btn btn-danger ms-1'>Delete</a>
            )}
          </form>
        </Fragment>
      );
    }
  }
}