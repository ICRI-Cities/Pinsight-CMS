import { Component } from 'react'
import * as firebase from 'firebase'

export default class TestArray extends Component {

  constructor(props) {
    super(props);

    this.state = {items:[]};

    var updates = {};
    window.database.ref("/dialogues").on("value", (value) => {
      
      var v = value.val();
      var keys = Object.keys(v);

      for (var i = 0; i < keys.length; i++) {
        var dialogue = v[keys[i]];
        var cardKeys = Object.keys(dialogue.cards);
        for (var k = 0; k < cardKeys.length; k++) {
          updates["/dialogues/"+keys[i]+"/cards/"+ cardKeys[k]] = {
            id: cardKeys[k],
            order: k
          }
        }
      }
    window.database.ref().update(updates)
  })

    // window.database.ref("/test").on("value", (value) => {
    //   var v = value.val();
    //   var keys = Object.keys(v);
    //   var items = keys.map((key) => {
    //     return {...v[key], id: key
    //     }
    //   });
    //   this.setState({items:items});
    // })
  }


  splice = (index, item) => {

    if (index > this.state.items.length || index == -1) {
      alert("invalid index");
      return;
    }

    var items=  this.state.items.map(a => Object.assign({}, a));
    items = items.sort((a, b) => a.order - b.order);

    (item != null) ? items.splice(index+1, 0, item) : items.splice(index, 1);

    this.saveArrayToFirebase(items);
  }


  saveArrayToFirebase = (items) => {
    var sortedItems = items.map((e, i) => {
      e.order = i;
      return e;
    });

    var updates = {};
    sortedItems.forEach((e) => {
      updates[e.id] = e;
    })

    console.log(updates)

    window.database.ref("/test").set(updates);

    this.setState({
      items:sortedItems
    })
  }

  getEmptyCard() {

    return {
      id: window.database.ref('/test/').push().key,
      title:"Example Card",
      createdAt:new Date(),
    };

  }

  render() {
    return (
      <ul>
      {
        this.state.items.map((n,i)=> (
          <li>
          <p> { "title: " + n.title} </p>
          <p> { "order: " + n.order} </p>
          <p> { "createdAt: " + n.createdAt} </p>
          <button onTouchTap={()=>this.splice(n.order)}>delete</button>
          <br/><button onTouchTap={()=>this.splice(n.order, this.getEmptyCard())}>add new card</button>
          </li>
          ))
      }
      </ul>
      )
  }

}
