// Esta función construye una matriz de transfromación de 3x3 en coordenadas homogéneas 
// utilizando los parámetros de posición, rotación y escala. La estructura de datos a 
// devolver es un arreglo 1D con 9 valores en orden "column-major". Es decir, para un 
// arreglo A[] de 0 a 8, cada posición corresponderá a la siguiente matriz:
//
// | A[0] A[3] A[6] |
// | A[1] A[4] A[7] |
// | A[2] A[5] A[8] |
// 
// Se deberá aplicar primero la escala, luego la rotación y finalmente la traslación. 
// Las rotaciones vienen expresadas en grados. 
function BuildTransform( positionX, positionY, rotation, scale )
{

	var matRot = Array( Math.cos(rotation), -Math.sin(rotation), 0,
						Math.sin(rotation), Math.cos(rotation), 0,
						0,              0,             1);

	var matTras = Array(1, 0, 0,
						0, 1, 0,
						positionX, positionY, 1);

	var matScale = Array(scale, 0 ,0,
						 0, scale, 0,
						 0, 0, 1);

	var sScale = ComposeTransforms(matRot, (matTras));  //porque a la traslacion no hay que expresarla en column major?
	var cScale = ComposeTransforms(transpose(matScale), sScale);
	return cScale;
}

// Esta función retorna una matriz que resula de la composición de trasn1 y trans2. Ambas 
// matrices vienen como un arreglo 1D expresado en orden "column-major", y se deberá 
// retornar también una matriz en orden "column-major". La composición debe aplicar 
// primero trans1 y luego trans2. 
function ComposeTransforms( trans1, trans2 )
{
	return transpose(composition (transpose(trans2), transpose(trans1)));
}

function composition(matrixA, matrixB){
	var comp = Array(0,0,0,0,0,0,0,0,0);

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			var acum = 0;
			for (var k = 0; k < 3; k++) {
				acum = acum + matrixA[3*i+k] * matrixB[3*k+j];
			}
			comp[3*i+j] = acum;
		}
	}

	return comp;
}


function transpose(matrix)
{
	return Array(matrix[0], matrix[3], matrix[6],
				 matrix[1], matrix[4], matrix[7],
				 matrix[2], matrix[5], matrix[8]);
}
