'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getMovies } from './globaldata';
import './ep.css'

export default function EpisodeList({ episodes, mid, secid }) {
  const router = useRouter();

  const movies = getMovies()
  const resdata = movies?.find((i) => i.id === mid)
 


  const handleClick = (item) => {
    const params = new URLSearchParams();
    params.set('video', encodeURIComponent(JSON.stringify(resdata)));
    params.set('season', encodeURIComponent(JSON.stringify(secid)))
    params.set('epid', encodeURIComponent(JSON.stringify(item.id)));

    router.push(
      `/videoplayer?${params.toString()}`
    );
  };

  return (
    <div style={{
      padding: '10px',
      paddingLeft: '130px',            /* Space for sidebar if needed */
      backgroundColor: '#060117',
    }}>
      {episodes?.map((item) => (
        <div
          key={item.id}
          onClick={() => handleClick(item)}
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
  );
}
