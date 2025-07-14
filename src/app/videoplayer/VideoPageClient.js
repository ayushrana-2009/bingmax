'use client'

import { useSearchParams } from "next/navigation";
import CustomVideoPlayer from "./VideoPlayer";

export default function VideoPageClient() {
  const searchParams = useSearchParams();

  let vdosrc, title, epid, secid, epsdata, fuldata;

  const videoUrl = searchParams.get('video');
  const video = JSON.parse(decodeURIComponent(videoUrl));
  const seasons = searchParams.get('season');
  const season = JSON.parse(decodeURIComponent(seasons));
  const episodes = searchParams.get('epid');
  const episode = JSON.parse(decodeURIComponent(episodes));
  const isSeries = video?.ref === '3001';

  if (isSeries) {
    const seasondata = video.season.find((i) => i.id === season);

    secid = seasondata.id;
    const epdata = seasondata.epsod?.find((i) => i.id === episode);

    epsdata = seasondata.epsod;
    fuldata = video;
    vdosrc = epdata?.video;
    title = video.tit;
    epid = epdata?.id;
  } else {
    vdosrc = video.video;
    title = video.tit;
  }

  return (
    <CustomVideoPlayer
      title={title}
      videoSource={vdosrc}
      currentVideoId={video.id}
      epsoideid={epid}
      seasonid={secid}
      isSeries={isSeries}
      ref={'5001'}
      epdata={epsdata}
      fulldata={fuldata}
    />
  );
}
