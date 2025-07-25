import { useState } from 'react';
import css from "./App.module.css"
import toast, { Toaster } from 'react-hot-toast';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieModal from '../MovieModal/MovieModal';
import MovieGrid from '../MovieGrid/MovieGrid';


export default function App() {

  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const searchMovie = async (movie: string) => { 
    try {
      setIsLoading(true);
      setIsError(false);
      setMovies([]);
      
      const results = await fetchMovies({ query: movie });
      if (results.length === 0) {
        toast.error("No movies found for your request.")
      } else { 
        setMovies(results);
      }
    } catch { 
      setIsError(true);
      toast.error("Something went wrong.");
    } finally {
    setIsLoading(false);
    }
  }

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
  setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <div className={css.container}>
        <Toaster/>
        <SearchBar onSubmit={searchMovie} />
        {isError && <ErrorMessage />}
        {isLoading && <Loader />}
        {!isLoading && !isError && movies.length > 0 && (<MovieGrid movies={movies} onSelect={handleSelectMovie} />)}
      </div>
      {selectedMovie && (<MovieModal movie={selectedMovie} onClose={handleCloseModal} />)}
    </div>
  )
}