new Vue ({
    el: "#app",
    data: {
        query: "",
        movieList: [],
        tvSeriesList: [],
        myFlagClass: "",
        defaultFlag: "flag-icon-default",
        sizeCode: "w185",
        newVote: 0
    },
    computed: {
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
                "it" : ["it", "sm"]
            };

            if (!langToCountry[language]) {
                return this.defaultFlag;
            }
            
            return `flag-icon-${langToCountry[language][0]}`;
        },

        //funzione che crea l'url del poster
        generateUrl(apiPath) {
            /*
            l'url è formato da 3 parti:
            1- sempre uguale, è la base delle immagini tmdb:
                https://image.tmdb.org/t/p/
            2 - codice dimensioni. Es:
                w342
            3- la parte finale è la stringa passata dall'api alla voce
                poster_path
            4- alcuni poster_path sono null.
           */

            if (apiPath == null) {
                return "";
            }

            return `https://image.tmdb.org/t/p/${this.sizeCode}${apiPath}`;

        },

        //funzione che converte i voti in numeri da 1 a 5
        generateVote(originalVote) {
            /*
            -Ho il voto espresso con num decim da 1 a 10 in vote_average
                -devo gestire il caso in cui il valore zia 0
            -posso creare un nuovo valore dividendo vote_average per due e
                arrotondando il risultato in eccesso con math.
            -devo far ciclare le stelle per farle comparire
                ora ciclano nella funzione.
                non so se mi piace.
            -per ottenere risultati specifici per ogni show il valore del voto
                devev essere l'argomento della funz che specificherò in html.
            */
            return newVote = Math.ceil(originalVote / 2);
        }
    }
})