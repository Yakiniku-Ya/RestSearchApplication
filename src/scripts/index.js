const url = "https://api.gnavi.co.jp/RestSearchAPI/v3/"
// const key = "6526d105b1d4506fdb09b7d64afa244b"
const key = "578f48400166717797a5f1da5f50e583"

document.onkeypress = function(e){
    var ref=e.target;
    if (e.key === 'Enter' && ref.type == 'text'){
        main.submit();
        return false;
    }
}

const main = new Vue({
    el: '#main',
    data: {
        latitude: '', 
        longitude: '',
        page: 0,
        pages: 1,
        freeword: '',
        selected: '2',
        options: [
            {text: '指定しない', value: ''},
            {text: '300m', value: '1'},
            {text: '500m', value: '2'},
            {text: '1km', value: '3'},
            {text: '2km', value: '4'},
            {text: '3km', value: '5'}
        ],
        error_message: '',
        result: [],
        error: [],
        results: []
    },
    mounted () {
        this.searchHandler();
    },
    methods: {
        searchHandler: function () {
            if (this.latitude == '' || this.longitude == '') {
                this.getLocation();
            } else {
                if (this.selected == '') {
                    // 半径指定なしの選択ではlatitudeとかlongitudeつけたらおこられる X(
                    this.restSearch(
                        {
                            keyid: key,
                            freeword: this.freeword,
                            offset_page: this.page + 1,
                            hit_per_page: 30
                        }
                    );
                } else {
                    // 半径指定をした状態でのレストラン検索（freeword検索可能）
                    this.restSearch(
                        {
                            keyid: key,
                            range: this.selected,
                            latitude: this.latitude,
                            longitude: this.longitude,
                            freeword: this.freeword,
                            offset_page: this.page + 1,
                            hit_per_page: 30
                        }
                    );
                }
            }
        },

        getLocation: function () {
            navigator.geolocation.getCurrentPosition (
                function(position) {
                    main.latitude = position.coords.latitude;
                    main.longitude = position.coords.longitude;
                    main.searchHandler();
                },
                function(error) {
                    var message = '';
                    switch (error.code) {
                        case 1: 
                            message = 'ブラウザまたは端末の位置情報の利用を許可してください。'; break;
                        case 2: 
                            message = '端末の位置を判定できません。'; break;
                        case 3:
                            message = 'リクエストがタイムアウトしました。'; break;
                    }
                    main.error = error;
                    main.error_message = message;
                }
            )
        },

        submit: function () {
            // Searchボタンをおしてsubmitした時の挙動というかpageとかのリセット。
            this.page = 0;
            this.pages = -1;
            this.results = [];
            this.searchHandler();
        },

        prevPage: function () {
            if (0 >= this.page) {
                return;
            }
            this.page -= 1;
            this.results = [];
            this.searchHandler();
        },

        nextPage: function () {
            if (this.pages <= this.page + 1) {
                return;
            }
            this.page += 1;
            this.results = [];
            this.searchHandler();
        },
        
        restSearch: function (params)  {
            console.log('requested!');
            axios
                .get(url, {
                    params: params
                })
                .then(response => {
                    console.log('get response!');
                    this.error_message = '';
                    this.pages = Math.ceil(Number(response.data.total_hit_count)/30);
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
                    this.page = 0;
                    this.pages = 1;
                    this.error = error;
                    this.error_message = message;
                })
            
        },
    }
})