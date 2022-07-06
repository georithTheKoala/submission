const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = async (request, h) => {

  // sisi client
  const { 
    name, year, author, summary, publisher, 
    pageCount, readPage, reading
   } = request.payload;

  // sisi server
  const id = nanoid(16);

  if (pageCount === readPage) {
    finished = true;
  } else {
    finished = false;
  }

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id, name, year, author, summary, publisher, 
    pageCount, readPage, finished, reading, 
    insertedAt, updatedAt
  }

  // Jika gagal menambahkan buku karena tidak melampirkan buku
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  // Jika gagal menambahkan buku karena nilai properti readPage > pageCount
  if (readPage > pageCount){
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  // Jika berhasil validasi maka proses input buku akan dimasukkan ke dalam sebuah array
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  // Jika server gagal menambahkan buku karena masalah pada server
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  })

  response.code(500);
  return response;
};

const getAllBook = (request, h) => ({
  // const { id } = request.params;

  status: 'success',
  data: {
    books: books.map((book) => ({id: book.id, name: book.name, publisher: book.publisher})),
  },
});

const getBookById = (request, h) => {
  const { id } = request.params;
  
  const book = books.filter((amount) => amount.id === id)[0];
  
  if(book !== undefined) {
    return {
      status: 'success',
      data: {
        books: books.map((item) => (item.filter({id: item.id, name:item.name, publisher: item.publisher})))
      },
    }
  };

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  })
  
  response.code(404);
  return response;
};

const updateBookById = (request, h) => {
  console.log(`Get book by id`);
};

const deleteBook = (request, h) => {
  console.log(`delete book`);
};

module.exports = {
  addBook,
  getAllBook,
  getBookById,
  updateBookById,
  deleteBook
};