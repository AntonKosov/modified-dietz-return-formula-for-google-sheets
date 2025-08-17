const DAYS_IN_YEAR = 365.25;

/**
 * Calculates investment return using the Modified Dietz method.
 * 
 * @param {number} startDate - Start date as a number
 * @param {number} startValue - Initial portfolio value at start date
 * @param {number} endDate - End date as a number
 * @param {number} endValue - Final portfolio value at end date
 * @param {number[][]} inflows - Array of [date, amount] pairs representing cash flows.
 *                               Positive values are contributions, negative are withdrawals
 * @return {number} The Modified Dietz return as a decimal (e.g., 0.10 = 10% return)
 * @throws {Error} Throws error if inputs are invalid
 */
function modifiedDietzReturnImpl(startDate, startValue, endDate, endValue, inflows = []) {
    // Input validation
    if (startDate >= endDate) {
        throw new Error('Start date must be before end date');
    }
    if (startValue < 0 || endValue < 0) {
        throw new Error('Portfolio values cannot be negative');
    }
    if (!Array.isArray(inflows)) {
        throw new Error('Inflows must be an array');
    }

    const totalDays = endDate - startDate;
    let totalInflow = 0;
    let weightedInflow = 0;

    // Process each cash flow
    for (const [flowDate, flowAmount] of inflows) {
        // Validate cash flow data
        if (typeof flowDate !== 'number' || typeof flowAmount !== 'number') {
            throw new Error('Cash flow date and amount must be numbers');
        }
        if (flowDate < startDate || flowDate > endDate) {
            continue; // Skip flows outside the measurement period
        }

        totalInflow += flowAmount;

        // Calculate weight based on time remaining in period
        const daysFromStart = flowDate - startDate;
        const weight = (totalDays - daysFromStart) / totalDays;
        weightedInflow += flowAmount * weight;
    }

    // Calculate denominator (average capital employed)
    const averageCapital = startValue + weightedInflow;

    // Avoid division by zero
    if (averageCapital === 0) {
        return endValue === 0 ? 0 : Infinity;
    }

    // Modified Dietz return formula
    const gain = endValue - startValue - totalInflow;
    return gain / averageCapital;
}
