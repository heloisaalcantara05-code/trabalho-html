<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$currentPage = basename($_SERVER['PHP_SELF']);
?>
<header>
    <img src="src/logo.png" class="logo" alt="Logo">
    <h1>Circuito Zero</h1>
    <p>Loja Online</p>
    <p>Venda de Artigos Eletrônicos</p>
</header>

<?php if ($currentPage !== 'login.php'): ?>

<?php if ($currentPage === 'index.php' && isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true): ?>
    <div class="top-bar">
        <span class="welcome-msg">Bem-vindo(a), <strong><?php echo htmlspecialchars($_SESSION['username']); ?></strong>!</span>
        <a href="logout.php" class="btn-logout">Sair</a>
    </div>
<?php endif; ?>

<nav>
    <ul class="navlist">
        <li><a href="index.php" class="<?php echo ($currentPage == 'index.php') ? 'active' : ''; ?>">Início</a></li>
        <li><a href="produtos.php" class="<?php echo ($currentPage == 'produtos.html') ? 'active' : ''; ?>">Produtos</a></li> 
        <li><a href="ofertas.php" class="<?php echo ($currentPage == 'ofertas.html' || $currentPage == 'ofertas.html') ? 'active' : ''; ?>">Ofertas</a></li>
        <li><a href="contato.php" class="<?php echo ($currentPage == 'contato.html' || $currentPage == 'contato.html') ? 'active' : ''; ?>">Contato</a></li>
        <li><a href="sobre.php" class="<?php echo ($currentPage == 'sobre.html' || $currentPage == 'sobre.html') ? 'active' : ''; ?>">Sobre</a></li>
        
        <?php if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true): ?>
            <li><a href="login.php">Login</a></li>
        <?php endif; ?>
    </ul>
</nav>
<?php endif; ?>