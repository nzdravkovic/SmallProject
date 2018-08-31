<?php 
	// Put json into array
	$inData = getRequestInfo();

	// Assign variables json strings
	$firstName = $inData["first"];
	$lastName = $inData["last"];
	$user = $inData["userNew"];
	$password = $inData["password"];
	$email = $inData["email"];

	// Info for server and database access -- change values to server info on aws
	$username = 'root';
	$password = 'Dg464569!';
	$server = 'localhost';
	$database = 'practice';

	// Connect to remote database on server
	$conn = new mysqli($server, $username, $password, $database);

	// Failed to connect to server -- return error
	if($conn->connect_error)
		returnWithError($conn->connect_error);

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