
let webSocket;


const subscibe = async () => {
  webSocket = new WebSocket('ws://localhost:3000');

  webSocket.addEventListener('message', (event) => {
    render(JSON.parse(event.data));
  });
}

const render = (message) => {
  const messageElement = document.createElement('div');
  const { text } = message;
  const timestamp = new Date(message.timestamp).toLocaleTimeString();

  messageElement.textContent = `${text} (${timestamp})`;
  document.body.appendChild(messageElement);

}

const initSendButton = () => {
  const sendButtonEl = document.querySelector('#send-button');
  sendButtonEl.addEventListener('click', () => {
    const textFieldEl = document.querySelector('#text-field');
    const textValue = textFieldEl.value;
    if (!textValue) return;

    textFieldEl.value = '';

    if (!webSocket) return;

    webSocket.send(textValue);
  })
}

const init = () => {
  subscibe();
  initSendButton();
};

document.addEventListener('DOMContentLoaded', init);