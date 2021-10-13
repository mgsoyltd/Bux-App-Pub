## Introduction

This project is the frontend React app for the Bux - a books reading goals app.\
The Bux API is the backend of this app and book images are stored in the cloud using Cloudinary API.

## Dependencies

In the project directory, run:

### `yarn`

### Environment Variables in Development

In development the following environment variables must be set in file .env.development.local
Template in file "sample .env.development.local"

#### Bux API

    REACT_APP_API_URL="http://localhost:3000/api"
    PORT=3001

#### Cloudinary

    REACT_APP_API_BASE_URL=<Cloudinary API Base URL>
    REACT_APP_API_KEY=<Cloudinary API Key>
    REACT_APP_API_SECRET=<Cloudinary API Secret>
    REACT_APP_API_UPLOAD_PRESET=<Cloudinary Upload Preset>
    REACT_APP_API_CLOUD_NAME=<Cloudinary Cloud Name>

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Deployment

### Environment Variables

In production the following environment variables must be set:

    REACT_APP_API_URL=<Bux API URL>   E.g. https://<appname>.herokuapp.com/api

    REACT_APP_API_BASE_URL=<Cloudinary API Base URL>
    REACT_APP_API_KEY=<Cloudinary API Key>
    REACT_APP_API_SECRET=<Cloudinary API Secret>
    REACT_APP_API_UPLOAD_PRESET=<Cloudinary Upload Preset>
    REACT_APP_API_CLOUD_NAME=<Cloudinary Cloud Name>

### License & copyright

© Copyright Morning Glow Solutions Oy Ltd

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
