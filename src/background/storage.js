import logger from '../lib/logger';

export default class Storage {
    constructor() {
        this.store = {};
        browser.storage.onChanged.addListener(this.handleChanges.bind(this));
        return this.fetchStore()
            .then(() => Promise.resolve(this));
    }

    handleChanges(changes, storeType) {
        if (storeType !== 'local') return;
        Object.keys(changes)
            .forEach(key => this.store[key] = changes[key].newValue);
    }

    fetchStore() {
        return browser.storage.local.get(null)
            .then(store => this.store = store)
            .then(store => { logger.info('Initial store fetched'); return store; })
            .catch(err => logger.error(err));
    }

    set(key,value) {
        return browser.storage.local.set({ [key]: value })
            .then(() => Promise.resolve(this.store[key] = value));
    }

    get(key) {
        return Promise.resolve(this.store[key]);
    }
};
