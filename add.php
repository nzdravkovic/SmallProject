<?php 
	// Put json into array
	$inData = getRequestInfo();

	// Assign variables json strings
	$userId = inData["userId"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$number = $inData["phoneNumber"];
	$email = $inData["email"];
	$address = $inData["address"];

	
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
		// Insert data into database
		// These values are the columns in my localhost database 
		// so they may change once I create the columns on the remote database on aws server
		$sql = 'insert into contacts(firstName, lastName, phoneNumber, email, userID, address) values ' . "('$firstName', '$lastName', '$number, '$email', '$userId', '$address')";
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
