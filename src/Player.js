import './Player.scss'

const empty_image = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';

function get_card_url (card, is_human, in_the_hand) {
	if (in_the_hand === false) {
		return empty_image;
	} else if (is_human === false) {
		return '/static/cards/back.png';
	}

	const suit = card.suit.charAt(0).toLowerCase();
	const rank = card.rank.charAt(0).toLowerCase().replace('t', '10').replace('a', '1');
	return `static/cards/${rank}${suit}.svg`;
}

function get_chips_url (bet) {
	if (bet <= 1) {
		return 'static/chips/coins_1.png';
	} else if (bet <= 2) {
		return 'static/chips/coins_2.png';
	} else if (bet <= 6) {
		return 'static/chips/coins_5.png';
	} else if (bet <= 20) {
		return 'static/chips/coins_100.png';
	} else if (bet <= 60) {
		return 'static/chips/coins_250.png';
	} else if (bet <= 200) {
		return 'static/chips/coins_1k.png';
	} else if (bet > 200) {
		return 'static/chips/coins_10k.png';
	} else {
		return empty_image;
	}
}

function get_button_class (position) {
	return ({
		'8': 'dealer',
		'0': 'small_blind',
		'1': 'big_blind'
	})[position] || '';
}

function PokerPlayer (props) {
	return <div className="poker_player">
		<div className="player_cards">
			<img className="poker_card card_a" src={get_card_url(props.card_a, props.is_human, props.in_the_hand)} alt="poker card"/>
			<img className="poker_card card_b" src={get_card_url(props.card_b, props.is_human, props.in_the_hand)} alt="poker card"/>
		</div>
		<div className="player_infobox">
			<img className="player_icon" src={props.icon_url} alt="player icon"/>
			<div className="player_name">{props.name}</div>
			<div className="player_stack_size">{props.stack_size}</div>
			<div className="player_action">{props.last_action}</div>
		</div>
		<div className="player_chips">
			<div className={`player_button ${get_button_class(props.post_flop_position)}`}></div>
			<img className="poker_chips" src={get_chips_url(props.bet)} alt="poker chips"/>
		</div>
	</div>
}

export default PokerPlayer;