import style from './output.css';
import Rx from 'rx';
import { div, input, span } from '@cycle/dom';

const Input = (sources) => {

	const initialValue$ = sources.props$
		.map(props => props.initial)
		.first();

	const label$ = sources.props$
		.map(props => props.label)
		.first();

	return {
		DOM: Rx.Observable.combineLatest(initialValue$, label$, (initialValue, label) => {
			return div({className: style.container}, [
				div([
					span({className: style.label}, [
						label
					]),
					input({className: style.output}, [
						initialValue
					])
				])
			]);
		})
	};
};

export default Input;
