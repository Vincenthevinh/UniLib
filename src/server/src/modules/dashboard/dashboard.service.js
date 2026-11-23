export const dashboardService = {
  async getReaderDashboard(readerId = 'usr_003') {
    return {
      readerId,
      activeLoans: [
        {
          loanId: 'loan_101',
          copyId: 'cpy_002',
          bookTitle: 'Clean Code',
          checkoutDate: '2026-11-15T09:00:00.000Z',
          dueDate: '2026-11-29T09:00:00.000Z',
          isOverdue: false,
          daysRemaining: 6,
          canRenew: true,
        },
      ],
      activeReservations: [
        {
          reservationId: 'res_001',
          bookTitle: 'Design Patterns',
          status: 'READY_FOR_PICKUP',
          pickupDeadline: '2026-11-25T14:00:00.000Z',
          queuePosition: 1,
        },
      ],
      alerts: [],
    };
  },

  async getLibrarianDashboard() {
    return {
      metrics: {
        totalTitles: 1250,
        totalCopies: 4500,
        availableCopies: 3200,
        activeLoans: 1150,
        overdueLoans: 18,
        activeReservations: 42,
      },
      recentActivity: [
        { type: 'CHECKOUT', timestamp: new Date().toISOString(), details: 'Loan created for reader usr_003' },
        { type: 'RETURN', timestamp: new Date().toISOString(), details: 'Copy BC-00101 returned in Good condition' },
      ],
    };
  },
};

export default dashboardService;
