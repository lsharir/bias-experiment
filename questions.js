var QUESTIONS = [
  {
    description: 'anchoring',
    unbiased: {
      text: 'How much would you tip for a drink?',
      answers: [
        '$0', '$0.5', '$1', '$1.25'
      ]
    },
    biased: {
      text: 'How much would you tip for a drink?',
      answers: [
        '$0', '$1', '$2', '$3', '$4'
      ]
    }
  },
  {
    description: 'availability',
    unbiased: {
      text: 'What is more likely to kill you?',
      answers: [
        'A neighborhood dog', 'Your furniture'
      ]
    },
    biased: {
      text: 'What is more likely to kill you?',
      image: 'images/availability_bias.jpg',
      answers: [
        'A neighborhood dog', 'Your furniture'
      ]
    }
  },
  {
    description: 'representativeness',
    unbiased: {
      text: 'Alex likes the color green. What is Alex more likely to be?',
      answers: [
        'a person', 'an eco-friendly person'
      ]
    },
    biased: {
      text: 'Sarah loves to read her horoscope each day. What is Sarah more likely to be?',
      answers: [
        'a teacher', 'a holistic teacher'
      ]
    }
  },
  {
    description: 'optimism and overconfidence',
    unbiased: {
      text: 'Is Chris\'s dog cuter than other people\'s dogs?',
      image: 'images/overconfidence_bias.jpg',
      answers: [
        'Yes', 'No'
      ]
    },
    biased: {
      text: 'Is your pet animal cuter than other people\'s pet animals?',
      answers: [
        'Yes', 'No'
      ]
    }
  },
  {
    description: 'gains and losses',
    unbiased: {
      text: 'A: Roll one die. On 1,2,3,4 you win $20 but on 5,6 you lose $40 (⅓ win, ⅔ lose)\n' +
            'B: Roll one die. On 1,2,3,4 you lose $20 but on 5,6 you win $40 (⅔ lose, ⅓ win) ',
      answers: [
        'Bet A', 'Bet B'
      ]
    },
    biased: {
      text: 'A: Roll one die. On 1,2,3,4 you win $20 but on 5,6 you lose $40 (⅓ win, ⅔ lose)\n' +
            'B: flip a coin. 50% win a dollar, 50% lose a dollar.',
      answers: [
        'Yes', 'No'
      ]
    }
  },
  {
    description: 'status quo bias',
    unbiased: {
      text: 'You are buying a set of pens. Which color would you prefer?',
      image: 'images/status_quo_unbiased.jpg',
      answers: [
        'Black', 'Blue'
      ]
    },
    biased: {
      text: 'You are buying a set of pens. Which color would you prefer?',
      image: 'images/status_quo_biased.jpg',
      answers: [
        'Black', 'Blue'
      ]
    }
  }
];