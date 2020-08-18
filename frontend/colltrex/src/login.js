import React, { Component } from 'react';
import './css/theme.css';
import './css/media.css';
import './css/header.css';
import './css/base.css';
import './css/font-awesome.min.css';
import "slick-carousel/slick/slick.css";  
import "slick-carousel/slick/slick-theme.css";  
import SimpleImageSlider from "react-simple-image-slider";

class login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            islogged: true,
            loadedstatus:'unloaded',
            headersize:"large",
            isMobile:false,
        }
        this.handleloginstatus = this.handleloginstatus.bind(this)
    }
    listenScrollEvent =(event)=>{
        this.setState({
            headersize:"smaller" ,
        })
        if (window.pageYOffset === 0){
            this.setState({
                headersize:"large"
            })
        }
      }
    componentDidMount(){
        this.setState({
            loadedstatus:'loaded',
        })
        
        window.addEventListener('resize', () => {
            this.setState({
                isMobile: window.innerWidth < 1200
            });
        }, false);
        window.addEventListener('scroll', this.listenScrollEvent)
      
    }
    handleloginstatus = (event) => {
        window.open(`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`, "_self")
    }
    render() {
        var images_slide= [
            {url:require("./img/Slider-img1.jpg")},
            {url:require("./img/Slider-img2.png")}
        ]
        return (
            <div className={this.state.loadedstatus}>
                <div class="DesignHolder">
          <div class="LayoutFrame">
            
            <header className={this.state.headersize}>
              <div class="Center">
                <div class="site-logo">
                  <h1><a href="#">Git<span>C</span>onnect</a></h1>
                </div>
                <div id={this.state.isMobile ? 'mobile_sec' : ''}>
                  <div class={this.state.isMobile ? "mobile" : ''}><i className={this.state.isMobile ? "fa fa-bars" : ''}></i><i className={this.state.isMobile ? "fa fa-times" : ''}></i></div>
                  <div class={this.state.isMobile ? "menumobile" : ''}>
                    <nav class="Navigation">
                      <ul>
                        <li class="active">
                          <a href="#home">Home</a>
                          <span class="menu-item-bg"></span>
                        </li>
                        <li>
                          <a href="#services">Services</a>
                          <span class="menu-item-bg"></span>
                        </li>
                        <li>
                          <a href="#contact">Contact</a>
                          <span class="menu-item-bg"></span>
                        </li>
                        <li>
                          <a href="/dashboard">Dashboard</a>
                          <span class="menu-item-bg"></span>
                        </li>
                        <li>
                          <a href="/newidea">New Idea</a>
                          <span class="menu-item-bg"></span>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
                <div class="clear"></div>
              </div>
            </header>
                <div class="Banner_sec" id="home">

            <div class="bannerside">
	            <div class="Center">
                    <div class="leftside">
                        <h3>Welcome to small step of atmanirbhar bharat:<span>GitConnect</span></h3>
                        <p>Gitconnect is for you and give solution to your problems by giving problems too!</p>
                        <button class="button button2" onClick={this.handleloginstatus}>Connect with Github</button>
                    </div>                        								
                    <div class="rightside">
                        <div id="slider">
                        <SimpleImageSlider className="Slider"
                            width={700}
                            height={500}
                            images={images_slide}
                        /> 
                        </div>
                                                       
            	        <figure><img src={require("./img/Shadow-img.png")}  alt="image" class="Shadow"/></figure>                                                        
                    </div>
	            </div>
            </div>
            <div class="clear"></div>
        </div>
         <div class="bgcolor"></div>
        <div id="Container">
            <div class="About_sec" id="about">
                <div class="Center">            	
                    <h2>about us</h2>            		
                    <p>Millions of people want to get direction and </p> <div class="Line"></div>	
                    <div class="Tabside">
                        <ul>
                            <li><a href="javascript:;" class="tabLink activeLink" id="cont-1">Mision</a></li>
                            <li><a href="javascript:;" class="tabLink" id="cont-2">vision</a></li>
                          
                        </ul>
                      <div class="clear"></div>
                        <div class="tabcontent" id="cont-1-1">
                            <div class="TabImage">
                                <div class="img1">
                                    <figure><img src= {require("./img/about-img2.jpg")} alt="image"/></figure>	
                                </div>
                                <div class="img2">
                                    <figure><img src={require("./img/about-img1.png")} alt="image"/></figure>
                                </div>
                            </div>
                            <div class="Description">
                    
                                <p>GitConnect is platform for you to connect and work with people across the world</p>
                            </div>
                        </div>
                        <div class="tabcontent hide" id="cont-2-1">
                            <div class="TabImage">
                                <div class="img1">
                                    <figure><img src={require("./img/about-img2.jpg")} alt="image"/></figure>	
                                </div>
                                <div class="img2">
                                    <figure><img src={require("./img/about-img1.png")} alt="image"/></figure>
                                </div>
                            </div>
                            <div class="Description">
                              <p>GitConnect is platform for you to connect and work with people across the world</p>
                            
                            </div>
                        </div>
                        
	                    <div class="clear"></div>	
                    </div>                    
                </div>
            </div>
        <div class="Services_sec" id="services">
            <div class="Center">
                <h2>our Services</h2>
                <p>GitConnect is all you are looking for ...</p>
				<div class="Line"></div>
                <div class="Serviceside">
                    <ul>
	                    <li class="Development"><a href="#services"><h4>Connect</h4></a></li>
    	                <li class="Desdin"><a href="#services"><h4>Explore</h4></a></li>
	                    <li class="Concept"><a href="#services"><h4>Idea</h4></a></li>
	                    <li class="System"><a href="#services"><h4>Develop</h4></a></li>
                    </ul>
                </div> 
                </div>               
            </div>
        <div class="Contact_sec" id="contact">
            <div class="Contactside">
                <div class="Center">
                    <h2>contact us</h2>
                    <p>We are the members of Cubix.</p>
                    <div class="Line"></div>
                </div>  

            </div>
                <div class="Get_sec">
                    <div class="Mid">					
                        <div class="Leftside">
                            <form action="#">
                                <fieldset>
                                    <p><input type="text" value="" placeholder="NAME" class="field"/></p>
                                    <p><input type="email" value="" placeholder="EMAIL" class="field"/></p>
                                    <p><textarea cols="2"  rows="2" placeholder="MESSAGE"></textarea></p>
                                    <p><input type="submit" value="send" class="button"/></p>
                                </fieldset>
                            </form>
                        </div>
						  <div class="Rightside">
                            <h3>Reach us ! !</h3>
                          
                                <address class="Email">
                                    // eslint-disable-next-line
                                    <a href="mailto: abc@gmail.com"></a>
                                </address>	
                                <div class="clear"></div>
                                <ul>
                                    // eslint-disable-next-line
                                    <li><a href="#"><img src={require("./img/th.png" )} alt="thg"/> Gitconnect_cubix</a></li>
                                  
                                </ul>
                        </div>
                    </div>
                    <footer>
                        <div class="Cntr">                
                            <p> COMPANY NAME. DESIGN: <a rel="nofollow" href="github" target="_parent">Cubix</a></p>
                        </div>
                    </footer>
                </div>
            
            </div>
        </div>
	</div>
</div>

<div id="loader-wrapper">
<div id="loader"></div>

    <div class="loader-section section-left"></div>
    <div class="loader-section section-right"></div>

</div>
</div>
        )
    }
}
export default login
