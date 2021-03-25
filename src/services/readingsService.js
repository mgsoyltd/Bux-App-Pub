import http from "./httpService";

const apiEndPoint = "/readings";

function getReadingsUrl(id) {
    return `${apiEndPoint}/${id}`;
}

function getReadingsExpandUrl(id) {
    return `${apiEndPoint}/${id}?$expand=*`;
}

function getReadingsExpandAllUrl() {
    return `${apiEndPoint}?$expand=*`;
}

export const getReadings = async () => {
    try {
        const res = await http.get(apiEndPoint);
        return res;
    } catch (err) {
        return err;
    }
}

export const getReadingsByUser = async () => {
    try {
        const res = await http.get(getReadingsExpandAllUrl());
        // console.log(JSON.stringify(res));
        return res;
    } catch (err) {
        return err;
    }
}

export const getReading = async (id) => {
    try {
        const res = await http.get(getReadingsExpandUrl(id));
        return res;
    } catch (err) {
        return err;
    }
}

export const saveReading = async (readings) => {
    console.log("<<<SAVEREADINGS>>>", readings);
    if (readings._id) {
        // Update the readings data
        const body = { ...readings };
        delete body._id;
        delete body.title;
        delete body.ISBN;
        delete body.author;
        delete body.description;
        delete body.imageURL;
        delete body.pages;
        delete body.image;
        // console.log("<<<BODY>>>", body);
        try {
            const resPut = await http.put(getReadingsUrl(readings._id), body);
            // console.log("<<<SAVEREADINGS:resPut>>>", resPut);
            return resPut.data;
        }
        catch (errPut) {
            console.log("<<<SAVEREADINGS:errPut>>>", errPut);
            return errPut;
        }
    } else {
        try {
            const resPost = await http.post(apiEndPoint, readings);
            // console.log("<<<SAVEREADINGS:resPost>>>", resPost);
            return resPost.data;
        }
        catch (errPost) {
            console.log("<<<SAVEREADINGS:errPost>>>", errPost);
            return errPost;
        }
    }
}

export const deleteReading = async (id) => {
    try {
        const res = await http.delete(getReadingsUrl(id));
        return res.data;
    } catch (err) {
        return err;
    }
}
