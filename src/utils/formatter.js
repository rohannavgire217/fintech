const currencyFormatter = new Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'INR',
	maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'INR',
	notation: 'compact',
	maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat('en-IN', {
	minimumFractionDigits: 0,
	maximumFractionDigits: 2,
});

export function formatCurrency(value) {
	return currencyFormatter.format(value);
}

export function formatCompactCurrency(value) {
	return compactCurrencyFormatter.format(value);
}

export function formatPercent(value) {
	return `${percentFormatter.format(value)}%`;
}

export function formatShortDate(date) {
	return new Intl.DateTimeFormat('en-IN', {
		month: 'short',
		day: 'numeric',
	}).format(date);
}

export function formatLongDate(date) {
	return new Intl.DateTimeFormat('en-IN', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(date);
}
