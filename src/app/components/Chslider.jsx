'use client';
import Image from 'next/image';
import './chslider.css';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Chslider({ title, data }) {

    const scrollRef = useRef(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);
  
   const router = useRouter();
  
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
    }, [data]);

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
        <div className={ "movie-card2"}  ref={scrollRef}>
          {data.map((movie) => (
            <div className={ "big-card2"} key={movie.id}>
              {/* Image */}
              <div onClick={()=>router.push(`/chactor/${movie.id}`)} className={ "card-image"}>
                <Image
                  src={movie.background}
                  alt={movie.tit}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Hover Content */}
               (
                <div className="card-gradient-overlay">
                  <h3 className="info-titleg">{movie.tit}</h3>
                  <p className="info-descg">{movie.des}</p>
                  
                </div>
              )
            </div>
          ))}
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
