document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  axios
    .post("https://task-manager-api-juqf.onrender.com/user/signup", {
      name,
      password,
      email,
    })
    .then((response) => {
      ipcRenderer.send("open-new-window");
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
});
