<?php 

	// Put json into array
	$inData = getRequestInfo();

	// Assign variables json strings 
	// reference the json in the javascript code 
	$login = $inData["Log"];
	$pw = $inData["password"];

	// Info for server and database access -- change values to server info on aws
	$username = 'root';
	$password = 'Dg464569!';
	$server = 'localhost';
	$database = 'practice';

	// Connect to remote database on server
	$conn = new mysqli($server, $username, $password, $database);

	$id = 0;
	$firstName = "";
	$lastName = "";
	

	// Failed to connect to server -- return error
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	// Whoever works on this can probably change this whole piece of code -- not sure if it works 100%
	else
	{
		// Check if the password matches the hashed password
		if(password_verify($pw, $row[2]))
		{
			$sql = "select * from users where username = '$login'";
			$result = $conn->query($query);

			if($result->num_rows > 0)
			{
				$row = $result->fetch_assoc();
				$firstName = $row["firstName"];
				$lastName = $row["lastName"];
				$id = $row["userID"];
			}
			else
			{
				returnWithError("No records found");
			}
		}
		
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnWithError($error)
	{
		$ret = '{"error": "' . $error . '"}';
		sendAsJson($ret);
	}



 ?>