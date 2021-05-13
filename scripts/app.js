new Vue ({
    el: "#app",
    data: {
        query: "",
        movieList: []
    },
    methods: {
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
        }
    }
})