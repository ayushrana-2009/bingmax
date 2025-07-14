'use client';
import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import './CustomVideoPlayer.css';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { FaExpand, FaCompress } from 'react-icons/fa';
import { FaTachometerAlt } from 'react-icons/fa';
import { FaSignal } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { FaListUl } from 'react-icons/fa';
import Image from 'next/image';


function saveWatchProgress(videoId, totalDuration, userWatched, extraData = {}) {
  const existing = localStorage.getItem('C_MOVIES');
  let history = existing ? JSON.parse(existing) : [];

  const isSeries = extraData.seasonid && extraData.epsoideid;  // ✅ Check if series

  // ✅ Filter out the existing object (match id and epsoideid for series, only id for movie)
  history = history.filter((item) => {
    if (isSeries) {
      return !(item.id === videoId && item.epsoideid === extraData.epsoideid);
    } else {
      return item.id !== videoId;
    }
  });

  const newEntry = {
    id: videoId,
    totalduration: totalDuration,
    userwatched: userWatched,
    ...extraData, // ✅ For series: seasonid, epsoideid, ref etc
  };

  // ✅ Add the new/updated item at the beginning
  history.unshift(newEntry);

  // ✅ Save back
  localStorage.setItem('C_MOVIES', JSON.stringify(history));
}





export default function CustomVideoPlayer({ title,videoSource,currentVideoId, seasonid, epsoideid,ref,isSeries,epdata,fulldata }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);  // Default full volume (1 = 100%)
const [showVolumeSlider, setShowVolumeSlider] = useState(false);
const [isFullscreen, setIsFullscreen] = useState(false);
const [playbackSpeed, setPlaybackSpeed] = useState(1);  // default speed
const [showSpeedOptions, setShowSpeedOptions] = useState(false);
const [selectedQuality, setSelectedQuality] = useState('Mid');  // Default Quality
const [showQualityOptions, setShowQualityOptions] = useState(false);
//const title = 'Video Player';
const router = useRouter()
const videoSources = videoSource

const [currentSrc, setCurrentSrc] = useState(videoSources[selectedQuality]);
const [showControls, setShowControls] = useState(true);
const hideTimeout = useRef(null);
const [savedTime, setSavedTime] = useState(0);
const [showEpisodesOverlay, setShowEpisodesOverlay] = useState(false);



if(!currentSrc){
  return (
    <div className="gradient-loader-container">
      <div className="gradient-loader"></div>
    </div>
  );
}



useEffect(() => {
  document.title = title;  // ✅ Set browser tab title
}, [title]);


useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  if (currentSrc.endsWith('.m3u8') && Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(currentSrc);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (savedTime > 0) {
        video.currentTime = savedTime;
      }
      if (playing) video.play();
    });
    

    return () => hls.destroy();
  } else {
    video.src = currentSrc;
    video.onloadedmetadata = () => {
      video.currentTime = currentTime;  // ✅ Restore position
      if (playing) video.play();
    };
  }
}, [currentSrc]);

useEffect(() => {
  const handleKeyDown = (event) => {
    const video = videoRef.current;
    if (!video) return;

    switch (event.code) {
      case 'Space':
        event.preventDefault();  // Prevent page scroll
        togglePlayPause();
        break;
      case 'ArrowLeft':
        skipTime(-10);
        break;
      case 'ArrowRight':
        skipTime(10);
        break;
      case 'ArrowUp':
        event.preventDefault();
        {
          const newVolume = Math.min(1, volume + 0.1);
          setVolume(newVolume);
          video.volume = newVolume;
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        {
          const newVolume = Math.max(0, volume - 0.1);
          setVolume(newVolume);
          video.volume = newVolume;
        }
        break;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [volume, playing]);  // Depend on volume & playing state


useEffect(() => {
  const interval = setInterval(() => {
    if (videoRef.current) {
      saveWatchProgress(
        currentVideoId,
        videoRef.current.duration,
        videoRef.current.currentTime,
        isSeries ? { seasonid, epsoideid, ref } : {},
        isSeries
      );
    }
  }, 5000);

  return () => clearInterval(interval);
}, [currentVideoId, seasonid, epsoideid, ref, isSeries]);


useEffect(() => {
  const existing = localStorage.getItem('C_MOVIES');
  if (existing) {
    const history = JSON.parse(existing);

    let match = null;

    if (isSeries) {
      // ✅ For Series: Match both id and episode id
      match = history.find((item) => item.id === currentVideoId && item.epsoideid === epsoideid);
    } else {
      // ✅ For Movies: Match only id
      match = history.find((item) => item.id === currentVideoId);
    }

    if (match) {
      setSavedTime(match.userwatched);  // ✅ Set saved time for later use
    }
  }
}, [currentVideoId, epsoideid, isSeries]);




const handleMouseMove = () => {
  // Always show controls on movement
  setShowControls(true);

  // Clear previous timer if any
  if (hideTimeout.current) {
    clearTimeout(hideTimeout.current);
  }

  // Start new 3-second timer
  hideTimeout.current = setTimeout(() => {
    setShowControls(false);
  }, 3000);
};

useEffect(() => {
  const container = document.getElementById('video-container');
  if (container) {
    container.addEventListener('mousemove', handleMouseMove);
  }

  return () => {
    if (container) {
      container.removeEventListener('mousemove', handleMouseMove);
    }
    clearTimeout(hideTimeout.current);
  };
}, []);



  const togglePlayPause = () => {
    const video = videoRef.current;
    if (playing) {
      video.pause();
    } else {
      video.play();
    }
    setPlaying(!playing);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };
  const handleSpeedChange = (speed) => {
    const video = videoRef.current;
    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSpeedOptions(false);
  };
  const handleQualityChange = (quality) => {
    const video = videoRef.current;
    if (!video) return;
  
    setCurrentTime(video.currentTime);   // ✅ Save current time before switching
    setSelectedQuality(quality);
    setCurrentSrc(videoSources[quality]);  // ✅ Trigger source reload
    setShowQualityOptions(false);
  };
  
  
  const toggleFullscreen = () => {
    const videoContainer = videoRef.current.parentElement;  // Full parent container
    
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };
  

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const paddedMins = String(mins).padStart(2, '0');
    const paddedSecs = String(secs).padStart(2, '0');
    return `${paddedMins}:${paddedSecs}`;
  }


  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
    if (savedTime > 0) {
      videoRef.current.currentTime = savedTime;
    }
  };
  
  

  const skipTime = (seconds) => {
    const video = videoRef.current;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  return (
    <div
  id="video-container"
  className={`video-container ${showControls ? 'show-controls' : 'hide-controls'}`}
>
<div className={`video-title-bar ${showControls ? 'visible' : 'hidden'}`}>
<button className="back-button" onClick={() => router.back()}>
  <FaArrowLeft size={20} />
</button>
  <h2>{title}</h2>
</div>

      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="video-element"
        playsInline
      />

      {/* ✅ Gradient Overlay */}
      <div className="video-bottom-gradient"></div>




      {/* ✅ Controls */}
      <div className={`video-controls ${showControls ? 'visible' : 'hidden'}`}>
        {/* Seekbar */}
        {/* ✅ Dynamic Seekbar Gradient */}
        <div className="time-container">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleSeek}
          className="seek-bar"
          style={{
            background: `linear-gradient(to right, #00f0ff 0%, #00f0ff ${(currentTime / duration) * 100}%, #444 ${(currentTime / duration) * 100}%, #444 100%)`
          }}
        />





        {/* Buttons */}
        <div className="button-row">

  {/* Left Side Controls */}
  <div className="left-controls">
    <button className="control-button" onClick={() => skipTime(-10)}>
      <FaBackward size={20} />
    </button>
    <button className="control-button play-button" onClick={togglePlayPause}>
      {playing ? <FaPause size={22} /> : <FaPlay size={22} />}
    </button>
    <button className="control-button" onClick={() => skipTime(10)}>
      <FaForward size={20} />
    </button>

    {/* Volume */}
    <div 
      className="volume-control" 
      onMouseEnter={() => setShowVolumeSlider(true)} 
      onMouseLeave={() => setShowVolumeSlider(false)}
    >
      <button className="control-button">
        {volume === 0 ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
      </button>
      {showVolumeSlider && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
          style={{
            background: `linear-gradient(to right, #00f0ff 0%, #ff00ff ${volume * 100}%, #444 ${volume * 100}%)`
          }}
        />
      )}
    </div>
  </div>

  {/* Right Side Fullscreen Button */}
  <div className="right-controls">
  {isSeries && (
    <button className="control-button" onClick={() => setShowEpisodesOverlay(true)}>
      <FaListUl size={18} />
    </button>
  )}
  <div
  className="quality-control"
  onMouseEnter={() => setShowQualityOptions(true)}
  onMouseLeave={() => setShowQualityOptions(false)}
>
  <button className="control-button">
    <FaSignal size={20} />
  </button>

  {showQualityOptions && (
    <div className="quality-options-overlay">
      {['High', 'Mid', 'Low'].map((quality) => (
        <div
          key={quality}
          className={`quality-option ${quality === selectedQuality ? 'active-quality' : ''}`}
          onClick={() => handleQualityChange(quality)}
        >
          {quality}
        </div>
      ))}
    </div>
  )}
</div>

  <div 
  className="speed-control" 
  onMouseEnter={() => setShowSpeedOptions(true)} 
  onMouseLeave={() => setShowSpeedOptions(false)}
>
  <button className="control-button">
    <FaTachometerAlt size={20} />
  </button>

  {showSpeedOptions && (
    <div className="speed-options-overlay">
      {[0.5, 1, 1.5, 2].map((speed) => (
        <div
          key={speed}
          className={`speed-option ${speed === playbackSpeed ? 'active-speed' : ''}`}
          onClick={() => handleSpeedChange(speed)}
        >
          {speed}x
        </div>
      ))}
    </div>
  )}
</div>

    <button className="control-button" onClick={toggleFullscreen}>
      {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
    </button>
  </div>

</div>

      </div>
      {showEpisodesOverlay && (
  <div className="episodes-overlay">
    {/* Close Button */}
    <button className="close-button" onClick={() => setShowEpisodesOverlay(false)}>
      ✖
    </button>

    {/* Content */}
    <div className="episodes-content">
    {epdata?.map((item) => (
        <div
        onClick={()=>{
          const params = new URLSearchParams();
                params.set('video', encodeURIComponent(JSON.stringify(fulldata)));
                params.set('season',encodeURIComponent(JSON.stringify(seasonid)))
                params.set('epid', encodeURIComponent(JSON.stringify(item.id)));

    router.replace(
      `/videoplayer?${params.toString()}`
    );
        }}
          key={item.id}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px',
            cursor: 'pointer',
          }}
        >
          <div className="episode-thumbnail" key={item.id} >
            <Image
              src={item.img}
              alt="Episode Thumbnail"
              fill
              style={{ objectFit: 'cover' }}
            />
            <div className="episode-overlay"></div>
          </div>

          <p
            style={{
              color: 'white',
              fontWeight: '600',
              fontSize: '24px',
              marginLeft: '5px',
            }}
          >
            {item.des}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
    
  );
}
