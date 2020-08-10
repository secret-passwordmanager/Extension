var sign_in = document.getElementById("sign-in");
var info = document.getElementById("info");
var success = document.getElementById("success");
var failure = document.getElementById("failure");
var warning = document.getElementById("warning");

function handleMessage(req) {

  console.log(`Message from the background script:  ${req.msg}`);

  if (req.msg == "login") {
    swap_div('sign-in');
    document.getElementById("login_btn").addEventListener("click", login);
  } else if (req.msg == "success") {
    swap_div('success');
  } else if (req.msg == "failure") {
    swap_div('failure');
  } else if (req.msg == "warning") {
    swap_div('warning');
  } else if (req.msg == "on") {
    document.getElementById("proxy_btn").checked = true;
  } else if (req.msg == "off") {
    document.getElementById("proxy_btn").checked = false;
  } else {
    document.getElementById("pin").style.display = "block";
    document.getElementById("pin").innerHTML = "PIN: " + req.msg;
  }
}

browser.runtime.sendMessage({
  msg: "check_status"
}).then(function () {
  browser.runtime.sendMessage({
    msg: "check_proxy"
  }).then(function() {
    browser.runtime.sendMessage({
      msg: "check_pin"
    });
  });
});

browser.runtime.onMessage.addListener(handleMessage);

function login() {

  let user = document.getElementById("login-user").value;
  let pass = document.getElementById("login-pass").value;
  let server = document.getElementById("server").value;

  var info = {
    "type": "login",
    "creds": {
      "username": user,
      "password": pass
    },
    "server": server 
  }

  if (user && pass && server) {
    swap_div('info');
    browser.runtime.sendMessage({
      msg: JSON.stringify(info)
    });
  }
}

function swap_div(name) {
  var id = document.getElementById(name);

  sign_in.style.display = "none";
  success.style.display = "none";
  failure.style.display = "none";
  info.style.display    = "none";
  warning.style.display = "none";

  id.style.display      = "block";

  if (name == "failure") {
    setTimeout(function () { swap_div("sign-in"); }, 2000);
    document.getElementById("login_btn").addEventListener("click", login);
  } else if (name == "warning") {
    success.style.display = "block";
  }
}

document.getElementById("proxy_btn").addEventListener("change", toggle_proxy);
function toggle_proxy() {

  if (document.getElementById("proxy_btn").checked){
    status = "on";
  } else {
    status = "off";
  }
  
  var info = {
    "type": "proxy",
    "status": status
  }

  browser.runtime.sendMessage({
    msg: JSON.stringify(info)
  });
  
}