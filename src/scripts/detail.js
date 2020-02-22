const url = "https://api.gnavi.co.jp/RestSearchAPI/v3/"
const key = "c2a5f92539c048d2cc984201a43a6b7d"

const detail = new Vue({
    el: '#detail',
    data: {
        id: '',
        error_message: '',
        result: [],
        image_url: [],
        pr: [],
        access: []
    },
    mounted () {
        /*
            Vue読み込み → レストラン検索で店舗詳細を表示する
        */
        this.restSearch();
    },
    methods: {
        /*
            index.htmlと同じで、apiにリクエストして店舗詳細を取得する。
            情報を整形してhtmlに渡す。
            parameter
                なし
            return
                なし
        */
        restSearch: function () {
            this.getRestId();
            axios
                .get(url, {
                    params: {
                        keyid: key,
                        id: this.id
                    }
                })
                .then(response => {
                    this.error_message = '';
                    const result = response.data.rest[0];
                    this.result = result;   
                    this.image_url = result.image_url;
                    this.pr = result.pr;
                    this.access = result.access;
                })
                .catch(error => {
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
        },
        /*
            urlからidパラメータを切り抜くやつ
            idは英数字7文字らしいので単純にslice(-7)する。
            ex: 'http://xxx.com/detail.html?id=abc1234' -> 'abc1234'
            parameter
                なし
            return
                なし
        */
        getRestId: function () {
            const url = location.href
            this.id = url.slice(-7)
        }
    }
})
