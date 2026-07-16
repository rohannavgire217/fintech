import React from 'react';
import Button from '../components/common/Button';
import Table from '../components/common/table';
import { AllocationDonut, CashFlowBars, NetWorthSparkline } from '../components/charts/charts';
import { useTransactions } from '../hooks/Usetranscation';
import { useMarketData } from '../hooks/Usemarketdata';
import { formatCompactCurrency, formatCurrency, formatPercent, formatShortDate, formatLongDate } from '../utils/formatter';

const metrics = [
	{ label: 'Net worth', value: 1284000000, change: 12.4, note: 'All accounts combined' },
	{ label: 'Monthly cash flow', value: 864000, change: 8.1, note: 'Income minus spend' },
	{ label: 'Portfolio return', value: 18.7, change: 3.2, note: 'Trailing 12 months' },
	{ label: 'Savings rate', value: 42, change: 5.6, note: 'Current month' },
];

const cashFlow = [
	{ month: 'Jan', income: 92, expense: 61 },
	{ month: 'Feb', income: 96, expense: 64 },
	{ month: 'Mar', income: 101, expense: 66 },
	{ month: 'Apr', income: 105, expense: 69 },
	{ month: 'May', income: 109, expense: 68 },
	{ month: 'Jun', income: 113, expense: 72 },
];

const allocation = [
	{ label: 'Equity', value: 56, color: '#0f766e' },
	{ label: 'Debt', value: 21, color: '#1d4ed8' },
	{ label: 'Cash', value: 12, color: '#f59e0b' },
	{ label: 'Alternatives', value: 11, color: '#7c3aed' },
];

const holdings = [
	{ asset: 'India Equity Fund', category: 'Equity', value: 38200000, weight: '29.8%', gain: '+18.2%' },
	{ asset: 'Global Index ETF', category: 'Equity', value: 21400000, weight: '16.7%', gain: '+14.6%' },
	{ asset: 'Treasury Ladder', category: 'Debt', value: 16800000, weight: '13.1%', gain: '+6.1%' },
	{ asset: 'Operating Cash', category: 'Cash', value: 13400000, weight: '10.4%', gain: '+2.0%' },
	{ asset: 'Private Credit', category: 'Alternatives', value: 9800000, weight: '7.6%', gain: '+11.4%' },
];

const insights = [
	'You are 14 months ahead of your emergency runway target.',
	'Rebalance drift is within 2.3%, so no urgent action is required.',
	'Tax-loss harvesting window opens in 19 days for the large-cap sleeve.',
];

function Dashboard({ onNavigate }) {
	const { transactions, getExpensesTotal, getIncomeTotal } = useTransactions();
	const { data: marketData, error: marketError, isRefreshing, lastUpdated, loading, refreshCount, refreshMarketData } = useMarketData();
	const incomeTotal = getIncomeTotal();
	const expenseTotal = getExpensesTotal();
	const savings = incomeTotal - expenseTotal;
	const flowRatio = incomeTotal === 0 ? 0 : (savings / incomeTotal) * 100;
	const cashFlowAverage = cashFlow.reduce((sum, month) => sum + (month.income - month.expense), 0) / cashFlow.length;
	const strongestMonth = cashFlow.reduce((best, month) => {
		const currentSpread = month.income - month.expense;
		const bestSpread = best.income - best.expense;
		return currentSpread > bestSpread ? month : best;
	}, cashFlow[0]);
	const recentActivity = transactions.slice(0, 4);

	function exportReport() {
		// Build a simple CSV with holdings and recent transactions
		const lines = [];
		lines.push(['Report', 'Finatech export', `Generated: ${new Date().toISOString()}`].join(','));
		lines.push([]);
		lines.push(['Holdings']);
		lines.push(['Asset', 'Category', 'Value', 'Allocation', 'Performance']);
		holdings.forEach((h) => {
			lines.push([h.asset, h.category, h.value, h.weight, h.gain].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
		});
		lines.push([]);
		lines.push(['Recent transactions']);
		lines.push(['ID', 'Title', 'Type', 'Amount', 'Date']);
		recentActivity.forEach((t) => {
			lines.push([t.id, t.title, t.type, t.amount, t.date].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
		});

		const csv = lines.map((l) => (Array.isArray(l) ? l.join(',') : l)).join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `finatech-report-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}

	function handleReviewRebalance() {
		onNavigate?.('planning');
	}

	return (
		<div className="dashboard">
			<section className="hero card">
				<div className="hero__copy">
					<span className="eyebrow">Financial overview</span>
					<h1>Net worth and cash flow in one command center.</h1>
					<p>
						Watch assets, income, spending, and portfolio drift together so you can make faster,
						cleaner capital allocation decisions.
					</p>
					<div className="hero__actions">
						<Button variant="primary" onClick={exportReport}>Export report</Button>
						<Button variant="secondary" onClick={() => onNavigate?.('planning')}>View planning</Button>
						<Button variant="outline" onClick={refreshMarketData}>Refresh market</Button>
					</div>
				</div>

				<div className="hero__chart">
					<div className="hero__chart-card">
						<span className="hero__chart-label">Net worth trajectory</span>
						<strong>{formatCompactCurrency(1284000000)}</strong>
						<div className="hero__chart-growth">
							{loading && !marketData ? 'Live market context loading' : marketError ? `Live fallback active: ${marketError}` : `${marketData.name} moved ${formatPercent(marketData.changePercent)} today`}
						</div>
						<div className="hero__chart-growth">
							{lastUpdated ? `Live updated at ${new Date(lastUpdated).toLocaleTimeString()}` : 'Waiting for live update...'}
						</div>
						<NetWorthSparkline />
					</div>
					<div className={`hero__live-strip ${isRefreshing ? 'is-syncing' : ''}`} aria-live="polite">
						<div>
							<span>Feed status</span>
							<strong>{isRefreshing ? 'Syncing' : marketError ? 'Offline fallback' : 'Live'}</strong>
						</div>
						<div>
							<span>Last refresh</span>
							<strong>{lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}</strong>
						</div>
						<div>
							<span>Refresh count</span>
							<strong>{refreshCount}</strong>
						</div>
					</div>
				</div>
			</section>

			<section className="metrics-grid">
				{metrics.map((metric) => (
					<article key={metric.label} className="metric card">
						<div className="metric__top">
							<span>{metric.label}</span>
							<span className="metric__change">+{formatPercent(metric.change)}</span>
						</div>
						<strong className="metric__value">
							{metric.label === 'Portfolio return' || metric.label === 'Savings rate'
								? `${metric.value}%`
								: formatCompactCurrency(metric.value)}
						</strong>
						<p>{metric.note}</p>
					</article>
				))}
			</section>

			<section className="content-grid">
				<article className="card panel panel--featured">
					<div className="section-head">
						<div>
							<span className="eyebrow">Cash flow</span>
							<h2>Income remains ahead of spend.</h2>
							<p className="panel__lede">A richer view of monthly surplus, spend pressure, and the current momentum of the year.</p>
						</div>
						<span className="pill">Updated {formatShortDate(new Date())}</span>
					</div>
					<div className="panel__highlights">
						<div className="panel__highlight">
							<span>Average surplus</span>
							<strong>{formatCompactCurrency(cashFlowAverage)}</strong>
						</div>
						<div className="panel__highlight">
							<span>Strongest month</span>
							<strong>{strongestMonth.month}</strong>
						</div>
						<div className="panel__highlight">
							<span>Cash control</span>
							<strong>{formatPercent(flowRatio)}</strong>
						</div>
					</div>
					<CashFlowBars data={cashFlow} />
					<div className="panel__legend">
						<span><i className="legend legend--income" />Income</span>
						<span><i className="legend legend--expense" />Expense</span>
					</div>
					<div className="stat-strip">
						<div>
							<span>Income total</span>
							<strong>{formatCompactCurrency(incomeTotal)}</strong>
						</div>
						<div>
							<span>Expense total</span>
							<strong>{formatCompactCurrency(expenseTotal)}</strong>
						</div>
						<div>
							<span>Savings rate</span>
							<strong>{formatPercent(flowRatio)}</strong>
						</div>
					</div>
					
				</article>

				<article className="card panel">
					<div className="section-head">
						<div>
							<span className="eyebrow">Allocation</span>
							<h2>Portfolio mix by asset class.</h2>
						</div>
						<span className="pill">Target aligned</span>
					</div>
					<AllocationDonut data={allocation} />
					<div className="allocation-list">
						{allocation.map((item) => (
							<div key={item.label} className="allocation-item">
								<span className="allocation-dot" style={{ backgroundColor: item.color }} />
								<span>{item.label}</span>
								<strong>{item.value}%</strong>
							</div>
						))}
					</div>
				</article>
			</section>

			<section className="content-grid content-grid--wide">
				<article className="card panel panel--table">
					<div className="section-head">
						<div>
							<span className="eyebrow">Holdings</span>
							<h2>Largest positions and drift.</h2>
						</div>
						<Button variant="outline" onClick={handleReviewRebalance}>Review rebalance</Button>
					</div>
					<Table
						headers={['Asset', 'Category', 'Value', 'Allocation', 'Performance']}
						data={holdings}
						renderRow={(item) => (
							<>
								<td>
									<strong>{item.asset}</strong>
								</td>
								<td>{item.category}</td>
								<td>{formatCurrency(item.value)}</td>
								<td>{item.weight}</td>
								<td>
									<span className="gain">{item.gain}</span>
								</td>
							</>
						)}
					/>
				</article>

				<div className="side-stack">
					<article className="card panel">
						<div className="section-head">
							<div>
								<span className="eyebrow">Insights</span>
								<h2>What the system is flagging.</h2>
							</div>
						</div>
						<ul className="insight-list">
							{insights.map((insight) => (
								<li key={insight}>{insight}</li>
							))}
						</ul>
					</article>

					<article className="card panel">
						<div className="section-head">
							<div>
								<span className="eyebrow">Activity</span>
								<h2>Recent account movements.</h2>
							</div>
						</div>
						<div className="activity-list">
							{recentActivity.map((transaction) => (
								<div key={transaction.id} className="activity-item">
									<div>
										<strong>{transaction.title}</strong>
										<p>{formatLongDate(new Date(transaction.date))}</p>
									</div>
									<span className={`activity-item__amount ${transaction.type === 'debit' ? 'is-debit' : ''}`}>
										{transaction.type === 'debit' ? '-' : '+'}{formatCompactCurrency(transaction.amount)}
									</span>
								</div>
							))}
						</div>
					</article>
				</div>
			</section>
		</div>
	);
}

export default Dashboard;
