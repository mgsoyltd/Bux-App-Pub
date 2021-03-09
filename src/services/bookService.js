import http from "./httpService";

const apiEndPoint = "/books";

function getBookUrl(id) {
    return `${apiEndPoint}/${id}`;
}

function getBookImageUrl(id) {
    return `${apiEndPoint}/upload/${id}`;
}

export const getBooks = async () => {
    try {
        const res = await http.get(apiEndPoint);
        return res;
    } catch (err) {
        return err;
    }
}

export const getBook = async (id) => {
    try {
        const res = await http.get(getBookUrl(id));
        return res;
    } catch (err) {
        return err;
    }
}

export const saveBookImage = async (book, file) => {
    if (book._id && file) {
        console.log("<<<SAVEBOOKIMAGE>>>", book, file);
        // Update image to existing book
        const body = { ...file };
        // If all worked, the response s/b imageURL
        try {
            const res = await http.post(getBookImageUrl(book._id), file,
                {
                    onUploadProgress: progressEvent => {
                        console.log('Upload Progress: ' + Math.round(progressEvent.loaded / progressEvent.total * 100) + '%');
                    }
                })
            return res.data;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
    return null;    // Book does not exist 
}

export const saveBook = async (book, fdImage) => {
    console.log("<<<SAVEBOOK>>>", book);
    if (book._id) {
        if (fdImage) {
            // Upload the image first and then bind the URL to the book
            try {
                const resImage = await saveBookImage(book, fdImage);
                if (resImage) {
                    // Bind the imageURL to the book
                    book.imageURL = resImage;
                    console.log("saveBookImage", resImage);
                }
            } catch (err) {
                console.log(err);
            }
        }
        // Update the book data
        const body = { ...book };
        delete body._id;
        try {
            const resPut = await http.put(getBookUrl(book._id), body);
            console.log("<<<SAVEBOOK:resPut>>>", resPut);
            return resPut.data;
        }
        catch (errPut) {
            console.log("<<<SAVEBOOK:errPut>>>", errPut);
            return errPut;
        }
    } else {
        try {
            const resPost = await http.post(apiEndPoint, book);
            console.log("<<<SAVEBOOK:resPost>>>", resPost);
            return resPost.data;
        }
        catch (errPost) {
            console.log("<<<SAVEBOOK:errPost>>>", errPost);
            return errPost;
        }
    }
}

export const deleteBook = async (id) => {
    try {
        const res = await http.delete(getBookUrl(id));
        return res.data;
    } catch (err) {
        return err;
    }
}
