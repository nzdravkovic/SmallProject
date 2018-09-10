<?php 



	//The Json object that this script recieves is from index.js and looks like this:
	//var jsonPayload = '{"first" : "' + shinyFirstName + '", "last" : "' + shinyLastName + '", "userNew" : "' + shinyUserName + '",
	//"password": "' + hashedPassword + '", "email" : "' + shinyEmail + '"}';
	// Put json into array
	$inData = getRequestInfo();

	// Assign variables json strings
	$firstName = preg_replace("/[^a-zA-Z]/","",$inData["first"]);
	$lastName = preg_replace("/[^a-zA-Z]/","",$inData["last"]);
	$user = preg_replace("/[^A-Za-z0-9]/","",$inData["userNew"]);
	$password = preg_replace("/[^A-Za-z0-9!@#$%^&*]/","",$inData["password"]);
	$email = preg_replace("/[^A-Za-z0-9|@|.]/","",$inData["email"]);

	// Info for server and database access -- change values to server info on aws
	$username = 'conman';
	$password = 'bananasAreActuallyCorn72!';
	$server = 'mydatabase.c7s05rybpupb.us-east-2.rds.amazonaws.com';
	$database = 'conmandatabase';

	// Connect to remote database on server
	$conn = new mysqli($server, $username, $password, $database);

	// Failed to connect to server -- return error
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}

	// Create new user
	else
	{
		// Check if email already exists
		$sql = "select email from users where email = '$email'";
		$result = $conn->query($sql);

		if(!$result)
		{
			returnWithError("An account has already been created using this email");
			exit();
		}
		
		// Hashes the password 
		$hash = password_hash($password, PASSWORD_DEFAULT);
		

		// Insert data into database
		// These values are the columns in my localhost database 
		// so they may change once I create the columns on the remote database on aws server
		$sql = 'insert into users (firstName, lastName, password, username, email) values ' . "('$firstName', '$lastName', '$hash', '$user', '$email')";

		$result = $conn->query($sql);

		if(!$result)
			returnWithError($conn->error);

		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	//should these two functions be the same?
	function sendAsJson($obj)
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnWithError($error)
	{
		$ret = '{"error": "' . $error . '"}';
		sendAsJson($ret);
	}

	// Not sure if we need this function but i'll leave it here just incase
	/*
	function get_post($conn, $var)
 	{
 		// real_escape_string prevents sql injections by removing
 		// any magic quites added to auser-inputting string 
 		return $conn->real_escape_string($_POST[$var]);
 	}
	*/

 ?>
