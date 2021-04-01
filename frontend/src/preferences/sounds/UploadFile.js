import React from 'react';
import '../../App.css'

export default class UploadFile extends React.Component{
    render(){
      return(
        <div >
          <label>Select the sound notification from computer</label>
           <form method="post" action="#" id="#">
              <div className="form-group files">
                  <input type="file" className="form-control" multiple=""></input>
              </div>
            </form>
        </div> 
      );
    }
  }