import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";
import movieCSV from "../data/movie_titles.csv";
import platformLogos from "../data/platformLogos";
import "../CSS/MovieDetails.css";

import { CreditCard, BadgeCheck, BadgeDollarSign, ShoppingCart } from "lucide-react";

const TMDB_API_KEY = "84f3b82b613c29aa7bef6d2644d174fc";
const WATCHMODE_API_KEY = "QeYGnAWfYR7NQC6NYUqmsRPQpUE4mnczugJjq1fb";

const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const MovieDetails = () => {
    const { id } = useParams(); // TMDB ID
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [sources, setSources] = useState([]);
    const [showFullCast, setShowFullCast] = useState(false);
    const [watchlisted, setWatchlisted] = useState(false);

    const fetchSourcesByWatchmodeId = async (watchmodeId) => {
        try {
            const cachedSources = localStorage.getItem(`sources_${watchmodeId}`);
            if (cachedSources) {
                setSources(JSON.parse(cachedSources));
                return;
            }

            const sourcesRes = await axios.get(
                `https://api.watchmode.com/v1/title/${watchmodeId}/sources/?apiKey=${WATCHMODE_API_KEY}`
            );

            const seen = new Set();
            const uniqueSources = sourcesRes.data.filter((s) => {
                if (seen.has(s.source_id)) return false;
                seen.add(s.source_id);
                return ["sub", "free", "rent", "buy"].includes(s.type);
            });

            setSources(uniqueSources);
            localStorage.setItem(`sources_${watchmodeId}`, JSON.stringify(uniqueSources));
        } catch (error) {
            console.error("Error fetching Watchmode sources:", error);
        }
    };

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const [detailsRes, creditsRes] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`),
                    axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=en-US`)
                ]);

                const movieData = detailsRes.data;
                setMovie(movieData);
                setCast(creditsRes.data.cast);

                // Check localStorage for existing Watchlist status
                const existing = JSON.parse(localStorage.getItem("watchlist")) || [];
                const isInWatchlist = existing.some((m) => m.id === movieData.id);
                setWatchlisted(isInWatchlist);

                const cacheKey = `watchmode_id_${id}`;
                let watchmodeId = localStorage.getItem(cacheKey);

                if (watchmodeId) {
                    fetchSourcesByWatchmodeId(watchmodeId);
                    return;
                }

                Papa.parse(movieCSV, {
                    header: true,
                    download: true,
                    complete: async (results) => {
                        const match = results.data.find((row) => row.tmdb_id === id);
                        if (match?.id) {
                            watchmodeId = match.id;
                            localStorage.setItem(cacheKey, watchmodeId);
                            fetchSourcesByWatchmodeId(watchmodeId);
                            return;
                        }

                        try {
                            const searchRes = await axios.get(
                                `https://api.watchmode.com/v1/search/?apiKey=${WATCHMODE_API_KEY}&search_field=tmdb_id&search_value=${id}&types=movie`
                            );
                            const result = searchRes.data.title_results?.[0];
                            if (result?.id) {
                                watchmodeId = result.id;
                                localStorage.setItem(cacheKey, watchmodeId);
                                fetchSourcesByWatchmodeId(watchmodeId);
                                return;
                            }
                        } catch {}

                        try {
                            const searchRes = await axios.get(
                                `https://api.watchmode.com/v1/search/?apiKey=${WATCHMODE_API_KEY}&search_field=name&search_value=${encodeURIComponent(
                                    movieData.title
                                )}&types=movie`
                            );
                            const result = searchRes.data.title_results?.[0];
                            if (result?.id) {
                                watchmodeId = result.id;
                                localStorage.setItem(cacheKey, watchmodeId);
                                fetchSourcesByWatchmodeId(watchmodeId);
                            }
                        } catch (error) {
                            console.error("❌ Error during Watchmode title search:", error);
                        }
                    }
                });
            } catch (error) {
                console.error("❌ Error fetching movie details:", error);
            }
        };

        fetchMovieDetails();
    }, [id]);

    const toggleWatchlist = () => {
        const existing = JSON.parse(localStorage.getItem("watchlist")) || [];
        const isAlreadyInWatchlist = existing.some((m) => m.id === movie.id);

        if (isAlreadyInWatchlist) {
            const updated = existing.filter((m) => m.id !== movie.id);
            localStorage.setItem("watchlist", JSON.stringify(updated));
            setWatchlisted(false);
        } else {
            const movieToSave = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                sources: sources,
            };
            localStorage.setItem("watchlist", JSON.stringify([...existing, movieToSave]));
            setWatchlisted(true);
        }
    };

    if (!movie) return <p>Loading...</p>;

    return (
        <div className="movie-details-page">
            <div className="movie-details-container">
                <div className="movie-poster">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                    />
                </div>
                <div className="movie-info">
                    <h2>{movie.title}</h2>
                    <p><strong>Release Date:</strong> {formatDate(movie.release_date)}</p>
                    <p><strong>Rating:</strong> {movie.vote_average}</p>
                    <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
                    <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(", ")}</p>
                    <p><strong>Overview:</strong> {movie.overview}</p>
                    <button className="watchlist-btn" onClick={toggleWatchlist}>
                        {watchlisted ? "✔ Added to StreamList" : "➕ Add to StreamList"}
                    </button>
                </div>
            </div>

            <div className="cast-section">
                <h3>Cast</h3>
                <div className="cast-grid">
                    {(showFullCast ? cast : cast.slice(0, 6)).map((member) => (
                        <div key={member.id} className="cast-member">
                            <img
                                src={
                                    member.profile_path
                                        ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                                        : "https://via.placeholder.com/100x100?text=No+Image"
                                }
                                alt={member.name}
                            />
                            <div>{member.name}</div>
                        </div>
                    ))}
                </div>
                {cast.length > 6 && (
                    <button
                        onClick={() => setShowFullCast(!showFullCast)}
                        className="toggle-cast-btn"
                    >
                        {showFullCast ? "Show Less" : "View Full Cast"}
                    </button>
                )}
            </div>

            <div className="streaming-section">
                <h3>Available On</h3>

                {sources.length === 0 ? (
                    <p className="no-streaming-message">
                        ⚠️ This movie isn't currently available on any streaming platforms.
                    </p>
                ) : (
                    <div className="streaming-logos">
                        {sources.map((source, index) => (
                            <a
                                key={index}
                                className="streaming-logo"
                                href={source.web_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={
                                        source.logo_100px ||
                                        platformLogos[source.name] ||
                                        "https://via.placeholder.com/100x40?text=No+Logo"
                                    }
                                    alt={source.name}
                                    className="streaming-logo-img"
                                />
                                <span className={`badge badge-${source.type}`}>
                  {source.type === "sub" && <><CreditCard size={14} style={{ marginRight: 4 }} /> Subscription</>}
                                    {source.type === "free" && <><BadgeCheck size={14} style={{ marginRight: 4 }} /> Free</>}
                                    {source.type === "rent" && <><BadgeDollarSign size={14} style={{ marginRight: 4 }} /> Rent</>}
                                    {source.type === "buy" && <><ShoppingCart size={14} style={{ marginRight: 4 }} /> Buy</>}
                </span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetails;
