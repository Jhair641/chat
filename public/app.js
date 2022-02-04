const botones = document.querySelector('#botones');
const nombreUsuario = document.querySelector('#nombreUsuario');
const contenidoProtegido = document.querySelector('#contenidoProtegido');
const formulario = document.querySelector('#formulario');
const inputChat = document.querySelector('#inputChat');

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        nombreUsuario.innerHTML = user.displayName;
        botones.innerHTML = `<button class="btn btn-outline-danger" id="btnCerrarSesion">Cerrar Sesión</button>`
        cerrarSesion();
        formulario.classList = 'input-group py-3 fixed-bottom container';
        contenidoChat(user);
    } else {
        botones.innerHTML = `<button class="btn btn-outline-success" id="btnAcceder">Acceder</button>`
        iniciarSesion();
        nombreUsuario.innerHTML = 'Chat';
        contenidoProtegido.innerHTML = `<p class="text-center lead mt-5">Debes iniciar sesion para ver</p>`;
        formulario.classList = 'input-group py-3 fixed-bottom container d-none';
    }
});

const contenidoChat = (user) => {
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!inputChat.value.trim()) {
            console.log('input vacio');
            return;
        }

        firebase.firestore().collection('chat').add({
            texto: inputChat.value,
            uid: user.uid,
            fecha: Date.now()
        })
            .then(res => {
                console.log('Mensaje guardado');
            })
            .catch(e => {
                console.log(e)
            })
        inputChat.value = '';
    })

    firebase.firestore().collection('chat').orderBy('fecha').onSnapshot(query => {
        contenidoProtegido.innerHTML = '';
        query.forEach(doc => {
            if (doc.data().uid === user.uid) {
                contenidoProtegido.innerHTML += `
                    <div class="d-flex justify-content-end mt-2">
                        <span class="badge rounded-pill bg-primary p-2">${doc.data().texto}</span>
                    </div>
                `
            }else {
                contenidoProtegido.innerHTML += `
                    <div class="d-flex justify-content-start mt-2">
                        <span class="badge rounded-pill bg-secondary p-2">${doc.data().texto}</span>
                    </div>
                `
            }
            
            contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight;
        });
    })
}

const cerrarSesion = () => {
    const btnCerrarSesion = document.querySelector('#btnCerrarSesion');
    btnCerrarSesion.addEventListener('click', () => {
        firebase.auth().signOut();
    })
}

const iniciarSesion = () => {
    const btnAcceder = document.querySelector('#btnAcceder');
    btnAcceder.addEventListener('click', async() => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider);
        } catch (error) {
            console.log('error');
        }
    })
}