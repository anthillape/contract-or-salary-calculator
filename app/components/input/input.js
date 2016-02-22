import style from './input.css';
import Rx from 'rx';
import { div, input, span } from '@cycle/dom';

const Output = (sources) => {

	const intent = (sources) => {
		const valueChange$ = sources.DOM.select(style.input)
			.events('input')
			.map( event => event.target.value )
			.share();

		return {
			valueChange$
		};
	};

	const model = (intents) => {
		const initialValue$ = sources.props$
			.map(props => props.initial);

		const label$ = sources.props$
			.map(props => props.label);

		return {
			label$,
			value$: initialValue$.concat(intents.valueChange$)
		};
	};

	const state = model(intent(sources));

	const view = ( state ) => {
		return Rx.Observable.combineLatest(state.label$, state.value$, (label, value) => {
			return div({className: style.container}, [
				div([
					span({className: style.label}, [
						label
					]),
					input({className: style.input, readonly: true, value})
				])
			]);
		});
	};

	return {
		value$: state.value$,
		DOM: view(state)
	};
};

export default Output;
