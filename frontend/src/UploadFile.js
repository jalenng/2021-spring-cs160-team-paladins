import React from 'react';
import './App.css';

export default class UploadFile extends React.Component{
    render(){
      return(
        <div >
          <label>Select the sound notification from computer</label>
           <form method="post" action="#" id="#">
              <div class="form-group files">
                  <input type="file" class="form-control" multiple=""></input>
              </div>
            </form>
        </div> 
      );
    }
  }