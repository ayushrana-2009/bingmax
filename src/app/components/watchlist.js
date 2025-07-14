import { watchlistEvent } from "./Event";

// ✅ Save movie to Watchlist
export function toggleWatchlist(movie) {
    let watchlist = JSON.parse(localStorage.getItem('WATCHLIST')) || [];
 
  
    const exists = watchlist.some((m) => m === movie);
   
  
    if (exists) {
      // ✅ If already exists → Remove
      watchlist = watchlist.filter((m) => m !== movie);
    } else {
      // ✅ If not exists → Add
      watchlist.push(movie);
    }
  
    localStorage.setItem('WATCHLIST', JSON.stringify(watchlist));
    watchlistEvent.emit('updated');
  }
  
  // ✅ Optional: Get Current Watchlist
  export function getWatchlist() {
    return JSON.parse(localStorage.getItem('WATCHLIST')) || [];
  }
  
  
  // ✅ Remove from watchlist
  export function removeFromWatchlist(movieId) {
    let watchlist = JSON.parse(localStorage.getItem('WATCHLIST')) || [];
    watchlist = watchlist.filter((m) => m.id !== movieId);
    localStorage.setItem('WATCHLIST', JSON.stringify(watchlist));
    alert('Removed from Watchlist ❌');
  }
  