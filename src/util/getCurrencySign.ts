export function getCurrencySign(currency: string) {
  return currency === "vnd"
    ? "₫"
    : currency === "sgd"
    ? "SGD"
    : currency === "eur"
    ? "€"
    : currency === "inr"
    ? "₹"
    : currency === "usd"
    ? "$"
    : "₱";
}
