

require('./index.css');
require('page/common/header/index.js');
require('page/common/nav/index.js');
var _mm                 = require('util/mm.js');
var _order              = require('service/order-service.js');
var _address            = require('service/address-service.js');
var templateProduct     = require('./product-list.string');
var templateAddress     = require('./address-list.string');
var addressModal        = require('./address-modal.js');

var page = {
    data: {
        selectAddressId :null
    },
    init: function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function () {
        this.loadAddressList();
        this.loadProductList();
    },
    // 事件绑定
    bindEvent: function () {
        var _this = this;
        // 地址选择
        $(document).on('click', '.address-item', function () {
            $(this).addClass('active')
            .siblings('.address-item').removeClass('active');
            _this.data.selectAddressId = $(this).data("id");
        });
        // 订单提交
        $(document).on('click', '.order-submit', function () {
            var shippingId = _this.data.selectAddressId;
            if(shippingId){
                _order.createOrder({
                    shippingId : shippingId
                },function (res) {
                    window.location.href = './payment.html?orderNumber=' + res.orderNo;
                },function (errMsg) {
                    _mm.errorTips(errMsg);
                });
            }
        });
        // 地址的添加
        $(document).on('click', '.address-add', function () {
            addressModal.show({
                isUpdate:false,
                onSuccess:function () {
                    _this.loadAddressList();
                }
            })
        });
        // 地址的编辑
        $(document).on('click', '.address-update', function (e) {
            e.stopPropagation();
            var shippingId = $(this).parents('.address-item').data("id");
            _address.getAddress(shippingId,function (res) {
                addressModal.show({
                    isUpdate    : true,
                    data        : res,
                    onSuccess   : function () {
                        _this.loadAddressList();
                    }
                });
            },function (errMsg) {
               _mm.errorTips(errMsg); 
            });
        });
        // 地址的删除
        $(document).on('click', '.address-delete', function (e) {
            e.stopPropagation();
            var id = $(this).parents('.address-item').data('id');
            if (window.confirm('您确定要删除改地址吗？')) {
                _address.deleteAddress(id, function (res) {
                    _this.loadAddressList();
                }, function (errMsg) {
                    _mm.errorTips(errMsg);
                });
            }
        });
    },
    // 加载地址列表
    loadAddressList: function () {
        $('.address-con').html('<div class="loading"></div>');
        var _this = this;
        // 获取地址列表
        _address.getAddressList(function (res) {
            _this.addressFilter(res);
            var addressListHtml = _mm.renderHtml(templateAddress,res);
            $('.address-con').html(addressListHtml);
        }, function (errMsg) {
            $('.address-con').html('<p class="err-tip">地址加载失败，请刷新后重试</p>');
        });
    },
    // 处理地址列表中选中状态
    addressFilter: function (data) {
        if (this.data.selectAddressId) {
            var selectAddressIdFlag = false;
            for(var i=0 ,length = data.list.length; i<length; i++){
                if (data.list[i].id === this.data.selectAddressId) {
                    data.list[i].isActive   = true;
                    selectAddressIdFlag     = true;
                }
            };
            if(!selectAddressIdFlag){
                this.data.selectAddressId = null;
            }
        }
    },
    // 加载商品清单
    loadProductList: function () {
        var _this = this;
        // 获取商品列表
        $('.product-con').html('<div class="loading"></div>');
        _order.getProductList(function (res) {
            var productListHtml = _mm.renderHtml(templateProduct, res);
            $('.product-con').html(productListHtml);
        }, function (errMsg) {
            $('.product-con').html('<p class="err-tip">商品信息加载失败，请刷新后重试</p>');
        });
    },
};
$(function () {
    page.init();
});