'use client';
import Image from 'next/image';
import './herosection.css';
import { useEffect, useRef, useState } from 'react';
import { getMovies } from './globaldata';
import { watchlistEvent } from './Event';
import { getWatchlist, toggleWatchlist } from './watchlist';
import { saveWatchedMovie } from './recmanded';
import { useRouter } from 'next/navigation';

export default function HeroSection({ id }) {
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [movies, setMovies] = useState(null);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [inwatchlist, setinWatchlist] = useState([]);
  const videoRef = useRef(null);
  const router = useRouter()

  const getwlist = async () => {
    const watchlist = await getWatchlist();
    setinWatchlist(watchlist);
  };

  useEffect(() => {
    const data = getMovies()
    setMovies(data)
    setLoadingMovies(false)
    getwlist();
    const handler = () =>{
      getwlist()
      
    } 
    watchlistEvent.on('updated', handler);
    return () => watchlistEvent.off('updated', handler);
  }, []);

  // switch to video after 5s
  useEffect(() => {
    const t = setTimeout(() => setShowVideo(true), 5000);
    return () => clearTimeout(t);
  }, []);

  // if still loading or no movies array yet
  if (loadingMovies || !movies) {
    return (
      <section className="hero-section">
        <div className="hero-poster-loader">
          <div className="gradient-loader" />
        </div>
      </section>
    );
  }

  const resdata = movies.find((m) => m.id === id);
  if (!resdata) {
    return (
      <section className="hero-section">
        <div className="hero-poster-loader">
          <div className="gradient-loader" />
        </div>
      </section>
    );
  }

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

 

  const isinWatchlist = inwatchlist.includes(resdata?.id)

  

  return (
    <section className={`hero-section ${showVideo && isPlaying ? 'video-playing' : ''}`}>

      {/* Background Poster Image */}
      <div className="hero-background">
      {showVideo ? (
          <video
          ref={videoRef}
            src={resdata?.tailer}  // ✅ Your background video here
            autoPlay
            muted
            loop
            playsInline
            className="hero-video"
          ></video>
        ) : (
          <Image
            src={resdata?.landimg}   // ✅ Your initial poster image here
            alt="Hero Poster"
            fill
            style={{ objectFit: 'cover' }}
          />
        )}
        <div className="hero-overlay"></div>
      </div>

      {/* Hero Content */}
      <div className="hero-content">
      <div className="title-image mb-3">
    <Image
      src={resdata?.poster}  // ✅ Replace with your title image link
      alt="Movie Logo"
      width={300}
      height={100}
      style={{ objectFit: 'contain' }}
    />
  </div>
        <h1 className="hero-title">{resdata?.title}</h1>
        <p className="hero-description">
        {resdata?.des}
        </p>
        <div className="hero-buttons">
        <button className="watch-now-button" onClick={()=>{saveWatchedMovie(resdata.id)
          const params = new URLSearchParams();
          params.set('video', encodeURIComponent(JSON.stringify(resdata)));

          router.push(`/videoplayer?${params.toString()}`);
        }} >
      <Image src="https://files.catbox.moe/y05iax.png" alt="Play Icon" width={20} height={20} />
      <span>Watch Now</span>
    </button>
    <button className="my-list-button" onClick={()=>toggleWatchlist(resdata.id)}>
      <i className={isinWatchlist ? 'bi bi-check-lg' : 'bi bi-plus'}
      style={{
        color: isinWatchlist ? '#00FF7F' : '#fff',              // ✅ Icon color
        fontSize: '1.2rem',
      }}></i> {/* ✅ Bootstrap Icon */}
      <span className="my-list-text" style={{
          color: isinWatchlist ? '#00FF7F' : '#fff',              // ✅ Icon color
          fontSize: '1.2rem',
        }}>{isinWatchlist ? 'Added' : 'My List'}</span>
    </button>
        </div>
      </div>
      {showVideo && (
        <div className="video-controls2">
          <button className="video-control-btn" onClick={togglePlayPause}>
            {isPlaying ? (
              <i className="bi bi-pause-fill"></i>
            ) : (
              <i className="bi bi-play-fill"></i>
            )}
          </button>

          <button className="video-control-btn" onClick={toggleMute}>
            {isMuted ? (
              <i className="bi bi-volume-mute-fill"></i>
            ) : (
              <i className="bi bi-volume-up-fill"></i>
            )}
          </button>
        </div>
      )}
      <div className="hero-bottom-gradient"></div>
    </section>
  );
}
