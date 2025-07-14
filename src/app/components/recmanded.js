export const saveWatchedMovie = async (movieId) => {
    try {
      const existing = await localStorage.getItem('WATCHED_MOVIES');
      let watched = existing ? JSON.parse(existing) : [];
  
      // Remove if already in list (optional)
      watched = watched.filter(id => id !== movieId);
  
      // Add new movie at the front
      watched.unshift(movieId);
  
      // Save only last 5 watched (limit list)
      const limited = watched.slice(0, 2);
  
      await localStorage.setItem('WATCHED_MOVIES', JSON.stringify(limited));
    } catch (e) {
      console.error('Failed to save movie:', e);
    }
  };
  
  export const saveWatchedMovieId = async (id) => {
    try {
      const existing = await localStorage.getItem("WATCHED");
      let list = existing ? JSON.parse(existing) : [];
  
      // Remove duplicate if exists
      list = list.filter((item) => item !== id);
  
      // Add the latest clicked movie to the start
      list.unshift(id);
  
      // Limit to last 10 watched
      list = list.slice(0, 10);
  
      await localStorage.setItem("WATCHED", JSON.stringify(list));
    } catch (e) {
      console.error("Error saving watched movie ID:", e);
    }
  };