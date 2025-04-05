import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../CSS/Movies.css";

const API_KEY = "84f3b82b613c29aa7bef6d2644d174fc";

const GENRE_MAP = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
};

const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const Movies = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOption, setSortOption] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");

    const searchMovies = async (newPage = 1) => {
        if (!searchTerm) return;

        try {
            const response = await axios.get(
                "https://api.themoviedb.org/3/search/movie",
                {
                    params: {
                        api_key: API_KEY,
                        query: searchTerm,
                        page: newPage,
                    },
                }
            );
            setMovies(response.data.results);
            setPage(newPage);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            searchMovies(1);
        }
    };

    const filteredMovies = selectedGenre
        ? movies.filter((movie) =>
            movie.genre_ids.includes(parseInt(selectedGenre))
        )
        : movies;

    const sortedMovies = [...filteredMovies].sort((a, b) => {
        switch (sortOption) {
            case "date-desc":
                return new Date(b.release_date) - new Date(a.release_date);
            case "date-asc":
                return new Date(a.release_date) - new Date(b.release_date);
            case "rating-desc":
                return b.vote_average - a.vote_average;
            case "rating-asc":
                return a.vote_average - b.vote_average;
            case "title-asc":
                return a.title.localeCompare(b.title);
            case "title-desc":
                return b.title.localeCompare(a.title);
            default:
                return 0;
        }
    });

    return (
        <div className="movies-page">
            <h2>Search Movies</h2>
            <input
                type="text"
                placeholder="Enter movie name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
            />
            <button onClick={() => searchMovies(1)}>Search</button>

            {movies.length > 0 && (
                <>
                    <div className="filter-container">
                        <label htmlFor="genre">Filter by Genre: </label>
                        <select
                            id="genre"
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                        >
                            <option value="">-- All Genres --</option>
                            {Object.entries(GENRE_MAP).map(([id, name]) => (
                                <option key={id} value={id}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="sort-container">
                        <label htmlFor="sort">Sort by: </label>
                        <select
                            id="sort"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="">-- Select --</option>
                            <option value="date-desc">Release Date (Newest)</option>
                            <option value="date-asc">Release Date (Oldest)</option>
                            <option value="rating-desc">Rating (Highest)</option>
                            <option value="rating-asc">Rating (Lowest)</option>
                            <option value="title-asc">Title (A-Z)</option>
                            <option value="title-desc">Title (Z-A)</option>
                        </select>
                    </div>
                </>
            )}

            <div className="movie-results">
                {sortedMovies.map((movie) => (
                    <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                        {movie.poster_path && (
                            <img
                                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                alt={movie.title}
                            />
                        )}
                        <div className="movie-card-details">
                            <h3>{movie.title}</h3>
                            <p><strong>Release:</strong> {formatDate(movie.release_date)}</p>
                            <p><strong>Rating:</strong> {movie.vote_average}</p>
                            <div className="genre-tags">
                                {movie.genre_ids?.map((id) => (
                                    <span key={id} className="genre-tag">
                    {GENRE_MAP[id]}
                  </span>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {movies.length > 0 && (
                <div className="pagination">
                    <button
                        disabled={page === 1}
                        onClick={() => searchMovies(page - 1)}
                    >
                        ◀ Prev
                    </button>

                    <span>
            Page {page} of {totalPages}
          </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => searchMovies(page + 1)}
                    >
                        Next ▶
                    </button>
                </div>
            )}
        </div>
    );
};

export default Movies;
