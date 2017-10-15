/*
 * Models for cards and gamestate.
 */

 class Card {
   constructor(card_elem) {
     this.card_elem = card_elem;
     this.open = false;
     this.match = false;
   }

   check_card(gamestate) {
     // Change class depending on gamestate.
     const self = this;
     const card_selector = $(this.card_elem).parent();
      card_selector.click(function() {
        if (gamestate.open_cards < 2 && self.open === false) {
          self.open = true;
          card_selector.addClass('open show');
          gamestate.open_cards += 1;
          // Check card match.
          if (gamestate.open_cards == 2) {
            self.check_match(gamestate);
          }
          gamestate.previous_card = self;

        }
     })
   }

   check_match(gamestate) {
     // Checks to see if cards match
     const self = this;
     const current_card = $(this.card_elem);
     const previous_card = $(gamestate.previous_card.card_elem);
     gamestate.previous_card.open = false;
     self.open = false;

     if (current_card.attr('class') !== previous_card.attr('class')) {
       // Cards don't match
       setTimeout(function() {
         current_card.parent().removeClass('open show');
         previous_card.parent().removeClass('open show');
         gamestate.open_cards = 0;
         gamestate.check_score();
       }, 300);
     } else {
       // Card match
       current_card.parent().addClass('match');
       previous_card.parent().addClass('match');
       gamestate.open_cards = 0;
     }
   }
 }

// Keep track of number of open cards and previous card value.
class Gamestate {
  constructor() {
    this.open_cards = 0;
    this.previous_card = {};
    this.move_counter = 0;
    this.star_count = 5;
  }

  check_score() {
    this.move_counter += 1;
    const stars = $('.stars');
    // Updates dom move counter
    $('.moves').text(this.move_counter)
    // Updates stars on how many moves player makes
    switch (this.move_counter) {
      case 2:
        $(stars.children()[stars.children().length - 1]).addClass('empty-star')
        this.star_count -= 1;
        break;
      case 4:
        $(stars.children()[stars.children().length - 2]).addClass('empty-star')
        this.star_count -= 1;
        break;
      case 21:
        $(stars.children()[stars.children().length - 3]).addClass('empty-star')
        this.star_count -= 1;
        break;
      case 28:
        $(stars.children()[stars.children().length - 4]).addClass('empty-star')
        this.star_count -= 1;
        break;
      case 35:
        $(stars.children()[stars.children().length - 5]).addClass('empty-star')
        this.star_count -= 1;
        break;
    }
  }
}

/*
 * Functions for game.
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Randomizes cards on board
function applyShuffle(gamestate) {
  const card_elems = $('.card').children();
  const shuffled_values = [];
  const card_list = [];

  for (let i = 0; i < card_elems.length; i++) {
    shuffled_values.push(card_elems[i].className);
  }

  shuffle(shuffled_values);
  // Apply shuffle values to dom
  card_elems.each(function(index) {
    $(this).attr('class', shuffled_values[index]);
  })
  return card_elems;
}

// Reinitializes gamestate
function reset(card_list, gamestate) {
  card_list.forEach(function(card) {
    $(card.card_elem).parent().removeClass('show open match');
  })

  // Resets moves to 0
  $('.moves').text(0);
  // Resets number of stars back to 5
  stars = $(".stars").children();
  stars.each(function(index) {
    $(stars[index]).removeClass('empty-star');
  })

  // Reset gamestate and randomize deck
  gamestate.star_count = 0;
  gamestate.move_counter = 0;
  gamestate.open_cards = 0;
  gamestate.previous_card = {};
  applyShuffle(gamestate);

}



/*
 * Initialize game
 */

function startGame() {
  const gamestate = new Gamestate();
  const card_list = [];

  // Applies shuffled deck to board
  card_elems = applyShuffle(gamestate);

  // Initialize card class list
  card_elems.each(function(index) {
    card_list.push(new Card(this));
    card_list[index].check_card(gamestate);
  });

  // Reset game upon click
  $('.restart').click(function() {
    reset(card_list, gamestate);
  })
}

startGame();


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


