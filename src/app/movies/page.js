'use client';
import React, { useEffect, useState } from 'react';
import NewMovieCard from './NewMovieCard';
import './page.css';
import axios from 'axios';

export default function NewMoviesPage() {

  const [data,setdata]= useState([])
  const [loading, setLoading] = useState(true);
 
  const fetchData = async () => {
    try {
      const response = await axios.get('https://getpantry.cloud/apiv1/pantry/1605a1e6-3154-4a63-9869-c50e5de3b156/basket/newBasket15'); // Example API
       setdata(response.data);

      setdata(response.data);  // ✅ Full list (array)
    
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

  const resdata = data.newmovie?.map((i)=>data.movies?.find((k)=>k.id === i))
  


  return (
    <div style={{ padding: '20px', backgroundColor: '#060117',paddingLeft:'100px' }}>
      <h1 style={{ color: 'white', marginBottom: '20px',paddingLeft:'40px' }}>New Movies</h1>

      {resdata.map((movie) => (
        <NewMovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

