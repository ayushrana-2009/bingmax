'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import './profile.css';  // ✅ Your CSS file for styles
import { watchlistEvent } from '../components/Event';
import { getWatchlist } from '../components/watchlist';
import MovieRow from '../components/MovieRow';
import { getMovies, setMovies } from '../components/globaldata';
import Slider from '../components/Slider';
import axios from 'axios';
import ContinueWatchingRow from '../components/Cwatch';

export default function ProfilePage() {
  const [inwatchlist, setinWatchlist] = useState([]);
  const [data,setdata]= useState([])
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    image: '',
  });

  
  const fetchData = async () => {
    try {
      const response = await axios.get('https://getpantry.cloud/apiv1/pantry/1605a1e6-3154-4a63-9869-c50e5de3b156/basket/newBasket15'); // Example API
       setdata(response.data);

      setdata(response.data);  // ✅ Full list (array)
      setMovies(response.data.movies)
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
    }
  };

 

  const router = useRouter();

  useEffect(() => {
    fetchData();
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setProfile({
        name: parsedProfile.name,
        image: parsedProfile.image,
      });
    }
  }, []);

  const getwlist = async () => {
    const watchlist = await getWatchlist();
    setinWatchlist(watchlist);
  };

  useEffect(() => {
    getwlist();
    
    const handler = () =>{
      getwlist()
      
    } 
    watchlistEvent.on('updated', handler);
    return () => watchlistEvent.off('updated', handler);
  }, []);


  const resdata = inwatchlist.map((i)=>data.movies?.find((k)=>k.id === i))
  

  if (loading) {
    return (
      <div className="gradient-loader-container">
        <div className="gradient-loader"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="profile-page-container">

        {/* ✅ Top Right Create Profile Button */}
        {!profile.name && (
          <button
            className="create-profile-button"
            onClick={() => router.push('/createprofile')}
          >
            Create Profile
          </button>
        )}

        {/* ✅ Circle Profile Image */}
        {profile.image ? (
          <Image
            src={profile.image}
            alt="Profile Image"
            width={100}
            height={100}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div className="profile-placeholder-img"></div>
        )}

        {/* ✅ Profile Name */}
        <h2 className="profile-name">{profile.name || 'Guest User'}</h2>

        {/* ✅ Blank Space Below */}
        <div className="profile-content-blank">
          <ContinueWatchingRow allMovies={data?.movies} />
          {
        inwatchlist.length > 0 && <Slider data={resdata} title={'your Watchlist'} catid={inwatchlist} styleid={'2002'} />
      }
        </div>
        
      </div>
      
      
    </>
  );
}
