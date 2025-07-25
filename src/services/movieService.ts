import axios from 'axios';
import type { Movie } from '../types/movie';

export interface MoviesResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

interface FetchParams {
    query: string;
    page?: number;
}

export async function fetchMovies({ query, page = 1 }: FetchParams): Promise<MoviesResponse> {
    const { data } = await axios.get<MoviesResponse>('https://api.themoviedb.org/3/search/movie', {
        params: {
            query,
            page,
            language: 'en-US',
        },
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
    });

    return data;
}
