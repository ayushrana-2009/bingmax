'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './TopTenSlider.css';  // ✅ Create this CSS file next

export default function TopTenSlider({ data, movies }) {
    const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const router = useRouter();

  const resdata = data.map((id) => movies.find((item) => item.id === id));

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

  const handleClick = (item) => {
    router.push(`/movie/${item.id}`);  // ✅ Adjust your route
  };

  return (
    <section className="top-ten-section">
      <h2 className="top-ten-title">Top Ten</h2>
      <div className="movie-card-wrapper">
{/* Left Gradient & Button */}
<div className="scroll-fade-left2"></div>
        {showLeft && (
          <button className="scroll-button left" onClick={scrollLeft}>
            <i className="bi bi-chevron-left"></i>
          </button>
        )}
      <div className="top-ten-scroll" ref={scrollRef}>
        {resdata.map((item, index) => (
          <div key={item.id} className="top-ten-card" onClick={() => handleClick(item)}>
            <div className="number-overlay">
              {index + 1}
            </div>

            <div className="image-container">
              <Image
                src={item.portimg}
                alt={item.tit}
                fill
                style={{ objectFit: 'cover', borderRadius: '10px' }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Right Gradient & Button */}
      {showRight && (
          <button className="scroll-button right" onClick={scrollRight}>
            <i className="bi bi-chevron-right"></i>
          </button>
        )}
        <div className="scroll-fade-right2"></div></div>
    </section>
  );
}
