//hogan的引入方式
var Hogan = require('hogan.js');
var conf ={
    serverHost: ''
};
var _mm = {
    // 网络请求
    request : function (param) {
        var _this = this;
        $.ajax({
            type: param.method || 'get',
            url: param.url || '',
            dataType: param.type || 'json',
            data: param.data || '',
            success: function (res) {
                //请求成功
                if(0 === res.status){
                    typeof param.success === 'function' && param.success(res.data, res.msg)
                }
                //没有登录状态，需要强制登录
                else if (10 === res.status) {
                    _this.doLogin();
                }
                //请求数据错误
                else if (1 === res.status) {
                    typeof param.error === 'function' && param.error(res.msg);
                }
            },
            error: function (err) {
                typeof param.error === 'function' && param.error(err.statusText);
            }
        })
    },
    //获取服务器地址
    getServerUrl: function (path) {
        return conf.serverHost + path;
    },
    //获取URL 参数
    getUrlParam: function (name) {
        var reg = new RegExp('(^|&)'+name+'=([^&]*)(&|$)');
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    renderHtml:function (htmlTemplate , data) {
        var template = Hogan.compile(htmlTemplate),
            result = template.render(data);
        return result;
    },
    //成功提示
    successTips: function (msg) {
        alert(msg || '操作成功');
    },
    //错误提示
    errorTips: function (msg) {
        alert(msg || '哪里出错了~');
    },
    //字段的验证，支持非空、手机号、邮箱的判断；
    validata: function (value,type) {
        var value = $.trim(value);
        // 非空验证,如果value的type是有值的，返回一个布尔值true；
        if ('require' === type) {
            return !!value;
        }
        //手机号验证，如果是，返回true
        if ('phone' === type) {
            return /^1\d(10)$/.test(value);
        }
        // 邮箱验证,如果是，返回true
        if ('email' === type) {
            return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);
        }
    },
    //统一登录处理
    doLogin: function () {
        window.location.href = './login.html?redirct=' + encodeURIComponent(window.location.href);
    },
    //跳回首页
    goHome: function () {
        window.location.href = './index.html';
    }
};

module.exports = _mm;