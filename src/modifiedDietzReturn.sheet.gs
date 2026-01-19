/**
 * Calculates investment return using the Modified Dietz method.
 * 
 * The Modified Dietz method provides a time-weighted return calculation that accounts
 * for the timing of cash flows during the measurement period.
 * 
 * @param {number|string|Date} startDate - Portfolio start date
 * @param {number|string} startValue - Initial portfolio value
 * @param {number|string|Date} endDate - Portfolio end date  
 * @param {number|string} endValue - Final portfolio value
 * @param {Array<Array<Date>>|Date} contributionDates - Array of contribution dates or single date
 * @param {Array<Array<number>>|number} contributions - Array of contribution amounts or single amount (negative for withdrawals)
 * @return {number} Investment return as a decimal (e.g., 0.05 for 5% return)
 * @throws {string} When input parameters are invalid
 * @customfunction
 */
function modifiedDietzReturn(startDate, startValue, endDate, endValue, contributionDates, contributions) {
    const inputs = parseAndValidateInputs(startDate, startValue, endDate, endValue, contributionDates, contributions);
    return modifiedDietzReturnImpl(inputs.parsedStartDate, inputs.parsedStartValue, inputs.parsedEndDate, inputs.parsedEndValue, inputs.cashFlows);
}

/**
 * Calculates the annualized investment return using the Modified Dietz method.
 * 
 * Annualizes the Modified Dietz return based on the number of days in the period.
 * Formula: (1 + R)^(365.25 / Days) - 1
 * 
 * @param {number|string|Date} startDate - Portfolio start date
 * @param {number|string} startValue - Initial portfolio value
 * @param {number|string|Date} endDate - Portfolio end date  
 * @param {number|string} endValue - Final portfolio value
 * @param {Array<Array<Date>>|Date} contributionDates - Array of contribution dates or single date
 * @param {Array<Array<number>>|number} contributions - Array of contribution amounts or single amount (negative for withdrawals)
 * @return {number} Annualized investment return as a decimal
 * @throws {string} When input parameters are invalid
 * @customfunction
 */
function modifiedDietzReturnAnnualized(startDate, startValue, endDate, endValue, contributionDates, contributions) {
    const inputs = parseAndValidateInputs(startDate, startValue, endDate, endValue, contributionDates, contributions);
    const periodReturn = modifiedDietzReturnImpl(inputs.parsedStartDate, inputs.parsedStartValue, inputs.parsedEndDate, inputs.parsedEndValue, inputs.cashFlows);
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysInPeriod = (inputs.parsedEndDate - inputs.parsedStartDate) / msPerDay;

    if (daysInPeriod <= 0) {
        return 0;
    }

    const daysInYear = 365.25;
    return Math.pow(1 + periodReturn, daysInYear / daysInPeriod) - 1;
}

function parseAndValidateInputs(startDate, startValue, endDate, endValue, contributionDates, contributions) {
    // Validate input parameter consistency
    const isArrayOfDates = Array.isArray(contributionDates);
    const isArrayOfContributions = Array.isArray(contributions);

    if (isArrayOfDates !== isArrayOfContributions) {
        throw "contributionDates and contributions must both be arrays or both be single values";
    }

    if (isArrayOfDates && contributionDates.length !== contributions.length) {
        throw "contributionDates and contributions arrays must have equal length";
    }

    // Helper functions for type conversion
    const parseDate = (date) => {
        if (date instanceof Date) return date.getTime();
        if (typeof date === 'string') return Date.parse(date);
        return date;
    };

    const parseNumber = (value) => {
        if (typeof value === 'string') return parseFloat(value);
        return value;
    };

    // Parse and validate main parameters
    const parsedStartDate = parseDate(startDate);
    const parsedStartValue = parseNumber(startValue);
    const parsedEndDate = parseDate(endDate);
    const parsedEndValue = parseNumber(endValue);

    if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
        throw "Invalid date format";
    }

    if (isNaN(parsedStartValue) || isNaN(parsedEndValue)) {
        throw "Invalid portfolio value";
    }

    // Process cash flows
    const cashFlows = [];

    const addCashFlow = (date, amount) => {
        const parsedDate = parseDate(date);
        const parsedAmount = parseNumber(amount);

        if (!isNaN(parsedDate) && !isNaN(parsedAmount) && parsedAmount !== 0) {
            cashFlows.push([parsedDate, parsedAmount]);
        }
    };

    if (isArrayOfDates) {
        // Process array of contributions
        for (let i = 0; i < contributionDates.length; i++) {
            const date = contributionDates[i][0];
            if (!date) break; // Stop at first empty date

            const amount = contributions[i][0];
            if (amount !== undefined && amount !== null && amount !== '') {
                addCashFlow(date, amount);
            }
        }
    } else {
        // Process single contribution
        addCashFlow(contributionDates, contributions);
    }

    return {
        parsedStartDate,
        parsedStartValue,
        parsedEndDate,
        parsedEndValue,
        cashFlows
    };
}
