


require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _mm             = require('util/mm.js');
var _payment        = require('service/payment-service.js');
var templateIndex   = require('./index.string');

// page 逻辑部分
var page = {
    data: {
        orderNumber: _mm.getUrlParam('orderNumber')
    },
    init: function () {
        this.onLoad();
    },
    onLoad: function () {
        this.loadPaymentDetail();
    },
    loadPaymentDetail: function () {
        var _this               = this,
            paymentlHtml        = '',
            $pageWrap           = $('.page-wrap');
        $pageWrap.html('<div class="loading"></div>');
        _payment.getPaymentInfo(this.data.orderNumber, function (res) {
            // 渲染html
            paymentlHtml = _mm.renderHtml(templateIndex, res);
            $pageWrap.html(paymentlHtml);
            _this.listenOrderStatus();
        }, function (errMsg) {
            $pageWrap.html('<p class="err-tip">' + errMsg + '</p>')
        });
    },
    // 监听订单状态
    listenOrderStatus: function () {
        var _this =this;
        this.paymentTimer = window.setInterval(function () {
            _payment.getPaymentStatus(_this.data.orderNumber,function (res) {
                if(res == true){
                    window.location.href 
                        = './result.html?type=payment&orderNumber=' + _this.data.orderNumber;
                }
            })
        },5e3)
    }
};
$(function () {
    page.init();
});