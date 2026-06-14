<?php
session_start();
$_SESSION = array(); // Limpa as variáveis da sessão
session_destroy(); // Destrói a sessão no servidor

header("Location: login.php");
exit;