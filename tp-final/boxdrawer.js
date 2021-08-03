// Clase que dibuja la caja alrededor de la escena
var pos = [];
var line = [];
class BoxDrawer 
{
	constructor()
	{
		// 1. Compilamos el programa de shaders
		this.prog = InitShaderProgram( boxVS, boxFS );
		
		// 2. Obtenemos los IDs de las variables uniformes en los shaders
		this.mvp = gl.getUniformLocation( this.prog, 'mvp' );
		
		// 3. Obtenemos los IDs de los atributos de los vértices en los shaders
		this.vertPos = gl.getAttribLocation( this.prog, 'pos' );
		
		// 4. Creamos el buffer para los vertices				
		this.vertbuffer = gl.createBuffer();

		var size = 16;
		var step = 1/size;
		for (var i = 0; i < size; i++) {
			for (var j = 0; j < size; j++) {
				pos.push(step*i, step*j, 0);
			}
		}

		for (var i = 0; i < size; i++) {
			for (var j = 0; j < size; j++) {
				var arrayLocation = i*size + j;
				if (i<size-1 && j<size-1){
					line.push(arrayLocation, arrayLocation+1); //el elemento de la derecha
					line.push(arrayLocation, arrayLocation+size); //el elemento de abajo
					line.push(arrayLocation, arrayLocation+size+1); //el elemento de la diagonal
				}else if(i<size-1 && j==size-1){ //estoy en la pared derecha
					line.push(arrayLocation, arrayLocation+size); //el elemento de abajo
				}else if(i==size-1 && j<size-1){ //estoy en la base
					line.push(arrayLocation, arrayLocation+1); //el elemento de la derecha
				}
			}
		}

		this.lineSize = line.length;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);

		// Conectividad de las lineas
		this.linebuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.linebuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(line), gl.STATIC_DRAW);
	}

	// Esta función se llama para dibujar la caja
	draw( trans )
	{
		// 1. Seleccionamos el shader
		gl.useProgram( this.prog );

		// 2. Setear matriz de transformacion
		gl.uniformMatrix4fv( this.mvp, false, trans );

		 // 3.Binding del buffer de posiciones
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertbuffer );

		// 4. Habilitamos el atributo 
		gl.vertexAttribPointer( this.vertPos, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.vertPos );
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.linebuffer );

		// 5. Dibujamos
		gl.drawElements( gl.LINES, this.lineSize, gl.UNSIGNED_BYTE, 0 );
	}
}

// Vertex shader 
var boxVS = `
	attribute vec3 pos;
	uniform mat4 mvp;
	void main()
	{
		gl_Position = mvp * vec4(pos,1);
	}
`;

// Fragment shader 
var boxFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(1,1,1,1);
	}
`;
