const chatContainer = document.querySelector('#chat-container')
const inputValue = document.querySelector('#message-input')
const inputSubmit = document.querySelector('#send-button') 
const clearButton = document.querySelector('#clear-messages')
const addUserInput = document.querySelector('#user-input')
const addUserButton = document.querySelector('#add-user-button')
const usersList = document.querySelector('#user-list')
let choiceUser = document.querySelectorAll('.user-btn')

class Chat {
    constructor(nickname) {
        this.messages = []
        this.nickname = nickname
    }
    
    sendMessage(message) {
        if (inputValue.value == '') {
        return
        } else {
            this.messages.push(message)
            this.renderMessages()
            inputValue.value = ''
        }
    }

    renderMessages() {
        chatContainer.innerHTML = ''
        for (const element of this.messages) {
            chatContainer.innerHTML += `<p>${element}</p>`
        }
    }

    saveMessages() {
        localStorage.setItem(`chatifinfo${this.nickname}`, JSON.stringify(this.messages))
    }

    giveMessages() {
        let info = JSON.parse(localStorage.getItem(`chatifinfo${this.nickname}`))
        if (info) {
            this.messages = info
        }
    }

    clearMessages() {
        localStorage.removeItem(`chatifinfo${this.nickname}`)
        this.messages = []
        this.renderMessages()
    }
}

class Users {
    constructor(nickname) {
        this.nickname = nickname;
        this.chat = new Chat(nickname)
    }

    saveUsers() {
    localStorage.setItem('users', JSON.stringify(users.map(user => ({ nickname: user.nickname }))));
    }
}

function giveUsers() {
    let infoUsers = JSON.parse(localStorage.getItem('users')) || []
    users = infoUsers.map(user => new Users(user.nickname))
}

function renderUsers() {
    usersList.innerHTML = ''
    users.forEach(user => {
        usersList.innerHTML += `<button class="user-btn">${user.nickname}</button>`
    })
    addUsersEvent()
}

let users = [];
let activeUser = null

addUserButton.addEventListener('click', () => {
    const userNickName = addUserInput.value.trim()
    if (userNickName === '') return
    
    const userExists = users.find(user => user.nickname === userNickName)
    if (userExists) {
        alert('User already exists')
        return
    } else {
        const newUser = new Users(userNickName);
        users.push(newUser);
        activeUser = newUser;
        activeUser.chat.giveMessages()
        activeUser.chat.renderMessages()

        usersList.innerHTML += `<button class="user-btn">${userNickName}</button>`
        addUserInput.value = ''

        newUser.saveUsers()
    }

})


if (activeUser) {
    activeUser.giveMessages()
    activeUser.renderMessages()
}



inputSubmit.addEventListener('click', () => {
    activeUser.chat.sendMessage(inputValue.value)
    activeUser.chat.saveMessages()
})

window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        activeUser.chat.sendMessage(inputValue.value)
        activeUser.chat.saveMessages()
    }
})

clearButton.addEventListener('click', () => {
    activeUser.chat.clearMessages()
})

function addUsersEvent() {
    choiceUser = document.querySelectorAll('.user-btn')

    choiceUser.forEach(button => {
        button.addEventListener('click', () => {
            const newUser = button.textContent.trim()
            activeUser = users.find(user => user.nickname === newUser)
            if (activeUser) {
                activeUser.chat.giveMessages()
                activeUser.chat.renderMessages()
            }
        })
    });
}

window.addEventListener('load', () => {
    giveUsers()
    renderUsers()

    if (users.length > 0) {
        activeUser = users[0]
        activeUser.chat.giveMessages()
        activeUser.chat.renderMessages()
    }
})