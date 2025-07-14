'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import './page.css';

export default function FullScreenSearch() {
  const [searchText, setSearchText] = useState('');
  const [allMovies, setAllMovies] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await axios.get('https://getpantry.cloud/apiv1/pantry/1605a1e6-3154-4a63-9869-c50e5de3b156/basket/newBasket15');
      const movies = response.data.movies; // check this line based on API structure

      setAllMovies(movies);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = searchText.trim() === ''
      ? allMovies
      : allMovies.filter((movie) =>
          movie.tit?.toLowerCase().includes(searchText.toLowerCase())
        );
    setFilteredResults(filtered);
  }, [searchText, allMovies]);

  if (loading) {
    return (
      <div className="gradient-loader-container">
        <div className="gradient-loader"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="search-fullscreen-container">
        <div className="search-bar-wrapper">
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
        </div>

        <h3 style={{ color: 'white', marginBottom: '20px', paddingLeft: '120px' }}>
          You searched for:{" "}
          <span style={{ color: '#00f0ff' }}>
            {searchText.trim() === '' ? 'All Movies' : searchText}
          </span>
        </h3>

        <div className="search-results-grid">
          {filteredResults.map((movie) => (
            <div
              key={movie.id}
              className="search-result-card"
              onClick={() => router.push(`/movie/${movie.id}`)}
            >
              <div className="image-container">
                <Image
                  src={movie.portimg}
                  alt={movie.tit}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className="image-gradient"></div>

                <div className="hover-overlay">
                  <p className="hover-title">{movie.tit}</p>
                  <p className="hover-description">{movie.des}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
