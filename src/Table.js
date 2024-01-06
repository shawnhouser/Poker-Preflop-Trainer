import { useState } from 'react';

import './Table.scss'
import Player from './Player.js'
import BettingControls from './BettingControls.js'
import PokerGame from './Game.js'

function PokerTable (props) {
	const [game_state, set_game_state] = useState(PokerGame.new_game());

	if (game_state.active === true) {
		game_state.play().then(e => set_game_state(e))
	} else {
		setTimeout(() => {
			set_game_state(PokerGame.new_game(game_state))
		}, 1000);
	}

	return <div>
		<div id="poker_table">
			{game_state.players.map(e => <Player {...e} />)}
		</div>
		<BettingControls player_action={type => () => {
			const human_player = game_state.players.find(e => e.is_human === true)
			human_player.last_action = type;
			human_player.needs_to_act = false;
		}}/>
	</div>
}

export default PokerTable;