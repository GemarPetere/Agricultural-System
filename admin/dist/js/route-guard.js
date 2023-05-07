if (!localStorage.getItem("userToken")) {
    window.location.href = "../../login.html";
    console.log("token does not exist");
}