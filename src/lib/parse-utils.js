import constants from '../lib/constants';

const metaKeys = constants.metaKeys;
const metaMap = constants.defaultMetaMap;
const nonPrintableMap = constants.nonPrintableMap;

const browserName = 'firefox';

class KeySequenceError extends Error {
    constructor(rawSeq, message) {
        const mess = 'In ' + rawSeq + ': ' + message;
        super(mess);
    }
};

function translateKey(s) {
    return [
        (typeof metaMap[s] === 'object' ? metaMap[s][browserName] : undefined),
        (typeof metaMap[s] === 'string' ? metaMap[s] : undefined),
        nonPrintableMap[s],
        (s.match(/^<.*?>$/)
            ? s.replace(/^<|>$/g, '').replace(/^(.)/, (p1) => p1.toUpperCase())
            : s)
    ]
    .filter(c => !!c)
    [0];
};

function translateSeq(seq) {
    return seq
        .map((s, i) => (i === seq.length-1 && s.length === 1)
             ? s
             : translateKey(s));
};

function validate(seq, raw) {
    const metaOnly = seq.map(c => metaKeys.indexOf(c) !== -1 ? c : null);
    const nonMetaOnly = seq.map(c => metaOnly.indexOf(c) === -1 ? c : null);

    // throw if same meta repeated
    const metaCounts = metaOnly
        .filter(c => c !== null)
        .reduce((a, i) => Object.assign({}, a, { [i]: (a[i] || 0) + 1 }), {});
    if (Object.keys(metaCounts).some(key => metaCounts[key] > 1)) {
        throw new KeySequenceError(raw, 'multiple instances of '
            + Object.keys(metaCounts).filter(key => metaCounts[key] > 1).join(', '));
    };

    // throw if any nontail nonmeta
    if (nonMetaOnly
            .reverse()
            .map((c, i) => (!!c ? i : null))
            .filter(c => c !== null).some(i => i > 0)) {
        throw new KeySequenceError(raw, 'non-meta character outside tail position');
    };

    return seq;
};

function sortSeq(seq) {
    return Object.assign([], seq)
        .sort()
        .sort(m => metaKeys.indexOf(m) === -1 ? 1 : -1);
};

function kbd(def) {
    return def.split(/ /)
        .map(s => s.split(/\-/))
        .map(translateSeq)
        .map(c => validate(c, def))
        .map(sortSeq)
        .reduce((a, i) => a.concat(i), []);
};

function parseKeymap(keymapDef) {
    const map = {};
    Object.keys(keymapDef)
        .forEach((command) => {
            const seqs = keymapDef[command]
                      .map(raw => [raw, kbd(raw)]);
            let ptr;
            seqs.forEach(([raw, seq]) => {
                ptr = map;
                seq.forEach((key, i) => {
                    if (metaKeys.indexOf(key) === -1 && i === (seq.length - 1)) {
                        ptr[key] = command;
                    } else if (typeof ptr[key] === 'object') {
                        ptr = ptr[key];
                    } else if (typeof ptr[key] === 'undefined') {
                        ptr[key] = {};
                        ptr = ptr[key];
                    } else {
                        throw new KeySequenceError(raw, 'tried to append to a non-prefix key');
                    };
                });
            });
        });
    return map;
}

function lookupCommand(map, seq) {
    let ptr = map;
    let cmdName = null;
    seq.forEach(key => {
        if (cmdName || typeof ptr === 'undefined') return;
        if (typeof ptr[key] === 'object') {
            ptr = ptr[key];
        } else if (ptr[key]) {
            cmdName = ptr[key];
        } else {
            ptr = undefined;
        }
    });
    return cmdName;
};

function keyIsMeta(key) {
	return metaKeys.some(item => key === item);
};

export {
	kbd,
	translateSeq,
	translateKey,
	sortSeq,
	validate,
	parseKeymap,
	lookupCommand,
	KeySequenceError,
	keyIsMeta
};
