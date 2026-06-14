<?php
session_start();
$message = '';
$file = 'login.txt';

// Processa o envio do formulário
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_POST['action'] ?? '';
    $user = trim($_POST['username'] ?? '');
    $pass = trim($_POST['password'] ?? '');

    if ($action === 'register') {
        if (!empty($user) && !empty($pass)) {
            $exists = false;
            
            // Verifica se o usuário já existe
            if (file_exists($file)) {
                $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    $parts = explode(':', $line);
                    if (isset($parts[0]) && $parts[0] === $user) {
                        $exists = true;
                        break;
                    }
                }
            }
            
            if ($exists) {
                $message = "<div style='background: #ffcccc; color: #cc0000; padding: 10px; border-radius: 5px; margin-bottom: 20px; text-align: center; font-weight: bold;'>Usuário já existe! Tente outro.</div>";
            } else {
                // Salva o usuário e senha (sem hash, conforme solicitado)
                file_put_contents($file, "$user:$pass\n", FILE_APPEND);
                $message = "<div style='background: #ccffcc; color: #008800; padding: 10px; border-radius: 5px; margin-bottom: 20px; text-align: center; font-weight: bold;'>Cadastro realizado com sucesso! Faça login abaixo.</div>";
            }
        } else {
            $message = "<div style='background: #ffcccc; color: #cc0000; padding: 10px; border-radius: 5px; margin-bottom: 20px; text-align: center; font-weight: bold;'>Preencha todos os campos!</div>";
        }
    } elseif ($action === 'login') {
        if (!empty($user) && !empty($pass)) {
            $valid = false;
            
            // Verifica as credenciais no arquivo
            if (file_exists($file)) {
                $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    $parts = explode(':', $line);
                    if (isset($parts[0]) && isset($parts[1]) && $parts[0] === $user && $parts[1] === $pass) {
                        $valid = true;
                        break;
                    }
                }
            }
            
            if ($valid) {
                $_SESSION['logged_in'] = true;
                $_SESSION['username'] = $user;
                // Redireciona para a página principal após login com sucesso
                echo "<script>localStorage.setItem('usuarioLogado', '" . addslashes($user) . "'); window.location.href='index.php';</script>";
                exit;
            } else {
                $message = "<div style='background: #ffcccc; color: #cc0000; padding: 10px; border-radius: 5px; margin-bottom: 20px; text-align: center; font-weight: bold;'>Usuário ou senha incorretos!</div>";
            }
        } else {
            $message = "<div style='background: #ffcccc; color: #cc0000; padding: 10px; border-radius: 5px; margin-bottom: 20px; text-align: center; font-weight: bold;'>Preencha todos os campos!</div>";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Circuito Zero</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div id="header-padrao"></div>

<main>
    <!-- Utilize o mesmo container do checkout para manter o design -->
    <div class="container caixa-checkout" style="max-width: 450px; margin: 40px auto;">
        
        <?php echo $message; ?>

        <!-- Formulário de Login -->
        <h2 class="checkout-titulo">LOGIN</h2>
        <form method="POST" action="login.php" style="margin-bottom: 40px;">
            <input type="hidden" name="action" value="login">
            <div class="form-group full-width" style="margin-bottom: 15px;">
                <label class="label-pagamento">Usuário:</label>
                <input type="text" name="username" class="input-pagamento" required>
            </div>
            <div class="form-group full-width" style="margin-bottom: 25px;">
                <label class="label-pagamento">Senha:</label>
                <input type="password" name="password" class="input-pagamento" required>
            </div>
            <button type="submit" class="btn-checkout">ENTRAR</button>
        </form>

        <!-- Formulário de Cadastro -->
        <h2 class="checkout-titulo">NÃO TEM CONTA? CADASTRE-SE</h2>
        <form method="POST" action="login.php">
            <input type="hidden" name="action" value="register">
            <div class="form-group full-width" style="margin-bottom: 15px;">
                <label class="label-pagamento">Novo Usuário:</label>
                <input type="text" name="username" class="input-pagamento" required>
            </div>
            <div class="form-group full-width" style="margin-bottom: 25px;">
                <label class="label-pagamento">Nova Senha:</label>
                <input type="password" name="password" class="input-pagamento" required>
            </div>
            <button type="submit" class="btn-checkout" style="background: #341539;">CRIAR CONTA</button>
        </form>
        
    </div>
</main>

<footer id="footer-padrao"></footer>

<script src="script.js"></script>

</body>
</html>