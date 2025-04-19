const addUserInput = document.querySelector('#user-input');
const addUserButton = document.querySelector('#add-user-button');
const usersList = document.querySelector('#user-list');
const inputSubmit = document.querySelector('#send-button');
const inputValue = document.querySelector('#message-input');
const clearButton = document.querySelector('#clear-messages');

import { Chat } from "./chat.js";

export class Users {
    constructor(nickname) {
        this.nickname = nickname;
        this.chat = new Chat(nickname);
    }

    saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users.map(user => ({ nickname: user.nickname }))));
    }
}

export function initUserModule() {
    let users = [];
    let activeUser = null;

    function giveUsers() {
        const infoUsers = JSON.parse(localStorage.getItem('users')) || [];
        users = infoUsers.map(user => new Users(user.nickname));
    }

    function renderUsers() {
        usersList.innerHTML = '';
        users.forEach(user => {
            usersList.innerHTML += `<button class="user-btn">${user.nickname}</button>`;
        });
        addUsersEvent();
    }

    addUserButton.addEventListener('click', () => {
        const userNickName = addUserInput.value.trim();
        if (userNickName === '') return;

        const userExists = users.find(user => user.nickname === userNickName);
        if (userExists) {
            alert('User already exists');
            return;
        }

        const newUser = new Users(userNickName);
        users.push(newUser);
        activeUser = newUser;
        activeUser.chat.giveMessages();
        activeUser.chat.renderMessages();

        usersList.innerHTML += `<button class="user-btn">${userNickName}</button>`;
        addUserInput.value = '';

        newUser.saveUsers(users);
        addUsersEvent();
    });

    inputSubmit.addEventListener('click', () => {
        if (!activeUser) return;
        activeUser.chat.sendMessage(inputValue.value);
        activeUser.chat.saveMessages();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && activeUser) {
            activeUser.chat.sendMessage(inputValue.value);
            activeUser.chat.saveMessages();
        }
    });

    clearButton.addEventListener('click', () => {
        if (!activeUser) return;
        activeUser.chat.clearMessages();
    });

    function addUsersEvent() {
        const choiceUser = document.querySelectorAll('.user-btn');
        choiceUser.forEach(button => {
            button.addEventListener('click', () => {
                const newUser = button.textContent.trim();
                activeUser = users.find(user => user.nickname === newUser);
                if (activeUser) {
                    activeUser.chat.giveMessages();
                    activeUser.chat.renderMessages();
                }
            });
        });
    }

    window.addEventListener('load', () => {
        giveUsers();
        renderUsers();

        if (users.length > 0) {
            activeUser = users[0];
            activeUser.chat.giveMessages();
            activeUser.chat.renderMessages();
        }
    });
}
