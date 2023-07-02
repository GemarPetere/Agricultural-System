import { apiBaseUrl } from "./_hosts.js";

export function checkLogin() {
  let token = localStorage.getItem("userToken");

  if (token) {
    if (token != "" && typeof token == "string") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export async function registerUser(userInfo, route) {
  const userData = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  };

  try {
    const response = await fetch(apiBaseUrl + route, userData);
    const data = await response.json();
    return data;
  } catch (error) {
    return `Cannot register new user, error is: ${error}`;
  }
}

export async function loginUser(userInfo, route) {
  const userData = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  };

  try {
    const response = await fetch(apiBaseUrl + route, userData);
    const data = await response.json();
    return data;
  } catch (error) {
    return `Cannot register new user, error is: ${error}`;
  }
}

export async function sendPostRequest(route, userInfo) {
  const userData = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  };

  try {
    const response = await fetch(apiBaseUrl + route, userData);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function sendPutRequest(route, userInfo) {
  const userData = {
    method: "PUT",
    body: userInfo,
  };

  try {
    const response = await fetch(apiBaseUrl + route, userData);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function editFarmerStatus(route, userInfo) {
  const userData = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  };

  console.log("User Data: ", userData);

  try {
    const response = await fetch(apiBaseUrl + route, userData);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function sendGetRequest(route) {
  try {
    const response = await fetch(apiBaseUrl + route);
    // if (!response.ok) return;
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}
