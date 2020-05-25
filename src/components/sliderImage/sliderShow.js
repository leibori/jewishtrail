import React from 'react';
import { Slide } from 'react-slideshow-image';
 
// proprites for featurs on slider
const properties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true,
  pauseOnHover: true,
  onChange: (oldIndex, newIndex) => {
    //console.log(`slide transition from ${oldIndex} to ${newIndex}`);
  }
}
const Slidershow = (props) => {
   // extarct the array from user.
    const {slideImages} = props
    return (
      <div className="slide-container">
        <Slide {...properties}>
        {
          /* iterate over the photos of the road and display it on the top of the road page */
            slideImages.map((siteImage, i) => {
                return (
                <div className="each=slider" key={i}>
                    <div className="image-container" style={{height:'280px',minHeight:'280px',maxHeight: '280px', width: '100%',outline:'none',margin:'auto'}}>
                    <img src= {siteImage}></img>
                    </div>
                </div> ) 
            })
        }    
        </Slide>
    </div>
    );
}
export default Slidershow