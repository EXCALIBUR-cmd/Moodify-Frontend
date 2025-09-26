import React, { useState, useRef } from "react";
import "./moodSongs.css";
const MoodSongs = ({ darkMode, songs = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);

  const handlePlay = (song) => {
    if (audioRef.current) {
      audioRef.current.src = song.audio; // audio URL from DB
      audioRef.current.play();
      setCurrentSong(song.title);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentSong(null);
    }
  };

  // Filter songs based on search term
  const filteredSongs = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className={`mood-songs ${darkMode ? "dark" : "light"}`}>
      <div className="mood-songs-inner">
        <h3 className="songs-heading">Recommended Tracks</h3>

        {/* Search Bar */}
        <div className="search-row">
          <input
            className="search-input"
            type="text"
            placeholder="Search for songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="song-list">
          {filteredSongs.length === 0 ? (
            <div className="no-results">No songs found</div>
          ) : (
            filteredSongs.map((s, idx) => (
              <div
                key={`${s.title}-${s.artist}-${idx}`}
                className={`song-card ${
                  currentSong === s.title ? "playing" : ""
                }`}
              >
                <div className="song-info">
                  <div className="song-title">{s.title}</div>
                  <div className="song-artist">{s.artist}</div>
                </div>

                <div className="song-controls">
                  <button
                    className="control-btn play-btn"
                    onClick={() => handlePlay(s)}
                  >
                    ▶️
                  </button>
                  <button
                    className="control-btn pause-btn"
                    onClick={handlePause}
                  >
                    ⏸
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} controls style={{ display: "none" }} />
      </div>
    </section>
  );
};

export default MoodSongs;
