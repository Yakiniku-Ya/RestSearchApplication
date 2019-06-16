const url = "https://api.gnavi.co.jp/RestSearchAPI/v3/"
const key = "6526d105b1d4506fdb09b7d64afa244b"

const main = new Vue({
    el: '#form',
    data: {
        latitude: '', 
        longitude: '',
        selected: '2',
        options: [
            {text: '300m', value: '1'},
            {text: '500m', value: '2'},
            {text: '1km', value: '3'},
            {text: '2km', value: '4'},
            {text: '3km', value: '5'}
        ],
        req: '',
        error_message: '',
        result: [],
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
                        // todo ページングなんとかする
                        this.error_message = '';
                        this.result = response;
                        this.results = [];
                        const results = response.data.rest;
                        for (let i = 0; i < results.length; i++) {
                            const result = {
                                name: results[i].name,
                                image: results[i].image_url,
                                address: results[i].address,
                                access: results[i].access
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
        }
    }
})