
const subscibe = async () => {
  const eventSource = new EventSource("/subscribe");
  eventSource.addEventListener('message', (event) => {
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

const init = () => {
  subscibe();
};

document.addEventListener('DOMContentLoaded', init);