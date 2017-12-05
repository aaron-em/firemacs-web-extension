export default Object.freeze({ // REALLY constant.
    // Emacs' defaults, for the most part (if not the whole part). See
    // `parse-utils.js' for the logic that translates this into
    // something we can use with browser-style key events.
    defaultKeymap: {
        // movement commands
        "previous-line": ["C-p"],
        "next-line": ["C-n"],
        "previous-char": ["C-b"],
        "next-char": ["C-f"],
        "previous-word": ["M-b"],
        "next-word": ["M-f"],
        "beginning-of-line": ["C-a"],
        "end-of-line": ["C-e"],
        "beginning-of-buffer": ["M-<"],
        "end-of-buffer": ["M->"],
        // commands affecting the mark and region
        "set-mark-command": ["C-SPC", "C-i"],
        "kill-region": ["C-w"],
        "kill-line": ["C-k"],
        "yank": ["C-y"],
        // commands otherwise modifying the buffer
        "delete-char": ["C-d"],
        "delete-backward-char": [],
        "kill-word": ["M-DEL"],
        "backward-kill-word": ["M-<backspace>"],
        "undo": ["C-x u", "C-/"],
        "redo": ["C-?"]
    },

    // Different browsers call different meta keys different things,
    // and we want the user to be able to override the default mapping
    // at will. This maps between the names browsers use for those
    // keys, and the symbols in our key definitions that represent
    // them.
    defaultMetaMap: {
        'S': 'Shift',
        'C': 'Control',
        'M': 'Alt',
        's': {
            chrome: 'Meta',
            firefox: 'OS'
        }
    },

    // We want to support Emacs-style specifications on the user side
    // for nonprintable key names, but also support the browsers' own
    // default representations on the command lookup side. This
    // mapping is used at keymap parsing time to perform that
    // translation, for those nonprintables whose names aren't the
    // same as in Emacs - for example, Emacs' "<home>" and the
    // browsers' "Home". These can be translated mechanically; only
    // those which can't must be manually mapped here.
    nonPrintableMap: {
        INS: 'Insert',
        DEL: 'Delete',
        SPC: ' ',
        RET: 'Enter',
        '<prior>': 'PageUp',
        '<next>': 'PageDown'
    },

    // Meta key names known to be used by browsers we support. We use
    // this in `parse-utils.js' to ensure that all key sequences, in
    // whatever order defined or issued, end up with a stable ordering
    // of meta key names - both during keymap parsing, and during
    // command lookup. This gives us an invariant equality over
    // e.g. 'C-M-x' and 'M-C-x', and makes command lookup a trivial
    // matter of tree traversal.
    metaKeys: ['Control', 'Shift', 'Alt', 'Meta', 'OS']
});
