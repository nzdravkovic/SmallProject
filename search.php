<?php 

	$inData = getRequestInfo();
	

	$cleanData = array(
    'uid'   => preg_replace("/[^$inData["uid"]")
    'search' => preg_replace("/[^$inData["search"]")
	);

	//The JSON that this function receives is from index.js and looks like this:
	//var jsonPayload = '{"uid" : "' + uid + '", "search" : "' + search + '"}';
	
	// Assign variables json strings 
	// reference the json in the javascript code 
	$uid = $cleanData["uid"];
	$search = $cleanData["search"];

	// Info for server and database access -- change values to server info on aws
	$username = 'conman';
	$password = 'bananasAreActuallyCorn72!';
	$server = 'mydatabase.c7s05rybpupb.us-east-2.rds.amazonaws.com';
	$database = 'conmandatabase';

	// Connect to remote database on server
	$conn = new mysqli($server, $username, $password, $database);


	$query =
	'SELECT *
	FROM contacts
	WHERE
	(
		userID = '?' AND
		(
    		firstName LIKE '%?%'
    		OR lastName LIKE '%?%'
    		OR phoneNumber LIKE '%?%'
    		OR email LIKE '%?%'
    		OR address LIKE '%?%'
    	)
	)
	ORDER BY lastName DESC , firstName DESC'

	//note: this if has one equals because we're checking to see if the function returned with an error or not
	if($sql = $mysqli->prepare($query)):
		$sql->bind_param('ss', $uid, $search, $search, $search, $search, $search);
		
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