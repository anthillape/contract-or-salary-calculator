import style from './app.css';
import { Observable } from 'rx';
import { run } from '@cycle/core';
import { makeDOMDriver, div } from '@cycle/dom';
import isolate from '@cycle/isolate';
import Input from 'components/input/input.js';
import { currency } from 'util.js';

function main(sources) {

	const dayRateInput = isolate(Input)({
		DOM: sources.DOM,
		props$: Observable.of({label: 'Day rate', initial: 400, step: 10})
	});

	const daysPerWeekInput = isolate(Input)({
		DOM: sources.DOM,
		props$: Observable.of({label: 'Days per week', initial: 5, step: 1})
	});

	const weeksWorkedInput = isolate(Input)({
		DOM: sources.DOM,
		props$: Observable.of({label: 'Weeks worked per year', initial: 46, step: 1})
	});

	const vatRateInput = isolate(Input)({
		DOM: sources.DOM,
		props$: Observable.of({label: 'VAT Rate', initial: 0.2, step: 0.005})
	});

	const annualSales$ = Observable.combineLatest(
		dayRateInput.value$,
		weeksWorkedInput.value$,
		daysPerWeekInput.value$,
		(dayRate, weeksWorked, daysPerWeek) => {
			return dayRate * daysPerWeek * weeksWorked;
		}
	);

	const annualSalesOutput = isolate(Input)({
		DOM: sources.DOM,
		props$: annualSales$.map( annualSales => ({
			label: 'Annual Sales',
			initial: currency(annualSales),
			readonly: true
		}))
	});

	const vatToClient$ = Observable.combineLatest(
		annualSales$,
		vatRateInput.value$,
		(annualSales, vatRate) => {
			return annualSales * vatRate;
		}
	);

	const vatToClientOutput = isolate(Input)({
		DOM: sources.DOM,
		props$: vatToClient$.map( vatToClient => ({
			label: 'VAT charged to client',
			initial: currency(vatToClient),
			readonly: true
		}))
	});

	const grossSales$ = Observable.combineLatest(
		annualSales$,
		vatToClientOutput.value$,
		(annualSales, vatToClient) => {
			return annualSales + vatToClient;
		}
	);

	const grossSalesOutput = isolate(Input)({
		DOM: sources.DOM,
		props$: grossSales$.map(sales => ({
			label: 'Gross Sales',
			initial: currency(sales),
			readonly: true
		}))
	});

	const vatFlatRateInput = isolate(Input)({
		DOM: sources.DOM,
		props$: Observable.of({label: 'VAT Flat Rate', initial: 0.145, step: 0.005})
	});

	const vatToHMRC$ = Observable.combineLatest(
		grossSales$,
		vatFlatRateInput.value$,
		(grossSales, vatFlatRate) => {
			return grossSales * vatFlatRate;
		}
	);

	const vatToHMRCOutput = isolate(Input)({
		DOM: sources.DOM,
		props$: vatToHMRC$.map(vatToHMRC => ({
			label: 'VAT to HMRC',
			initial: currency(vatToHMRC),
			readonly: true
		}))
	});

	return {
		DOM: Observable.combineLatest(
			dayRateInput.DOM,
			daysPerWeekInput.DOM,
			weeksWorkedInput.DOM,
			annualSalesOutput.DOM,
			vatRateInput.DOM,
			vatToClientOutput.DOM,
			grossSalesOutput.DOM,
			vatFlatRateInput.DOM,
			vatToHMRCOutput.DOM,
			( dayRateView,
				daysPerWeekView,
				weeksWorkedView,
				annualSalesView,
				vatRateView,
				vatToClientView,
				grossSalesView,
				vatFlatRateView,
				vatToHMRCView
			) => div({className: style.app},
				[
					dayRateView,
					daysPerWeekView,
					weeksWorkedView,
					annualSalesView,
					vatRateView,
					vatToClientView,
					grossSalesView,
					vatFlatRateView,
					vatToHMRCView
				]
			)
		)
	};
}

run(main, {
	DOM: makeDOMDriver('#app')
});
