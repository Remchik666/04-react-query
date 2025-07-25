import css from "./SearchBar.module.css"
import toast from "react-hot-toast";

interface SearchMovieProps {
    onSubmit: (movie: string) => void;
}

export default function SearchBar({ onSubmit }: SearchMovieProps) { 

    const handleSubmit = (formData: FormData) => { 
        const query = formData.get("query") as string;

        if (query.trim() === "") {
            toast("Please enter your search query.", {
                icon: "⚠️",
                style: {
                    borderRadius: "8px",
                    background: "#fff3cd",
                    color: "#856404",
                    border: "1px solid #ffeeba",
                },
});
        } else {
            onSubmit(query);
        }
    }

    return (
        <header className={css.header}>
            <div className={css.container}>
                <a className={css.link}
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer">
                    Powered by TMDB
                </a>
                <form action={handleSubmit} className={css.form}>
                    <input
                    className={css.input}
                    type="text"
                    name="query"
                    autoComplete="off"
                    placeholder="Search movies..."
                    autoFocus
                    />
                    <button className={css.button} type="submit">
                        Search
                    </button>
                </form>
            </div>
        </header>
    )
}