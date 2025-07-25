import axios from 'axios';
import type { Movie } from '../types/movie';

interface MoviesResponse { 
    results: Movie[];
}

export async function fetchMovies(params: { query: string }): Promise<Movie[]> {
    const { data } = await axios.get<MoviesResponse>('https://api.themoviedb.org/3/search/movie', {
        params: { query: params.query },
        headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
        }
    });
    return data.results;
}