import raw_text from './PlayerAI.txt.js';
const gto_charts = parse_text(raw_text);

function parse_text (raw_text) {
	const raw_groups = raw_text.split('$')
		.filter(e => e && e.replace(/\n/g, ''))
		.map(situation => situation.split('\n\n').filter(e => e).map(position => position.split('\n')))
		.map(situation => {
			const title = situation[0].splice(0, 1)[0];
			const position_choices = situation.map(position => {
				const position_name = position.splice(0, 1)[0];

				const return_object = {
					position: position_name
				};

				position.map(group => group.split(':').map(e => e.trim()))
					.forEach(e => return_object[e[0]] = (e[1] || '').split(', ').filter(p => p).map(p => ({
						hand: p.split('[')[0],
						percent: parseFloat(p.slice(0, -2).split('[')[1])
					})));
				
				return return_object;
			});

			return {
				title: title,
				position_choices
			};
		});

	return raw_groups;
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

function find_gto_move (history, post_flop_position, given_hand) {
	// Remove the posts because we don't care
	history = history.slice(2);
	const position_raises = history.filter(e => e.action === 'raise').map(e => e.player.post_flop_position)

	const position_chart = (() => {
		if (position_raises.length === 0) {
			const situation_chart = gto_charts.find(e => e.title === 'RFI');
			const position_chart = situation_chart.position_choices.filter(e => e.position === index_to_position(post_flop_position))[0];
			return position_chart;
		} else if (position_raises.length === 1) {
			const situation_chart = gto_charts.find(e => e.title === `FACING RFI FROM ${index_to_position(position_raises[0])}`);
			const position_chart = situation_chart.position_choices.filter(e => e.position === index_to_position(post_flop_position))[0];
			return position_chart;
		} else if (position_raises.length === 2) {
			const situation_chart = gto_charts.find(e => e.title === `FACING RFI FROM ${index_to_position(position_raises[0])} 3BET FROM ${index_to_position(position_raises[1])}`);
			const position_chart = situation_chart.position_choices.filter(e => e.position === index_to_position(post_flop_position))[0];
			return position_chart;
		}
	})();

	const allin_ratio = position_chart?.allin?.find(e => e.hand === given_hand)?.percent || 0;
	const bet_ratio = position_chart?.bet?.find(e => e.hand === given_hand)?.percent || 0;
	const call_ratio = position_chart?.call?.find(e => e.hand === given_hand)?.percent || 0;
	const fold_ratio = position_chart?.fold?.find(e => e.hand === given_hand)?.percent || 0;
	
	const option = Math.random() * 100;

	if (option < allin_ratio) {
		return {
			action: 'raise',
			amount: 100
		}
	} else if (option < allin_ratio + bet_ratio) {
		return {
			action: 'raise',
			amount: 3
		}
	} else if (option < allin_ratio + bet_ratio + call_ratio) {
		return {
			action: 'call',
			amount: 1
		}
	} else if (option < allin_ratio + bet_ratio + call_ratio + fold_ratio) {
		return {
			action: 'fold',
			amount: 0
		}
	} else {
		// should never happen
		return {
			action: 'fold',
			amount: 0
		}
	}
}

function find_gto_wrapper (history, post_flop_position, given_hand) {
	const move = find_gto_move(history, post_flop_position, given_hand);
//	console.log(`The AI ${move.action}ed with ${given_hand} from ${index_to_position(post_flop_position)}`);
	return move;
}

export default find_gto_wrapper;