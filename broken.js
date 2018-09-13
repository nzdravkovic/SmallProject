//Personal Contact Manager
//COP 4331

// Url
var urlBase = 'ec2-18-219-60-79.us-east-2.compute.amazonaws.com';

var extension = 'php';

var firstName = "";
var lastName = "";
var userID = 0;
let rowCount = 1;
let names = [];

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
	hideOrShow("contactList", false);
	hideOrShow("addContactList", false);
	hideOrShow("loggedInDiv", false);
}

 // Shows search results
function showResults(res)
{
	var table = document.getElementById("searchResults");

	for (var i = 0; i < res.size; i++)
	{
		var row = table.insertRow(i);

		var fName = row.insertCell(0);
		var lName = row.insertCell(1);
		var number = row.insertCell(2);
		var email = row.insertCell(3);
		var addr = row.insertCell(4);
		var del = row.insertCell(5);

		fName.innerHTML = res[i].fName;
		lName.innerHTML = res[i].lName;
		number.innerHTML = res[i].number;
		email.innerHTML = res[i].email;
		addr.innerHTML = res[i].addr;
		del.innerHTML = '<button type="submit" onclick="deleteContact();">Delete</button>';
	}
}

 // Shows search results
function showAll()
{
	var searchCriteria = "";

	document.getElementById("contactSearchResult").innerHTML = "";

	var jsonPayload = '{"searchCriteria" : "' + searchCriteria + '", "userId" : "' + userID + '"}';
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
				var res = JSON.parse(xhr.responseText);
				document.getElementById("searchContact").value = "";

				document.getElementById('contactAddResult').innerHTML = showResults(res.result);
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById('logginResult').innerHTML = err.message;
	}

}


//secured
function doLogin()
{
	// Get username and password
	var login = document.getElementById('loginUser').value.replace(/[^[a-zA-Z0-9]{4,20}]/g, '');
	//var password1 = document.getElementById('pwUser').value.replace(/[^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})]/g, '');
	var password1 = document.getElementById('pwUser').value;
	if(password1.length>32||password1.length<4||login.length<4||login.length>20)
	{
		alert("Please submit a valid username and password");
		return;
	}
	//turns out javascript encryption sux, leaving this here for now
	//var hashedPassword = crypt(password1,'$2y$09$whatsyourbagelsona?$');

	// Username is showing up as undefined -- doing some testing
	console.log(login);


	document.getElementById('logginResult').innerHTML = "";

	// Create json
	var jsonPayload = '{"Log" : "' + login + '", "password" : "' + password1 + '"}';

	// Send url
	var url = urlBase + '/login.' + extension;
	console.log(url);

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

// executes logout
function doLogout()
{
	/*
	var jsonPayload = '{' + '"userId":"' + userID'"}';
	var url = urlBase + '/logout.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("Post", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if(this.readyState == 4 && this.status == 200)
		{
			resetAdd();

			// reset global variables
			firstName = "";
			lastName = "";
			userID = 0;
		}
	}

	xhr.sent(jsonPayload);
	*/
}

// resets fields for add contact
function resetAdd()
{
	document.getElementById("addFirstName").value = "";
	document.getElementById("addLastName").value = "";
	document.getElementById("addPhoneNumber").value = "";
	document.getElementById("addEmail").value = "";
	document.getElementById("addAddress").value = "";
}

// janky delete
function onDelete(num)
{
	let table = document.getElementById("contactResults").deleteRow(num);
	rowCount--;
}

// Not sure if this function is working correctly
// Doesn't insert anything in the database so could be this or something wrong with the add.php script
function addContact()
{

	var contactFirstName = document.getElementById("addFirstName").value.replace(/[^a-zA-Z0-9]/g, '');
	var contactLastName = document.getElementById("addLastName").value.replace(/[^a-zA-Z0-9]/g, '');
	var contactPhoneNumber = document.getElementById("addPhoneNumber").value;
	var contactEmail = document.getElementById("addEmail").value.replace(/[^a-zA-Z0-9|@|.]/g, '');
	var contactAddress = document.getElementById("addAddress").value.replace(/[^a-zA-Z0-9]/g, '');

	names.push(contactFirstName);
	names.push(contactLastName);
	names.push(contactPhoneNumber);
	names.push(contactEmail);
	names.push(contactAddress);


	// var searchFirstName = document.getElementById('searchFirstName').innerHTML = contactFirstName;
	// var searchLastName = document.getElementById('searchLastName').innerHTML = contactLastName;
	// var searchPhone = document.getElementById('searchPhone').innerHTML = contactPhoneNumber;
	// var searchEmail = document.getElementById('searchEmail').innerHTML = contactEmail;
	// var searchAddress = document.getElementById('searchAddress').innerHTML = contactAddress;
	//
	// if(searchFirstName != "")
	// 	hideOrShow("firstDelete", true);
	// if(searchFirstName != "" && searchLastName != "" && searchPhone != "" && searchEmail != "" && searchAddress != "")
	// 	hideOrShow("secondDelete", true);

	console.log(rowCount);

	let table = document.getElementById("contactResults");

	var row = table.insertRow(rowCount);

	row.id = "" + rowCount;

	var fName = row.insertCell(0);
	var lName = row.insertCell(1);
	var number = row.insertCell(2);
	var email = row.insertCell(3);
	var addr = row.insertCell(4);
	var del = row.insertCell(5);

	fName.innerHTML = contactFirstName;
	lName.innerHTML = contactLastName;
	number.innerHTML = contactPhoneNumber;
	email.innerHTML = contactEmail;
	addr.innerHTML = contactAddress;
	del.innerHTML = '<button type="submit" onclick="onDelete(' + rowCount + ');">Delete</button>';

	rowCount++;

	resetAdd();


	/*
	document.getElementById("contactAddResult").innerHTML = "";
	var ID = 19;
	var jsonPayload = '{"firstName" : "' + contactFirstName + '", "lastName" : "' + contactLastName + '", "phone" : "' + contactPhoneNumber + '", "email": "' + contactEmail
	 + '", "address" : "' + contactAddress + '", "userId" : "' + ID + '"}';
	var url = urlBase + '/add.' + extension;
	//document.getElementById("deleteContact").value = "";
	console.log(jsonPayload);
	console.log(url);

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{

			if(this.readyState == 4 && this.status == 200)
			{
				resetAdd();
			    	document.getElementById('contactAddResult').innerHTML = "Contact Added";
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//why does this give you a login result response in a contactadd function?
		document.getElementById('logginResult').innerHTML = err.message;
	}
*/


}

// janky search
function searchForContact()
{
	let table = document.getElementById("contactResults");
	var compare = document.getElementById('searchContact').innerHTML;
	var trueflag = false;

	var rows = table.rows.length;
	var cols = table.rows[0].cells.length - 1;

	for(var i = 1; i < rows; i++)
	{
		for(var j = 0; j < cols; j++)
		{
			if(table.rows[i].cells[j].innerHTML.includes(compare))
			{
				// hideOrShow("" + i, true);
				trueflag = true;
			}
		}
		if(!trueflag)
		{
			hideOrShow("" + i, false);
		}
		trueflag = false;
	}
}

// need to research toggleclass for table
// deletecontact using jquery, no clue if it works
function deleteContact(id)
{

	var del = document.getElementById('deleteContact').value;

	var searchFirstName = document.getElementById('searchFirstName').innerHTML = "";
	var searchLastName = document.getElementById('searchLastName').innerHTML = "";
	var searchPhone = document.getElementById('searchPhone').innerHTML = "";
	var searchEmail = document.getElementById('searchEmail').innerHTML = "";
	var searchAddress = document.getElementById('searchAddress').innerHTML = "";

	document.getElementById('deleteContact').innerHTML = "";

}

//secured
function registerNewUser()
{
	// getElementById gets the text in the input where the id = "whatever"
	// Gets the value of each input and stores it in a variable
	var cleanFirstName = document.getElementById("firstName").value	//only letters
	//var shinyFirstName = mysqli_real_escape_string(cleanFirstName);
	var cleanLastName = document.getElementById('lastName').value	//only letters
	//var shinyLastName = mysqli_real_escape_string(cleanLastName);
	var cleanEmail = document.getElementById('email').value	//only letters, '@', and '.'
	//var shinyEmail = mysqli_real_escape_string(cleanEmail);
	var cleanUserName = document.getElementById('newUser').value//only letters and numbers
	//var shinyUserName = mysqli_real_escape_string(cleanUserName);
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
	//var newPassword = document.getElementById('passwordNewUser').value.replace(/[^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})]/g, '');
	var newPassword = document.getElementById('passwordNewUser');
	//var hashedPassword = crypt(newPassword,'$2y$09$whatsyourbagelsona?$');

	// Create the url -- Change the urlBase to aws domain
	var url = urlBase + '/create.' + extension;

	// Create json -- the variables in quotes can be changed to a different name but the changes need to be
	// reflected in the php scripts
	var jsonPayload = '{"first" : "' + cleanFirstName + '", "last" : "' + cleanLastName + '", "userNew" : "' + cleanUserName + '", "password": "' + newPassword
	 + '", "email" : "' + cleanEmail + '"}';
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
		hideOrShow("loginForm", true);
		hideOrShow("loggedInDiv", false);
		hideOrShow("createAccount", false);
}

// Searches for contacts and presents results in a table
function searchContact()
{

	var contactFirstName = document.getElementById("addFirstName").value.replace(/[^a-zA-Z0-9]/g, '');
	var contactLastName = document.getElementById("addLastName").value.replace(/[^a-zA-Z0-9]/g, '');
	var contactPhoneNumber = document.getElementById("addPhoneNumber").value;
	var contactEmail = document.getElementById("addEmail").value.replace(/[^a-zA-Z0-9|@|.]/g, '');
	var contactAddress = document.getElementById("addAddress").value.replace(/[^a-zA-Z0-9]/g, '');

		var searchFirstName = document.getElementById('searchFirstName').innerHTML = contactFirstName;
	var searchLastName = document.getElementById('searchLastName').innerHTML = contactLastName;
	var searchPhone = document.getElementById('searchPhone').innerHTML = contactPhoneNumber;
	var searchEmail = document.getElementById('searchEmail').innerHTML = contactEmail;
	var searchAddress = document.getElementById('searchAddress').innerHTML = contactAddress;

	document.getElementById('searchContact').innerHTML = "";

	/*
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
				var res = JSON.parse(xhr.responseText);
				document.getElementById("searchContact").value = "";

				document.getElementById('contactAddResult').innerHTML = showResults(res.result);
			}
		};
 		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById('logginResult').innerHTML = err.message;
	}
	*/
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
