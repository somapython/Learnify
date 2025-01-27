export function saveTokenToLocalStorage(token) {
  localStorage.setItem("fcmToken", token);
}

export function getTokenFromLocalStorage() {
  return localStorage.getItem("fcmToken");
}
