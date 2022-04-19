// Matrix 3x3 example
// [1, [4, [7,
//  2,  5,  8,
//  3], 6], 9]
//
// 2D array - an array of matrix columns
// In hindsight I regret choosing columns instead of rows
export function createMatrix() {
    let m = [[]];
    for (let i = 0; i < arguments.length; i++) {
        m[i] = arguments[i];
    }

    return m;
};

// Multiply any 2 compatible matrices
export function multiplyMatrix(a, b) {
    let v1 = [];
    let v2 = [];
    let m = [[]];

    // Multiply matrix a row by row and b column by column
    for (let aRows = 0; aRows < a[0].length; aRows++) {
        for (let aCols = 0; aCols < a.length; aCols++) {
            v1.push(a[aCols][aRows]);
        }
        for (let bCols = 0; bCols < b.length; bCols++) {
            v2 = b[bCols];
            if (!m[bCols]) m[bCols] = [];
            // Create the multiplied matrix left to right, top down
            m[bCols].push(dotProduct(v1, v2));
        }

        v1 = [];
    }

    return m;
};

// Multiple a matrix by a vector
export function multiplyVectorMatrix(v, m) {
    let mv = [];
    let result = [[]];

    // Use the dot product of each row of the matrix with the vector
    for (let rows = 0; rows < m[0].length; rows++) {
        for (let cols = 0; cols < m.length; cols++) {
            mv.push(m[cols][rows]);
        }

        result[0].push(dotProduct(mv, v));
        mv = [];
    }

    return result;
}

// Multiply a matrix by a single value
export function multiplyScalarMatrix(s, m) {
    let result = copyMatrix(m);

    // Multiply every value in the matrix by the scalar
    for (let rows = 0; rows < m[0].length; rows++) {
        for (let cols = 0; cols < m.length; cols++) {
            result[cols][rows] = m[cols][rows] * s;
        }
    }

    return result;
}

// Compute the dot product
export function dotProduct(v1, v2) {
    let dot = 0;
    // Sum the products of every corresponding value in the vectors
    for (let i = 0; i < v1.length; i++) {
        dot += v1[i] * v2[i];
    }
    return dot;
};

// Invert the matrix
export function invertMatrix(m) {
    // If the matrix is square and bigger than 2x2
    if (m.length == m[0].length && m.length > 2) {
        const moc = copyMatrix(m);
        // Create the matric of cofactors by properly signing a new matrix filled
        // with the determinants of the sub matrices of the values in the original matrix
        for (let cols = 0; cols < m.length; cols++) {
            for (let rows = 0; rows < m[0].length; rows++) {
                let sign = cofactorSign(rows, cols);
                moc[cols][rows] = sign * determinant(subMatrix(m, rows, cols));
            }
        }

        // Transpose the matrix to get the adjugate
        const adj = transposeMatrix(moc);

        // Find the determinate using the matrix of cofactors
        // Multiply the first row of original matrix by first row of moc
        let d = 0;
        for (let cols = 0; cols < m.length; cols++) {
            d += m[cols][0] * moc[cols][0];
        }
        // Scale adjugate by 1/determinant if determinate is not 0
        if (d != 0) {
            const inverse = multiplyScalarMatrix(1 / d, adj);
            return inverse;
        }
    }
    // If the matrix is square and 2x2
    // Inverse equals
    //                1/determ. * |  d -b |
    //                            | -c  a |
    else if (m.length == 2 && m[0].length == 2) {
        let inverse = createMatrix([m[1][1], -m[0][1]], [-m[1][0], m[0][0]]);
        const d = determinant(m);
        if (d != 0) {
            inverse = multiplyScalarMatrix(1 / d, inverse);
            return inverse;
        }
    }
}

// Find the adjugate of the matrix (a not properly scaled version of the invert matrix; less costly)
export function adjugateMatrix(m) {
    // If the matrix is square and bigger than 2x2
    if (m.length == m[0].length && m.length > 2) {
        const moc = copyMatrix(m);
        // Create the matric of cofactors by properly signing a new matrix filled
        // with the determinants of the sub matrices of the values in the original matrix
        for (let cols = 0; cols < m.length; cols++) {
            for (let rows = 0; rows < m[0].length; rows++) {
                let sign = cofactorSign(rows, cols);
                moc[cols][rows] = sign * determinant(subMatrix(m, rows, cols));
            }
        }

        // Transpose the matrix to get the adjugate
        const adj = transposeMatrix(moc);
        return adj;
    }
    // If the matrix is square and 2x2
    // Adjugate equals
    //                 |  d -b |
    //                 | -c  a |
    else if (m.length == 2 && m[0].length == 2) {
        let adj = createMatrix([m[1][1], -m[0][1]], [-m[1][0], m[0][0]]);
        return adj;
    }
}

// Recursively finds the determinant of any square matrix
export function determinant(m) {
    // If matrix is bigger than 2x2
    if (m.length > 2) {
        let d = 0;
        // Multiply first row of matrix by each entry's determinant of its sub matrix
        // Then add all even numbered products and subtract all odd numbered products
        // This continues until sub matrix is sized 2x2
        for (let i = 0; i < m.length; i++) {
            let mSub = subMatrix(m, i, i);
            let sign = 1;
            if (i % 2 == 0) sign = 1;
            else sign = -1;
            d = d + sign * (m[i][0] * determinant(mSub));
        }
        return d;
    }
    // If matrix is 2x2 return ad - bc
    else {
        return m[0][0] * m[1][1] - m[1][0] * m[0][1];
    }
}

// Gets the 'sub matrix' of a matrix by excluding the values in a specified row and column
// Example: submatrix at value 'a'
// | a b c|     | O X X |
// | d e f| --> | X e f | --> | e f |
// | g h i|     | X h i |     | h i |
export function subMatrix(m, row, col) {
    let mSub = [[]];
    let subCols = 0;
    let found = false;

    for (let cols = 0; cols < m[0].length; cols++) {
        for (let rows = 0; rows < m.length; rows++) {
            if (rows != row && cols != col) {
                if (!mSub[subCols]) mSub[subCols] = [];
                mSub[subCols].push(m[cols][rows]);
                found = true;
            }
        }
        // Only allows the submatrix to grow if its last column has been filled
        if (found) {
            subCols++;
            found = false;
        }
    }

    return mSub;
}

// Sign table for matrix of cofactors
// Assign a positive or negative value according to this table
// +-+-
// -+-+
// +-+-
// -+-+
export function cofactorSign(row, col) {
    let sign = 1;
    if (col % 2 == 0) {
        if (row % 2 == 0) {
            sign = 1;
        }
        else {
            sign = -1;
        }
    }
    else {
        if (row % 2 == 0) {
            sign = -1;
        }
        else {
            sign = 1;
        }
    }

    return sign;
}

// Transpose a square matrix
export function transposeMatrix(m) {
    let copy = copyMatrix(m);
    // Swaps the positions of elements in the matrix over the diagonal
    for (let rows = 0; rows < m[0].length; rows++) {
        for (let cols = 0; cols < m.length; cols++) {
            copy[cols][rows] = m[rows][cols];
        }
    }

    return copy;
}

// Deep copy a matrix
export function copyMatrix(m) {
    const copy = [];
    for (let i = 0; i < m.length; i++) {
        copy.push(m[i].slice());
    }
    return copy;
}