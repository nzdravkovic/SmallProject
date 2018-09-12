<?php 

	
	function userfilter($string) 
	{
		return preg_replace("/[^A-Za-z0-9]/","",$string);
	}
	
	function passfilter($string) 
	{
		return preg_replace("/[^A-Za-z0-9!@#$%^&*]/","",$string);
	}


	
	
	//The JSON that this function receives is from index.js and looks like this:
	//var jsonPayload = '{"Log" : "' + login + '", "password" : "' + hashedPassword + '"}';

	// Put json into array
	$inData = getRequestInfo();
	
	$cleanData = array(
    'Log'   => userfilter($inData["Log"],
    'password' => passfilter($inData["password"])
	);
	
	
	
	// Assign variables json strings 
	// reference the json in the javascript code 
	$login = $cleanData["Log"];
	$pw = $cleanData["password"];

	// Info for server and database access -- change values to server info on aws
	$username = 'conman';
	$password = 'bananasAreActuallyCorn72!';
	$server = 'mydatabase.c7s05rybpupb.us-east-2.rds.amazonaws.com';
	$database = 'conmandatabase';

	// Connect to remote database on server
	$conn = new mysqli($server, $username, $password, $database);

	//note: this if has one equals because we're checking to see if the function returned with an error or not
	if($sql = $conn->prepare('SELECT * FROM users WHERE username = ? and password = ?')):
		$sql->bind_param('ss', $login, $pwd);
		$sql->execute();
		header("Content-Type: application/json; charset=UTF-8");

		/*
		$conn = new mysqli("myServer", "myUser", "myPassword", "Northwind");
		$stmt = $conn->prepare("SELECT name FROM ? LIMIT ?");
		$stmt->bind_param("ss", $obj->table, $obj->limit);
		$stmt->execute();
		*/
		$result = $sql->get_result();
		$outp = $result->fetch_all(MYSQLI_ASSOC);

		echo json_encode($outp);
		return json_encode($outp);
		
		
		
		//if($sql->execute()):
		$result=$conn->query($sql);

			//$sql->fetch();

			if($sql->num_rows > 0):
				
				//successful login!
				return json_encode($result);
			else:
				//nooooope
				return;
			endif;
			
		endif;
			$sql->close();
	endif;

	$id = 0;
	$firstName = "";
	$lastName = "";
	

	// Failed to connect to server -- return error
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}

	else
	{		
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
