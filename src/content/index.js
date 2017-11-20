import Handler from './handler';

let handlers = [];

const applyHandler = (element) => {
	const hdlr = new Handler(element);
	handlers.push([element, hdlr]);
};

const removeHandler = (element) => {
	const pair = handlers.filter(pair => pair[0] === element)[0];
	if (typeof pair === 'undefined') {
		return false;
	};

	handlers = handlers.filter(pair => pair[0] !== element);
	return pair[1].remove();
};

const initialize = () => {
	console.log('Firemacs content script reporting in hi');

	const observer = new MutationObserver((mutations) => {
		mutations.forEach(mut => {
			Array.from(mut.addedNodes)
				.forEach(applyHandler);
			Array.from(mut.removedNodes)
				.forEach(removeHandler);
		});
	});

	observer.observe(
		document.querySelector('body'),
		{ childList: true }
	);

	Array.from(document.querySelectorAll('textarea'))
		.forEach(applyHandler);
};

initialize();
