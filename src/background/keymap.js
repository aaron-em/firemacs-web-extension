import constants from '../lib/constants';
import { parseKeymap, lookupCommand } from '../lib/parse-utils';

class Keymap {
    constructor(def) {
        this.parse(def);
    }

    parse(def) {
        this.map = parseKeymap(def);
    }

    lookup(seq) {
        return lookupCommand(this.map, seq);
    }
};

export default Keymap;
