new Vue ({
    el: "#app",
    data: {
        query: "",
        movieList: [],
        tvSeriesList: [],
        myFlagClass: "",
        defaultFlag: "flag-icon-default"
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
        }
    }
})