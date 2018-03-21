/*
* @Author: ChenHongwei
* @Date:   2017-05-08 22:26:19
* @Last Modified by:   ChenHongwei
* @Last Modified time: 2017-05-21 22:36:14
*/

'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var _mm = require('util/mm.js');
var _user = require('service/user-service.js');
var templateIndex = require('./index.string');

// page 逻辑部分
var page = {
    init: function () {
        this.onLoad();
    },
    onLoad: function () {
        // 初始化侧边栏
        navSide.init({
            name: 'user-center'
        });
        this.loadUserInfo();
    },
    // 加载用户信息
    loadUserInfo: function () {
        var userHtml = '';
        _user.getUserInfo(function (res) {
            userHtml = _mm.renderHtml(templateIndex,res);
            $('.panel-body').html(userHtml);
        },function (errMsg) {
            _mm.errTips(errMsg);
        })
    }
   
};
$(function () {
    page.init();
});