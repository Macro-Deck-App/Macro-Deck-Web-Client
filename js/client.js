var buttons;
var websocket;
var connected;
var recentConnections = [];
var clientId;
var rows = 3;
var columns = 5;
var buttonSpacing = 5;
var buttonRadius = 40;
var buttonSize = 100;
var buttonBackground = false;
var icons = [];
var pressTimer;
var longPress = false;
var supportButtonReleaseLongPress = false;
var buttonsGenerated = false;

var apiVersion = 20;
var version = "2.4.1";

function back() {
	disconnect();
	window.location.reload(false); 
}

function disconnect() {
	lastUrl = null;
	if (websocket != null) {
		websocket.close();
	}
}

$( window ).resize(function() {
	autoSize();
});

$(window).on("orientationchange", function (event) {
	autoSize();
});

function openFullscreen() {
	var elem = document.documentElement;
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.webkitRequestFullscreen) {
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) {
		elem.msRequestFullscreen();
	}
}

var dark = true;
function toggleDark() {
    dark = !dark;
    document.getElementById("body").classList.toggle("bg-dark");
    if (dark) {
        document.getElementById("btn-dark").innerText = "Light";
        document.getElementById("logo").setAttribute("src","images/logo.png" );

    } else {
        document.getElementById("btn-dark").innerText = "Dark";
        document.getElementById("logo").setAttribute("src","images/logo2.png" );
    }
} 

$( window ).resize(function() {
	if (!document.fullscreenElement) {
		if (connected) {
			document.getElementById("btn-back").classList.toggle("d-none", false);
		}
		document.getElementById("btn-fullscreen").classList.toggle("d-none", false);
		document.getElementById("btn-dark").classList.toggle("d-none", false);
	} else {
		document.getElementById("btn-back").classList.toggle("d-none", true);
		document.getElementById("btn-dark").classList.toggle("d-none", true);
		document.getElementById("btn-fullscreen").classList.toggle("d-none", true);
	}
	autoSize();
});

$(document).ready(function () {	
	$('form[name="connect"]').on("submit", function (e) {
		e.preventDefault();
		var host = $(this).find('input[name="inputHost"]');
		var port = $(this).find('input[name="inputPort"]');
		
		connect("ws://" + host.val() + ":" + port.val() + "/");
	});
	
	if (getCookie("clientId")) {
		clientId = getCookie("clientId");
	} else {
		clientId = Math.random().toString(36).substr(2, 9);
		setCookie("clientId", clientId, 365);
	}
	
	document.getElementById("labelVersion").innerHTML = version;

	document.getElementById("client-id").innerHTML = clientId;
	
	if (getCookie("recentConnections")) {
		recentConnections = JSON.parse(getCookie("recentConnections"));
		if (recentConnections.length < 1) {
			document.getElementById("col-recent-connections").classList.toggle("d-none", true);
		} else {
			document.getElementById("col-recent-connections").classList.toggle("d-none", false);
		}
		for (var i = 0; i < recentConnections.length; i++) {
			var recentConnectionItemRow = document.createElement("div");
			recentConnectionItemRow.classList.add("row");
			recentConnectionItemRow.classList.add("mb-2");
			
			var recentConnectionItem = document.createElement("div");
			recentConnectionItem.classList.add("col");
			recentConnectionItem.classList.add("recent-connection-item");
			recentConnectionItem.classList.add("text-left");
			recentConnectionItem.setAttribute("id", recentConnections[i]);
			recentConnectionItem.addEventListener("click", function() {
				connect(this.id);
			});
			var recentConnectionUrl = document.createElement("h6");
			recentConnectionUrl.classList.add("my-auto");
			recentConnectionUrl.innerHTML = recentConnections[i];
			recentConnectionItem.appendChild(recentConnectionUrl);
			
			var btnRemoveRecentConnection = document.createElement("button");
			btnRemoveRecentConnection.classList.add("col-auto");
			btnRemoveRecentConnection.classList.add("btn");
			btnRemoveRecentConnection.classList.add("btn-danger");
			btnRemoveRecentConnection.classList.add("ml-1");
			btnRemoveRecentConnection.style.minWidth = "50px";
			btnRemoveRecentConnection.setAttribute("id", recentConnections[i]);
			
			btnRemoveRecentConnection.innerHTML = "X";
			btnRemoveRecentConnection.addEventListener("click", function() {
				if (recentConnections.includes(this.id)) {
					recentConnections.splice(recentConnections.indexOf(this.id), 1);
					setCookie("recentConnections", JSON.stringify(recentConnections), 365);
				}
				window.location.reload(false); 
			});
			
			
			recentConnectionItemRow.appendChild(recentConnectionItem);
			recentConnectionItemRow.appendChild(btnRemoveRecentConnection);
			document.getElementById("recent-connections").appendChild(recentConnectionItemRow);
		}
	}
});

function connect(url) {
	if (connected) return;
	document.getElementById("button-connect-spinner").classList.toggle("d-none", false);
	
	if (websocket != null) {
		disconnect();
	}
	
	websocket = new WebSocket(url);

	websocket.onopen = function (e) {
		connected = true;
		
		document.getElementById("button-container").innerHTML = "";
		document.getElementById("connect-container").innerHTML = '<div class="d-flex align-items-center justify-content-center" style="height: 500px;"><h1>Waiting for accepting the connection... <span class="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span></h1></div>';
		var jsonObj = { "Method" : JsonMethod.CONNECTED, "Client-Id" : clientId, "API" : apiVersion, "Device-Type": "Web"  }
		doSend(JSON.stringify(jsonObj));
		
	};

	websocket.onclose = function (e) {
		connected = false;
		console.log("Connection closed");
		window.location.reload(false); 
	};

	websocket.onmessage = function (e) {
		try {
			var obj = JSON.parse(e.data);
			console.log(obj);
			switch (obj.Method) {
				case JsonMethod.GET_CONFIG:
					document.getElementById("connect-container").innerHTML = "";
					if (obj.Columns !== columns || obj.Rows !== rows || obj.ButtonBackground != buttonBackground) {
						buttonsGenerated = false;
						columns = obj.Columns;
						rows = obj.Rows;
						buttonBackground = obj.ButtonBackground;
					}
					columns = obj.Columns;
					rows = obj.Rows;
					buttonSpacing = obj.ButtonSpacing;
					buttonRadius = obj.ButtonRadius;
					buttonBackground = obj.ButtonBackground;
					if (obj.SupportButtonReleaseLongPress && obj.SupportButtonReleaseLongPress == true) {
						supportButtonReleaseLongPress = true;
					}

					var jsonObj = { "Method" : JsonMethod.GET_BUTTONS }
					doSend(JSON.stringify(jsonObj));
					
					if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
						document.getElementById("btn-back").classList.toggle("d-none", false);
					}
					
					if (recentConnections.includes(url) == false) {
						recentConnections.push(url);
						setCookie("recentConnections", JSON.stringify(recentConnections), 365);
					}
					autoSize();
					break;
				case JsonMethod.GET_BUTTONS:
					if (!buttonsGenerated) {
						buttonsGenerated = true;
						generateGrid(columns, rows);
					}
					var actionButtons = document.getElementsByClassName("action-button");
					var labels = document.getElementsByClassName("label");
					for (var i = 0; i < actionButtons.length; i++) {
						actionButtons[i].style.backgroundImage = '';
						actionButtons[i].classList.toggle("btn-secondary", true);
						labels[i].style.backgroundImage = '';
					}
					
					this.buttons = obj.Buttons;
					for (var i = 0; i < this.buttons.length; i++) {
						var button = document.getElementById(this.buttons[i].Position_Y + "_" + this.buttons[i].Position_X);
						
						if (button && this.buttons[i]) {
							if (this.buttons[i].Icon) {
								var iconPack;
								var icon;

								if (Array.prototype.find != null) { // using faster find method for supported browser
									var _buttons = this.buttons;

									iconPack = icons.IconPacks.find(function (e) {
										return e.Name == _buttons[i].Icon.split(".")[0]
									});

									icon = iconPack.Icons.find(function (e) {
										return e.IconId == _buttons[i].Icon.split(".")[1]
									});
								} else { // using slower for loop to find the icon for older browsers
									for (var j = 0; j < icons.IconPacks.length; j++) {
										if (this.buttons[i].Icon.split(".").length > 0 && icons.IconPacks[j].Name == this.buttons[i].Icon.split(".")[0]) {
											iconPack = icons.IconPacks[j];
										}
									}

									for (var j = 0; j < iconPack.Icons.length; j++) {
										if (this.buttons[i].Icon.split(".").length > 0 && iconPack.Icons[j].IconId == this.buttons[i].Icon.split(".")[1]) {
											icon = iconPack.Icons[j];
										}
									}
								}
								button.style.backgroundImage = 'url(data:image/gif;base64,' + icon.IconBase64 + ')';
							} else if (this.buttons[i].IconBase64) {
								button.style.backgroundImage = 'url(data:image/gif;base64,' + this.buttons[i].IconBase64 + ')';
							}

						}
						
						var label = document.getElementById("label_" + this.buttons[i].Position_Y + "_" + this.buttons[i].Position_X);
						if (label) {
							if (this.buttons[i].Label && this.buttons[i].Label.LabelBase64) {
								label.style.backgroundImage = 'url(data:image/gif;base64,' + this.buttons[i].Label.LabelBase64 + ')';
							}
							if (this.buttons[i].LabelBase64) {
								label.style.backgroundImage = 'url(data:image/gif;base64,' + this.buttons[i].LabelBase64 + ')';
							}
						}

						if (this.buttons[i].BackgroundColorHex) {
							button.classList.toggle("btn-secondary", !this.buttons[i].BackgroundColorHex);
							button.style.backgroundColor = this.buttons[i].BackgroundColorHex;
						}
					}
					autoSize();
					break;
				case JsonMethod.UPDATE_BUTTON:
					var button = document.getElementById(obj.Buttons[0].Position_Y + "_" + obj.Buttons[0].Position_X);
					
					if (button) {
						if (obj.Buttons[0].Icon) {
							var iconPack;
							var icon;

							if (Array.prototype.find != null) { // using faster find method to find the icon for supported browsers
								iconPack = icons.IconPacks.find(function (e) {
									return e.Name == obj.Buttons[0].Icon.split(".")[0]
								});

								icon = iconPack.Icons.find(function (e) {
									return e.IconId == obj.Buttons[0].Icon.split(".")[1]
								});
							} else { // using slower for loop to find the icon for older browsers
								for (var j = 0; j < icons.IconPacks.length; j++) {
									if (obj.Buttons[0].Icon.split(".").length > 0 && icons.IconPacks[j].Name == obj.Buttons[0].Icon.split(".")[0]) {
										iconPack = icons.IconPacks[j];
									}
								}

								for (var j = 0; j < iconPack.Icons.length; j++) {
									if (obj.Buttons[0].Icon.split(".").length > 0 && iconPack.Icons[j].IconId == obj.Buttons[0].Icon.split(".")[1]) {
										icon = iconPack.Icons[j];
									}
								}
							}
							button.style.backgroundImage = 'url(data:image/gif;base64,' + icon.IconBase64 + ')';
						} else if (obj.Buttons[0].IconBase64) {
							button.style.backgroundImage = 'url(data:image/gif;base64,' + obj.Buttons[0].IconBase64 + ')';
						} else {
							button.style.backgroundImage = '';
						}


						if (obj.Buttons[0].BackgroundColorHex) {
							button.classList.toggle("btn-secondary", !obj.Buttons[0].BackgroundColorHex);
							button.style.backgroundColor = obj.Buttons[0].BackgroundColorHex;
						}
					}
					
					var label = document.getElementById("label_" + obj.Buttons[0].Position_Y + "_" + obj.Buttons[0].Position_X);
					if (label) {
						if (obj.Buttons[0].Label && obj.Buttons[0].Label.LabelBase64) {
							label.style.backgroundImage = 'url(data:image/gif;base64,' + obj.Buttons[0].Label.LabelBase64 + ')';
						}
						if (obj.Buttons[0].LabelBase64) {
							label.style.backgroundImage = 'url(data:image/gif;base64,' + obj.Buttons[0].LabelBase64 + ')';
						}
					}
					break;
				case JsonMethod.UPDATE_LABEL:
					var label = document.getElementById("label_" + obj.Buttons[0].Position_Y + "_" + obj.Buttons[0].Position_X);
					if (obj.Buttons[0].Label && obj.Buttons[0].Label.LabelBase64) {
						label.style.backgroundImage = 'url(data:image/gif;base64,' + obj.Buttons[0].Label.LabelBase64 + ')';
					}
					if (obj.Buttons[0].LabelBase64) {
						label.style.backgroundImage = 'url(data:image/gif;base64,' + obj.Buttons[0].LabelBase64 + ')';
					}
					break;
				case JsonMethod.GET_ICONS:
					icons = obj;
					break;
			}
			
		} catch(err) {
			console.log(err);
			if (document.getElementById("button-connect-spinner")) {
				document.getElementById("button-connect-spinner").classList.toggle("d-none", true);
			}
		}
	};
	
	websocket.onerror = function (e) {
		document.getElementById("button-connect-spinner").classList.toggle("d-none", true);
		websocket.close();
		connected = false;
		$('#connection-failed-modal').modal('show');
	};
}

function generateGrid(columns, rows) {
	var buttonContainer = document.getElementById("button-container");
	buttonContainer.innerHTML = "";
	
	for (var i = 0; i < rows; i++) {
		var row = document.createElement("div");
		row.setAttribute("class", "row");
		row.setAttribute("style", "margin: 0; padding: 0;");
		buttonContainer.appendChild(row);
		for (var j = 0; j < columns; j++) {
			var column = document.createElement("div");
			column.setAttribute("id", "col_" + i + "_" + j);
			column.classList.add("col");
			column.classList.add("blockBox");
			var button = document.createElement("div");
			button.classList.add("action-button");
			button.classList.toggle("btn-secondary", buttonBackground);
			button.setAttribute("id", i + "_" + j);
			
			$(button).bind('touchstart', function() {
				onTouchStart(this.id);
			});
			$(button).bind('touchend', function() {
				onTouchEnd(this.id);
			});
			$(button).mousedown(function(){
				onMouseDown(this.id);
			});
			$(button).mouseup(function(){
				onMouseUp(this.id);
			});
						
			var label = document.createElement("div");
			label.setAttribute("id", "label_" + i + "_" + j);
			label.classList.add("label");
			button.appendChild(label);
			
			var loaderContainer = document.createElement("div");
			loaderContainer.classList.add("loader-container");
			loaderContainer.setAttribute("id", "loader_" + i + "_" + j);
			loaderContainer.classList.toggle("d-none", true);
			button.appendChild(loaderContainer);
						
			row.appendChild(column);
			column.appendChild(button);
		}
	}
	
}

function autoSize() {
	var divs = document.getElementsByClassName('blockBox');
	var rows = document.getElementsByClassName('row');
	var container = document.getElementsByClassName('button-container')[0];
	
	var btnFullscreen = document.getElementById("btn-fullscreen");

	var offset = 0;
	if (!document.fullscreenElement) {
		offset = 30 + btnFullscreen.offsetHeight * 2;
	}

	var buttonSize = 100;
    var rowsCount = rows.length;
	var columnsCount = (divs.length / rows.length);
    var width = window.innerWidth, height = window.innerHeight - offset;
    var buttonSizeX, buttonSizeY;

    buttonSizeX = width / columnsCount;
    buttonSizeY = height / rowsCount;
    buttonSize = Math.min(buttonSizeX, buttonSizeY);
	
	
	
	var containerWidth = buttonSize * (divs.length / rows.length);
	var containerHeight = buttonSize * (rows.length);
	container.setAttribute("style","width: " + containerWidth + "px; height: " + containerHeight + "px;");

	
	for (i = 0; i < divs.length; i++) {
		divs[i].style.padding = buttonSpacing + "px";
		divs[i].style.borderRadius = buttonRadius + "px";
		divs[i].style.width = buttonSize + "px";
		divs[i].style.height = buttonSize + "px";
	}
	
	var buttons = document.getElementsByClassName('action-button');
	for (i = 0; i < buttons.length; i++) {
		buttons[i].style.borderRadius = ((buttonRadius / 2) / 100) * buttonSize + "px";
	}
	
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
        while (c.charAt(0) === ' ') {
			c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
        }
	}
    return "";
}

function onTouchStart(id) {
	if (!IsTouchDevice()) return;
	buttonPress(id);
}

function onTouchEnd(id) {
	if (!IsTouchDevice()) return;
	buttonPressRelease(id);
}

function onMouseDown(id) {
	if (IsTouchDevice()) return;
	buttonPress(id);
}

function onMouseUp(id) {
	if (IsTouchDevice()) return;
	buttonPressRelease(id);
}

function buttonPress(id) {
	longPress = false;
	pressTimer = window.setTimeout(function() {
		longPress = true;
		var jsonObj = { "Message" : id, "Method" : JsonMethod.BUTTON_LONG_PRESS }
		if (supportButtonReleaseLongPress) {
			doSend(JSON.stringify(jsonObj));
		}
	},1000);
	if (document.getElementById("col_" + id)) {
		document.getElementById("col_" + id).classList.toggle('pressed', true);
		document.getElementById("col_" + id).classList.toggle('release-transition', false);
	}
	var jsonObj = { "Message" : id, "Method" : JsonMethod.BUTTON_PRESS }
	doSend(JSON.stringify(jsonObj));
}

function buttonPressRelease(id) {
	clearTimeout(pressTimer);
	if (document.getElementById("col_" + id)) {
		document.getElementById("col_" + id).classList.toggle('pressed', false);
		document.getElementById("col_" + id).classList.toggle('release-transition', true);
	}

	var jsonObj = { "Message" : id, "Method" : JsonMethod.BUTTON_RELEASE }
	if (longPress) {
		jsonObj = { "Message" : id, "Method" : JsonMethod.BUTTON_LONG_PRESS_RELEASE }
	}
	if (supportButtonReleaseLongPress) {
		doSend(JSON.stringify(jsonObj));
	}
}


function doSend(message) {
    websocket.send(message);
}

function IsTouchDevice() {
	return 'ontouchstart' in window || navigator.msMaxTouchPoints;
}

var JsonMethod = {
	CONNECTED: "CONNECTED",
    GET_CONFIG: "GET_CONFIG",
    GET_BUTTONS: "GET_BUTTONS",
	UPDATE_BUTTON: "UPDATE_BUTTON",
	UPDATE_LABEL: "UPDATE_LABEL",
	BUTTON_DONE: "BUTTON_DONE",
	REQUEST_PIN: "REQUEST_PIN",
	GET_ICONS: "GET_ICONS",
    BUTTON_PRESS: "BUTTON_PRESS",
    BUTTON_LONG_PRESS: "BUTTON_LONG_PRESS",
	BUTTON_RELEASE: "BUTTON_RELEASE",
	BUTTON_LONG_PRESS_RELEASE: "BUTTON_LONG_PRESS_RELEASE"
}
