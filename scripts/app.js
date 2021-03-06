new Vue ({
    el: "#app",
    data: {
        query: "",
        movieList: [],
        tvSeriesList: [],
        myFlagClass: "",
        defaultFlag: "flag-icon-default",
        sizeCode: "w342",
        newVote: 0,
        moviesGenres: [],
        tvSeriesGenres: []
    },
    computed: {
        fullMoviesList() {
            return this.movieList.concat(this.tvSeriesList);
        }
    },
    methods: {
        //funzione che crea due array separati da una sola chiamata grazie all'argomento searchType
        makeAxiosSearch(searchType) {
            axios.get("https://api.themoviedb.org/3/search/" + searchType, {
                params: {
                    api_key: "c8a6a5493ec7223e34efa320cd602f6c",
                    query: this.query,
                    language: "it-IT"
                }
            }).then((resp) => {
                if (searchType === "movie") {
                    this.movieList = resp.data.results;
                } else if (searchType === "tv") {
                    this.tvSeriesList = resp.data.results.map((tvShow) => {
                        tvShow.original_title = tvShow.original_name;
                        tvShow.title = tvShow.name;
                        tvShow.tvSeries = true;

                        return tvShow;
                    })
                }
            })
        },

        //funzione che carica i film in base alla ricerca nell'input
        //la funzione evoca a sua volta una funzione che stabilisce il parametro di ricerca tramite l'assegnazione dell'argomento
        doSearch() {
           this.makeAxiosSearch("movie");
           this.makeAxiosSearch("tv");
        },
        
        //funzione che traduce la lingua dell'oggetto in classe per la flag
        getFlag(language) {
            const langToCountry = {
                "en" : ["us", "gb", "ca"],
                "es" : ["es", "ar", "cu", "mx"],
                "de" : ["de", "be", "li"],
                "it" : ["it", "sm"],
                "fr" : ["fr"]
            };

            if (!langToCountry[language]) {
                return this.defaultFlag;
            }
            
            return `flag-icon-${langToCountry[language][0]}`;
        },

        //funzione che crea l'url del poster
        generateUrl(apiPath) {
            /*
            l'url ?? formato da 3 parti:
            1- sempre uguale, ?? la base delle immagini tmdb:
                https://image.tmdb.org/t/p/
            2 - codice dimensioni. Es:
                w342
            3- la parte finale ?? la stringa passata dall'api alla voce
                poster_path
            4- alcuni poster_path sono null.
           */

            if (apiPath == null) {
                return "../img/download2.jpg";
            }

            return `https://image.tmdb.org/t/p/${this.sizeCode}${apiPath}`;

        },

        //funzione che converte i voti in numeri da 1 a 5
        getMovieStars(originalVote) {
            newVote = Math.round(originalVote / 2);
            const toReturn = [];

            for (let i = 1; i <= 5; i++) {
                toReturn.push(i <= newVote);
            }

            return toReturn;
        },

        getCast(movie) {
            //se la chiave actors esiste gi?? fermo la funzione
            if (movie.actors) {
                return;
            };

            const axiosOptions = {
                params: {
                    api_key: "c8a6a5493ec7223e34efa320cd602f6c",
                    language: "it-IT"
                }
            };

            const movieType = movie.tvSeries ? "tv" : "movie";

            axios.get(`https://api.themoviedb.org/3/${movieType}/${movie.id}/credits`, axiosOptions)
                .then(resp => {
                    this.$set(movie, "actors", resp.data.cast);
            });
        },

        decodeGenres(movie) {
            if (movie.genresDescription) {
                return;
            }
        },

        getGenres(movieType) {
            const axiosOptions = {
                params: {
                    api_key: "c8a6a5493ec7223e34efa320cd602f6c",
                    language: "it-IT"
                }
            };

            axios.get(`https://api.themoviedb.org/3/genre/${movieType}/list`, axiosOptions)
            .then(resp => {
                if (movieType == 'movie') {
                    this.moviesGenres = resp.data.genres;
                } else {
                    this.tvSeriesGenres = resp.data.genres;
                }
            })

        },

        getAddInfo(movie) {
            this.getCast(movie);
            this.decodeGenres(movie);
        }
    },
    mounted() {
        this.getGenres('tv');
        this.getGenres('movie');
    }
})