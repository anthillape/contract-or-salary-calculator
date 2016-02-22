import style from './app.css';
import { Observable } from 'rx';
import { run } from '@cycle/core';
import { makeDOMDriver, div } from '@cycle/dom';
import isolate from '@cycle/isolate';
import Input from 'components/input/input.js';

function main(sources) {

	const dayRateInput = isolate(Input)({
		DOM: sources.DOM,
		props$: Observable.of({label: 'Day rate', initial: 400})
	});

	const daysPerWeekInput = isolate(Input)({
		DOM: sources.DOM,
		props$: Observable.of({label: 'Days per week', initial: 5})
	});

	const weeksWorkedInput = isolate(Input)({
		DOM: sources.DOM,
		props$: Observable.of({label: 'Weeks worked per year', initial: 46})
	});

	const vatRateInput = isolate(Input)({
		DOM: sources.DOM,
		props$: Observable.of({label: 'VAT Rate', initial: 0.2})
	});

	const totalEarned$ = Observable.combineLatest(
		dayRateInput.value$,
		weeksWorkedInput.value$,
		daysPerWeekInput.value$,
		(dayRate, weeksWorked, daysPerWeek) => {
			return dayRate * daysPerWeek * weeksWorked;
		}
	);

	const totalEarnedOutput = isolate(Input)({
		DOM: sources.DOM,
		props$: totalEarned$.map( totalEarned => ({
			label: 'Total Earned',
			initial: totalEarned,
			readonly: true
		}))
	});

	const vatToClient$ = Observable.combineLatest(
		totalEarned$,
		vatRateInput.value$,
		(totalEarned, vatRate) => {
			return totalEarned * vatRate;
		}
	);

	const vatToClientInput = isolate(Input)({
		DOM: sources.DOM,
		props$: vatToClient$.map( vatToClient => ({
			label: 'VAT charged to client',
			initial: vatToClient,
			readonly: true
		}))
	});

	return {
		DOM: Observable.combineLatest(
			dayRateInput.DOM,
			daysPerWeekInput.DOM,
			weeksWorkedInput.DOM,
			totalEarnedOutput.DOM,
			vatRateInput.DOM,
			vatToClientInput.DOM,
			( dayRateView,
				daysPerWeekView,
				weeksWorkedView,
				totalEarnedView,
				vatRateView,
				vatToClientView) => div({className: style.app}, [
					dayRateView,
					daysPerWeekView,
					weeksWorkedView,
					totalEarnedView,
					vatRateView,
					vatToClientView
				])
			)
	};
}

run(main, {
	DOM: makeDOMDriver('#app')
});
