# Modified Dietz Return Formula for Google Sheets

This project provides a custom Google Sheets formula that calculates investment returns using the [Modified Dietz method](https://en.wikipedia.org/wiki/Modified_Dietz_method). The Modified Dietz method delivers time-weighted return calculations that accurately account for the timing of cash flows during the measurement period.

## Features

- Calculate time-weighted investment returns
- Account for contributions and withdrawals at different times
- Easy integration with Google Sheets
- Handles partial periods automatically

## Installation

1. Open your Google Sheets document
2. Navigate to `Extensions` → `Apps Script`
3. Copy and paste the scripts from the `src` folder into the Apps Script editor
4. Save the project

## Usage

Use the following formula in your spreadsheet:

```
=modifiedDietzReturn(startDate, startValue, endDate, endValue, dateRange, amountRange)
```

### Parameters

- `startDate`: The beginning date of the measurement period
- `startValue`: Portfolio value at the start date
- `endDate`: The end date of the measurement period (can use `TODAY()`)
- `endValue`: Portfolio value at the end date
- `dateRange`: Range of cells containing cash flow dates
- `amountRange`: Range of cells containing cash flow amounts (positive for contributions, negative for withdrawals)

### Requirements

- Date and amount ranges must have equal lengths
- Dates must be in Date format
- Amounts must be in Number format
- Calculation stops at the first empty cell in the date range

## Example

View a working example [here](https://docs.google.com/spreadsheets/d/177Z6YsVA7RnzK3OP8hpe29R8dNCqmIgT0C--7QnjudQ/edit?usp=sharing).