import data from './data.js'
import Post from './classes.js'

let container = document.querySelector(".container");

data.comments.forEach((c) => {
   let {currentUser} = data
   let post = new Post(c, currentUser, container)


})
