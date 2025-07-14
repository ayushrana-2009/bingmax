'use client';
import Image from 'next/image';
import './category.css';
import { getFdata, getMovies } from './globaldata';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addToWatchlist, getWatchlist, toggleWatchlist } from './watchlist';
import { watchlistEvent } from './Event';

export default function Category() {

  const router = useRouter();

  
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [inwatchlist, setinWatchlist] = useState([]);

 const fulldata = getFdata()
 const category = fulldata.category

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
    
  }, [category]);


  if (!category || category.length === 0) return null;
  const styleid = "2002";

  return (
    <section className={"movie-row"}>
      <h2 className={"row-title"}>Category</h2>

      <div className="movie-card-wrapper">
        {/* Left Gradient & Button */}
        <div className="scroll-fade-left"></div>
        {showLeft && (
          <button className="scroll-button left" onClick={scrollLeft}>
            <i className="bi bi-chevron-left"></i>
          </button>
        )}

        {/* Scrollable Content */}
        <div className={styleid === "2002" ? "landscape-container2" : "movie-card"}  ref={scrollRef}>
          {category.map((movie) =>{            
             
           return (
            <div className={styleid === "2002" ? "landscape-card2" : "big-card"} onClick={()=>router.push(`/catgory/${movie.id}`)} key={movie.id}>
              {/* Image */}
              <div  className={styleid === "2002" ? "image2" : "card-image"}>
                <Image
                  src={movie.img}
                  alt={movie.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h2 className={"row-title2"}>{movie.title}</h2>
               </div>)
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
