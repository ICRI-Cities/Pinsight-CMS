import React, { Component } from 'react';
import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';

export default class ImageUploader extends Component {
  state = {
    image: '',
    isUploading: false,
    progress: 0,
    imageURL: ''
  };

  handleUploadStart(){ 
    this.setState({isUploading: true, progress: 0});
  }

  handleProgress(progress) {
    this.setState({progress});
  } 

  handleUploadError(error) {
    this.setState({isUploading: false});
    console.error(error);
  }

  handleUploadSuccess(filename) {
    this.setState({image: filename, progress: 100, isUploading: false});
    firebase.storage().ref('images').child(filename).getDownloadURL().then(url => {
      this.props.onChangeImage({filename, url});
    });
  };

  render() {
    return (
      <div>
        <form>
          {this.state.isUploading &&
            <p>Progress: {this.state.progress}</p>
          }
          {this.props.card.imageURL ? <img height="150" src={this.props.card.imageURL} /> : <div className="ImageUploaderNoImg"><p>No image uploaded</p></div> }
          <FileUploader
            accept="image/*"
            name="image"
            randomizeFilename
            storageRef={firebase.storage().ref('images')}
            onUploadStart={this.handleUploadStart.bind(this)}
            onUploadError={this.handleUploadError.bind(this)}
            onUploadSuccess={this.handleUploadSuccess.bind(this)}
            onProgress={this.handleProgress.bind(this)}
          />
        </form>
      </div>
    );
  }
}

