'use client';
import Image from 'next/image';
import './page.css';
import { getWatchlist, toggleWatchlist } from '../components/watchlist';
import { saveWatchedMovie } from '../components/recmanded';
import { useEffect, useState } from 'react';
import { watchlistEvent } from '../components/Event';
import { useRouter } from 'next/navigation';

export default function NewMovieCard({ movie }) {
  const [inwatchlist, setinWatchlist] = useState([]);
  const getwlist = async () => {
    const watchlist = await getWatchlist();
    setinWatchlist(watchlist);
  };

  const router = useRouter();

  useEffect(()=>{
    getwlist();
    const handler = () =>{
      getwlist()
      
    } 
    watchlistEvent.on('updated', handler);
    return () => watchlistEvent.off('updated', handler);
  },[])

  const isinWatchlist = inwatchlist.includes(movie.id)
  const isSeries = movie.ref === '3001'


  return (
    <div className="new-movie-card">
      {/* Left Side - Big Portrait */}
      <div className="left-image" onClick={()=>router.push(`/movie/${movie.id}`)} >
        <Image
          src={movie.landimg}
          alt={movie.title}
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="left-gradient"></div>
      </div>

      {/* Right Side - Info */}
      <div className="right-info">
        <h2 className="movie-title">{movie.tit}</h2>
        <p className="movie-description">A short description about the movie storyline. Exciting, action-packed and dramatic!</p>
        {
          isSeries ? <div className="hero-buttons2">
          <button className="my-list-button2" onClick={()=>toggleWatchlist(movie.id)}>
          <i className={isinWatchlist ? 'bi bi-check-lg' : 'bi bi-plus'}
style={{
  color: isinWatchlist ? '#00FF7F' : '#fff',              // ✅ Icon color
  fontSize: '1.2rem',
}}></i> {/* ✅ Bootstrap Icon */}
            <span className="my-list-tex2" style={{
              color: isinWatchlist ? '#00FF7F' : '#fff',               // ✅ Green text if added
            }}>{isinWatchlist ? 'Already Added' : 'Add to My List'}</span>
          </button>
        </div>:<div className="hero-buttons">
        <button className="watch-now-button" onClick={()=>{saveWatchedMovie(movie.id)
          const params = new URLSearchParams();
          params.set('video', encodeURIComponent(JSON.stringify(movie)));

          router.push(`/videoplayer?${params.toString()}`);
        }} >
      <Image src="https://files.catbox.moe/y05iax.png" alt="Play Icon" width={20} height={20} />
      <span>Watch Now</span>
    </button>
    <button className="my-list-button" onClick={()=>toggleWatchlist(movie.id)}>
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
        }
        
      </div>
    </div>
  );
}
