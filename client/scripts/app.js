var socket = null;
const serverAPI = 'http://localhost:8080/';
const chatTemplate = `<div class="box-container">
<div class="navbar">
    <div class="height-100 width-70 float-left">
        <img class="height-99" src="css/images/chat.png">
        <p id="clientName" class="inline-block"></p>
    </div>
    <div class="img-wrapper height-100 width-5 float-right inline-block">
        <img class="height-80 padding-5" src="css/images/logout.png" onclick="logout()">
    </div>
</div>
<div class="section">
    <div id="message-box" class="message-container size-100" >
        <span class="text-center margin-auto">Login successfully</span>
    </div>
</div>
<div class="footer">
    <div class="button-input-wrapper">
        <div class="height-100 width-70 float-left">
            <input class="message-input" id="message" type="text" placeholder="Type a message"></input>
        </div>
        <div class="width-30 height-100 float-right inline-block">
            <button class="message-button" onclick="sendMessage()">Send</button>
        </div>
    </div>
</div>`
const loginTemplate = `<div class="box-container">
<div class="navbar">
    <div class="height-100 width-70 float-left">
        <img class="height-99" src="css/images/chat.png">
    </div>
</div>
<div class="text-center heightpx-100">Welcome! please login</div>
<div class="login-section">

     <div class="row height-20">
        <div class="width-30 height-100 float-left">
            <label class="label-login display-block">Email</label>
        </div>
        <div class="width-70 float-right">
            <input class="login-input" type="text" id="login_email" required placeholder="example@email.com"> </input>
        </div>
     </div>
     <div class="row height-20">
     <div class="width-30 height-100 float-left"> <label class="display-block label-login">Password</label> </div>
    <div class="width-70 float-right">
        <input type="password" class="login-input" id="login_password" required placeholder="******"> </input>
    </div>
     </div>
     <div class="row height-20 text-center">
        <button class="message-button" onlick="onsubmit="login(event)">Login</button>
     </div>
 </div>
</div>`


const mount = async function () {
    let email = localStorage.getItem('email');
    let name = localStorage.getItem('name');
    let id = localStorage.getItem('id')
    if (id && name && email)
        loadChatPage({ email, name, id })
    else {
        document.getElementById('chatty-app').innerHTML = "";
        document.getElementById('chatty-app').insertAdjacentHTML('beforeend', loginTemplate);
    }
}

const loadChatPage = async function (data) {
    localStorage.setItem('email', data.email);
    localStorage.setItem('name', data.name);
    localStorage.setItem('id', data.id);
    document.getElementById('chatty-app').innerHTML = "";
    document.getElementById('chatty-app').insertAdjacentHTML('beforeend', chatTemplate);
    document.getElementById('clientName').innerHTML = data.name;
    activateServer(data.id);
}

const sendMessage = function () {
    try {
        let text = document.getElementById('message').value;
        if (!text || text == "") throw 'Type a message first'
        document.getElementById('message').value = "";
        sendSocketMessage(text);
        addMessageInBox(text, 'right')
    } catch (error) {
        if (typeof error == 'string') alert(error);
        else console.log(error);
    }
}

const activateServer = async function (userId) {
    try {
        socket = io.connect('http://localhost:3000', { query: 'id=' + userId });
        socket.on('recieve_new_message', receiveSocketMessage);
    } catch (error) {
        console.log(error);
    }
}

const sendSocketMessage = function (text) {
    socket.emit('new_message', { id: localStorage.getItem('id') == 1 ? 2 : 1, message: text });
}

const receiveSocketMessage = function (message) {
    messageHandler(message, 'right');
}


const addMessageInBox = function (text, from) {
    try {
        let messageHtml = `<div class="message-line ${from}"> <span class="span-message ${from == 'right' ? 'green-message' : ''}"> ${text}</span> </div>`;
        document.getElementById('message-box').insertAdjacentHTML('beforeend', messageHtml);
    } catch (error) {
        console.log(error);
    }
}

const messageHandler = function (data) {
    try {
        addMessageInBox(data.message, 'left');
    } catch (error) {
        console.log(error);
    }
}

const returnRequestOptionWithBody = function (body, method) {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        method: method,
        body: JSON.stringify(body)
    }
}


const login = async function (event) {
    try {
        event.preventDefault();
        let password = document.getElementById('login_password').value;
        let email = document.getElementById('login_email').value;
        if (password == '' || email == '') throw { code: 909, message: 'Please enter the ' + (email == '' ? 'email' + (password == '' ? ' & password' : '') : 'password') }
        let response = await fetch(serverAPI + 'auth/login', returnRequestOptionWithBody({ email: email, password: password }, 'POST'));
        response = await response.json();
        if (response.status == 200)
            loadChatPage({ email: email, ...response.data })
        else alert(response.message);
    } catch (error) {
        if (error.code && error.code == 909) alert(error.message);
        console.log(error);
    }
}

const logout = function () {
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    socket.disconnect();
    socket = null;
    mount();
}



mount();
