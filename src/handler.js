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

  if (pageCount === readPage) {
    finished = true;
  } else {
    finished = false;
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

const getAllBook = () => ({
  status: 'success',
  data: {
    books: books.map((book) => ({id: book.id, name: book.name, publisher: book.publisher})),
  },
});

const getBookById = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((amount) => amount.id === bookId)[0];
  
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    
    response.code(404);
    return response;
  }
};

const updateBookById = (request, h) => {
  const { bookId } = request.params; 
  
  const { 
    name, year, author, summary, publisher, 
    pageCount, readPage, reading 
  } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (pageCount === readPage) {
    finished = true;
  } else {
    finished = false;
  };

  // [Mandatory] Update Book Without Name
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  };

  // [Mandatory] Update Book With Page Read More Than Page Count
  if (readPage > pageCount){
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  };

  // [Mandatory] Update Book With Complete Data
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name, 
      year, 
      author, 
      summary, 
      publisher, 
      pageCount, 
      readPage, 
      reading,
      updatedAt
    };

    const response = h.response ({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  };

  // [Mandatory] Update Book with Invalid Id
  if (bookId !== undefined) {
    const response = h.response({
      status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
    
      response.code(404);
      return response;
  };
};

const deleteBook = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if(index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBook,
  getAllBook,
  getBookById,
  updateBookById,
  deleteBook
};