new Vue ({
    el: "#app",
    data: {
        query: "",
        movieList: [],
        myFlagClass: "",
        defaultFlag: "flag-icon-default"
    },
    computed: {
    },
    methods: {

        //funzione che carica i film in base alla ricerca nell'input
        doSearch() {
            axios.get("https://api.themoviedb.org/3/search/movie", {
                params: {
                    api_key: "c8a6a5493ec7223e34efa320cd602f6c",
                    query: this.query,
                    language: "it-IT"
                }
            }).then((resp) => {
                this.movieList = resp.data.results;
            })
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