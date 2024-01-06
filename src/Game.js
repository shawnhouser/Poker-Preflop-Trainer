import names from './names.js'
import find_gto_move from './PlayerAI.js'

class Deck {
	constructor () {
		const suits = ['Spade', 'Heart', 'Club', 'Diamond'];
		const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 'T', 'J', 'Q', 'K', 'A'].map(e => e.toString());
		const deck = suits.map(e => ranks.map(p => ({suit: e, rank: p}))).flat();
		shuffle_array(deck);
		this.deck = deck;

		function shuffle_array (array) {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
		}
	}

	pull (amount) {
		return this.deck.splice(0, amount);
	}
}

const CARD_RANKS = ['A', 'K', 'Q', 'J', 'T', 9, 8, 7, 6, 5, 4, 3, 2].map(e => e.toString())

function organize_hand (hand) {
	const modifier = (() => {
		if (hand.charAt(0) === hand.charAt(1)) {
			return '';
		} else if (hand.includes('s')) {
			return 's';
		} else if (hand.includes('o')) {
			return 'o';
		} else {
			return '';
		}
	})();

	return hand
		.split('')
		.slice(0, 2)
		.sort(sort_single_cards)
		.join('') +
		modifier;
}

function sort_single_cards (a, b) {
	const a_index = CARD_RANKS.findIndex(e => e === a);
	const b_index = CARD_RANKS.findIndex(e => e === b);
	return a_index - b_index;
}

function index_to_position (index) {
	return [
		'SB',
		'BB',
		'UTG',
		'UTG1',
		'UTG2',
		'LJ',
		'HJ',
		'CO',
		'BTN'
	][index];
}

class PokerPlayer {
	constructor (player_id, is_human, card_a, card_b) {
		const randomizer = Math.random()
		const random_size = Math.floor(randomizer * 200) + 200;
		
		this.stack_size = 200;
		this.card_a = card_a;
		this.card_b = card_b;

		this.id = player_id;
		this.key = player_id;
		this.icon_url = `https://placekitten.com/${random_size}/${random_size}`;
		
		this.is_human = is_human;
		if (is_human === true) {
			this.name = ' You'
			this.icon_url = 'https://yt3.ggpht.com/-MiJ_Ya6a8Bc/AAAAAAAAAAI/AAAAAAAAAAA/nn7XgDGHa0M/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
		} else {
			this.name = names[Math.floor(randomizer * names.length)];
		}

		this.in_the_hand = true;
		this.needs_to_act = true;
		this.last_action = '';

		// TODO post for blinds
	}

	async make_move (history, post_flop_position) {
		if (this.is_human === true) {
			const last_raise = history.findLast(e => e.action === 'raise').amount;
			const ai_move = this.consult_ai_charts(history, post_flop_position);
			const player_move = await this.wait_for_human(last_raise);
			if (ai_move.action === player_move.action) {
				console.log('Correct');
			} else {
				const card_shorthand = organize_hand(`${this.card_a.rank}${this.card_b.rank}${this.card_a.suit === this.card_b.suit ? 's' : 'o'}`);
				console.log(`WRONG. You should ${ai_move.action} with ${card_shorthand} in ${index_to_position(post_flop_position)} when ${history.filter(e => e.action === 'raise').splice(2).map((e, i) => `${i+3}bet from ${index_to_position(e.player.post_flop_position)}`)}`)
			}
			return player_move
		} else {
			return this.consult_ai_charts(history, post_flop_position);
		}
	}

	async wait_for_human (last_raise_amount) {
		while (true) {
			await new Promise(resolve => setTimeout(resolve, 10));
			if (this.needs_to_act === false) {
				break;
			}
		}

		if (this.last_action === 'raise') {
			return {
				id: this.id,
				action: this.last_action,
				amount: last_raise_amount * 3
			}
		} else if (this.last_action === 'call') {
			return {
				id: this.id,
				action: this.last_action,
				amount: last_raise_amount
			}
		} else {
			return {
				id: this.id,
				action: 'fold',
				amount: 0
			}
		}
	}

	consult_ai_charts (history, post_flop_position) {
		const card_shorthand = organize_hand(`${this.card_a.rank}${this.card_b.rank}${this.card_a.suit === this.card_b.suit ? 's' : 'o'}`);
		const move = find_gto_move(history, post_flop_position, card_shorthand);

		move.amount = move.amount * history.findLast(e => e.action === 'raise').amount;;
		move.id = this.id;
		return move;
	}
}

// TODO bb cant fold
class PokerGame {
	constructor (players, last_game) {
		this.moves = [];
		this.pot = 0;
		this.big_blind = 2;
		this.small_blind = 1;

		this.players = players;
		this.active = true;
		
		this.player_index = last_game !== undefined ? last_game.starting_player_index + 1 % 9 : Math.floor(Math.random() * 9);
		this.starting_player_index = this.player_index
		const post_flop_starting_index = (9 + this.player_index - 1) % 9;
		this.players.forEach((e, i) => e.post_flop_position = (9 + i - post_flop_starting_index) % 9)
	
		this.player_action(this.players[post_flop_starting_index], {
			action: 'raise',
			amount: this.small_blind
		});

		this.player_action(this.players[(post_flop_starting_index + 1) % 9], {
			action: 'raise',
			amount: this.big_blind
		});
	}

	// https://stackoverflow.com/questions/41474986/how-to-clone-a-javascript-es6-class-instance
	clone () {
		return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
	}

	static new_game (last_game) {
		const deck = new Deck();

		const players = new Array(9).fill(0).map((e, i) => {
			const [card_a, card_b] = deck.pull(2);
			const is_human = i === 0;
			return new PokerPlayer(i, is_human, card_a, card_b);
		});

		return new PokerGame(players, last_game);
	}

	player_action (player, move) {
		move.player = player;
		if (move.action === 'raise') {
			this.players.filter(e => e.in_the_hand).forEach(e => e.needs_to_act = true)
			
			player.needs_to_act = false;
			player.last_action = 'raise';

			player.bet = move.amount;
			player.stack_size = player.stack_size - move.amount;
		} else if (move.action === 'call') {
			player.needs_to_act = false;
			player.last_action = 'call';

			player.bet = move.amount;
			player.stack_size = player.stack_size - move.amount;
		} else if (move.action === 'fold') {
			player.needs_to_act = false;
			player.in_the_hand = false;
			player.last_action = 'fold';
		} else {
			// should never happen
		}

		this.moves.push(move);
	}

	async play () {
		this.player_index = (this.player_index + 1) % this.players.length;
		const player = this.players[this.player_index];

		// if no one needs to act then quit
		if (this.players.every(e => e.needs_to_act === false) === true) {
			this.active = false;
			return this.clone();
		}

		if (player.in_the_hand === false) {
			return this.clone();
		}

		const move = await player.make_move(this.moves, player.post_flop_position);
		this.player_action(player, move);

		await new Promise(res => setTimeout(res, 100));
		return this.clone()
	}
}

export default PokerGame;
