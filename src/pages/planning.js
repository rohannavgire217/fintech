import React, { useState } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/input';
import Modal from '../components/common/model';
import Table from '../components/common/table';
import { useTransactions } from '../hooks/Usetranscation';
import { formatCompactCurrency, formatCurrency, formatPercent } from '../utils/formatter';

const goals = [
  { title: 'Home purchase fund', target: 10000000, saved: 4500000, deadline: 'Aug 2028', tone: 'green', icon: '🏠' },
  { title: 'Education reserve', target: 3500000, saved: 1975000, deadline: 'Mar 2027', tone: 'blue', icon: '📚' },
  { title: 'Tax buffer', target: 2000000, saved: 1300000, deadline: 'Dec 2026', tone: 'amber', icon: '📋' },
];

const budgetRows = [
  { category: 'Housing', budget: 180000, actual: 154000 },
  { category: 'Travel', budget: 120000, actual: 88000 },
  { category: 'Family', budget: 150000, actual: 141500 },
  { category: 'Learning', budget: 95000, actual: 72000 },
];

const toDraftRows = (rows) => rows.map((row) => ({
  ...row,
  budget: String(row.budget),
  actual: String(row.actual),
}));

const parseAmount = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

function Planning() {
  const { getExpensesTotal, getIncomeTotal } = useTransactions();
  const [currentBudgetRows, setCurrentBudgetRows] = useState(budgetRows);
  const [draftBudgetRows, setDraftBudgetRows] = useState(toDraftRows(budgetRows));
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const income = getIncomeTotal();
  const expense = getExpensesTotal();
  const available = income - expense;

  const openBudgetModal = () => {
    setDraftBudgetRows(toDraftRows(currentBudgetRows));
    setIsBudgetModalOpen(true);
  };

  const closeBudgetModal = () => {
    setIsBudgetModalOpen(false);
  };

  const updateDraftRow = (index, field, value) => {
    setDraftBudgetRows((currentRows) => currentRows.map((row, rowIndex) => {
      if (rowIndex !== index) {
        return row;
      }

      return { ...row, [field]: value };
    }));
  };

  const handleBudgetUpdate = (event) => {
    event.preventDefault();

    const nextRows = draftBudgetRows.map((row) => ({
      category: row.category,
      budget: parseAmount(row.budget),
      actual: parseAmount(row.actual),
    }));

    setCurrentBudgetRows(nextRows);
    setIsBudgetModalOpen(false);
  };

  return (
    <div className="page-stack">
      <section className="page-hero card panel panel--gradient-plan">
        <div>
          <span className="eyebrow">Planning</span>
          <h2>Budgets, goals, and tax strategy.</h2>
          <p>Turn your monthly surplus into measurable progress across every major life goal.</p>
        </div>
        <div className="stat-strip stat-strip--compact stat-strip--plan">
          <div className="stat-plan-item">
            <span>Monthly income</span>
            <strong>{formatCompactCurrency(income)}</strong>
          </div>
          <div className="stat-plan-item">
            <span>Monthly expenses</span>
            <strong>{formatCompactCurrency(expense)}</strong>
          </div>
          <div className="stat-plan-item stat-plan-item--highlight">
            <span>Available for goals</span>
            <strong>{formatCompactCurrency(available)}</strong>
          </div>
        </div>
      </section>

      <section className="page-grid">
        {goals.map((goal, index) => {
          const progress = (goal.saved / goal.target) * 100;
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          return (
            <article key={goal.title} className={`card panel goal-card goal-card--${goal.tone}`}>
              <div className="section-head">
                <div>
                  <div className="goal-card__header-top">
                    <span className="goal-card__icon">{goal.icon}</span>
                    <div>
                      <span className="eyebrow">Goal</span>
                      <h3>{goal.title}</h3>
                    </div>
                  </div>
                </div>
                <span className="pill pill--small">Due {goal.deadline}</span>
              </div>
              <div className="goal-card__progress">
                <div className="goal-card__progress-background" />
                <div className={`goal-card__bar goal-card__bar--${goal.tone}`} style={{ width: `${progress}%` }} />
              </div>
              <div className="goal-card__meta">
                <span className="goal-card__saved">{formatCurrency(goal.saved)}</span>
                <strong className="goal-card__percentage">{formatPercent(progress)}</strong>
                <span className="goal-card__target">{formatCurrency(goal.target)}</span>
              </div>
              <div className="goal-card__footer">
                <span className="goal-card__timeline">~{daysLeft} days left</span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="card panel panel--table">
        <div className="section-head">
          <div>
            <span className="eyebrow">Budget lens</span>
            <h2>Spending by major category.</h2>
          </div>
          <Button variant="outline" onClick={openBudgetModal}>Update budget</Button>
        </div>
        <Table
          headers={['Category', 'Budget', 'Actual', 'Variance']}
          data={currentBudgetRows}
          renderRow={(item) => {
            const variance = item.actual - item.budget;
            return (
              <>
                <td><strong>{item.category}</strong></td>
                <td>{formatCurrency(item.budget)}</td>
                <td>{formatCurrency(item.actual)}</td>
                <td className={variance > 0 ? 'variance variance--negative' : 'variance variance--positive'}>
                  {variance > 0 ? '+' : '-'}{formatCurrency(Math.abs(variance))}
                </td>
              </>
            );
          }}
        />
      </section>

      <Modal isOpen={isBudgetModalOpen} onClose={closeBudgetModal} title="Update monthly budgets">
        <form onSubmit={handleBudgetUpdate} className="planning-budget-form">
          <div className="planning-budget-form__grid">
            {draftBudgetRows.map((item, index) => (
              <div key={item.category} className="planning-budget-form__row">
                <h4>{item.category}</h4>
                <div className="planning-budget-form__inputs">
                  <Input
                    label="Budget"
                    inputMode="numeric"
                    min="0"
                    value={item.budget}
                    onChange={(event) => updateDraftRow(index, 'budget', event.target.value)}
                  />
                  <Input
                    label="Actual"
                    inputMode="numeric"
                    min="0"
                    value={item.actual}
                    onChange={(event) => updateDraftRow(index, 'actual', event.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="planning-budget-form__actions">
            <Button type="button" variant="outline" onClick={closeBudgetModal}>Cancel</Button>
            <Button type="submit" variant="primary">Update</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Planning;