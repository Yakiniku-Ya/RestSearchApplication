const url = "https://api.gnavi.co.jp/RestSearchAPI/v3/"
const key = "6526d105b1d4506fdb09b7d64afa244b"

const main = new Vue({
    el: '#form',
    data: {
        latitude: '', 
        longitude: '',
        selected: '2',
        options: [
            { text: '300m', value: '1'},
            { text: '500m', value: '2'},
            { text: '1km', value: '3'},
            { text: '2km', value: '4'},
            { text: '3km', value: '5'}
        ],
        req: '',
        results: [],
        values: []
    },
    mounted () {
        this.restSearch();
    },
    methods: {
        restSearch: function () {
            // if-elseで再帰的にやってるけど非同期処理？したほうがいいかも
            if (this.latitude == '' || this.longitude == '') {
                this.getLocation();
            } else {
                // todo urlをうまいこと形成できるやつ(method?)がほしいかも
                const req = url + '?keyid=' + key + '&range=' + this.selected + '&latitude=' + this.latitude + '&longitude=' + this.longitude;
                this.req = req;
                axios
                    .get(req)
                    .then(response => {
                        // todo1 jsonバラす
                        // todo2 ページングなんとかする
                        this.results = response.data;
                    })
                    .catch(error => {
                        // todo エラー処理いろいろする
                        console.log(error);
                    })
            }
        },
        getLocation: function () {
            navigator.geolocation.getCurrentPosition (
                function(position) {
                    main.latitude = position.coords.latitude;
                    main.longitude = position.coords.longitude;
                    main.restSearch();
                },
                function(error) {
                    // todo エラー表示なんかする
                    alert('error: ' + error.code + ', ' + error.message);
                }
            )
        }
    }
})