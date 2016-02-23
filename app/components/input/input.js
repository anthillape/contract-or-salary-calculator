import style from './input.css';
import Rx from 'rx';
import { div, input, span } from '@cycle/dom';

const Output = sources => {

	const intent = sources => ({
		valueChange$:  sources.DOM.select('.' + style.input)
		.events('input')
		.map( event => event.target.value )
		.share()
	});

	const model = intents => ({
		label$: sources.props$.pluck('label'),
		value$: sources.props$.pluck('initial').concat(intents.valueChange$),
		readonly$: sources.props$.pluck('readonly'),
		step$: sources.props$.pluck('step')
	});

	const state = model(intent(sources));

	const view = state => {
		return Rx.Observable.combineLatest(
			state.label$,
			state.value$,
			state.readonly$,
			state.step$,
			(label, value, readonly, step) => {
				return div({className: style.container}, [
					div([
						span({className: style.label}, [
							label
						]),
						input({className: style.input, type: 'number', disabled: readonly, value, step})
					])
				]);
			}
		);
	};

	return {
		value$: state.value$,
		DOM: view(state)
	};
};

export default Output;
