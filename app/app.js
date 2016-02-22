import style from './app.css';
import Rx from 'rx';
import Cycle from '@cycle/core';
import { makeDOMDriver, div } from '@cycle/dom';
import isolate from '@cycle/isolate';
import Input from 'components/input/input.js';
// import Output from 'components/output/output.js';

function main(sources) {

	sources.DOM.select('miles').events('click').subscribe(j => console.log('j', j));

	const dayRateProps$ = Rx.Observable.of({label: 'Day rate', initial: 400});
	const weeksWorkedProps$ = Rx.Observable.of({label: 'Weeks worked per year', initial: 46});

	const dayRateInput = isolate(Input)( {DOM: sources.DOM, props$: dayRateProps$} );
	const weeksWorkedInput = isolate(Input)( {DOM: sources.DOM, props$: weeksWorkedProps$} );

	const dayRateVTree$ = dayRateInput.DOM;
	const dayRateValue$ = dayRateInput.value$;

	const weeksWorkedVTree$ = weeksWorkedInput.DOM;
	const weeksWorkedValue$ = weeksWorkedInput.value$;

	let totalEarned$ = Rx.Observable.combineLatest(dayRateValue$, weeksWorkedValue$, (dayRate, weeksWorked) => {
		return dayRate * 5 * weeksWorked;
	});

	const totalEarnedProps$ = Rx.Observable.of({label: 'Total Earned'})
		.combineLatest( totalEarned$, (label, totalEarned) => {
			const foo = {
				...label,
				initial: totalEarned
			};
			return foo;
		});

	const totalEarnedOutput = isolate(Input)( {DOM: sources.DOM, props$: totalEarnedProps$} );

	const totalEarnedVTree$ = totalEarnedOutput.DOM;

	return {
		DOM: Rx.Observable.combineLatest(
			dayRateVTree$,
			weeksWorkedVTree$,
			totalEarnedVTree$,
			(dayRateVTree, weeksWorkedVTree, totalEarnedVTree) => {
				return div({className: style.app}, [
					'hello',
					div({className: 'miles'}, ['screw']),
					dayRateVTree,
					weeksWorkedVTree,
					totalEarnedVTree
				]);
			})
	};
}

const drivers = {
	DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers);
