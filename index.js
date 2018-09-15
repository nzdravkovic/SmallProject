//Personal Contact Manager
//COP 4331

// Url
var urlBase = '';

var extension = 'php';

var firstName = "";
var lastName = "";
var userID = 0;
var conID = 0;

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
function showResults(res)
{
        var table = document.getElementById("searchResults");

        for (var i = 0; i < 1; i++)
        {

                // Creates new rows <tr> elements
                var row = table.insertRow(1);

                // Creates new columns <td> elements
                var s1 = row.insertCell(0);
                var s2 = row.insertCell(1);
                var s3 = row.insertCell(2);
                var s4 = row.insertCell(3);
                var s5 = row.insertCell(4);
                var s6 = row.insertCell(5);

                // results array from json in search.php
                s1.innerHTML = res.results[0];
                s2.innerHTML = res.results[1];
                s3.innerHTML = res.results[2];
                s4.innerHTML = res.results[3];
                s5.innerHTML = res.results[4];
                s6.innerHTML = '<button type="submit" onclick="deleteContact();">Delete</button>';
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
                                document.getElementById("searchContact").value = res;
                                document.getElementById('contactAddResult').innerHTML = showResults(res.results);
        
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
        var login = document.getElementById('loginUser').value;//.replace(/[^[a-zA-Z0-9]{4,20}]/g, '');
        var password1 = document.getElementById('pwUser').value;//.replace(/[^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})]/g, '');
        if(password1.length>32||password1.length<4||login.length<4||login.length>20)
        {
                alert("Please submit a valid username and password");
                return;
        }

        //turns out javascript encryption sux, leaving this here for now
        //var hashedPassword = crypt(password1,'$2y$09$whatsyourbagelsona?$');

        document.getElementById('logginResult').innerHTML = "";

        // Create json
        var jsonPayload = '{"Log" : "' + login + '", "pW" : "' + password1 + '"}';

        // Send url
        var url = urlBase + '/login.' + extension;
        console.log(url);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                // Send json
                xhr.send(jsonPayload);

                // Retrieve json from php
                var jsonObject = JSON.parse(xhr.responseText);
                userID = jsonObject.id;

                // Incorrect pass/user 
                if(userID < 1)
                {
                        console.log("user/pass combo incorrect");
                        document.getElementById('logginResult').innerHTML = "User/password combination incorrect";
                        return;
                }

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
        userID = 0;
        firstName = lastName = "";

        resetAdd();

        hideOrShow("loginForm", true);
        hideOrShow("loggedInDiv", false);
        hideOrShow("createAccount", false);
        hideOrShow("contactList", false);
        hideOrShow("addContactList", false);
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

// Add contact 
function addContact()
{
        var contactFirstName = document.getElementById("addFirstName").value.replace(/[^a-zA-Z0-9]/g, '');
        var contactLastName = document.getElementById("addLastName").value.replace(/[^a-zA-Z0-9]/g, '');
        var contactPhoneNumber = document.getElementById("addPhoneNumber").value.replace(/[^0-9]/g, '');
        var contactEmail = document.getElementById("addEmail").value.replace(/[^a-zA-Z0-9|@|.]/g, '');
        var contactAddress = document.getElementById("addAddress").value.replace(/[^a-zA-Z0-9]/g, '');

        document.getElementById("contactAddResult").innerHTML = "";
        
        // Create JSON to send to php
        var jsonPayload = '{"firstName" : "' + contactFirstName + '", "lastName" : "' + contactLastName + '", "phone" : "' + contactPhoneNumber + '", "email": "' + contactEmail  + '", "address" : "' + contactAddress + '", "userId" : "' + userID + '"}';
        var url = urlBase + '/add.' + extension;


        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                // Send that JSON!!
                xhr.send(jsonPayload);
                xhr.onreadystatechange = function()
                {
                        if(this.readyState == 4 && this.status == 200)
                        {
                                resetAdd();
                                //showAll();
                                 var table = document.getElementById("searchResults");

                                // Display contact info once added 
                                for (var i = 0; i < 1; i++)
                                {

                                // Creates new rows <tr> elements
                                var row = table.insertRow(1);

                                // Creates new columns <td> elements
                                var s1 = row.insertCell(0);
                                var s2 = row.insertCell(1);
                                var s3 = row.insertCell(2);
                                var s4 = row.insertCell(3);
                                var s5 = row.insertCell(4);
                                var s6 = row.insertCell(5);

                                s1.innerHTML = contactFirstName;
                                s2.innerHTML = contactLastName
                                s3.innerHTML = contactPhoneNumber;
                                s4.innerHTML = contactEmail;
                                s5.innerHTML = contactAddress;
                                s6.innerHTML = '<button type="submit" onclick="deleteContact();">Delete</button>';
                                 }

                                document.getElementById('contactAddResult').innerHTML = "Contact Added";
                        }
                };
        }
        catch(err)
        {
                //why does this give you a login result response in a contactadd function?
                document.getElementById('logginResult').innerHTML = err.message;
        }
}

// Delete a contact
function deleteContact()
{
        var toDelete = document.getElementById("deleteContact").value.replace(/[^[a-zA-Z]{4,20}]/g, '');
        var jsonPayload = '{"id" : "' + userID + '"}';

        var url = urlBase + '/removeContact.' + extension;

        //not sure if this should go above or below the ajax stuff
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                xhr.onreadystatechange = function()
                {

                        if(this.readyState == 4 && this.status == 200)
                        {
                                //needs to be reset del
                                resetAdd();

                        }
                };

                xhr.send(jsonPayload);
        }
        catch(err)
        {
                document.getElementById('logginResult').innerHTML = err.message;
        }


        /*
        jQuery.ajax(
        {
                url: url,
                type: 'POST',
                data: {UserID:UserID, id:id},

                success: function(resp)
                {
                        if(resp != "fail")
                        {
                                var obj = $parseJSON(resp);
                                $('#' + obj.id).remove();
                                $(".contactSearchResult").toggleClass("nameClass");
                        }
                        else
                        {
                                showError("deleteContact API failed");
                        }
                }
        });
        */
}

//secured
function registerNewUser()
{
        // getElementById gets the text in the input where the id = "whatever"
        // Gets the value of each input and stores it in a variable
        var cleanFirstName = document.getElementById("firstName").value.replace(/[^a-zA-Z]/g, '');      //only letters
        //var shinyFirstName = mysqli_real_escape_string(cleanFirstName);
        var cleanLastName = document.getElementById('lastName').value.replace(/[^a-zA-Z]/g, '');        //only letters
        //var shinyLastName = mysqli_real_escape_string(cleanLastName);
        
        var cleanEmail = document.getElementById('email').value.replace(/[^a-zA-Z|@|.]/g, '');          //only letters, '@', and '.'
        //var shinyEmail = mysqli_real_escape_string(cleanEmail);
        var cleanUserName = document.getElementById('newUser').value.replace(/[^a-zA-Z0-9]/g, '');      //only letters and numbers
        //var shinyUserName = mysqli_real_escape_string(cleanUserName);
        /*
        // getElementById gets the text in the input where the id = "whatever"
        // Gets the value of each input and stores it in a variable
        var newFirstName = document.getElementById("firstName").value.replace(/[^a-zA-Z]/g, '');        //only letters
        var newLastName = document.getElementById('lastName').value.replace(/[^a-zA-Z]/g, '');  //only letters
        var email = document.getElementById('email').value.replace(/[^a-zA-Z|@|.]/g, '');                       //only letters, '@', and '.'
        var newUserName = document.getElementById('newUser').value.replace(/[^a-zA-Z0-9]/g, '');        //only letters and numbers
        */



        //NOTE: THIS REGEX NEEDS TESTING
        //What this *should* do is require:
        //>Between 8 and 32 characters
        //>At least one lowercase letter (?=.*[a-z])
        //>At least one uppercase letter (?=.*[A-Z])
        //>At least one number (?=.*[0-9])
        //>At least one special character (?=.*[!@#\$%\^&\*])
        var newPassword = document.getElementById('passwordNewUser').value;//.replace(/[^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})]/g, '');
        //var hashedPassword = AES_ENCRYPT(newPassword,'$2y$09$whatsyourbagelsona?$');

        // Create the url -- Change the urlBase to aws domain
        var url = urlBase + '/create.' + extension;

        // Create json -- the variables in quotes can be changed to a different name but the changes need to be
        // reflected in the php scripts
        var jsonPayload = '{"first" : "' + cleanFirstName + '", "last" : "' + cleanLastName + '", "userNew" : "' + cleanUserName + '", "password": "' + newPassword + '", "email" : "' + cleanEmail + '"}';
        console.log(jsonPayload);

        // Some networking code available in Leineckers slides -- don't really know what it does
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                 xhr.send(jsonPayload);
                xhr.onreadystatechange = function()
                {

                        if(this.readyState == 4 && this.status == 200)
                        {
                                
                                document.getElementById('userAddResult').innerHTML = "Account created";

                                // Added to automatically login new user
                                document.getElementById("loginUser").innerHTML = document.getElementById("newUser");
                                document.getElementById("pwUser").innerHTML = document.getElementById("passwordNewUser");

                                //doLogin();
                        }
                };
        
        }
        catch(err)
        {
                // Display error
                document.getElementById("userAddResult").innerHTML =  "User could not be registered. Try again";
        }

                // Hides or displays the form based on boolean passed
        hideOrShow("loginForm", false);
        hideOrShow("loggedInDiv", false);
        hideOrShow("createAccount", true);
        hideOrShow("contactList", false);
        hideOrShow("addContactList", false);
}

// Searches for contacts and presents results in a table
function searchContact()
{
        var searchName = document.getElementById("searchContact").value;
        var jsonPayload = '{"search" : "' + searchName + '", "userId" : "' + userID + '"}';
        var url = urlBase + '/search.' + extension;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
                 xhr.send(jsonPayload);
                xhr.onreadystatechange = function()
                {
                        if(this.readyState == 4 && this.status == 200)
                        {
                                var jsonObject = JSON.parse(xhr.responseText);
                                var contactID = jsonObject.id;
                                console.log("Contact ID: " + contactID);

                                if(contactID == 0)
                                {
                                        var result = document.getElementById('searchContact').value
                                        alert(result + " is not on your contact list");
                                        return;
                                }
                   
                                document.getElementById("searchContact").value = "";
                
                                 showResults(jsonObject);
                                //document.getElementById('contactAddResult').innerHTML = jsonObject.results[0] + " added";
                        }
                };
               
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
