import Storage from './storage';
import Keymap from './keymap';
import constants from '../lib/constants';
import logger from '../lib/logger';

function initialize([ store ]) {
	let activeKeymap = null;

	browser.runtime.onMessage.addListener((message, sender, respond) => {
		if (sender.id !== browser.runtime.id
		    || sender.envType !== 'content_child') {
			return false;
		};

		respond(activeKeymap.lookup(message.sequence));
		return true;
	});

    // Keymap initialization logic
    store.get('keymap')
        .then((result) => {
            if (typeof result === 'object') {
                logger.info('Loaded existing keymap');
                return result;
            } else {
                logger.info('No existing keymap; installing default');
                return store.set('keymap', constants.defaultKeymap);
            };
        })
        .then((keymapDef) => {
            logger.info('Activating keymap', keymapDef);
            return (activeKeymap = new Keymap(keymapDef));
        })
        // Any other initialization would happen here
        .then(() => logger.info('Firemacs is good to go!'))
        .catch(err => logger.error(err));
};

Promise.all([new Storage(constants.storageKey)])
    .then(initialize);
