const {formatCategoryData} = require('../db/utils/data-manipulation');

describe('formatCategoryData', () => {
    it('returns an array of arrays, when passed an array of objects', () => {
        const input = [
            {slug: 'dexterity', description: 'Games involving physical skill' },
            { slug: "children's games", description: 'Games suitable for children' }
        ];
        const actualOutput = formatCategoryData(input);
        expect(Array.isArray(actualOutput[0])).toBe(true);
     
    });

   it('returns an array of category arrays,containing only the values of the slug and description properties,when passed an array of a category objects', () => {
        const input = [
            {slug: 'dexterity', description: 'Games involving physical skill' },
            { slug: "children's games", description: 'Games suitable for children' }
        ];
        const expectedOutput = [
            ['dexterity','Games involving physical skill'] ,
            ["children's games",'Games suitable for children' ]
        ];
        const actualOutput = formatCategoryData(input);
        expect(actualOutput).toEqual(expectedOutput);   
    });
    it('returns a new array', () => {
        const input = [
            {slug: 'dexterity', description: 'Games involving physical skill' }
        ];
        const actualOutput = formatCategoryData(input);
        expect(actualOutput).not.toBe(input); 
    });
    it('does not mutate input', () => {
        const input = [
            {slug: 'dexterity', description: 'Games involving physical skill' }
        ];
        const copyInput = [
            {slug: 'dexterity', description: 'Games involving physical skill' }
        ];
       formatCategoryData(input);
        expect(input).toEqual(copyInput); 
    });
});
    