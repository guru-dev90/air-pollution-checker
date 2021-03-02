

<br />
<p align="center">

  <h3 align="center">Air Quality Checker</h3>

  <p align="center">
    An awsome web-application to check the air quality in any place in the world !
    <br />
    <a href="https://github.com/guru-dev90/air-pollution-checker"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/guru-dev90/air-pollution-checker">View Demo</a>
    ·
    <a href="https://github.com/guru-dev90/air-pollution-checker/issues">Report Bug</a>
    ·
    <a href="https://github.com/guru-dev90/air-pollution-checker/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project


The project has the goal to verify the current air pollution state in a given location using API publicly available at the <b>World Air Quality Index Project.</b>
<br>You can check the current air pollution quality by either using your device location data or providing a location of your choice in the input box.
<br>Please remember, the air pollution data displayed are historical and they always reference the data provided by the nearest measuring station.



### Built With

* [Bootstrap](https://getbootstrap.com)
* [Webpack](https://webpack.js.org/)
* [Axios](https://www.npmjs.com/package/axios)
* [Lodash](https://lodash.com/)
* [Mathjs](https://mathjs.org/)
* [Here Geocoding/Reverse Geocoding Api](https://developer.here.com/)
* [Aqicn Air Pollution Api](https://aqicn.org/json-api/doc/)




<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

The application has been developed and tested on Node version 13.14.0 that is available here for download:

      https://nodejs.org/uk/blog/release/v13.14.0/


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/guru-dev90/air-pollution-checker
   ```

2. Get your api keys using the following links:

   JAVASCRIPT HERE API KEY:  https://developer.here.com/tutorials/getting-here-credentials/#signing-up-and-getting-your-api-key <br><br>
   WAQI API KEY:  https://aqicn.org/data-platform/token/#/

3. Create a file named .env with the following content
   ```sh
   HERE_SERVICE_APIKEY="your here service api key"
   WAQI_SERVICE_APIKEY="your waqi service api key"
   ```

4. Install NPM packages
   ```sh
   npm install
   ```


<!-- USAGE EXAMPLES -->
## Usage

Build the project with one of the following
   ```sh
   npm run dev        ( for development )
   npm run build      ( for production )
   ```


<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/guru-dev90/air-pollution-checker/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Umberto Giacomini - giacominiu@gmail.com

Project Link: [https://github.com/guru-dev90/air-pollution-checker](https://github.com/guru-dev90/air-pollution-checker)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* I want to thank all the great guys at start2impact for inspiring me to develop this project




