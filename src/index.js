const url = "https://api.gnavi.co.jp/RestSearchAPI/v3/"
const key = "6526d105b1d4506fdb09b7d64afa244b"

// indexが呼び出された時にまず半径500で表示する
// geolocationAPIで現在緯度経度取得

/*  https://api.gnavi.co.jp/RestSearchAPI/v3/ 
      ?keyid=6526d105b1d4506fdb09b7d64afa244b
      &range=5
      &latitude=34.511083
      &longitude=135.785522
  */
new Vue({
    el: '#form',
    data: {
        selected: '2',
        options: [
            { text: '300m', value: '1'},
            { text: '500m', value: '2'},
            { text: '1km', value: '3'},
            { text: '2km', value: '4'},
            { text: '3km', value: '5'}
        ],
        req: '',
        result: ''
    },
    mounted () {
      this.restSearch();
    },
    methods: {
        restSearch: function() {
            const req = url + "?keyid=" + key + "&range=" + this.selected + "&latitude=34.511083&longitude=135.785522"
            this.req = req
            axios
                .get(req)
                .then(response => (
                    this.result = response
                ))
                .catch(error => {
                    console.log(error)
                })
        }
    }
})
