var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var _ = require('lodash');
 
var schema = buildSchema(`
  type Query {
    deck: [String]
    draw(noOfCard: Int!): [String]
  }
`);
 
class Deck {
  constructor() {
    this.cards = [];
    this.openPack();
    this.shuffle();
  }

  openPack() {
    this.cards = [];
    for (let i = 1; i <= 13; i++) {
      switch(i) {
        case 1:
          this.initCard('A');
          break;
        case 11:
          this.initCard('J');
          break;
        case 12:
          this.initCard('Q');
          break;
        case 13:
          this.initCard('K');
          break;
        default:
          this.initCard(i);
      }
    }
  }

  initCard(word) {
    this.cards.push(word + '♠');
    this.cards.push(word + '♥');
    this.cards.push(word + '♣');
    this.cards.push(word + '♦');
  }
 
  shuffle() {
    this.cards = _.shuffle(this.cards);
  }

  draw(noOfCard) {
    return this.cards.splice(0, noOfCard);
  }

  toString() {
    return this.cards;
  }
}
 
// The root provides the top-level API endpoints
const deck = new Deck();
var root = {
  hello: () => {
    return `Hello World`;
  },
  deck: () => deck.toString(),

  draw: ({noOfCard}) => {
    return deck.draw(noOfCard);
  }
}
 
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
