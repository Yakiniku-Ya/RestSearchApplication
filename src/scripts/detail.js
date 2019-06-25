const url = "https://api.gnavi.co.jp/RestSearchAPI/v3/"
const key = "578f48400166717797a5f1da5f50e583"

/*
    issue #3
    formのinput-textでエンター押したら検索ではなく更新されてしまうのを修正
 */
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
        range: '',
        ranges: [
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
    /*
        Vue読み込み → getLocationで緯度経度取得
    */
        this.getLocation();
    },
    methods: {
    /*
        RestSearchで半径指定のためだけにsearchHandlerを一度経由する
        parameter
            なし
        return
            なし
    */
        searchHandler: function () {
            if (this.latitude == '' || this.longitude == '') {
                // 検索時に位置情報がもしなければ再取得する。
                this.getLocation();
            } else {
                if (this.range == '') {
                    // 半径指定なしの選択ではlatitudeとかlongitudeつけたらおこられるのでその対策
                    this.restSearch(
                        {
                            keyid: key,
                            freeword: this.freeword,
                            offset_page: this.page + 1,
                            hit_per_page: 30
                        }
                    );
                } else {
                    // 半径指定をした状態でのレストラン検索（freewordとAND検索可能）
                    this.restSearch(
                        {
                            keyid: key,
                            range: this.range,
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

    /*
        geolocationAPIを使って緯度経度をもってくる
        parameter
            なし
        return
            なし
    */
        getLocation: function () {
            navigator.geolocation.getCurrentPosition (
                function(position) {
                    main.latitude = position.coords.latitude;
                    main.longitude = position.coords.longitude;
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
    
    /*
        検索ボタンやformのinput-textでエンターキー押したときに呼ばれる。
        一般的なsubmit機能みたいなもの。
        parameter
            なし
        return
            なし
    */
        submit: function () {
            this.page = 0;
            this.pages = -1;
            this.results = [];
            this.searchHandler();
        },

    /*
        ページングのためのprevボタンとnextボタン
        いろいろ考えたけどとりあえず毎回offset_pageパラメータを変えて再リクエストする方法で実装
        parameter
            なし
        return
            なし
    */
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
        
    /*
        gnaviAPIに対してaxiosを用いてhttpリクエストを行う
        引数としてリクエストパラメータを使う。
        取得したレスポンスを整形してresultリストにする。
        parameter
            params: リクエストパラメータ
        return
            なし
    */
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