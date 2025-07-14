'use client'

import { Suspense } from "react";
import VideoPageClient from "./VideoPageClient";

export default function VideoPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoPageClient />
    </Suspense>
  );
}
