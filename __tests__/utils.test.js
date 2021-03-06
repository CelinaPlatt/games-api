const {
  formatCategoryData,
  formatUserData,
  formatReviewData,
  formatCommentData,
  formatTimeStamp,
} = require('../db/utils/data-manipulation');

describe('formatCategoryData', () => {
  it('returns an array of arrays, when passed an array of objects', () => {
    const input = [
      { slug: 'dexterity', description: 'Games involving physical skill' },
      { slug: "children's games", description: 'Games suitable for children' },
    ];
    const actualOutput = formatCategoryData(input);
    expect(Array.isArray(actualOutput[0])).toBe(true);
  });
  it('returns an array of category arrays,containing only the values of the slug and description properties,when passed an array of a category objects', () => {
    const input = [
      { slug: 'dexterity', description: 'Games involving physical skill' },
      { slug: "children's games", description: 'Games suitable for children' },
    ];
    const expectedOutput = [
      ['dexterity', 'Games involving physical skill'],
      ["children's games", 'Games suitable for children'],
    ];
    const actualOutput = formatCategoryData(input);
    expect(actualOutput).toEqual(expectedOutput);
  });
  it('returns a new array', () => {
    const input = [
      { slug: 'dexterity', description: 'Games involving physical skill' },
    ];
    const actualOutput = formatCategoryData(input);
    expect(actualOutput).not.toBe(input);
  });
  it('does not mutate input', () => {
    const input = [
      { slug: 'dexterity', description: 'Games involving physical skill' },
    ];
    const copyInput = [
      { slug: 'dexterity', description: 'Games involving physical skill' },
    ];
    formatCategoryData(input);
    expect(input).toEqual(copyInput);
  });
});

describe('formatUserData', () => {
  it('returns an array with array, when passed an array with an object', () => {
    const input = [
      {
        username: 'mallionaire',
        name: 'haz',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      },
    ];
    const actualOutput = formatUserData(input);
    expect(Array.isArray(actualOutput[0])).toBe(true);
  });
  it('returns an array with a user array,containing the values of the username,name and avatar_url properties,when passed an array with a user object', () => {
    const input = [
      {
        username: 'mallionaire',
        name: 'haz',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      },
    ];
    const expectedOutput = [
      [
        'mallionaire',
        'haz',
        'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      ],
    ];
    const actualOutput = formatUserData(input);
    expect(actualOutput).toEqual(expectedOutput);
  });
  it('returns a new array', () => {
    const input = [
      {
        username: 'mallionaire',
        name: 'haz',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      },
    ];
    const actualOutput = formatUserData(input);
    expect(actualOutput).not.toBe(input);
  });
  it('does not mutate input', () => {
    const input = [
      {
        username: 'mallionaire',
        name: 'haz',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      },
    ];
    const copyInput = [
      {
        username: 'mallionaire',
        name: 'haz',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
      },
    ];
    formatUserData(input);
    expect(input).toEqual(copyInput);
  });
});

describe('formatReviewData', () => {
  it('returns an array with array, when passed an array with an object', () => {
    const input = [
      {
        title: 'Jenga',
        designer: 'Leslie Scott',
        owner: 'philippaclaire9',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        review_body: 'Fiddly fun for all the family',
        category: 'dexterity',
        created_at: new Date(1610964101251),
        votes: 5,
      },
    ];
    const actualOutput = formatReviewData(input);
    expect(Array.isArray(actualOutput[0])).toBe(true);
  });
  it('returns an array with a review array,containing the values of the title, review_body, designer, review_img_url,votes, category, owner and created_at properties when passed an array with a review object', () => {
    const input = [
      {
        title: 'Jenga',
        designer: 'Leslie Scott',
        owner: 'philippaclaire9',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        review_body: 'Fiddly fun for all the family',
        category: 'dexterity',
        created_at: new Date(1610964101251),
        votes: 5,
      },
    ];
    const expectedOutput = [
      [
        'Jenga',
        'Fiddly fun for all the family',
        'Leslie Scott',
        'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        5,
        'dexterity',
        'philippaclaire9',
        '2021-01-18 10:01:41.251'
      ],
    ];
    const actualOutput = formatReviewData(input);
    expect(actualOutput).toEqual(expectedOutput);
  });
  it('returns a new array', () => {
    const input = [
      {
        title: 'Jenga',
        designer: 'Leslie Scott',
        owner: 'philippaclaire9',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        review_body: 'Fiddly fun for all the family',
        category: 'dexterity',
        created_at: new Date(1610964101251),
        votes: 5,
      },
    ];
    const actualOutput = formatReviewData(input);
    expect(actualOutput).not.toBe(input);
  });
  it('does not mutate input', () => {
    const input = [
      {
        title: 'Jenga',
        designer: 'Leslie Scott',
        owner: 'philippaclaire9',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        review_body: 'Fiddly fun for all the family',
        category: 'dexterity',
        created_at: new Date(1610964101251),
        votes: 5,
      },
    ];
    const copyInput = [
      {
        title: 'Jenga',
        designer: 'Leslie Scott',
        owner: 'philippaclaire9',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        review_body: 'Fiddly fun for all the family',
        category: 'dexterity',
        created_at: new Date(1610964101251),
        votes: 5,
      },
    ];
    formatUserData(input);
    expect(input).toEqual(copyInput);
  });
});

describe('formatCommentData', () => {
  it('returns an array with array, when passed an array with an object', () => {
    const input = [
      {
        body: 'My dog loved this game too!',
        votes: 13,
        author: 'mallionaire',
        review_id: 3,
        created_at: new Date(1610964545410),
      },
    ];
    const actualOutput = formatCommentData(input);
    expect(Array.isArray(actualOutput[0])).toBe(true);
  });
  it('returns an array with a comment array,containing the values of the author, review_id, votes, created_at and body properties when passed an array with a comment object', () => {
    const input = [
      {
        body: 'My dog loved this game too!',
        votes: 13,
        author: 'mallionaire',
        review_id: 3,
        created_at: new Date(1610964545410),
      },
    ];
    const expectedOutput = [
      [
        'mallionaire',
        3,
        13,
        '2021-01-18 10:09:05.410',
        'My dog loved this game too!',
      ],
    ];
    const actualOutput = formatCommentData(input);
    expect(actualOutput).toEqual(expectedOutput);
  });
  it('returns a new array', () => {
    const input = [
      {
        body: 'My dog loved this game too!',
        votes: 13,
        author: 'mallionaire',
        review_id: 3,
        created_at: new Date(1610964545410),
      },
    ];
    const actualOutput = formatCommentData(input);
    expect(actualOutput).not.toBe(input);
  });
  it('does not mutate input', () => {
    const input = [
      {
        body: 'My dog loved this game too!',
        votes: 13,
        author: 'mallionaire',
        review_id: 3,
        created_at: new Date(1610964545410),
      },
    ];
    const copyInput = [
      {
        body: 'My dog loved this game too!',
        votes: 13,
        author: 'mallionaire',
        review_id: 3,
        created_at: new Date(1610964545410),
      },
    ];
    formatUserData(input);
    expect(input).toEqual(copyInput);
  });
});
describe('formatTimeStamp', () => {
  test('returns a review object when passed a review object', () => {
    const input = {
      title: 'Jenga',
      created_at: new Date(1610964101251),
      votes: 5
    };
    const actualOutput = formatTimeStamp(input);
    expect(typeof actualOutput).toBe('object');
  });
  test('returns a different object', () => {
    const input = {
      title: 'Jenga',
      created_at: new Date(1610964101251),
      votes: 5
    };
    const actualOutput = formatTimeStamp(input);
    expect(actualOutput).not.toBe(input);
  });
  test('returns a timestamp with the letters "T" AND "Z" removed as value for the created_at property, when passed an object with a created_at property', () => {
    const input = {
      created_at: new Date(1610964101251),
    };
    const expectedOutput = {
      created_at: '2021-01-18 10:01:41.251',
    };
    const actualOutput = formatTimeStamp(input);
    expect(actualOutput).toEqual(expectedOutput);
  });
  test('does not mutate original object', () => {
    const input = {
      created_at: new Date(1610964101251),
    };
    const copyInput = {
      created_at: new Date(1610964101251),
    };
    formatTimeStamp(input);
    expect(input).toEqual(copyInput);
  });
});
