<?php  
 // Check if database.php has already been included, and if not, to require it.
 require_once(__DIR__ . "/../model/config.php");

   // Creates a table called Users
   $query = $_SESSION["connection"] ->query("CREATE TABLE users ("
    . "id int(11) NOT NULL AUTO_INCREMENT, "
    .  "username varchar(30) NOT NULL,"
    . "email varchar(50) NOT NULL,"
    . "password char(128) NOT NULL,"
    . "salt char(128) NOT NULL,"
    . "exp int(4),". "exp int(4),"
    . "exp1 int(4),"
    . "exp2 int(4),"
    . "exp3 int(4),"
    . "exp4 int(4),"
    . "PRIMARY KEY (id))");
