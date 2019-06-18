const url = "https://api.gnavi.co.jp/RestSearchAPI/v3/"
const key = "6526d105b1d4506fdb09b7d64afa244b"

const detail = new Vue({
    el: '#detail',
    data: {
        id: '',
        error_message: '',
        result: []
    },
    mounted () {
        this.restSearch();
    },
    methods: {
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
                    this.result = response;
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
        getRestId: function () {
            // urlからidパラメータを切り抜くやつ
            // ex: 'http://xxx.com/detail.html?abc123' -> 'abc123'
            const url = location.href
            const index = url.lastIndexOf('?') + 1
            this.id = url.slice(index)
        }
    }
})