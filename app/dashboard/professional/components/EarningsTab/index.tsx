'use client';
import { Transaction } from '../types';

interface EarningsTabProps {
  earnings: {
    total: number;
    pending: number;
    recent: Transaction[];
  };
}

export default function EarningsTab({ earnings }: EarningsTabProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl text-purple-500 font-semibold mb-4">Earnings Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Earnings</p>
          <p className="text-2xl font-bold mt-1">${earnings.total.toLocaleString()}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Pending Payments</p>
          <p className="text-2xl font-bold mt-1">${earnings.pending.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {earnings.recent.length === 0 ? (
            <p className="text-gray-500 text-sm p-2">No recent transactions</p>
          ) : (
            earnings.recent.map(transaction => (
              <div key={transaction.id} className="flex justify-between items-center p-2 border-b border-gray-200">
                <div>
                  <p className="font-medium">{transaction.project}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-semibold">${transaction.amount.toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}