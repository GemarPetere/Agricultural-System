// Check if user is logged in
import { checkLogin } from "./common.js";

if(checkLogin()){
  // Your code here
}else{
  window.location.href = "../login.html"
}
