import { Shaders } from './shaders.js';
import { Matrix } from './matrix.js';

function initWebGL( canvas ) {
  return canvas.getContext( 'experimental-webgl' );
}

function drawScene( gl, shader, buffer, scale, x, y ) {
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

  let perspectiveMatrix = Matrix.makePerspective( 40, window.innerWidth / window.innerHeight, 0.02, 100.0 ),
      mvMatrix = Matrix.loadIdentity();

  mvMatrix = Matrix.mvTranslate( mvMatrix, [x || - 0.0, y || 0.0, scale || - 1.0] );
  console.log( mvMatrix );
  gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
  gl.vertexAttribPointer( shader.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0 );

  console.log( perspectiveMatrix );
  Matrix.setMatrixUniforms( gl, shader.program, perspectiveMatrix, mvMatrix );

  gl.lineWidth( 1.0 );

  gl.drawArrays( gl.LINES, 0, buffer.numItems );
}

function initBuffer( gl, vertices ) {
  let lineVerticesBuffer = gl.createBuffer();

  gl.bindBuffer( gl.ARRAY_BUFFER, lineVerticesBuffer );

  lineVerticesBuffer.itemSize = 3;
  lineVerticesBuffer.numItems = vertices.length / 3;

  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

  return lineVerticesBuffer;
}

let WebGl = function ( canvas ) {
  let gl = initWebGL( canvas );
  let shader = null,
      bufferData = null;

  if ( gl ) {
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 ); // Clear to black, fully opaque
    gl.clearDepth( 1.0 ); // Clear everything
    gl.enable( gl.DEPTH_TEST ); // Enable depth testing
    gl.depthFunc( gl.LEQUAL ); // Near things obscure far things

    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.

    shader = Shaders.init( gl );
    console.log( shader );
    this.loadData = function ( vertices ) {
      bufferData = initBuffer( gl, vertices );
      // console.log( bufferData.numItems );
    };

    this.start = function () {
      if ( !bufferData ) {
        throw new Error( 'No data loaded yet!' );
      }

      drawScene( gl, shader, bufferData, 0.0, 0.0, 0.0 );
    };

    this.goTo = function ( scale, x, y ) {
      drawScene( gl, shader, bufferData, scale, x, y );
    };

    return this;
  }

};

export { WebGl };
