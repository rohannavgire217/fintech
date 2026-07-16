const API_BASE_URL = process.env.REACT_APP_MARKET_API_BASE_URL || 'https://api.marketdata.example/v1';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.REACT_APP_API_KEY ? { Authorization: `Bearer ${process.env.REACT_APP_API_KEY}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getSensexUpdate() {
  try {
    return await request('/indices/sensex');
  } catch (error) {
    const baseValue = 75340.21;
    const randomShift = (Math.random() * 240 - 120);
    const value = Number((baseValue + randomShift).toFixed(2));
    const change = Number((Math.random() * 900 - 450).toFixed(2));

    return {
      name: 'BSE Sensex',
      value,
      change,
      changePercent: Number(((change / value) * 100).toFixed(2)),
      updatedAt: new Date().toISOString(),
      error: error.message,
    };
  }
}

export { request };