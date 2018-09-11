//Personal Contact Manager
//COP 4331

// Url
var urlBase = 'http://ec2-18-219-60-79.us-east-2.compute.amazonaws.com';

var extension = 'php';

var firstName = "";
var lastName = "";
var userID = 0;

// Directs to signup
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


//secured
function doLogin()
{
	// Get username and password
	var login = document.getElementById('loginUser').value.replace(/[^[a-zA-Z0-9]{4,20}]/g, '');
	var password1 = document.getElementById('pwUser').value.replace(/[^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})]/g, '');
	if(password1.length>32||password1.length<4||login.length<4||login.length>20)
	{
		alert("Please submit a valid username and password");
		return;
	}
	//turns out javascript encryption sux, leaving this here for now
	//var hashedPassword = crypt(password1,'$2y$09$whatsyourbagelsona?$');

	
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
	
	var contactFirstName = document.getElementById("addFirstName").value.replace(/[^a-zA-Z0-9]/g, '');
	var contactLastName = document.getElementById("addLastName").value.replace(/[^a-zA-Z0-9]/g, '');
	var contactPhoneNumber = document.getElementById("addPhoneNumber").value.replace(/[^0-9]/g, '');
	var contactEmail = document.getElementById("addEmail").value.replace(/[^a-zA-Z0-9|@|.]/g, '');
	var contactAddress = document.getElementById("addAddress").value.replace(/[^a-zA-Z0-9]/g, '');

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

function searchContact()
{
	//what is the json for this going to look like?
}

function deleteContact()
{
	//what is the json for this going to look like?
	
}

//secured
function registerNewUser()
{
	// getElementById gets the text in the input where the id = "whatever"
	// Gets the value of each input and stores it in a variable
	var cleanFirstName = document.getElementById("firstName").value.replace(/[^a-zA-Z]/g, '');	//only letters
	var shinyFirstName = mysqli_real_escape_string(cleanFirstName);
	var cleanLastName = document.getElementById('lastName').value.replace(/[^a-zA-Z]/g, ''); 	//only letters
	var shinyLastName = mysqli_real_escape_string(cleanLastName);
	var cleanEmail = document.getElementById('email').value.replace(/[^a-zA-Z|@|.]/g, '');		//only letters, '@', and '.'
	var shinyEmail = mysqli_real_escape_string(cleanEmail);
	var cleanUserName = document.getElementById('newUser').value.replace(/[^a-zA-Z0-9]/g, '');	//only letters and numbers
	var shinyUserName = mysqli_real_escape_string(cleanUserName);
	/*
	// getElementById gets the text in the input where the id = "whatever"
	// Gets the value of each input and stores it in a variable
	var newFirstName = document.getElementById("firstName").value.replace(/[^a-zA-Z]/g, '');	//only letters
	var newLastName = document.getElementById('lastName').value.replace(/[^a-zA-Z]/g, ''); 	//only letters
	var email = document.getElementById('email').value.replace(/[^a-zA-Z|@|.]/g, '');			//only letters, '@', and '.'
	var newUserName = document.getElementById('newUser').value.replace(/[^a-zA-Z0-9]/g, '');	//only letters and numbers
	*/
	
	
	
	//NOTE: THIS REGEX NEEDS TESTING
	//What this *should* do is require:
	//>Between 8 and 32 characters
	//>At least one lowercase letter (?=.*[a-z])
	//>At least one uppercase letter (?=.*[A-Z])
	//>At least one number (?=.*[0-9])
	//>At least one special character (?=.*[!@#\$%\^&\*])
	var newPassword = document.getElementById('passwordNewUser').value.replace(/[^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})]/g, '');
	var hashedPassword = crypt(newPassword,'$2y$09$whatsyourbagelsona?$');
	
	// Create the url -- Change the urlBase to aws domain
	var url = urlBase + '/create.' + extension;

	// Create json -- the variables in quotes can be changed to a different name but the changes need to be
	// reflected in the php scripts
	var jsonPayload = '{"first" : "' + shinyFirstName + '", "last" : "' + shinyLastName + '", "userNew" : "' + shinyUserName + '", "password": "' + hashedPassword
	 + '", "email" : "' + shinyEmail + '"}';
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
		// Display error
		document.getElementById("userAddResult").innerHTML =  "User could not be registered. Try again";
	}

		// Hides or displays the form based on boolean passed
		hideOrShow("loginForm", false);
		hideOrShow("loggedInDiv", true);
		hideOrShow("createAccount", false);
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
