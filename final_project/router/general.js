const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username , password} = req.body
  users.push({
    username,password
  })
  res.send("user successfully registered")
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try {
    const response = await axios.get(books)
    const books = response.data;
    res.json(books);
  } catch (error) {
    console.error("Error while fetching books:", error);
    res.status(500).json({ message: "Internal error" });
  }
});

public_users.get('/user',function (req, res) {
    res.send(users)
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn
  res.send(books[isbn])
  try {
    const respose = await axios.get(books[isbn])
    const details = respose.data
    if(details){
        res.json(details)
    }
  } catch (error) {
    console.error("error when fetching data")
  }   
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  let author = req.params.author
  let author_ = Object.values(books).filter(
    book => book.author === author
  )
  try {
    const response = await axios.get(author_)
    const booksAuth = response.data
    if(booksAuth){
        res.json(booksAuth)
    }
  } catch (error) {
    console.error("error while fetching books by authors")
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    let title = req.params.title
    let title_ = Object.values(books).filter(
      book => book.title === title
    )
    try {
        const response = await axios.get(title_)
        const booksTitle = response.data
        if(booksTitle){
            res.json(booksTitle)
        }
      } catch (error) {
        console.error("error while fetching books by title")
      }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  let book = Object.values(books).filter(
    book => book.isbn === isbn
  )
  if(book){
    const bookrev = book.reviews
    res.send(bookrev)
  }
});

module.exports.general = public_users;
