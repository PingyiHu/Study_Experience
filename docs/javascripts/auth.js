/**
 * 登录认证系统
 * 密码：dnnsecurity
 * 使用 localStorage 缓存登录状态
 */

(function() {
  'use strict';
  
  // 配置
  const CONFIG = {
    password: 'dnnsecurity',
    storageKey: 'llm_safety_auth',
    expireDays: 30  // 登录状态保留天数
  };
  
  // 生成验证 token
  function generateToken() {
    const date = new Date();
    const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    return btoa(CONFIG.password + '_' + dateStr);
  }
  
  // 检查是否已登录
  function isLoggedIn() {
    // 检查 sessionStorage（用于"不记住"的情况）
    if (sessionStorage.getItem(CONFIG.storageKey) === 'true') {
      return true;
    }
    
    // 检查 localStorage（用于"记住"的情况）
    const authData = localStorage.getItem(CONFIG.storageKey);
    if (!authData) return false;
    
    try {
      const data = JSON.parse(authData);
      if (Date.now() > data.expiry) {
        localStorage.removeItem(CONFIG.storageKey);
        return false;
      }
      return data.token === generateToken();
    } catch (e) {
      localStorage.removeItem(CONFIG.storageKey);
      return false;
    }
  }
  
  // 保存登录状态
  function saveAuth(remember) {
    if (remember) {
      const expiry = Date.now() + (CONFIG.expireDays * 24 * 60 * 60 * 1000);
      const authData = {
        token: generateToken(),
        expiry: expiry
      };
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(authData));
    } else {
      sessionStorage.setItem(CONFIG.storageKey, 'true');
    }
  }
  
  // 显示登录界面
  function showLogin() {
    const loginHTML = [
      '<!DOCTYPE html>',
      '<html lang="zh">',
      '<head>',
      '  <meta charset="UTF-8">',
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '  <title>LLM 安全学习笔记 - 登录</title>',
      '  <style>',
      '    * { margin: 0; padding: 0; box-sizing: border-box; }',
      '    body {',
      '      font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
      '      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
      '      min-height: 100vh;',
      '      display: flex;',
      '      align-items: center;',
      '      justify-content: center;',
      '    }',
      '    .login-container {',
      '      background: white;',
      '      border-radius: 16px;',
      '      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);',
      '      padding: 3rem;',
      '      width: 100%;',
      '      max-width: 400px;',
      '      margin: 1rem;',
      '      animation: fadeIn 0.5s ease-out;',
      '    }',
      '    @keyframes fadeIn {',
      '      from { opacity: 0; transform: translateY(20px); }',
      '      to { opacity: 1; transform: translateY(0); }',
      '    }',
      '    .login-header { text-align: center; margin-bottom: 2rem; }',
      '    .login-header .icon { font-size: 3rem; margin-bottom: 1rem; }',
      '    .login-header h1 { font-size: 1.5rem; color: #1a1a2e; font-weight: 700; margin-bottom: 0.5rem; }',
      '    .login-header p { color: #666; font-size: 0.9rem; }',
      '    .form-group { margin-bottom: 1.5rem; }',
      '    .form-group label { display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500; font-size: 0.9rem; }',
      '    .form-group input {',
      '      width: 100%; padding: 0.75rem 1rem;',
      '      border: 2px solid #e0e0e0; border-radius: 8px;',
      '      font-size: 1rem; transition: all 0.3s ease; outline: none;',
      '    }',
      '    .form-group input:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2); }',
      '    .form-group input.error { border-color: #e74c3c; box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2); }',
      '    .error-message { color: #e74c3c; font-size: 0.85rem; margin-top: 0.5rem; display: none; }',
      '    .error-message.show { display: block; animation: shake 0.5s ease; }',
      '    @keyframes shake {',
      '      0%, 100% { transform: translateX(0); }',
      '      25% { transform: translateX(-5px); }',
      '      75% { transform: translateX(5px); }',
      '    }',
      '    .submit-btn {',
      '      width: 100%; padding: 0.75rem;',
      '      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
      '      color: white; border: none; border-radius: 8px;',
      '      font-size: 1rem; font-weight: 600; cursor: pointer;',
      '      transition: all 0.3s ease;',
      '    }',
      '    .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }',
      '    .submit-btn:active { transform: translateY(0); }',
      '    .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }',
      '    .remember-me { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }',
      '    .remember-me input[type="checkbox"] { width: 18px; height: 18px; accent-color: #667eea; }',
      '    .remember-me label { color: #666; font-size: 0.9rem; cursor: pointer; }',
      '    .footer { text-align: center; margin-top: 2rem; color: #999; font-size: 0.8rem; }',
      '  </style>',
      '</head>',
      '<body>',
      '  <div class="login-container">',
      '    <div class="login-header">',
      '      <div class="icon">🔐</div>',
      '      <h1>LLM 安全学习笔记</h1>',
      '      <p>请输入访问密码</p>',
      '    </div>',
      '    <form id="loginForm">',
      '      <div class="form-group">',
      '        <label for="password">访问密码</label>',
      '        <input type="password" id="password" placeholder="请输入密码" autocomplete="current-password" required>',
      '        <div class="error-message" id="errorMsg">密码错误，请重试</div>',
      '      </div>',
      '      <div class="remember-me">',
      '        <input type="checkbox" id="rememberMe" checked>',
      '        <label for="rememberMe">记住登录状态（30天）</label>',
      '      </div>',
      '      <button type="submit" class="submit-btn" id="submitBtn">登录</button>',
      '    </form>',
      '    <div class="footer">',
      '      <p>本站内容仅供学术研究与学习使用</p>',
      '    </div>',
      '  </div>',
      '  <script>',
      '    (function() {',
      '      var correctPassword = "' + CONFIG.password + '";',
      '      var storageKey = "' + CONFIG.storageKey + '";',
      '      var expireDays = ' + CONFIG.expireDays + ';',
      '      ',
      '      function generateToken() {',
      '        var date = new Date();',
      '        var dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();',
      '        return btoa(correctPassword + "_" + dateStr);',
      '      }',
      '      ',
      '      document.getElementById("loginForm").addEventListener("submit", function(e) {',
      '        e.preventDefault();',
      '        var password = document.getElementById("password").value;',
      '        var errorMsg = document.getElementById("errorMsg");',
      '        var submitBtn = document.getElementById("submitBtn");',
      '        var input = document.getElementById("password");',
      '        ',
      '        if (password === correctPassword) {',
      '          submitBtn.disabled = true;',
      '          submitBtn.textContent = "登录中...";',
      '          var rememberMe = document.getElementById("rememberMe").checked;',
      '          if (rememberMe) {',
      '            var expiry = Date.now() + (expireDays * 24 * 60 * 60 * 1000);',
      '            localStorage.setItem(storageKey, JSON.stringify({',
      '              token: generateToken(),',
      '              expiry: expiry',
      '            }));',
      '          } else {',
      '            sessionStorage.setItem(storageKey, "true");',
      '          }',
      '          setTimeout(function() { window.location.reload(); }, 500);',
      '        } else {',
      '          input.classList.add("error");',
      '          errorMsg.classList.add("show");',
      '          setTimeout(function() {',
      '            input.classList.remove("error");',
      '            errorMsg.classList.remove("show");',
      '          }, 2000);',
      '          input.value = "";',
      '          input.focus();',
      '        }',
      '      });',
      '      document.getElementById("password").focus();',
      '    })();',
      '  </script>',
      '</body>',
      '</html>'
    ].join('\n');
    
    document.open();
    document.write(loginHTML);
    document.close();
  }
  
  // 主逻辑
  function init() {
    if (!isLoggedIn()) {
      showLogin();
    }
  }
  
  // 执行
  init();
})();
