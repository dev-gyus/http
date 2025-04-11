
let webSocket;

const init = async () => {
  const res = await fetch('http://localhost:3000/resource.json', {
    headers: {
      'X-FOO': 'foo'
    },
    method: 'PUT'
  });

  const data = await res.text();
  const jsonEl = document.createElement('pre');
  jsonEl.textContent = data;
  document.body.appendChild(jsonEl);
};

document.addEventListener('DOMContentLoaded', init);