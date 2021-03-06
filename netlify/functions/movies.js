// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Error: queryStringParameters must include both year and genre` // a string of data
    }
  }
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

    for (let i=0; i < moviesFromCsv.length; i++) {
      // store each movie in memory
      let movie = moviesFromCsv[i]
      // check if the year and genre match the searched parameters, excluding movies with unlisted runtime ("\\N"); if so:
      if (movie.startYear == year && movie.genres.includes(genre) && movie.runtimeMinutes > 0) {
      // add the movie to the array of movies to return, returning only the primary title, year released, and genres of the returned movies:
        returnValue.movies.push(`Primary title:${movie.primaryTitle}, Year released: ${movie.startYear}, Genres: ${movie.genres}`)
        returnValue.numResults = returnValue.numResults + 1
      }
      // if not, return simple error message
      else {
        `Error`
      }
    }

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
    }
  }
}