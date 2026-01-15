import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [urls, setUrls] = useState([]);
    const [longUrl, setLongUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cooldown, setCooldown] = useState(0);
    const [newShortCode, setNewShortCode] = useState(null);

    useEffect(() => {
        fetchUrls();
    }, []);

    useEffect(() => {
        let interval = null;
        if (cooldown > 0) {
            interval = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        } else if (cooldown === 0) {
            setError(null); // Clear error when cooldown finishes
        }
        return () => clearInterval(interval);
    }, [cooldown]);

    const fetchUrls = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/my-urls/", {
                headers: {
                    "Authorization": "Bearer " + authTokens.access
                }
            });
            const data = await response.json();
            if (response.status === 200) {
                setUrls(data);
            } else {
                logoutUser();
            }
        } catch (error) {
            console.error("Error fetching URLs:", error);
        } finally {
            setLoading(false);
        }
    };

    const createShortUrl = async (e) => {
        e.preventDefault();
        setError(null);
        setNewShortCode(null);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/shorten/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + authTokens.access
                },
                body: JSON.stringify({ long_url: longUrl })
            });

            const data = await response.json();

            if (response.status === 201) {
                setLongUrl("");
                setNewShortCode(data.short_code);
                fetchUrls();
            } else if (response.status === 429) {
                setCooldown(60); // Start 60s cooldown
                setError("Rate limit exceeded.");
            } else {
                setError("Something went wrong");
            }
        } catch (error) {
            console.error("Error creating URL:", error);
            setError("Network error");
        }
    };

    const deleteUrl = async (id) => {
        if (!window.confirm("Are you sure you want to delete this URL?")) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/url/${id}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + authTokens.access
                }
            });

            if (response.status === 200) {
                setUrls(urls.filter(url => url.id !== id));
            }
        } catch (error) {
            console.error("Error deleting URL:", error);
        }
    };

    return (
        <div className="container" style={{ padding: "2rem 0" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Shorten Your Links</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                    Paste your long URL below to create a trackable short link.
                </p>
            </div>

            <div className="card" style={{ marginBottom: "3rem" }}>
                <form onSubmit={createShortUrl} style={{ display: "flex", gap: "1rem" }}>
                    <input
                        type="url"
                        className="form-control"
                        placeholder="https://example.com/very/long/url..."
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        required
                        disabled={cooldown > 0}
                        style={{ flex: 1 }}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={cooldown > 0}
                        style={{ whiteSpace: "nowrap", minWidth: "120px" }}
                    >
                        {cooldown > 0 ? `Wait ${cooldown}s` : "Shorten URL"}
                    </button>
                </form>
                {newShortCode && (
                    <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--surface-color)", borderRadius: "var(--radius-md)", border: "1px solid var(--primary-color)", textAlign: "center" }}>
                        <p style={{ margin: "0 0 0.5rem 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>Your Short Link:</p>
                        <a
                            href={`http://127.0.0.1:8000/register/${newShortCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "2rem", letterSpacing: "2px", color: "var(--primary-color)", textDecoration: "underline", fontWeight: "bold" }}
                        >
                            {newShortCode}
                        </a>
                    </div>
                )}
                {cooldown > 0 && (
                    <div style={{ marginTop: "1rem", color: "red", fontWeight: "bold", textAlign: "center" }}>
                        Rate limit exceeded. Please wait {cooldown} seconds.
                    </div>
                )}
                {error && !cooldown && (
                    <div style={{ marginTop: "1rem", color: "red", fontWeight: "bold", textAlign: "center" }}>
                        {error}
                    </div>
                )}
            </div>

            <h3 style={{ marginBottom: "1.5rem" }}>Your Recent URLs</h3>

            {loading ? (
                <p>Loading...</p>
            ) : urls.length > 0 ? (
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Short Link</th>
                                <th>Original URL</th>
                                <th>Created</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {urls.map((url) => (
                                <tr key={url.id}>
                                    <td>
                                        <a href={`http://127.0.0.1:8000/register/${url.short_code}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500 }}>
                                            {window.location.host}/{url.short_code}
                                        </a>
                                    </td>
                                    <td style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {url.long_url}
                                    </td>
                                    <td style={{ color: "var(--text-secondary)" }}>
                                        {new Date(url.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <button
                                            className="btn btn-danger"
                                            style={{ padding: "0.25rem 0.75rem", fontSize: "0.875rem" }}
                                            onClick={() => deleteUrl(url.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center" style={{ padding: "4rem", background: "var(--surface-color)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)" }}>
                    <p style={{ color: "var(--text-secondary)" }}>No shortened URLs yet. Create one above!</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
