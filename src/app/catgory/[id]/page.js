'use client';
import { useEffect, useState } from "react";
import { setFdata, setMovies, setSlider } from "../../components/globaldata";
import { getWatchlist } from "../../components/watchlist";
import './page.css'
import axios from "axios";
import Image from 'next/image';
import { watchlistEvent } from "../../components/Event";
import MovieRow from "@/app/components/MovieRow";

export default function Category({params}) {

    const [data,setdata]= useState([])
    const [loading, setLoading] = useState(true);
    const [watched,setWatched] = useState([])
    const [inwatchlist, setinWatchlist] = useState([]);

  
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
    
      const getwlist = async () => {
        const watchlist = await getWatchlist();
        setinWatchlist(watchlist);
      };
      
      const getLastWatchedMovieId = async () => {
        try {
          const existing = await localStorage.getItem('WATCHED_MOVIES');
          const watched = existing ? JSON.parse(existing) : [];
          setWatched(watched)
        } catch (e) {
          console.error('Failed to read movie:', e);
          return null;
        }
      };
    
      useEffect(() => {
        fetchData();
        getwlist();
        getLastWatchedMovieId()
        const handler = () =>{
          getwlist()
          
        } 
        watchlistEvent.on('updated', handler);
        return () => watchlistEvent.off('updated', handler);
      }, []);

      if (loading) {
        return (
          <div className="gradient-loader-container">
            <div className="gradient-loader"></div>
          </div>
        );
      }
    
    
      if (!data || data.length === 0) {
        return <p style={{ color: 'white', textAlign: 'center' }}>No data found</p>;
      }

      const resdata = data.category.find((i)=>i.id === params.id)


    return(
        <div style={{ padding: '20px', backgroundColor: '#060117',paddingLeft:'10px',paddingBottom:'20vh' }}>
        
        <div className="hero-background2">
          <div className="containerimg" >
        <Image
            src={resdata?.img}   // ✅ Your initial poster image here
            alt="Hero Poster"
            fill
            style={{ objectFit: 'cover' }}
          />
          <h1 style={{ color: 'white', marginBottom: '20px',paddingLeft:'40px',position:'absolute',top:'10%',fontSize:'450%',fontWeight:'700',zIndex:"5" }}>{`${resdata.title} Movies`}</h1></div>
        </div>
        {
          resdata.sliders.map((i)=><MovieRow catid={i.catid} title={i.tit} styleid={i.style} />)
        }
      </div>
    )
}