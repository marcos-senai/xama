document.addEventListener('DOMContentLoaded', () => {
    // Elementos
    const loginContainer = document.getElementById('login-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginBox = document.querySelector('.login-box');
    const registerBox = document.querySelector('.register-box');
  
    // Mostrar login ao clicar em "Iniciar Jogo"
    document.querySelector('button#iniciar-jogo').addEventListener('click', () => {
      loginContainer.style.display = 'flex';
    });
  
    // Alternar entre Login e Registro
    showRegister.addEventListener('click', (e) => {
      e.preventDefault();
      loginBox.style.display = 'none';
      registerBox.style.display = 'block';
    });
  
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      registerBox.style.display = 'none';
      loginBox.style.display = 'block';
    });
  
    // Submissão do Login
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      // Validação básica
      if(username && password) {
        // Aqui você faria a validação real com o backend
        alert(`Bem-vindo, ${username}! Redirecionando para o jogo...`);
        loginContainer.style.display = 'none';
        // Iniciar o jogo aqui
      } else {
        alert('Por favor, preencha todos os campos!');
      }
    });
  
    // Submissão do Registro
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newUsername = document.getElementById('new-username').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      if(newPassword !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }
      
      // Aqui você enviaria os dados para o backend
      alert(`Conta criada para ${newUsername}! Faça login.`);
      registerBox.style.display = 'none';
      loginBox.style.display = 'block';
    });
  });
