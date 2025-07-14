
'use client';
import { setMovies, setSlider } from '@/app/components/globaldata'
import Image from 'next/image';
import './page.css'
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Navbar from '@/app/components/Navbar';
import MovieRow from '@/app/components/MovieRow';
import Slider from '../../components/Slider';
import Chslider from '@/app/components/Chslider';
import { saveWatchedMovie } from '@/app/components/recmanded';
import SeasonSelector from '@/app/components/SeasonSelector';
import EpisodeList from '@/app/components/EpisodeList';
import { getWatchlist, toggleWatchlist } from '@/app/components/watchlist';
import { watchlistEvent } from '@/app/components/Event';
import { useRouter } from 'next/navigation';


export default function MovieDetails({ params }) {


  const [data, setdata] = useState([])
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [inwatchlist, setinWatchlist] = useState([]);
  const [showVideo, setShowVideo] = useState(false);

  const router = useRouter()

  useEffect(() => {

    getwlist();
    const handler = () => {
      getwlist()

    }
    watchlistEvent.on('updated', handler);
    return () => watchlistEvent.off('updated', handler);
  }, []);

  const getwlist = async () => {
    const watchlist = await getWatchlist();
    setinWatchlist(watchlist);
  };

  useEffect(() => {
    fetchData()
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 5000);  // ✅ Show video after 5 seconds
    return () => clearTimeout(timer);
  }, []);

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

  const movie = data.movies?.find((m) => m.id === params.id);
  const isSeries = movie?.ref === '3001' && Array.isArray(movie.season);


  //  const [selectedSeason, setSelectedSeason] = useState(
  //     isSeries ? movie.season[0] : null
  //   );
  useEffect(() => {
    document.title = `Watch ${movie?.tit} on BingMax`;
    if (isSeries && movie?.season?.[0]) {
      setSelectedSeason(movie.season[0]);
    }
  }, [isSeries, movie]);




  if (loading) {
    return (
      <div className="gradient-loader-container">
        <div className="gradient-loader"></div>
      </div>
    );
  }



  const catid = movie.recid.map((i) => data.movies.find((m) => m.id === i))
  const catid2 = movie.recid2.map((i) => data.movies.find((m) => m.id === i))
  const chdata = movie.chid.map((i) => data.chdetails.find((m) => m.id === i))
  const isinWatchlist = inwatchlist.includes(movie?.id)

  if (!movie) {
    return <p style={{ color: 'white' }}>Movie not found</p>;
  }


  return (

    <>

      <section className={`hero-section `}>

        {/* Background Poster Image */}
        <div className="hero-background">
          {showVideo ? (
            <video
              ref={videoRef}
              src={movie?.tailer}  // ✅ Your background video here
              autoPlay
              muted
              loop
              playsInline
              className="hero-video"
            ></video>
          ) : (
            <Image
              src={movie?.landimg}   // ✅ Your initial poster image here
              alt="Hero Poster"
              fill
              style={{ objectFit: 'cover' }}
            />
          )}
          <div className="hero-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <div className="title-image mb-3">
            <Image
              src={movie?.poster}  // ✅ Replace with your title image link
              alt="Movie Logo"
              width={300}
              height={100}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <h1 className="hero-title">{movie?.title}</h1>
          <p className="hero-description">
            {movie?.des}
          </p>
          {
            isSeries ? (<>

              <div className="hero-buttons2">
                <button className="my-list-button2" onClick={() => toggleWatchlist(movie.id)}>
                  <i className={isinWatchlist ? 'bi bi-check-lg' : 'bi bi-plus'}
                    style={{
                      color: isinWatchlist ? '#00FF7F' : '#fff',              // ✅ Icon color
                      fontSize: '1.2rem',
                    }}></i> {/* ✅ Bootstrap Icon */}
                  <span className="my-list-tex2" style={{
                    color: isinWatchlist ? '#00FF7F' : '#fff',               // ✅ Green text if added
                  }}>{isinWatchlist ? 'Already Added' : 'Add to My List'}</span>
                </button>
              </div>

            </>) : (<div className="hero-buttons">
              <button className="watch-now-button" onClick={() => {
                saveWatchedMovie(movie.id)
                const params = new URLSearchParams();
                params.set('video', encodeURIComponent(JSON.stringify(movie)));
                
                router.push(`/videoplayer?${params.toString()}`);


              }} >
                <Image src="https://files.catbox.moe/y05iax.png" alt="Play Icon" width={20} height={20} />
                <span>Watch Now</span>
              </button>
              <button className="my-list-button" onClick={() => toggleWatchlist(movie.id)}>
                <i className={isinWatchlist ? 'bi bi-check-lg' : 'bi bi-plus'}
                  style={{
                    color: isinWatchlist ? '#00FF7F' : '#fff',              // ✅ Icon color
                    fontSize: '1.2rem',
                  }}></i> {/* ✅ Bootstrap Icon */}
                <span className="my-list-text" style={{
                  color: isinWatchlist ? '#00FF7F' : '#fff',               // ✅ Green text if added
                }}>{isinWatchlist ? 'Already Added' : 'Add to My List'}</span>
              </button>
            </div>)
          }

        </div>

        <div className="hero-bottom-gradient"></div>
      </section>
      {
        isSeries && <section style={{ backgroundColor: '#060117', }} >
          <div style={{
            paddingLeft: '130px',            /* Space for sidebar if needed */
            backgroundColor: '#060117',
          }} >
            {
              selectedSeason ? (
                <SeasonSelector
                  seasons={movie.season}
                  selectedSeason={selectedSeason}
                  onSelectSeason={setSelectedSeason}
                />
              ) : (
                <p className="text-white">Loading seasons...</p>
              )
            }
          </div>
          <div style={{
            paddingLeft: '50px',            /* Space for sidebar if needed */
            backgroundColor: '#060117',
          }} >{selectedSeason ? (
            <EpisodeList
              episodes={selectedSeason.epsod}
              mid={movie.id}
              secid={selectedSeason.id}
            />
          ) : (
            <p className="text-white">Loading seasons...</p>
          )}</div>
        </section>
      }

      <Chslider data={chdata} title={"Cast & Crew"} />
      <Slider styleid={'2001'} title={"Recommended For You"} data={catid} />
      <Slider styleid={'2002'} title={"Related Movies"} data={catid2} />
    </>
  );
}
