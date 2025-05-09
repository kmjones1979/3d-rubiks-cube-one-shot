# 3D Interactive Rubik's Cube

This is a web application featuring a fully interactive 3D Rubik's Cube. Users can manipulate the cube in 3D space, perform standard Rubik's Cube moves, and see the moves animated in real-time. The application also tracks the number of moves made and provides an option to reset the cube to its solved state.

## Key Features

-   **3D Cube Rotation**: Orbit controls allow users to rotate the entire Rubik's Cube to view it from any angle.
-   **Standard Cube Moves**: Intuitive UI controls enable standard Rubik's Cube face rotations (U, D, L, R, F, B) including prime (e.g., U') and double (e.g., U2) moves.
-   **Move Animation**: Each move is visually animated, showing the cubies turning to their new positions and orientations.
-   **State Tracking**: The application accurately updates and maintains the cube's state after each move.
-   **Move Counter**: The number of moves made by the user is tracked and displayed.
-   **Reset Functionality**: A reset button allows users to return the cube to its initial solved state at any time.
-   **Responsive UI**: The interface is designed to be responsive for a good experience across different screen sizes.

## Technology Stack

-   **Frontend Framework**: [Next.js](https://nextjs.org/) (with React)
-   **3D Rendering**: [Three.js](https://threejs.org/) via [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
-   **3D Helpers & Controls**: [React Three Drei](https://github.com/pmndrs/drei)
-   **Animation**: [React Spring](https://www.react-spring.dev/)
-   **State Management**: [Valtio](https://valtio.pmnd.rs/)
-   **Language**: TypeScript
-   **Styling**: CSS Modules

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18.17.0 or later recommended, as per Next.js requirements)
-   npm or yarn (this project uses npm in its scripts)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/kmjones1979/3d-rubiks-cube-one-shot.git
    cd 3d-rubiks-cube-one-shot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

Once the dependencies are installed, you can start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the app in development mode.
-   `npm run build`: Builds the app for production.
-   `npm run start`: Starts the production server (after building).
-   `npm run lint`: Lints the project files using Next.js's built-in ESLint configuration.

## Project Structure (Simplified)

```
/public
    /favicon.ico
/src
    /components
        /Controls
            CubeControls.module.css
            CubeControls.tsx
        /RubiksCube
            Cubie.tsx
            RubiksCube.tsx
    /pages
        _app.tsx      # (Implicitly, if customizations were made)
        index.tsx     # Main page
    /store
        cubeStore.ts  # Valtio store for cube state and logic
    /styles
        Home.module.css
        globals.css   # (If it exists)
.gitignore
next-env.d.ts
next.config.js
package.json
README.md
tsconfig.json
```
