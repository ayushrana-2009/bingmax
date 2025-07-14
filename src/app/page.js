'use client';
import { useEffect, useState } from 'react';
import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import axios, { Axios } from 'axios';
import { getMovies, getSlider, setFdata, setMovies, setSlider } from './components/globaldata';
import MovieRow from './components/MovieRow';
import { getWatchlist } from './components/watchlist';
import { watchlistEvent } from './components/Event';
import Slider from './components/Slider';
import Cwatch from './components/Cwatch';
import ContinueWatchingRow from './components/Cwatch';
import TopTenSlider from './components/TopTenSlider';
import Category from './components/Category';

export default function Home() {

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
      setFdata(response.data)
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

  const [profile, setProfile] = useState({
    name: '',
    image: '',
  });


  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setProfile({
        name: parsedProfile.name,
        image: parsedProfile.image,
      });
    }
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

  const slider = getSlider()

  


  const watchedlist = watched.map((i) => data.movies.find((k) => k.id === i));

  

  

  const resdata = inwatchlist.map((i) => data.movies.find((k) => k.id === i));

  

  return (
    <main >
      <Navbar />
      <HeroSection id={data?.slider?.id} />
      <ContinueWatchingRow allMovies={data.movies} />
      {
        data.rows2.map((i)=><MovieRow catid={i.catid} title={i.title} styleid={i.style} />)
      }
      {
        resdata.length > 0 && <Slider data={resdata} styleid={'2002'} title={profile.name
          ? `${profile.name.charAt(0).toUpperCase() + profile.name.slice(1)}'s Watchlist`
          : 'Your Watchlist'} />
      }
      <TopTenSlider data={data.topten} movies={data.movies} />
      {
        watchedlist.map((i)=><MovieRow catid={i.recid} title={`Because you Like ${i.tit}`} styleid={"2002"} />)
      }
      <Category/>
      {
        slider.map((i)=><MovieRow catid={i.catid} title={i.title} styleid={i.style} />)
      }
    </main>
  );
}

