import React, { useState } from "react";
import axios from "axios";
import "../CSS/Streaming.css";

const API_KEY = "QeYGnAWfYR7NQC6NYUqmsRPQpUE4mnczugJjq1fb";

const Streaming = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);

    const searchStreaming = async () => {
        try {
            const { data } = await axios.get("https://api.watchmode.com/v1/search/", {
                params: {
                    apiKey: API_KEY,
                    search_field: "name",
                    search_value: searchTerm,
                },
            });

            const titles = data.title_results;

            const detailedResults = await Promise.all(
                titles.map(async (title) => {
                    const detail = await axios.get(`https://api.watchmode.com/v1/title/${title.id}/sources/`, {
                        params: { apiKey: API_KEY },
                    });
                    return { ...title, sources: detail.data };
                })
            );

            setResults(detailedResults);
        } catch (err) {
            console.error("Error fetching streaming info:", err);
        }
    };

    return (
        <div className="streaming-page">
            <h2>Streaming Availability</h2>
            <input
                type="text"
                placeholder="Search for a movie or show"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={searchStreaming}>Search</button>

            <div className="results">
                {results.map((item) => (
                    <div key={item.id} className="result-card">
                        <h3>{item.name}</h3>
                        <p>{item.year}</p>
                        <ul>
                            {item.sources.map((source, index) => (
                                <li key={index}>{source.name} - {source.type}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Streaming;
