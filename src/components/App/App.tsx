import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import css from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieModal from '../MovieModal/MovieModal';
import MovieGrid from '../MovieGrid/MovieGrid';
import ReactPaginate from 'react-paginate';
import type { Movie } from '../../types/movie';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies({ query, page }),
    enabled: query.trim() !== '',
    placeholderData: keepPreviousData
  });

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim() === '') {
      toast.error('Enter movie name.');
      return;
    }

    setQuery(searchQuery);
    setPage(1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (
      !isLoading &&
      !isError &&
      (data?.results as Movie[])?.length === 0 &&
      query.trim() !== ''
    ) {
      toast.error('No movies found for your request.');
    }
  }, [data, isLoading, isError, query]);

  return (
    <div className={css.app}>
      <div className={css.container}>
        <Toaster />
        <SearchBar onSubmit={handleSearch} />
        {totalPages > 1 && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}
        {isError && <ErrorMessage />}
        {(isLoading || isFetching) && <Loader />}
        {!isLoading &&
          !isError &&
          (data?.results as Movie[])?.length > 0 && (
            <MovieGrid
              movies={data?.results as Movie[]}
              onSelect={handleSelectMovie}
            />
          )}
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
