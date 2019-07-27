import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import SearchField from './SearchField';
import escapeRegExp from 'escape-string-regexp';
import MenuBar from './MenuBar';

class App extends Component {

  state = {
    venues: [],
    query: '',
    markers: []
  }

  componentDidMount(){
    this.getVenues();
  }

  /*loading the script and initializing the map*/
  loadMap = () =>{
    loadScript ("https://maps.googleapis.com/maps/api/js?key=AIzaSyA7UvgrutCeaJTAfnqvkSB1i7fgKFXgLko&callback=initMap")
    window.initMap = this.initMap;
  }

  /*endPoint & parameters are set following the guidelines in Foursquare*/
  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "JWWFF4QXQZVJN2XJLIMR4RKDVRMIANWVMWG3DQMQE4NU0XQD",
      client_secret: "XQ41LIDQYSQFQDMFPETIUUDSIV5BWQLSDV33HNCFAE23SNPB",
      query: "restaurant",
      ll: "39.74460,-75.539787",
      v: "20190722",
      limit: 7
    }

    /*used axios which is similar to fetch API*/
    axios.get(endPoint + new URLSearchParams(parameters))
    .then(response => {
      this.setState({
        venues: response.data.response.groups[0].items,
        displayVenues: response.data.response.groups[0].items
      }, this.loadMap())
    })
    .catch(error => {
      console.log("Foursquare error! " + error)
    })
  }

  /*Creating map with center coordinate of wilmington,delaware*/
  initMap = () => {
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 39.74460, lng: -75.539787},
      zoom: 14
    });

    /*creating info-window*/
    var infowindow = new window.google.maps.InfoWindow();

    // eslint-disable-next-line
    this.state.venues.map(selectedVenue => {

      var contentString = `<strong>${selectedVenue.venue.name}</strong> <br>
                        <em>${selectedVenue.venue.location.address}</em>`                        

      /*creating markers*/
      var marker = new window.google.maps.Marker({
        position: {lat: selectedVenue.venue.location.lat, lng: selectedVenue.venue.location.lng},
        map: map,
        title: selectedVenue.venue.name
      })    

      this.state.markers.push(marker)

      /*creating animation*/
      function animation_effect(){
        marker.setAnimation(window.google.maps.Animation.BOUNCE)
        setTimeout(function(){ marker.setAnimation(4) })
      }          

      /*click on marker*/
      marker.addListener('click', function() {
        infowindow.setContent(contentString)
        animation_effect()
        infowindow.open(map,marker)
        })  
    })
}

/*Filter a new array of current places based on user query*/
onQuery = query => {
  this.setState({ query })
  this.state.markers.map(marker => marker.setVisible(true))
  var locationFilter
  var unselectedLocations

  if (query) {
    const match = new RegExp(escapeRegExp(query), "i")
    locationFilter = this.state.venues.filter(selectedVenue =>
      match.test(selectedVenue.venue.name)
    )
    this.setState({ venues: locationFilter })
    unselectedLocations = this.state.markers.filter(marker =>
      locationFilter.every(selectedVenue => selectedVenue.venue.name !== marker.title)    
    )
 
  /*Hiding not selected markers*/
   unselectedLocations.forEach(marker => marker.setVisible(false))

    this.setState({ unselectedLocations })
  } 
  else {
    this.setState({ venues: this.state.displayVenues })
    this.state.markers.forEach(marker => marker.setVisible(true))
  }
}

  render(){
    return(
      <main>
        <div id="header" aria-label="Header" tabIndex='0'>
          <h3>Restaurants in Wilmington</h3>
        </div>

        <div id="SearchField" aria-label="Search Field">
          <SearchField
            venues={ this.state.displayVenues } 
            markers={ this.state.markers } 
            locationFilter = {this.locationFilter}
            query={this.state.query}
            onQuery={q => this.onQuery(q)}
          />
        </div>          
        
        <div id="container" aria-label="Menu Container">
          <MenuBar 
            venues={ this.state.venues }
            markers={ this.state.markers }
          />
        </div>

       <div id="map" aria-label="Map" role="application"></div>

      </main>
    );
  }
}

/*using loadScript function to get the url and insertBefore to put the script to the top of the list*/
function loadScript(url) {
    var index  = window.document.getElementsByTagName("script")[0]
    var script = window.document.createElement("script")
    script.src = url
    script.async = true
    script.defer = true
    index.parentNode.insertBefore(script, index)
    script.onerror = function() {
    alert("Error while loading map! Check the URL!");
  };
}

export default App;
