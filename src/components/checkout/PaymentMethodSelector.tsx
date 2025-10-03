const PaymentMethodSelector = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Payment Method</h2>
      <div className="p-4 border rounded-md">
        <label className="flex items-center">
          <input
            type="radio"
            name="paymentMethod"
            value="creditCard"
            className="mr-2"
            defaultChecked
          />
          Credit/Debit Card
        </label>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;