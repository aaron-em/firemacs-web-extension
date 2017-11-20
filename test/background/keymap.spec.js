import { describe, it } from 'mocha';
import { expect } from 'chai';

import Keymap from '../../src/background/keymap';
import { parseKeymap } from '../../src/lib/parse-utils.js';

describe('Keymap handling', () => {
    describe('Class', () => {
        const mockKeymap = {
            'mock1': ['C-m'],
            'mock2': ['C-x C-c']
        };
        let t;

        beforeEach(() => {
            t = new Keymap(mockKeymap);
        });

        it('should parse in the constructor and bind to an instance prop', () => {

            expect(t.map)
                .to.deep.equal(parseKeymap(mockKeymap));
        });

        it('should reparse on .parse', () => {
            const secondMockKeymap = {
                mock3: ['C-y']
            };

            t.parse(secondMockKeymap);
            expect(t.map)
                .to.deep.equal(parseKeymap(secondMockKeymap));
        });

        it('should lookup', () => {
            expect(t.lookup(['Control', 'x', 'Control', 'c']))
                .to.equal('mock2');
        });
    });
});
