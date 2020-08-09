import React,{Component} from 'react';
import './css/app.css';
import rock from './res/rock.png';
import paper from './res/paper.png';
import scissors from './res/scissors.png';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      wins: 0,
      losses: 0,
      response: "",
      matrix: []
    }


    // user choice
    this.user_choice = "";

    // the user's choice from last turn
    this.last_choice = "";

    // the bot choice
    this.bot_choice = "";

    // keep track of consecutive losses for the bot
    this.loss_counter = 0;


    this.matrix = [
      [0,0,0],
      [0,0,0],
      [0,0,0]
    ];

    this.first = true;

    this.choice_dict = {
      "rock": 0,
      "paper": 1,
      "scissors": 2
    }
  }



  // update/calculate the probabilities
  calculate_probabilities = (choice) => {
    let matrix = this.matrix;

    //             r,p,s
    //(r)ock:     [x,x,x]
    //(p)aper:    [x,x,x]
    //(s)cissors: [x,x,x]

    // Each row corresponds to rock, paper, and scissors respectively
    // and the same is true for the columns
    
    // A "best guess" can be made on what the user will choose next 
    // based off of what they chose the after their last choice
    // 
    // ex: user sequence: rock -> paper -> paper -> rock -> ?
    // Last time they chose rock, their next choice was paper.
    // Using this (simplified) example we can guess what a user
    // will choose on their next turn based off of previous decisions
    // and probabilities



    // get indices for the row based on the previous choice
    let v1 = matrix[this.choice_dict[choice]][0];
    let v2 = matrix[this.choice_dict[choice]][1];
    let v3 = matrix[this.choice_dict[choice]][2];


    // get probabilities
    let p1 = v1 / (v1 + v2 + v3);
    let p2 = v2 / (v1 + v2 + v3);
    let p3 = v3 / (v1 + v2 + v3);



    if (isNaN(p1))
      p1 = 0;
    
    if (isNaN(p2))
      p2 = 0;

    if (isNaN(p3))
      p3 = 0;

  

    // get the largest probability 
    let largest = Math.max.apply(Math, [p1, p2, p3]);

    // bot chooses paper
    if(largest === p1)
      this.bot_choice = "paper";

    // bot chooses scissors
    if(largest === p2)
      this.bot_choice = "scissors";

    // bot chooses rock
    if(largest === p3)
      this.bot_choice = "rock";

    
  }



  // choose and display the winner
  choose_winner = (choice) => {
    // check for first turn
    if (this.first){
      // signal the first turn
      this.first = false;

      // set the user's choice
      this.user_choice = choice;

      // set the last choice, which is the choice for the first turn
      this.last_choice = choice;

      // choices for first random pick
      let choices = ["rock", "paper", "scissors"]

      // pick a random option
      this.bot_choice = choices[Math.floor(Math.random()*3)];

    } else {

       // set the last choice
      this.last_choice = this.user_choice;

      // calculate probability
      this.calculate_probabilities(this.last_choice);

      // set the current user choice
      this.user_choice = choice;

           // update the matrix
      this.matrix[this.choice_dict[this.last_choice]][this.choice_dict[this.user_choice]]++;
    }


    // keep track of the result for the response text
    let result = "";
    
    // rock options
    if(this.user_choice === "rock" && this.bot_choice === "rock") {
      this.setState({
        response: "We both chose rock. It's a tie :/",
      });
      result = "tie";
    }else if(this.user_choice === "rock" && this.bot_choice === "paper"){
      this.setState({
        response: "I chose paper. You lose :)",
        losses: this.state.losses + 1,
      });
      result = "lose";
    }else if(this.user_choice === "rock" && this.bot_choice === "scissors"){
      this.setState({
        response: "I chose scissors. You win :(",
        wins: this.state.wins + 1,
      });
      result = "win";
    }


    // paper options
    if(this.user_choice === "paper" && this.bot_choice === "paper") {
      this.setState({
        response: "We both chose paper. It's a tie :/",
      });
      result = "tie";
    }else if(this.user_choice === "paper" && this.bot_choice === "scissors"){
      this.setState({
        response: "I chose scissors. You lose :)",
        losses: this.state.losses + 1,
      });
      result = "lose";
    }else if(this.user_choice === "paper" && this.bot_choice === "rock"){
      this.setState({
        response: "I chose rock. You win :(",
        wins: this.state.wins + 1,
      });
      result = "win";
    }

    // scissors options
    if(this.user_choice === "scissors" && this.bot_choice === "scissors") {
      this.setState({
        response: "We both chose scissors. It's a tie :/",
      });
      result = "tie";
    }else if(this.user_choice === "scissors" && this.bot_choice === "rock"){
      this.setState({
        response: "I chose rock. You lose :)",
        losses: this.state.losses + 1,
      });
      result = "lose";
    }else if(this.user_choice === "scissors" && this.bot_choice === "paper"){
      this.setState({
        response: "I chose paper. You win :(",
        wins: this.state.wins + 1,
      });
      result = "win";
    }

    let response_text = document.getElementsByClassName("response")[0];

    // change the color of the results section by toggling classes
    if (result === "win") {

      // add to the bot's loss count
      this.loss_counter++;

      // toggle classes
      response_text.classList.add("win");
      response_text.classList.remove("lose");
      response_text.classList.remove("tie");
    } else if(result === "lose") {

      // toggle classes
      response_text.classList.add("lose");
      response_text.classList.remove("win");
      response_text.classList.remove("tie");
    } else {

      // toggle classes
      response_text.classList.remove("lose");
      response_text.classList.remove("win");
      response_text.classList.add("tie");
    }
  }

  // listen for button clicked
  button_clicked = (event, choice) => {

    // create variable for button
    let button = event.currentTarget;

    // toggle the active button class
    button.classList.toggle("active");

    // toggle again in 200 milliseconds to simulate button press animation
    setTimeout(() => {
      button.classList.toggle("active"); 
    }, 200);

    // choose the winner
    this.choose_winner(choice);
  }

  render(){
    return (
      <div className="App">
        <div className="header">
          <header>
            Rock Paper Scissors!
          </header> 
          <p>
            This is a simple rock paper scissors bot that "learns" how you play by using <a href="https://en.wikipedia.org/wiki/Markov_chain">markov chains</a>.
            It doesn't always win, but it's trying it's best!
          </p>
        </div>
        <div className="button-container">
          <button className="choice-button" onClick={e => this.button_clicked(e,"rock")}>
            <img src={rock} alt="rock"/>
          </button> 
          <button className="choice-button" onClick={e => this.button_clicked(e,"paper")}>
            <img src={paper} alt="paper" className="shift"/>
          </button> 
          <button className="choice-button" onClick={e => this.button_clicked(e,"scissors")}>
            <img src={scissors} alt="scissors"/>
          </button> 
        </div>
        <span className="response">
          {this.state.response}
        </span>
        <div className="win-loss-container">
          <span>
            Wins: {this.state.wins}
          </span>
          <span>
            Losses: {this.state.losses}
          </span>
        </div>
          <div className="credits-container">
          <span><a href="https://github.com/MickNorris/rock-paper-scissors-ai">Code on Github</a></span>
        </div>

      </div>
    );
  }
}

export default App;
