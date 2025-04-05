import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import platformLogos from "../data/platformLogos";
import "../CSS/Watchlist.css";
import {
    CreditCard,
    BadgeCheck,
    BadgeDollarSign,
    ShoppingCart,
    X,
} from "lucide-react";

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("title-asc");

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("watchlist")) || [];
        setWatchlist(stored);

        const platformSet = new Set();
        const typeSet = new Set();

        stored.forEach((movie) => {
            movie.sources?.forEach((source) => {
                platformSet.add(source.name);
                typeSet.add(source.type);
            });
        });

        setPlatforms([...platformSet].sort());
        setTypes([...typeSet].sort());
    }, []);

    const handlePlatformToggle = (platform) => {
        setSelectedPlatforms((prev) =>
            prev.includes(platform)
                ? prev.filter((p) => p !== platform)
                : [...prev, platform]
        );
    };

    const handleTypeToggle = (type) => {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const clearFilters = () => {
        setSelectedPlatforms([]);
        setSelectedTypes([]);
        setSearchTerm("");
        setSortOption("title-asc");
    };

    const removeFromWatchlist = (id) => {
        const updated = watchlist.filter((m) => m.id !== id);
        localStorage.setItem("watchlist", JSON.stringify(updated));
        setWatchlist(updated);
    };

    const movieMatchesFilters = (movie) => {
        const titleMatch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());

        const sourceMatch = movie.sources?.some((source) => {
            const platformMatch =
                selectedPlatforms.length === 0 || selectedPlatforms.includes(source.name);
            const typeMatch =
                selectedTypes.length === 0 || selectedTypes.includes(source.type);
            return platformMatch && typeMatch;
        });

        return titleMatch && sourceMatch;
    };

    const sortedFilteredMovies = [...watchlist]
        .filter(movieMatchesFilters)
        .sort((a, b) => {
            if (sortOption === "title-asc") return a.title.localeCompare(b.title);
            if (sortOption === "title-desc") return b.title.localeCompare(a.title);
            return 0;
        });

    const grouped = {};
    sortedFilteredMovies.forEach((movie) => {
        movie.sources?.forEach((source) => {
            const platformMatch =
                selectedPlatforms.length === 0 || selectedPlatforms.includes(source.name);
            const typeMatch =
                selectedTypes.length === 0 || selectedTypes.includes(source.type);

            if (platformMatch && typeMatch) {
                if (!grouped[source.name]) grouped[source.name] = [];
                if (!grouped[source.name].some((m) => m.id === movie.id)) {
                    grouped[source.name].push(movie);
                }
            }
        });
    });

    return (
        <div className="watchlist-page">
            <div className="watchlist-header">
                <h1>Your StreamList</h1>
                <div className="search-sort-bar">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="title-asc">Title A–Z</option>
                        <option value="title-desc">Title Z–A</option>
                    </select>
                    <button onClick={clearFilters}>Clear All</button>
                </div>
            </div>

            <div className="filters-modern">
                <div className="filter-group">
                    <span>Platforms:</span>
                    {platforms.map((platform) => (
                        <button
                            key={platform}
                            className={selectedPlatforms.includes(platform) ? "active" : ""}
                            onClick={() => handlePlatformToggle(platform)}
                        >
                            {platform}
                        </button>
                    ))}
                </div>
                <div className="filter-group">
                    <span>Types:</span>
                    {types.map((type) => (
                        <button
                            key={type}
                            className={selectedTypes.includes(type) ? "active" : ""}
                            onClick={() => handleTypeToggle(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {Object.keys(grouped).length === 0 ? (
                <p>No movies match your filters.</p>
            ) : (
                Object.entries(grouped).map(([platform, movies]) => (
                    <div key={platform} className="watchlist-group">
                        <h3 className="platform-header">
                            {platformLogos[platform] ? (
                                <img
                                    src={platformLogos[platform]}
                                    alt={platform}
                                    className="platform-logo"
                                />
                            ) : (
                                platform
                            )}
                        </h3>
                        <div className="watchlist-grid">
                            {movies.map((movie) => (
                                <div key={movie.id} className="watchlist-card">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                    <h4>{movie.title}</h4>
                                    <div className="badges">
                                        {movie.sources?.map((source, i) => {
                                            if (source.name === platform) {
                                                return (
                                                    <span key={i} className={`badge badge-${source.type}`}>
                                                        {source.type === "sub" && (
                                                            <>
                                                                <CreditCard size={14} /> Sub
                                                            </>
                                                        )}
                                                        {source.type === "free" && (
                                                            <>
                                                                <BadgeCheck size={14} /> Free
                                                            </>
                                                        )}
                                                        {source.type === "rent" && (
                                                            <>
                                                                <BadgeDollarSign size={14} /> Rent
                                                            </>
                                                        )}
                                                        {source.type === "buy" && (
                                                            <>
                                                                <ShoppingCart size={14} /> Buy
                                                            </>
                                                        )}
                                                    </span>
                                                );
                                            } else return null;
                                        })}
                                    </div>
                                    <div className="card-actions">
                                        <Link to={`/movie/${movie.id}`} className="details-btn">
                                            View Details
                                        </Link>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromWatchlist(movie.id)}
                                            title="Remove from Watchlist"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Watchlist;
