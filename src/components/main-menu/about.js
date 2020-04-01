import React, { Component } from 'react'
import { Link } from 'react-router-dom'

const h1Style = {
    display:"block",
    color:"darkblue",
    fontWEIGHT:"bold"
}
const buttonStyle = {
    backgroundColor:"lightBlue",
    color:"white",
    padding:"8px",
    border:"black",
    textAlight:"center",
    margin:"4px 2px",
    borderRadius:"12px"
}

class About extends Component {
  render() {
    return (
      <div>
        <h1 style={h1Style}> About us </h1>
        <div className="elementor-widget-container">
    			<p><strong>SonShine: bringing light to the world in their memory</strong>, was founded by Bat-Galim and Ophir Shaer in memory of their son Gil-ad, one of the three boys kidnapped and murdered in the summer of 2014.</p>
          <p>“<strong>During the eighteen <em>(chai), </em>days of searching, worrying and not knowing what had happened to the kidnapped boys, we experienced unprecedented support from Jews all over the world. This was absolute proof of the strong feelings of mutual responsibility and the global connection felt by Jews throughout the world. Our goal is to encourage and leverage this connection and strength.</strong></p>
          <p><strong>The strength we discovered as individuals and as a nation during those difficult eighteen days, and the optimistic approach we chose after discovering the bitter fate of the boys, must inform our day to day lives and strengthen the spirit of every Jew throughout the world</strong>.” &nbsp;Bat-Galim Shaer</p>
          <p><img className="wp-image-1024 alignright" src="http://sonshine.org.il/wp-content/uploads/2019/07/תמונה-זוגית-מיכל-גלעדי.jpg" alt="" width="569" height="379" srcSet="http://sonshine.org.il/wp-content/uploads/2019/07/תמונה-זוגית-מיכל-גלעדי.jpg 1600w, http://sonshine.org.il/wp-content/uploads/2019/07/תמונה-זוגית-מיכל-גלעדי-300x200.jpg 300w, http://sonshine.org.il/wp-content/uploads/2019/07/תמונה-זוגית-מיכל-גלעדי-768x512.jpg 768w, http://sonshine.org.il/wp-content/uploads/2019/07/תמונה-זוגית-מיכל-גלעדי-1024x682.jpg 1024w" sizes="(max-width: 569px) 100vw, 569px" /></p>
          <p>Bat-Galim (47) an educator and social activist and her husband, Ophir (48) a lawyer and tax specialist established the organization to enhance optimism and a sense of unity in Israel and throughout the world.&nbsp; Its goal is to encourage a positive and constructive approach especially during times of crisis and challenge. They are the parents of six children and are among the founders and promoters of “Unity Day” and the “Jerusalem Prize for Jewish Unity.</p>
          <p>Bat-Galim has been its CEO since its beginning. She is an educator for over twenty years with a B.A. in History and Political Science and an M.A. in Educational Administration. She lectures in Israel and throughout the world to promote dialogue and projects to foster Jewish unity.</p>
          <p>The activities of the three families to promote unity and connections within Israeli society and throughout the world was formally recognized by the Government of Israel when the three mothers were honored by the privilege of lighting a torch at the National Independence Day Celebration in 2019.</p>
          <p>Sonshine continues to work on projects and new initiatives to foster optimism and unity among the Jewish people.</p>
          <p><iframe src="https://www.youtube.com/embed/SQuo9tAFJMA" width="560" height="315" frameBorder="0" allowFullScreen="allowfullscreen"></iframe><iframe src="https://www.youtube.com/embed/I6fOafWrTOI" width="560" height="315" frameBorder="0" allowFullScreen="allowfullscreen"></iframe></p>
		    </div>
        <button style={buttonStyle}><Link style={{color:"black"}} to="/menu">Retrun to main Menu</Link></button>
      </div>
    )
  }
}
export default About