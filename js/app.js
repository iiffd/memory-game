/*
 * Models for cards and gamestate.
 */


 class Card {
   constructor(card_elem) {
     this.card_elem = card_elem;
     this.open = false;
     this.match = false;
   }

   check_card(gamestate, timer) {
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
            self.check_match(gamestate, timer);
          }
          gamestate.previous_card = self;

        }
     })
   }

   check_match(gamestate, timer) {
     // Checks to see if cards match
     const self = this;
     const current_card = $(this.card_elem);
     const previous_card = $(gamestate.previous_card.card_elem);
     gamestate.previous_card.open = false;
     self.open = false;

     if (current_card.attr('class') !== previous_card.attr('class')) {
       // Cards don't match
       wrongMatch(current_card.parent(), previous_card.parent(), gamestate);
     } else {
       // Cards match
       match(current_card.parent(), previous_card.parent(), gamestate, timer);
     }
   }
 }


// Keep track of number of open cards and previous card value.
class Gamestate {
  constructor() {
    this.open_cards = 0;
    this.previous_card = {};
    this.move_counter = 0;
    this.star_count = 3;
    this.match_count = 0;
  }

  check_score() {
    this.move_counter += 1;
    const stars = $('.stars');
    // Updates dom move counter
    $('.moves').text(this.move_counter)
    // Updates stars on how many moves player makes
    switch (this.move_counter) {
      case 5:
        $(stars.children()[stars.children().length - 1]).addClass('empty-star')
        this.star_count -= 1;
        break;
      case 10:
        $(stars.children()[stars.children().length - 2]).addClass('empty-star')
        this.star_count -= 1;
        break;
      case 15:
        $(stars.children()[stars.children().length - 3]).addClass('empty-star')
        this.star_count -= 1;
        break;
    }
  }
}

/*
 * Functions for game.
 */


// Cards don't match
function wrongMatch(cur_card, prev_card, gamestate) {
  cur_card.addClass('wrong')
  prev_card.addClass('wrong')
  // Shakes cards
  cur_card.effect('shake');
  prev_card.effect('shake');

  // Shows cards for some time
  setTimeout(function() {
    cur_card.removeClass('open show wrong');
    prev_card.removeClass('open show wrong');
    gamestate.open_cards = 0;
    gamestate.check_score();
  }, 700);
}


// Cards match
function match(cur_card, prev_card, gamestate, timer) {
  gamestate.match_count += 1;
  cur_card.addClass('match');
  prev_card.addClass('match');
  // Shakes card horizontal slower
  cur_card.effect('shake', {direction:'up', times:2,
                       distance: 10}, 600)
  prev_card.effect('shake', {direction:'up', times:2,
                        distance: 10}, 600)
  gamestate.open_cards = 0;

  // Popup shows if win condition met
  if (gamestate.match_count === 8) {
    // Stops timer when game ends
    clearInterval(timer);
    winMessage(gamestate);
  }
}


// Win message popup
function winMessage(gamestate, timer) {
  // Changes win message depending on star count
  const win_time = $('.timer').text();
  $('#end-message').text(`Great job! You won in ${win_time} seconds with ${gamestate.move_counter} moves and ${gamestate.star_count} stars!`);
  $('#myModal').modal('toggle');
}


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
function reset(card_list, gamestate, timer) {
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
  gamestate.star_count = 5;
  gamestate.move_counter = 0;
  gamestate.open_cards = 0;
  gamestate.match_count = 0;
  gamestate.previous_card = {};
  applyShuffle(gamestate);

  // Stops timer
  clearInterval(timer);
  timer = null;
  // New timer instance
  let start = new Date;
  timer = setInterval(function(){ startTimer(start) }, 1000);
  return timer;
}

// Timer function from
// https://stackoverflow.com/questions/2604450/how-to-create-a-jquery-clock-timer
function startTimer(start){
  $('.timer').text(Math.round((new Date - start) / 1000));
}


/*
 * Initialize game
 */


function startGame() {
  const gamestate = new Gamestate();
  const card_list = [];

  // Applies shuffled deck to board
  card_elems = applyShuffle(gamestate);

  // Start timer
  let start = new Date;
  let timer = setInterval(function(){ startTimer(start) }, 1000);

  // Initialize card class list
  card_elems.each(function(index) {
    card_list.push(new Card(this));
    card_list[index].check_card(gamestate, timer);
  });

  // Removes modal on x click
  $('.close').click(function() {
    $('#myModal').modal('toggle');
  })

  // Play again button. Closes modal and resets board
  $('.btn-success').click(function() {
    $('#myModal').modal('toggle');
    timer = reset(card_list, gamestate, timer);
  })

  // Reset game upon click
  $('.restart').click(function() {
    timer = reset(card_list, gamestate, timer);
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


