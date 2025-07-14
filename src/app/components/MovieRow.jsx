'use client';
import Image from 'next/image';
import './movierow.css';
import { getMovies } from './globaldata';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addToWatchlist, getWatchlist, toggleWatchlist } from './watchlist';
import { watchlistEvent } from './Event';

export default function MovieRow({ title, catid, styleid }) {

  const router = useRouter();
  const movies = getMovies();
  
  const resdata = catid.map((i) => movies.find((k) => k.id === i));
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [inwatchlist, setinWatchlist] = useState([]);

 

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const canScrollRight = el.scrollWidth > el.clientWidth && el.scrollLeft + el.clientWidth < el.scrollWidth;
    const canScrollLeft = el.scrollLeft > 0;

    setShowLeft(canScrollLeft);
    setShowRight(canScrollRight);
  };

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => checkScroll(), 100);
    
  }, [resdata]);

  

  useEffect(() => {
    getwlist();
    const handler = () =>{
      getwlist()
      
    } 
    watchlistEvent.on('updated', handler);
    return () => watchlistEvent.off('updated', handler);
  }, []);

 const getwlist = async () => {
    const watchlist = await getWatchlist();
    setinWatchlist(watchlist);
  };

  if (!resdata || resdata.length === 0) return null;

  return (
    <section className={"movie-row"}>
      <h2 className={"row-title"}>{title}</h2>

      <div className="movie-card-wrapper">
        {/* Left Gradient & Button */}
        <div className="scroll-fade-left"></div>
        {showLeft && (
          <button className="scroll-button left" onClick={scrollLeft}>
            <i className="bi bi-chevron-left"></i>
          </button>
        )}

        {/* Scrollable Content */}
        <div className={styleid === "2002" ? "landscape-container" : "movie-card"}  ref={scrollRef}>
          {resdata.map((movie) =>{

            const isinWatchlist = inwatchlist.includes(movie.id)
            
             
           return (
            <div className={styleid === "2002" ? "landscape-card" : "big-card"} key={movie.id}>
              {/* Image */}
              <div onClick={()=>router.push(`/movie/${movie.id}`)} className={styleid === "2002" ? "" : "card-image"}>
                <Image
                  src={movie.portimg}
                  alt={movie.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Hover Content */}
              {styleid === "2002" ? (
                <div className="hover-gradient">
                  <div className="landscape-title-text">{movie.title}</div>
                  <p className="info-descg">{movie?.des}</p>
                  <button className="landscape-watchlist-btn" style={{
        backgroundColor: isinWatchlist ? '#144e29' : '#212227',  // ✅ Green if added, dark otherwise
        color: isinWatchlist ? '#00FF7F' : '#fff',               // ✅ Green text if added
      }} onClick={()=>toggleWatchlist(movie.id)}>
                    <i className={isinWatchlist ? 'bi bi-check-lg' : 'bi bi-plus'} style={{
          color: isinWatchlist ? '#00FF7F' : '#fff',              // ✅ Icon color
          fontSize: '1.2rem',
        }}></i>
                    <span>{isinWatchlist ? 'Added' : 'My List'}</span>
                  </button>
                </div>
              ) : (
                <div className="card-gradient-overlay">
                  <h3 className="info-titleg">{movie.title}</h3>
                  <p className="info-descg">Exciting, action-packed and dramatic!</p>
                  <button className="watchlist-btn" style={{
        backgroundColor: isinWatchlist ? '#144e29' : '#212227',  // ✅ Green if added, dark otherwise
        color: isinWatchlist ? '#00FF7F' : '#fff',               // ✅ Green text if added
      }} onClick={()=>toggleWatchlist(movie.id)}>
                    <i className={isinWatchlist ? 'bi bi-check-lg' : 'bi bi-plus'} style={{
          color: isinWatchlist ? '#00FF7F' : '#fff',              // ✅ Icon color
          fontSize: '1.2rem',
        }}></i>
                    <span>{isinWatchlist ? 'Added' : 'My List'}</span>
                  </button>
                </div>)} </div>)
          } 
              
           
          )}
        </div>

        {/* Right Gradient & Button */}
        {showRight && (
          <button className="scroll-button right" onClick={scrollRight}>
            <i className="bi bi-chevron-right"></i>
          </button>
        )}
        <div className="scroll-fade-right"></div>
      </div>
    </section>
  );
}
