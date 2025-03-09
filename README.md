# Egg SVG Visualizer

A React application for visualizing SVG designs projected over an egg using Three.js and Vite.

## Overview

Egg SVG Visualizer lets you upload an SVG file and see how it wraps around a 3D egg shape. This project leverages:

- [React](https://reactjs.org/)
- [Three.js](https://threejs.org/)
- [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
- [Vite](https://vitejs.dev/) for fast development and building

## Features

- **SVG Upload:** Easily upload an SVG file to project onto a 3D egg.
- **Interactive Controls:** Adjust egg shape, texture projection, and more in real time.
- **Real-Time 3D Rendering:** Powered by Three.js and react‑three/fiber.
- **Optimized Development:** Uses Vite for a fast development experience.
- **GitHub Pages Ready:** Configured for deployment on GitHub Pages.

## Installation

1. **Clone the repository**

  ```bash
   git clone https://github.com/msurguy/egg-svg-visualizer.git
   cd egg-svg-visualizer
  ```

2. Install dependencies

`npm install`

## Development

Start the development server with:

`npm run dev`

Then open your browser and navigate to <http://localhost:3000> (or the port specified in your terminal).

Build

To create a production build, run:

`npm run build`

You can preview the production build locally with:

`npm run preview`

Deployment to GitHub Pages

This project is set up for deployment on GitHub Pages. The base path is configured in vite.config.js.
 1. Build the project

npm run build

 2. Deploy to GitHub Pages

npm run deploy

Ensure that your repository is configured correctly on GitHub and that you have the correct permissions.

Code Quality

This project uses ESLint to enforce JavaScript and React best practices. To run ESLint across your project files, use:

npx eslint .

Feel free to adjust the ESLint rules in the .eslintrc.js file.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with any suggestions or improvements.

## License

This project is open source and available under the MIT License.
