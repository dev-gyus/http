const init = () => {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) throw "no login-form";

  loginForm.addEventListener("submit", handleSubmit);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  // const urlSearchParams = new URLSearchParams();
  // urlSearchParams.append("email", formData.get('email'));
  // urlSearchParams.append("password", formData.get('password'));
  const jsonData = {
    email: formData.get("email"),
    password: formData.get("password"),
  }
  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: formData
      // body: urlSearchParams.toString(),
      body: JSON.stringify(jsonData),
    });
    if (!res.ok) {
      alert('API Error ');
      return;
    }
    // console.log(await res.text());
    console.log(await res.json());
    alert("Success");
  } catch (error) {
    alert("Network error");
  }
}

document.addEventListener('DOMContentLoaded', init);