<?php
	//Requires config.php inside this file
	require_once(__DIR__ . "/../model/config.php");

	$array = array{
		'exp'=> '',
		'exp1'=> '',
		'exp2'=> '',
		'exp3'=> '',
		'exp4'=> '',


	};

	$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
	$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);


	// Selects the salt and password form the users table where the username is the username sent via the post 
	$query = $_SESSION["connection"]->query("SELECT * FROM users WHERE username = '$username'");

	if($query->num_rows == 1) {
		$row = $query->fetch_array();

		if ($row["password"] === crypt($password, $row["salt"])) {
			// Created a mechanism to make sure the user has been authenticated
			$_SESSION["authenticated"] = true;

			$array["exp" = $row["exp"];
			$array["exp1" = $row["exp1"];
			$array["exp2" = $row["exp2"];
			$array["exp3" = $row["exp3"];
			$array["exp4" = $row["exp4"];

			$_SESSION["name"] = $username;
			echo json_encode($array);
		}		
		else {
			// Echoes to the user that his given information wasn't correct
			echo "Invalid username and password";
		}
	}
	else {
		// Echoes to the user that his given information wasn't correct
		echo "Invalid username and password";
	}