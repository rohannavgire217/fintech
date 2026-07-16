import { useSyncExternalStore } from 'react';

const initialState = {
  isAuthenticated: false,
  profile: {
    name: 'Anand Kumar',
    email: 'anand.kumar@finatech.local',
    team: 'Mumbai HQ',
    initials: 'AK',
    notifications: '3',
  },
  transactions: [
    { id: 1, title: 'Salary credited', type: 'credit', amount: 1240000, date: '2026-04-30' },
    { id: 2, title: 'SIP execution', type: 'debit', amount: 125000, date: '2026-04-29' },
    { id: 3, title: 'Dividend received', type: 'credit', amount: 68000, date: '2026-04-28' },
    { id: 4, title: 'Credit card spend', type: 'debit', amount: 94300, date: '2026-04-28' },
    { id: 5, title: 'Consulting invoice', type: 'credit', amount: 340000, date: '2026-04-26' },
  ],
};

let state = initialState;
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useFinanceStore(selector = (currentState) => currentState) {
  return useSyncExternalStore(subscribe, () => selector(getSnapshot()), () => selector(initialState));
}

export function getFinanceState() {
  return state;
}

export function setFinanceState(updater) {
  state = typeof updater === 'function' ? updater(state) : { ...state, ...updater };
  notify();
}

export function resetFinanceState() {
  state = initialState;
  notify();
}