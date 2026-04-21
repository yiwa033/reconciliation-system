/**
 * 对账计算引擎
 * 实现所有财务公式的核心逻辑
 */

/**
 * 计算单笔交易
 * @param {Object} transaction - 交易数据
 * @returns {Object} 计算结果
 */
function calculateTransaction(transaction) {
  const {
    gameName,
    rechargeFlow,
    discount = 0.05,
    channelFee = 0,
    taxRate = 0.10,
    commissionRate = 0.50
  } = transaction;

  // 折扣金额 = 充值流水 × 折扣
  const discountedAmount = rechargeFlow * discount;

  // 代扣税费 = (折扣金额 - 通道费) × 税率
  const taxAmount = (discountedAmount - channelFee) * taxRate;

  // 实际结算金额 = 折扣金额 - 通道费 - 税费
  const settlementAmount = discountedAmount - channelFee - taxAmount;

  // 分成金额 = 实际结算金额 × 分成比例
  const commissionAmount = settlementAmount * commissionRate;

  return {
    gameName,
    rechargeFlow,
    discount,
    discountedAmount: Number(discountedAmount.toFixed(2)),
    channelFee,
    taxAmount: Number(taxAmount.toFixed(2)),
    settlementAmount: Number(settlementAmount.toFixed(2)),
    commissionAmount: Number(commissionAmount.toFixed(2)),
    commissionRate,
    ratio: Math.round(commissionRate * 100)
  };
}

/**
 * 计算对账汇总
 * @param {Array} transactions - 交易数组
 * @returns {Object} 汇总数据
 */
function calculateReconciliationSummary(transactions) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {
      totalRechargeFlow: 0,
      totalSettlementAmount: 0,
      totalTax: 0,
      totalCommission: 0,
      actualSettlementAmount: 0,
      prepaidBalance: 0,
      remainingBalance: 0
    };
  }

  const summary = transactions.reduce(
    (acc, tx) => {
      return {
        totalRechargeFlow: acc.totalRechargeFlow + (tx.rechargeFlow || 0),
        totalSettlementAmount: acc.totalSettlementAmount + (tx.settlementAmount || 0),
        totalTax: acc.totalTax + (tx.taxAmount || 0),
        totalCommission: acc.totalCommission + (tx.commissionAmount || 0)
      };
    },
    {
      totalRechargeFlow: 0,
      totalSettlementAmount: 0,
      totalTax: 0,
      totalCommission: 0
    }
  );

  // 实际结算金额
  summary.actualSettlementAmount = summary.totalSettlementAmount;

  // 预付款余额
  summary.prepaidBalance = summary.totalSettlementAmount;

  // 剩余余款（这里简化处理，实际应根据业务逻辑）
  summary.remainingBalance = summary.prepaidBalance;

  // 格式化为两位小数
  Object.keys(summary).forEach(key => {
    summary[key] = Number(summary[key].toFixed(2));
  });

  return summary;
}

module.exports = {
  calculateTransaction,
  calculateReconciliationSummary
};