import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyByb6rofEe1LP5EEKRu1OuGujIycc_livQ",
    authDomain: "espacoliteral-3dcfe.firebaseapp.com",
    projectId: "espacoliteral-3dcfe",
    storageBucket: "espacoliteral-3dcfe.appspot.com",
    messagingSenderId: "418284699754",
    appId: "1:418284699754:web:41a8c117c008a2b7b28a13"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/books');


setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log('Persistência configurada.');
  })
  .catch((error) => {
    console.error('Erro ao configurar persistência:', error);
  });


function handleLogin() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const authToken = credential.accessToken; 
            sessionStorage.setItem('googleAccessToken', authToken);
            const user = result.user;
            console.log('Token de autenticação:', authToken); 
            console.log('Usuário logado:', user);

            const botaoLogin = document.getElementById('botaoLogin');
            const botaoLogout = document.getElementById('botaoLogout');
            if (botaoLogin) botaoLogin.style.display = 'none';
            if (botaoLogout) botaoLogout.style.display = 'block';
            const menuSuspenso = document.getElementById('menuSuspenso');
            if (menuSuspenso) menuSuspenso.style.display = 'none';

           
            if (window.location.pathname === '/index.html') {
                window.location.href = '/Home/home.html';
            }
        })
        .catch((error) => {
            console.error('Erro na autenticação:', error);
            alert('Ocorreu um erro durante o login. Por favor, tente novamente.');
        });
}


function handleLogout() {
    signOut(auth).then(() => {
        sessionStorage.removeItem('googleAccessToken');
        console.log('Usuário deslogado');

        
        window.location.href = '/index.html';

        
        const botaoLogout = document.getElementById('botaoLogout');
        if (botaoLogout) botaoLogout.style.display = 'none';
    }).catch((error) => {
        console.error('Erro ao deslogar:', error);
    });
}


export function handleDropdownToggle() {
    const menuSuspenso = document.getElementById('menuSuspenso');
    if (menuSuspenso) {
        menuSuspenso.style.display = menuSuspenso.style.display === 'block' ? 'none' : 'block';
    }
}


window.addEventListener('beforeunload', () => {
    const authToken = sessionStorage.getItem('googleAccessToken');
    console.log('Token de autenticação:', authToken);
});


window.onload = () => {
    const botaoLogin = document.getElementById('botaoLogin');
    const botaoLogout = document.getElementById('botaoLogout');

 
    const authToken = sessionStorage.getItem('googleAccessToken');
    if (authToken) {
        if (botaoLogin) botaoLogin.style.display = 'none';
        if (botaoLogout) botaoLogout.style.display = 'block';
    } else {
        if (botaoLogin) botaoLogin.style.display = 'block';
        if (botaoLogout) botaoLogout.style.display = 'none';
    }


    if (botaoLogin) botaoLogin.addEventListener('click', handleLogin);
    if (botaoLogout) botaoLogout.addEventListener('click', handleLogout);
};
