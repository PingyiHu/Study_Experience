/**
 * 认证辅助脚本
 * 主要认证逻辑在 main.html 和 login.html 中
 * 此脚本提供登出功能
 */

(function() {
  'use strict';
  
  var storageKey = 'llm_safety_auth';
  
  // 提供全局登出函数
  window.logout = function() {
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
    window.location.href = '/Study_Experience/login.html';
  };
})();
