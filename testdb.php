<?php 
	$database = 'conmandatabase';
	$username = 'conman';
	$password = 'bananasAreActuallyCorn72!';
	$server = 'mydatabase.c7s05rybpupb.us-east-2.rds.amazonaws.com';

	$conn = new mysqli($server, $username, $password, $database);

	if($conn->connect_error)
		echo "Failed to connect to server";
	else
		echo "Successfully conncetd";


 ?>