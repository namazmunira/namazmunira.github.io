var redirecting = false;

function redirectToMainPage() {
  if (!redirecting) {
    redirecting = true;
    window.location.href = "index.html";
  }
}



function handleOnlineEvent() {
  console.log("Интернет-соединение восстановлено.");
  redirectToMainPage();
}


function checkInternetConnection() {
  if (window.navigator.onLine) {
    handleOnlineEvent();
  } else {
    return;
  }
}

window.addEventListener("online", checkInternetConnection);

checkInternetConnection();