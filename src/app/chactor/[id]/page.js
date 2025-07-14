'use client';

import Image from 'next/image';
import './page.css';
import { useEffect, useRef, useState } from 'react';
import { getMovies, setMovies, setSlider } from '@/app/components/globaldata';
import Navbar from '@/app/components/Navbar';
import axios from 'axios';
import Slider from '@/app/components/Slider';

export default function CharacterDetails({ params }) {
    const [data,setdata]= useState([])
    const [loading, setLoading] = useState(true);

  

    const fetchData = async () => {
      try {
        const response = await axios.get('https://getpantry.cloud/apiv1/pantry/1605a1e6-3154-4a63-9869-c50e5de3b156/basket/newBasket15'); // Example API
         setdata(response.data);
  
        setdata(response.data);  // ✅ Full list (array)
        setMovies(response.data.movies)
        setSlider(response.data.rows)
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
      
    }, []);
  
    if (loading) {
      return (
        <div className="gradient-loader-container">
          <div className="gradient-loader"></div>
        </div>
      );
    }

    const character = data.chdetails.find((c) => c.id === params.id);
    
    const resdata = character.resid.map((i)=>data.movies.find((k)=>k.id === i))

  if (!character) {
    return <p style={{ color: 'white' }}>Character not found</p>;
  }

  return (
    <>
      <Navbar />
      <section className="character-hero-section">
        {/* Gradient Background */}
        <div className="character-gradient-overlay"></div>

        {/* Left Text */}
        <div className="character-left">
          <h1 className="character-title">{character.tit}</h1>
          <p className="character-description">{character.des}</p>
        </div>

        {/* Right Portrait Image */}
        <div className="character-right">
          <Image
            src={character.background}
            alt={character.tit}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </section>
      <Slider data={resdata} styleid={'2002'} title={`Movies of ${character.tit}`} />
    </>
  );
}
