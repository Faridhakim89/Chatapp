// Konfigurasi Firebase const firebaseConfig = { apiKey: "AIzaSyDfD5H8xXZhboOp78IdFPbxlhuE_LkGkDI", authDomain: "chatapp-75cfd.firebaseapp.com", projectId: "chatapp-75cfd", storageBucket: "chatapp-75cfd.firebasestorage.app", messagingSenderId: "197066503871", appId: "1:197066503871:web:45fb035f0a1699751fb80a", measurementId: "G-5HVWY1MYJP" };

// Inisialisasi Firebase firebase.initializeApp(firebaseConfig); const auth = firebase.auth(); const db = firebase.firestore(); const provider = new firebase.auth.GoogleAuthProvider();

function loginWithGoogle() { auth.signInWithPopup(provider) .then((result) => { const user = result.user; document.getElementById("user-info").innerHTML = <p>Selamat datang, ${user.displayName}!</p> <input type="text" id="messageInput" placeholder="Tulis pesan..." /> <button onclick="sendMessage()">Kirim</button> <div id="messages"></div>; listenMessages(); }) .catch((error) => { alert("Login gagal: " + error.message); }); }

function sendMessage() { const messageInput = document.getElementById("messageInput"); const text = messageInput.value; const user = auth.currentUser; if (text.trim() !== "") { db.collection("messages").add({ text: text, name: user.displayName, uid: user.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() }); messageInput.value = ""; } }

function listenMessages() { db.collection("messages") .orderBy("createdAt", "asc") .onSnapshot((snapshot) => { const messagesDiv = document.getElementById("messages"); messagesDiv.innerHTML = ""; const currentUser = auth.currentUser;

snapshot.forEach((doc) => {
    const data = doc.data();
    const isMe = data.uid === currentUser.uid;
    const bubble = document.createElement("div");
    bubble.classList.add("message", isMe ? "my-message" : "other-message");
    bubble.innerHTML = `
      <div class="name">${data.name}</div>
      ${data.text}
    `;
    messagesDiv.appendChild(bubble);
  });

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

}

