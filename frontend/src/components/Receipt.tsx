import React, { useRef } from "react";

const Receipt = ({ transaction }: { transaction: any }) => {
  const receiptRef = useRef(null);

  const handlePrint = () => {
    const printContent = receiptRef.current?.innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow && printContent) {
      printWindow.document.write(
        "<html><head><title>Receipt</title></head><body>"
      );
      printWindow.document.write(printContent);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div>
      <div ref={receiptRef}>
        <h2>Thank you for your purchase!</h2>
        <p>
          <strong>Date:</strong> {transaction.date}
        </p>
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
            {transaction.items.map((item: any, index: number) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>₱{item.price}</td>
                <td>{item.quantity}</td>
                <td>₱{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          <strong>Discount:</strong> ₱{transaction.discount}
        </p>
        <p>
          <strong>Total:</strong> ₱{transaction.total}
        </p>
        <p>
          <strong>Final Amount:</strong> ₱{transaction.final}
        </p>
      </div>

      <button onClick={handlePrint} className="btn btn-primary mt-3">
        🖨️ Print / Save as PDF
      </button>
    </div>
  );
};

export default Receipt;
