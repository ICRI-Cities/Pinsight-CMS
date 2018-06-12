## Pinsight CMS


The app is built in ES6 and uses [React](https://facebook.github.io/react/) and [Redux](https://github.com/rackt/redux) 

For a gentle introduction I highly recommend the Lynda.com tutorials on [React](https://www.lynda.com/React-js-tutorials/) and [Redux](https://www.lynda.com/React-js-tutorials/Learning-Redux/540345-2.html) and the official documentation for both.

Reducers and data normalization are implemented according to the [Redux guide](http://redux.js.org/docs).

Routing is handled by [react-router](https://github.com/reacttraining/react-router)

Asynchronous requests are handled by the [redux-thunk](https://github.com/gaearon/redux-thunk) middleware

The UI components are styled and rendered using [Material UI](http://www.material-ui.com/)

All the icons used in the app are from the Material UI library. A reference sheet for these icons can be found [here](https://material.io/icons/).

### Working prototype

[http://bit.do/pinsight2](http://bit.do/pinsight2)

### To run the app

1. `npm install`
2. `npm start`
3. Go to [http://localhost:3000/](http://localhost:3000/)

### To build the app for deployment

From the repo folder run:  `webpack -p` or `npm run build`
The app uses webpack for minification and optimization. See `webpack.config.js`for the build settings.

### Firebase

Add your Firebase configuration to `config.js`.

The app is hosted on Firebase at the following address [pinsight-cf45d.firebaseapp.com](https://pinsight-cf45d.firebaseapp.com)

The database is also hosted on the same site and can be accessed [here](https://console.firebase.google.com/project/pinsight-cf45d/database/data).

To deploy directly to Firebase make sure to have Firebase tools installed:

`npm install -g firebase-tools`

and then deploy using: 

`firebase deploy`



## Data structure

Data is divided in 3 main objects: *devices*, *dialogues* (the content which can be navigated with the 2 buttons on the device), and *cards* (the screens of each dialogue).

Cards have a graph structure as they can point to each other.

Here's an example of data structure for the app.

```javascript

{
    "cards": {
        {firebaseId}: {
            "title": {string},
            "id": {firebaseId},
            "answers": {
                "0": {
                    "label": {string},
                    "link": {firebaseId}
                },
                "1": {
                    "label":  {string},
                    "link": {firebaseId}
                }
            }
        }
        ...
    },

    "devices": {
        {firebaseId}: {
            "name": {string},
            "dialogues": {
                {firebaseId}: {
                    "order": {int}
                },
                {firebaseId}: {
                    "order": {int}
                }
            }
        }
        ...

    },

    "dialogues": {
        {firebaseId}: {
            "id": {firebaseId},
            "title": {string}
            "needsUpdate": {boolean},
            "cards": {
                cardId: {firebaseId}
            }
        }
        ...
    }

    "responses": {
        {firebaseId}: {
            "deviceId": {firebaseId},
            "dialogueId": {firebaseId},
            "cardId": {firebaseId},
            "value": {int},
            "time": {date}
        }
        ...
    }

}
```

### Wireframe and prototype

The interactive prototype is hosted on InVision at the following URL: [https://projects.invisionapp.com/d/main#/projects](https://projects.invisionapp.com/d/main#/projects)


### Assets

Pin icon from [http://www.flaticon.com/free-icon/placeholder_232587#term=location%20pin&page=2&position=59](Flaticon, author Freepik)

### Tests

Device Map
- Move a Pin

Device Editor
- Add new/existing dialogue to device
- Remove dialogue from device
- Change dialogue order
- Rename a dialogue
- Preview a dialogue
- Update device

Dialogue Editor
- Create a card
- Delete a card
- Change card title
- Change card answers
- Add/remove links to next/previous cards
- Switch image/text
- Upload image

