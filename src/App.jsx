import React, { useState, useEffect } from 'react';
import currencyData from './currencyData';

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  // Fetch exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/435b2037c217583e7cb6633b/latest/${fromCurrency}`
        );
        const data = await response.json();
        setExchangeRate(data.conversion_rates[toCurrency]);
        setLastUpdated(data.time_last_update_utc);
        setError(''); // Clear error on success
      } catch (err) {
        setError('Failed to fetch exchange rate. Please try again later.');
        console.error(err);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  // Calculate converted amount
  useEffect(() => {
    setConvertedAmount((amount * exchangeRate).toFixed(2));
  }, [amount, exchangeRate]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`flex flex-col items-center justify-between min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {/* Header */}
      <header className="w-full mb-6">
        <h1 className="text-3xl font-bold text-center">Smart Currency Converter</h1>
      </header>

      <main className={`shadow-lg rounded-lg p-8 max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Dark mode toggle button */}
        <button onClick={toggleDarkMode} className={`mb-4 py-2 px-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-blue-600'} text-white`}>
          Toggle Dark Mode
        </button>

        {/* Input for amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`border border-gray-300 p-2 rounded w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
          />
        </div>

        {/* Currency from selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">From Currency</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className={`border border-gray-300 p-2 rounded w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
          >
            {currencyData.map((currency) => (
              <option key={currency.currency} value={currency.currency}>
                {currency.country} ({currency.currency})
              </option>
            ))}
          </select>
        </div>

        {/* Currency to selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">To Currency</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className={`border border-gray-300 p-2 rounded w-full ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
          >
            {currencyData.map((currency) => (
              <option key={currency.currency} value={currency.currency}>
                {currency.country} ({currency.currency})
              </option>
            ))}
          </select>
        </div>

        {/* Display converted amount */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">
            {amount} {fromCurrency} = {convertedAmount} {toCurrency}
          </h2>
          {lastUpdated && <p className="text-sm text-gray-400">Last updated: {lastUpdated}</p>}
        </div>

        {/* Convert button */}
        <button className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700">
          Convert
        </button>

        {/* Error handling */}
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      </main>

      {/* Footer */}
      <footer className="w-full mt-6 text-center">
        <p className="text-sm">© 2024 Currency Converter App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
