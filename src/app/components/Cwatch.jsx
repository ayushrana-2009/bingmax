'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import './cwatch.css';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { watchlistEvent } from './Event';


export default function ContinueWatchingRow({ allMovies }) {
  const [watchHistory, setWatchHistory] = useState([]);
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const existing = localStorage.getItem('C_MOVIES');
    if (existing) {
      const history = JSON.parse(existing);
      setWatchHistory(history);
    }
    const handler = () => {
      const existing = localStorage.getItem('C_MOVIES');
      if (existing) {
        const history = JSON.parse(existing);
        setWatchHistory(history);
      }

    }
    watchlistEvent.on('updated2', handler);
    return () => watchlistEvent.off('updated2', handler);
  }, []);

  function deleteWatchProgress(videoId, epsoideid = null) {
    const existing = localStorage.getItem('C_MOVIES');
    if (!existing) return;

    let history = JSON.parse(existing);

    if (epsoideid) {
      // ✅ Series: Match both id and epsoideid
      history = history.filter(item => !(item.id === videoId && item.epsoideid === epsoideid));
    } else {
      // ✅ Movie: Match by id only
      history = history.filter(item => item.id !== videoId);
    }

    localStorage.setItem('C_MOVIES', JSON.stringify(history));
    watchlistEvent.emit('updated2');
  }


  const getMovieData = (id) => {
    return allMovies.find((movie) => movie.id === id);
  };

  const formatMinutesLeft = (total, watched) => {
    const remaining = total - watched;
    const minutesLeft = Math.floor(remaining / 60);
    return `${minutesLeft}m left`;
  };

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
  }, [allMovies]);

  if (watchHistory.length === 0) return null;

  return (
    <section className={"movie-row"}>
      <h2 className={"row-title"}>Continue Watching</h2>

      <div className="movie-card-wrapper">
        {/* Left Gradient & Button */}
        <div className="scroll-fade-left"></div>
        {showLeft && (
          <button className="scroll-button left" onClick={scrollLeft}>
            <i className="bi bi-chevron-left"></i>
          </button>
        )}

        {/* Scrollable Content */}
        <div className={"movie-card3"} ref={scrollRef}>
          {watchHistory.map((movie) => {
            const movieData = getMovieData(movie.id);
            if (!movieData) return null;
            const resdata = allMovies.find((i) => i.id === movie.id)
     
            const isSeries = resdata.ref === '3001'
            let img
            if (isSeries) {
              const seasondata = resdata.season.find((i) => i.id === movie.seasonid)
              const epdata = seasondata.epsod?.find((i) => i.id === movie.epsoideid)
          
              img = epdata?.img
            } else {
              img = resdata.landimg
            }




            return (
              <div className={"big-card3"} key={movie.id}>
                <button
                  className="delete-icon"
                  onClick={() => {
                    deleteWatchProgress(movie.id, movie.epsoideid);
                  }}
                >
                  <FaTrash size={14} />
                </button>
                {/* Image */}
                <div onClick={() => {

                  if (isSeries) {
                    const params = new URLSearchParams();
                    params.set('video', encodeURIComponent(JSON.stringify(resdata)));
                    params.set('season', encodeURIComponent(JSON.stringify(movie.seasonid)))
                    params.set('epid', encodeURIComponent(JSON.stringify(movie.epsoideid)));

                    router.push(
                      `/videoplayer?${params.toString()}`
                    );
                  } else {

                    const params = new URLSearchParams();
                    params.set('video', encodeURIComponent(JSON.stringify(resdata)));

                    router.push(`/videoplayer?${params.toString()}`);
                  }
                }} className={"card-image"}>
                  <Image
                    src={img}
                    alt={resdata.tit}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="bottom-gradient"></div>
                <div className="progress-text">
                  {formatMinutesLeft(movie.totalduration, movie.userwatched)}
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${(movie.userwatched / movie.totalduration) * 100}%`,
                    }}
                  ></div>
                </div>

              </div>
            )
          })}
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
