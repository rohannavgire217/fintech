import { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

export function useAuth() {
	const isAuthenticated = useFinanceStore((state) => state.isAuthenticated);
	const profile = useFinanceStore((state) => state.profile);

	return useMemo(() => {
		const user = profile || {
			name: 'Anand Kumar',
			email: 'anand.kumar@finatech.local',
			team: 'Mumbai HQ',
			initials: 'AK',
			notifications: '3',
		};

		return {
			user,
			isAuthenticated: Boolean(isAuthenticated),
			signIn: () => undefined,
			signOut: () => undefined,
		};
	}, [profile, isAuthenticated]);
}
