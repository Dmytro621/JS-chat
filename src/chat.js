const chatContainer = document.querySelector('#chat-container');
const inputValue = document.querySelector('#message-input');

export class Chat {
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