
export async function convertCurrency(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const url =
    `https://api.frankfurter.dev/v2/rate/${fromCurrency}/${toCurrency}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to retrieve exchange rate.");
  }

  const data = await response.json();

  return amount * data.rate;
}

export function formatCurrency(amount, currency) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 2
  }).format(amount);
}
