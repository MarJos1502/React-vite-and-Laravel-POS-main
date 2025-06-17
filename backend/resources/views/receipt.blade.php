<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Receipt</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
    </style>
</head>

<body>
    <h2>Receipt</h2>
    <p><strong>Date:</strong> {{ $transaction['date'] }}</p>

    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($transaction['items'] as $item)
                <tr>
                    <td>{{ $item['name'] }}</td>
                    <td>₱{{ $item['price'] }}</td>
                    <td>{{ $item['quantity'] }}</td>
                    <td>₱{{ $item['price'] * $item['quantity'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p><strong>Discount:</strong> ₱{{ $transaction['discount'] }}</p>
    <p><strong>Total:</strong> ₱{{ $transaction['total'] }}</p>
    <p><strong>Final:</strong> ₱{{ $transaction['final'] }}</p>
</body>

</html>
