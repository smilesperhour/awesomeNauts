<?php
	// Requires config.php in this file
	require_once(__DIR__ . "/../model/config.php");

	// Destroys the session variable
	unset($_SESSION["authenticated"]);

	// Destroys the session, ensures that the session has been safely cleaned and no information about the login has been saved.
	session_destroy();

	// Redirects the user to my blog
	header("Location: " . $path . "blog.php");