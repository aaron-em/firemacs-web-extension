import { sortSeq, keyIsMeta } from '../lib/parse-utils';

export default class Handler {
	constructor(element) {
		this.element = element;
		this.sequence = [];
		this.boundListener = this.listener.bind(this);
		this.element.addEventListener('keydown', this.boundListener);
		this.element.addEventListener('keyup', this.boundListener);
	}

	remove() {
		this.element.removeEventListener('keydown', this.boundListener);
		this.element.removeEventListener('keyup', this.boundListener);
		return true;
	}

	listener(e) {
		if (e.type === 'keydown') {
			this.sequence = sortSeq(this.sequence.concat([e.key]));
		} else {
			this.sequence = sortSeq(this.sequence.filter(k => k !== e.key));
			// We don't get clean keyup events for the base key
			// of a meta chord on the Mac; we only get keyup events
			// for the meta keys themselves. in lieu of a proper fix,
			// we have this ugly hack that removes the base key of a
			// chord from the sequence at the same time we remove its
			// last meta key:
			if (this.sequence.every(entry => !keyIsMeta(entry))) {
				this.sequence = [];
			};

		};
		console.log(e.type, e.key, this.sequence);
		this.lookupCommand(this.sequence)
			.then((response) => {
				if (!response) {
					return false;
				};

				console.log('Would execute', response);
				e.preventDefault();

				return true;
			});
	}

	lookupCommand(seq) {
		return browser.runtime.sendMessage({sequence: seq});
	}
}
