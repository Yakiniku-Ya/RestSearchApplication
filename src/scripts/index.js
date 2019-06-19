const url = "https://api.gnavi.co.jp/RestSearchAPI/v3/"
const key = "6526d105b1d4506fdb09b7d64afa244b"

const main = new Vue({
    el: '#form',
    data: {
        latitude: '', 
        longitude: '',
        page: 0,
        pages: 1,
        selected: '2',
        options: [
            {text: '300m', value: '1'},
            {text: '500m', value: '2'},
            {text: '1km', value: '3'},
            {text: '2km', value: '4'},
            {text: '3km', value: '5'}
        ],
        error_message: '',
        result: [],
        results: []
    },
    mounted () {
        this.restSearch();
    },
    methods: {
        restSearch: function ($state) {
            // if-elseで再帰的にやってるけど非同期処理？したほうがいいかも
            if (this.latitude == '' || this.longitude == '') {
                this.getLocation();
            } else {
                axios
                .get(url, {
                    params: {
                        keyid: key,
                        range: this.selected,
                        latitude: this.latitude,
                        longitude: this.longitude,
                        offset_page: this.page + 1,
                        hit_per_page: 30
                    }
                })
                .then(response => {
                    this.error_message = '';
                    this.pages = Math.ceil(Number(response.data.total_hit_count)/10);
                    this.result = response;
                    const results = response.data.rest;
                    for (let i = 0; i < results.length; i++) {
                        const result = {
                            id: results[i].id,
                            name: results[i].name,
                            image: results[i].image_url,
                            address: results[i].address,
                            access: results[i].access,
                            category: results[i].category
                        };
                        this.results.push(result);
                    }
                })
                .catch(error => {
                    // エラー処理geoLocationとまとめられないか？
                    const code = Number(error.toString().slice(-3));
                    var message = '';
                    switch (code) {
                            case 400: 
                                message = '検索パラメータが不正です。'; break;
                            case 401: 
                                message = 'アクセスが不正です。'; break;
                            case 404:
                                message = '指定の店舗は存在しません。'; break;
                            case 405:
                                message = 'アクセスが不正です。'; break;
                            case 429:
                                message = 'リクエスト回数が上限に達しました。'; break;
                            case 500:
                                message = '処理中にエラーが発生しました。'; break;
                    }
                    this.error_message = message;
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
                    var message = '';
                    switch (error.code) {
                        case 1: 
                            message = 'ブラウザの位置情報の利用を許可してください。'; break;
                        case 2: 
                            message = '端末の位置を判定できません。'; break;
                        case 3:
                            message = 'リクエストがタイムアウトしました。'; break;
                    }
                    main.error_message = message;
                }
            )
        },

        submit: function () {
            // Searchボタンをおしてsubmitした時の挙動というかpageとかのリセット。
            this.page = 0;
            this.pages = -1;
            this.results = [];
            this.restSearch();
        },

        prevPage: function () {
            if (0 <= this.page) {
                return;
            }
            this.page -= 1;
            this.results = [];
            this.restSearch();
        },

        nextPage: function () {
            if (this.pages <= this.page + 1) {
                return;
            }
            this.page += 1;
            this.results = [];
            this.restSearch();
        }
    }
})