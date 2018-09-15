
<?php 
	// Put json into array
	$inData = getRequestInfo();
 error_log("Oracle database not available!", 0);
	// Assign variables json strings
	$userId = $inData["userId"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$number = $inData["phone"];
	$email = $inData["email"];
	$address = $inData["address"];
	ini_set('display_errors', 1);
	
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
		$sql = 'DELETE FROM  contacts WHERE (firstName, lastName, phoneNumber, email, userID, address) = ('$firstName', '$lastName', '$number', '$email', '$userId', '$address')';
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
