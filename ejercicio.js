// La imagen que tienen que modificar viene en el parámetro image y contiene inicialmente los datos originales
// es objeto del tipo ImageData ( más info acá https://mzl.la/3rETTC6  )
// Factor indica la cantidad de intensidades permitidas (sin contar el 0)
const channels = 4;

function dither(image, factor) {

	for (var x = 0; x < image.height; x++) {
		for (var y = 0; y < image.width; y++) {

			var palette = calculatePalette(factor);
			quant_error = updatePixel(image, x, y, palette);

			if (x + 1 < image.height) {
				ditherPixel(image, x + 1, y, quant_error, 5 / 16);
			}
			if (y > 0 && x + 1 < image.height) {
				ditherPixel(image, x + 1, y - 1, quant_error, 3 / 16);
			}
			if (y + 1 < image.width) {
				ditherPixel(image, x, y + 1, quant_error, 7 / 16);
			}
			if (x + 1 < image.height && y + 1 < image.width) {
				ditherPixel(image, x + 1, y + 1, quant_error, 1 / 16);
			}
		}
	}
}


function ditherPixel(image, row, col, quantError, value) {
	image.data[((row * (image.width * channels)) + (col * channels)) + 0] += quantError[0] * value;
	image.data[((row * (image.width * channels)) + (col * channels)) + 1] += quantError[1] * value;
	image.data[((row * (image.width * channels)) + (col * channels)) + 2] += quantError[2] * value;
}


function updatePixel(image, row, col, palette) {
	oldpixelR = image.data[((row * (image.width * channels)) + (col * channels)) + 0];
	oldpixelG = image.data[((row * (image.width * channels)) + (col * channels)) + 1];
	oldpixelB = image.data[((row * (image.width * channels)) + (col * channels)) + 2];

	newpixelR = getNearestColor(palette, oldpixelR);
	newpixelG = getNearestColor(palette, oldpixelG);
	newpixelB = getNearestColor(palette, oldpixelB);

	quant_error = [oldpixelR - newpixelR,
		oldpixelG - newpixelG,
		oldpixelB - newpixelB
	];

	image.data[((row * (image.width * channels)) + (col * channels)) + 0] = newpixelR;
	image.data[((row * (image.width * channels)) + (col * channels)) + 1] = newpixelG;
	image.data[((row * (image.width * channels)) + (col * channels)) + 2] = newpixelB;

	return quant_error;
}

function calculatePalette(factor) {
	var palette = [0];
	for (var i = 1; i < factor; i++) {
		palette.push(i * Math.round(256 / factor));
	}
	palette.push(255);
	return palette;
}

function getNearestColor(palette, value) {
	return palette.reduce(function(prev, curr) {
		return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
	});
}


// Imágenes a restar (imageA y imageB) y el retorno en result
function substraction(imageA,imageB,result) 
{
    for (var i = 0; i < imageA.data.length; i+=4) {
    	result.data[i]   = Math.abs(imageA.data[i]   - imageB.data[i])  ;
    	result.data[i+1] = Math.abs(imageA.data[i+1] - imageB.data[i+1]);
    	result.data[i+2] = Math.abs(imageA.data[i+2] - imageB.data[i+2]);
    }
}