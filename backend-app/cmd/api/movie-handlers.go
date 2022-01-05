package main

import (
	"backend/models"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/julienschmidt/httprouter"
)

type jsonResp struct {
	OK      bool   `json:"ok"`
	Message string `json:"message"`
}

func (app *application) getOneMovie(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		app.logger.Println(errors.New("invalid id parameter"))
		app.errorJSON(w, err)
		return
	}

	movie, err := app.models.DB.Get(id)
	if err != nil {
		app.logger.Println(errors.New("could not get movie"))
	}

	if err := app.writeJSON(w, http.StatusOK, movie, "movie"); err != nil {
		app.errorJSON(w, err)
	}

}

func (app *application) getAllMovies(w http.ResponseWriter, r *http.Request) {
	movies, err := app.models.DB.All()
	if err != nil {
		app.errorJSON(w, err)
	}

	if err := app.writeJSON(w, http.StatusOK, movies, "movies"); err != nil {
		app.errorJSON(w, err)
	}
}

func (app *application) getAllGenres(w http.ResponseWriter, r *http.Request) {
	genres, err := app.models.DB.GenresAll()
	if err != nil {
		app.errorJSON(w, err)
	}

	if err := app.writeJSON(w, http.StatusOK, genres, "genres"); err != nil {
		app.errorJSON(w, err)
	}
}

func (app *application) getAllMoviesByGenre(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())
	generID, err := strconv.Atoi(params.ByName("genre_id"))
	if err != nil {
		app.errorJSON(w, err)
	}

	movies, err := app.models.DB.All(generID)
	if err != nil {
		app.errorJSON(w, err)
	}

	if err := app.writeJSON(w, http.StatusOK, movies, "movies"); err != nil {
		app.errorJSON(w, err)
	}
}

func (app *application) deleteMovie(w http.ResponseWriter, r *http.Request) {

}

type MoviePayload struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Year        string `json:"year"`
	ReleaseDate string `json:"release_date"`
	Runtime     string `json:"runtime"`
	Rating      string `json:"rating"`
	MPAARating  string `json:"mpaa_rating"`
}

func (app *application) editmovie(w http.ResponseWriter, r *http.Request) {
	var payload MoviePayload

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		app.errorJSON(w, err)
		return
	}

	var movie models.Movie

	movie.ID, _ = strconv.Atoi(payload.ID)
	movie.Title = payload.Title
	movie.Description = payload.Description
	movie.ReleaseDate, _ = time.Parse("2006-01-02", payload.ReleaseDate)
	movie.Year = movie.ReleaseDate.Year()
	movie.Runtime, _ = strconv.Atoi(payload.Runtime)
	movie.Rating, _ = strconv.Atoi(payload.Rating)
	movie.MPAARating = payload.MPAARating
	movie.CreatedAt = time.Now()
	movie.UpdatedAt = time.Now()

	if movie.ID == 0 {
		if err := app.models.DB.InsertMovie(movie); err != nil {
			app.errorJSON(w, err)
			return
		}
	}

	ok := jsonResp{
		OK: true,
	}

	if err := app.writeJSON(w, http.StatusOK, ok, "respose"); err != nil {
		app.errorJSON(w, err)
	}
}

func (app *application) searchMovies(w http.ResponseWriter, r *http.Request) {

}
