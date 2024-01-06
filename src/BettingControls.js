import './BettingControls.scss'

function BettingControls (props) {
	return <div id="betting_controls">
		<input type="range" min="1" max="100" step="1" id="range_slider" />
		<div id="fold_button" onClick={props.player_action('fold')}>Fold</div>
		<div id="call_button" onClick={props.player_action('call')}>Call</div>
		<div id="raise_button" onClick={props.player_action('raise')}>Raise</div>
	</div>
}

export default BettingControls;