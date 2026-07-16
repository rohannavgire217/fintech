import { useCallback, useEffect, useState } from 'react';
import { getSensexUpdate } from '../services/Api';

export function useMarketData() {
	const [state, setState] = useState({
		data: null,
		loading: true,
		error: null,
		lastUpdated: null,
		isRefreshing: false,
		refreshCount: 0,
	});

	const fetchMarketData = useCallback(async ({ isBackground = false } = {}) => {
		setState((currentState) => ({
			...currentState,
			loading: isBackground ? currentState.loading : true,
			isRefreshing: isBackground,
		}));

		try {
			const data = await getSensexUpdate();
			setState((currentState) => ({
				...currentState,
				data,
				loading: false,
				error: data?.error || null,
				lastUpdated: data?.updatedAt || new Date().toISOString(),
				isRefreshing: false,
				refreshCount: currentState.refreshCount + 1,
			}));
		} catch (error) {
			setState((currentState) => ({
				...currentState,
				loading: false,
				error: error.message,
				lastUpdated: new Date().toISOString(),
				isRefreshing: false,
				refreshCount: currentState.refreshCount + 1,
			}));
		}
	}, []);

	useEffect(() => {
		let isMounted = true;
		let intervalId;

		const runFetch = async (options) => {
			if (!isMounted) {
				return;
			}

			await fetchMarketData(options);
		};

		runFetch({ isBackground: false });
		intervalId = setInterval(() => runFetch({ isBackground: true }), 8000);

		return () => {
			isMounted = false;
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [fetchMarketData]);

	return {
		...state,
		refreshMarketData: () => fetchMarketData({ isBackground: true }),
	};
}
