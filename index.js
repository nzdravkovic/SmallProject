//Personal Contact Manager
//COP 4331

// Url
var urlBase = 'http://ec2-18-219-60-79.us-east-2.compute.amazonaws.com/';

var extension = 'php';

var firstName = "";
var lastName = "";
var userID = 0;

// Directs to SignUp
function doSignUp()
{
	hideOrShow("signUp", false);
	hideOrShow("createAccount", true);
	hideOrShow("loginForm", false);
}

// Back to Login
function backToLogin()
{
	hideOrShow("signUp", true);
	hideOrShow("createAccount", false);
	hideOrShow("loginForm", true);
}

// Shows search results
function showResults()
{

}

function doLogin()
{
	// Get username and password
	var login = document.getElementById('loginUser').value;
	var password1 = document.getElementById('pwUser').value;
	/*
	if (login.length == 0 || password1.length == 0)
	{
		alert("Please submit a valid username and password");
		return;
	}*/
	document.getElementById('logginResult').innerHTML = "";

	// Create json
	var jsonPayload = '{"Log" : "' + login + '", "password" : "' + password1 + '"}';

	// Send url
	var url = urlBase + '/login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		// Send json
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse(jsonPayload);
		var userId = jsonObject.id;

		if(userId < 1)
		{
			//console.log("user/pass combo incorrect");
			document.getElementById('logginResult').innerHTML = "User/password combination incorrect";
			return;
		}

		//firstName = jsonObject.firstName;
		//lastName = jsonObject.lastName;

		document.getElementById('userLog').innerHTML = login;

		document.getElementById('loginUser').value = "";
		document.getElementById('pwUser').value = "";

		hideOrShow("loginForm", false);
		hideOrShow("loggedInDiv", true);
		hideOrShow("createAccount", false);
		hideOrShow("contactList", true);
		hideOrShow("addContactList", true);
	}
	catch(err)
	{
		document.getElementById('logginResult').innerHTML = err.message;
	}
}

// Not sure if this function is working correctly
// Doesn't insert anything in the database so could be this or something wrong with the add.php script
function addContact()
{
	var contactFirstName = document.getElementById("addFirstName").value;
	var contactLastName = document.getElementById("addLastName").value
	var contactPhoneNumber = document.getElementById("addPhoneNumber").value
	var contactEmail = document.getElementById("addEmail").value
	var contactAddress = document.getElementById("addAddress").value

	document.getElementById("contactAddResult").innerHTML = "";

	var jsonPayload = '{"firstName" : "' + contactFirstName + '", "lastName" : "' + contactLastName + '", "phone" : "' + contactPhoneNumber + '", "email": "' + contactEmail
	 + '", "address" : "' + contactAddress + '", "userId" : "' + userID + '"}';
	var url = urlBase + '/add.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{

			if(this.readyState == 4 && this.status == 200)
			{
				document.getElementById("addFirstName").value = "";
				document.getElementById("addLastName").value = ""
		    document.getElementById("addPhoneNumber").value = ""
				document.getElementById("addEmail").value = ""
		    document.getElementById("addAddress").value = ""
		    document.getElementById('contactAddResult').innerHTML = "Contact Added";
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById('logginResult').innerHTML = err.message;
	}
}

// Searches for contacts and presents results in a table
function searchContact()
{
	let searchName = document.getElementById("searchContact").value;

	var jsonPayload = '{"searchInquiry" : "' + searchName + '"}';

	var url = urlBase + '/search.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{

			if(this.readyState == 4 && this.status == 200)
			{
				document.getElementById("searchContact").value = "";
				document.getElementById('contactSearchResult').innerHTML = "Contact(s) Found";

				showResults();
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById('logginResult').innerHTML = err.message;
	}
}

function deleteContact()
{

}

// This function works for me
function registerNewUser()
{
	// getElementById gets the text in the input where the id = "whatever"
	// Gets the value of each input and stores it in a variable
	var newFirstName = document.getElementById("firstName").value;
	var newLastName = document.getElementById('lastName').value;
	var email = document.getElementById('email').value;
	var newUserName = document.getElementById('newUser').value;
	var newPassword = document.getElementById('passwordNewUser').value;

	//var jsonPayload = '{"first" : "' + newFirstName + '", "last" : "' + newLastName + '","user" : "' + newUserName + '", "password" : "' + newPassword + '", "email" : "' + email + '"}';

	// Create the url -- Change the urlBase to aws domain
	var url = urlBase + '/create.' + extension;

	// Create json -- the variables in quotes can be changed to a different name but the changes need to be
	// reflected in the php scripts
	var jsonPayload = '{"first" : "' + newFirstName + '", "last" : "' + newLastName + '", "userNew" : "' + newUserName + '", "password": "' + newPassword
	 + '", "email" : "' + email + '"}';
	//console.log(url);

	// Some networking code available in Leineckers slides -- don't really know what it does
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{

			if(this.readyState == 4 && this.status == 200)
			{
				document.getElementById("userAddResult").innerHTML =  "User is registered";

				// Added to automatically login new user
				document.getElementById("loginUser").innerHTML = document.getElementById("newUser");
				document.getElementById("pwUser").innerHTML = document.getElementById("passwordNewUser");

				doLogin();
			}
		};

		// Send the json to php scripts?
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		// Diplay error
		document.getElementById("userAddResult").innerHTML =  "User could not be registered. Try again";
	}

		// Hides or displays the form based on boolean passed
		hideOrShow("loginForm", false);
		hideOrShow("loggedInDiv", true);
		hideOrShow("createAccount", false);
}


function hideOrShow( elementId, showState )
{
	var vis = "visible";
	var dis = "block";
	if( !showState )
	{
		vis = "hidden";
		dis = "none";
	}

	document.getElementById( elementId ).style.visibility = vis;
	document.getElementById( elementId ).style.display = dis;
}
