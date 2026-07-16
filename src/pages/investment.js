import React from 'react';
import Button from '../components/common/Button';
import Table from '../components/common/table';
import { useMarketData } from '../hooks/Usemarketdata';
import { formatCompactCurrency, formatCurrency, formatPercent } from '../utils/formatter';

const portfolio = [
	{ asset: 'Large cap equity', value: 48200000, allocation: 38.2, return: 17.8 },
	{ asset: 'Global ETF', value: 21400000, allocation: 16.7, return: 14.2 },
	{ asset: 'Credit instruments', value: 16800000, allocation: 13.1, return: 6.4 },
	{ asset: 'Cash reserve', value: 13400000, allocation: 10.4, return: 2.0 },
];

const watchlist = [
	{ name: 'Tech leaders basket', thesis: 'AI infrastructure exposure', conviction: 'High', conviction_color: 'high', potential: '+18–24%' },
	{ name: 'Green energy ETF', thesis: 'Multi-year policy tailwind', conviction: 'Medium', conviction_color: 'medium', potential: '+8–14%' },
	{ name: 'Short duration bond fund', thesis: 'Cash parking with yield', conviction: 'High', conviction_color: 'high', potential: '+5–7%' },
];

function Investments() {
	const { data: marketData } = useMarketData();

	return (
		<div className="page-stack">
			<section className="page-hero card panel panel--gradient-invest">
				<div>
					<span className="eyebrow">Investments</span>
					<h2>Portfolio tracking with live market context.</h2>
					<p>Keep conviction, risk, and allocation visible while the market moves.</p>
				</div>
				<div className="stat-strip stat-strip--compact stat-strip--invest">
					<div className="stat-item--invest">
						<span>Market index</span>
						<strong>{marketData ? formatCompactCurrency(marketData.value) : 'Loading'}</strong>
					</div>
					<div className="stat-item--invest">
						<span>Day change</span>
						<strong className={marketData && marketData.changePercent > 0 ? 'gain' : 'variance--negative'}>{marketData ? formatPercent(marketData.changePercent) : '...'} </strong>
					</div>
					<div className="stat-item--invest">
						<span>Portfolio value</span>
						<strong>{formatCompactCurrency(119800000)}</strong>
					</div>
				</div>
			</section>

			<section className="card panel panel--table">
				<div className="section-head">
					<div>
						<span className="eyebrow">Core holdings</span>
						<h2>Largest positions in the portfolio.</h2>
					</div>
					<Button variant="outline">Add holding</Button>
				</div>
				<Table
					headers={['Asset', 'Value', 'Allocation', 'Return']}
					data={portfolio}
					renderRow={(item) => (
						<>
							<td><strong>{item.asset}</strong></td>
							<td>{formatCurrency(item.value)}</td>
							<td>{formatPercent(item.allocation)}</td>
							<td className="gain">+{formatPercent(item.return)}</td>
						</>
					)}
				/>
			</section>

			<section className="page-grid page-grid--3">
				{watchlist.map((item) => (
					<article key={item.name} className={`card panel watch-card watch-card--${item.conviction_color}`}>
						<div className="watch-card__header">
							<span className="eyebrow">Watchlist</span>
							<span className={`watch-card__badge watch-card__badge--${item.conviction_color}`}>{item.conviction}</span>
						</div>
						<div>
							<h3>{item.name}</h3>
							<p>{item.thesis}</p>
						</div>
						<div className="watch-card__footer">
							<span className="watch-card__potential">Upside</span>
							<strong className="watch-card__upside">{item.potential}</strong>
						</div>
					</article>
				))}
			</section>
		</div>
	);
}

export default Investments;
