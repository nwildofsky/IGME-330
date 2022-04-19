import * as matrix from './matrix.js'

// https://math.stackexchange.com/questions/296794/finding-the-transform-matrix-from-4-projected-points-with-javascript
// http://jsfiddle.net/dFrHS/1/
// https://franklinta.com/2014/09/08/computing-css-matrix3d-transforms/

// Solve
//       | x1 x2 x3|   | Lambda|   | x4 |
//       | y1 y2 y3| * | Mu    | = | y4 |
//       | 1  1  1 |   | Tau   |   | 1  |
// for lambda, mu, and tau, then scale first matrix columns by those values
function basisToPoints(x1, y1, x2, y2, x3, y3, x4, y4) {
    const m = matrix.createMatrix([x1,y1,1], [x2,y2,1], [x3,y3,1]);
    const v = matrix.multiplyVectorMatrix([x4,y4,1], matrix.invertMatrix(m));
    const scale = matrix.createMatrix([v[0][0],0,0], [0,v[0][1],0], [0,0,v[0][2]]);
    return matrix.multiplyMatrix(m, scale);
}

// Outputs a css matrix3d formatted perspective transformation with the given coordinates
export function getProjectionMatrix(
                x1s, y1s, x1d, y1d,
                x2s, y2s, x2d, y2d,
                x3s, y3s, x3d, y3d,
                x4s, y4s, x4d, y4d) {
        // Compute matrices to map from basis vectors ((1,0,0) (0,1,0) (0,0,1) (1,1,1))
        // to both source and destination positions
        const source = basisToPoints(x1s, y1s, x2s, y2s, x3s, y3s, x4s, y4s);
        const destination = basisToPoints(x1d, y1d, x2d, y2d, x3d, y3d, x4d, y4d);

        // Compute the combined matrix C
        const c = matrix.multiplyMatrix(destination, matrix.invertMatrix(source));
        // Convert the C matrix to css matrix3d
        //      Matrix Notation           Converted to my matrix implementation
        // | C(1,1) C(1,2) 0 C(1,3) |        | C[0][0] C[0][1] 0 C[0][2] |
        // | C(2,1) C(2,2) 0 C(2,3) | --->   | C[1][0] C[1][1] 0 C[1][2] |
        // | 0      0      1     0  | --->   | 0       0       1       0 |
        // | C(3,1) C(3,2) 0 C(3,3) |        | C[2][0] C[2][1] 0 C[2][2] |
        //                                   ^ Flipped for some reason
        const m = `matrix3d(${c[0][0]},${c[0][1]},0,${c[0][2]},
                            ${c[1][0]},${c[1][1]},0,${c[1][2]},
                            0,         0,         1,         0,
                            ${c[2][0]},${c[2][1]},0,${c[2][2]})`;
        return m;
    }