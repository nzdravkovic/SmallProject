<?php 

	/*
	function userfilter($string) 
	{
		return preg_replace("/[^A-Za-z0-9]/","",$string);
	}
	
	function passfilter($string) 
	{
		return preg_replace("/[^A-Za-z0-9!@#$%^&*]/","",$string);
	}
	*/
	
	//The JSON that this function receives is from index.js and looks like this:
	//var jsonPayload = '{"uid" : "' + uid + '", "id" : "' + id + '"}';

	// Put json into array
	$inData = getRequestInfo();
	
	$cleanData = array(
    'uid'   => preg_replace("/[^$inData["uid"]")
    'id' => preg_replace("/[^$inData["id"]")
	);
	
	
	
	// Assign variables json strings 
	// reference the json in the javascript code 
	$uid = $cleanData["uid"];
	$id = $cleanData["id"];

	// Info for server and database access -- change values to server info on aws
	$username = 'root';
	$password = 'Dg464569!';
	$server = 'mydatabase.c7s05rybpupb.us-east-2.rds.amazonaws.com';
	$database = 'conmandatabase';

	// Connect to remote database on server
	$conn = new mysqli($server, $username, $password, $database);

	//note: this if has one equals because we're checking to see if the function returned with an error or not
	if($sql = $mysqli->prepare('DROP * FROM contacts WHERE uid = ? and id = ?')):
		$sql->bind_param('ss', $uid, $pwd);
		
		if($sql->execute()):

			$sql->fetch();

			if($sql->num_rows > 0):
				
				//successful login!
			else:
				//nooooope
				return;
			endif;
			
		endif;
			$sql->close();
			//what does this return?
			return json_encode($ret);
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
