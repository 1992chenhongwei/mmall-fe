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

// page 逻辑部分
var page = {
    init: function () {
        this.onLoad();
        this.bindEvent();
    },
    bindEvent: function () {
        var _this = this;
        $(document).on('click', '.btn-submit', function () {
            var userInfo = {
                password: $.trim($('#password').val()),
                passwordNew: $.trim($('#password-new').val()),
                passwordConfirm: $.trim($('#password-confirm').val())
            }, 
            validateResult = _this.validateForm(userInfo);
            if (validateResult.status) {
                // 更改用户密码
                _user.updatePassword({
                    passwordOld:userInfo.password,
                    passwordNew:userInfo.passwordNew
                }, function (res, msg) {
                    _mm.successTips(msg);
                }, function (errMsg) {
                    _mm.errorTips(errMsg);
                });
            }
            else {
                _mm.errorTips(validateResult.msg);
            }
        });
    },
    onLoad: function () {
        // 初始化侧边栏
        navSide.init({
            name: 'user-pass-update'
        });
    },
    validateForm: function (FormData) {
        var result = {
            status: false,
            msg: ''
        };
        // 验证原密码
        if (!_mm.validate(FormData.password, 'require')) {
            result.msg = '原密码不能为空';
            return result;
        }
        // 验证新密码长度
        if (!FormData.passwordNew || FormData.passwordNew.length<6) {
            result.msg = '密码长度不能小于6位';
            return result;
        }
        // 验证两次密码是否一致
        if (FormData.passwordNew !== FormData.passwordConfirm) {
            result.msg = '两次输入的密码不一致';
            return result;
        }
        // 通过验证，返回正确提示
        result.status = true;
        result.msg = '验证通过';
        return result;
    }

};
$(function () {
    page.init();
});