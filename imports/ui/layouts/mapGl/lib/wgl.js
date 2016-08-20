import {Coords} from '../../map/carto/coords.js';

// augment Sylvester some
Matrix.Translation = function ( v )
{
  if ( v.elements.length == 2 ) {
    var r = Matrix.I( 3 );
    r.elements[2][0] = v.elements[0];
    r.elements[2][1] = v.elements[1];
    return r;
  }

  if ( v.elements.length == 3 ) {
    var r = Matrix.I( 4 );
    r.elements[0][3] = v.elements[0];
    r.elements[1][3] = v.elements[1];
    r.elements[2][3] = v.elements[2];
    return r;
  }

  throw 'Invalid length for Translation';
};

Matrix.prototype.flatten = function ()
{
    var result = [];
    if ( this.elements.length == 0 )
        return [];


    for ( var j = 0; j < this.elements[0].length; j++ )
        for ( var i = 0; i < this.elements.length; i++ )
            result.push( this.elements[i][j] );
    return result;
  };

Matrix.prototype.ensure4x4 = function()
{
    if ( this.elements.length == 4 &&
        this.elements[0].length == 4 )
        return this;

    if ( this.elements.length > 4 ||
        this.elements[0].length > 4 )
        return null;

    for ( var i = 0; i < this.elements.length; i++ ) {
      for ( var j = this.elements[i].length; j < 4; j++ ) {
        if ( i == j )
            this.elements[i].push( 1 );
        else
            this.elements[i].push( 0 );
      }
    }

    for ( var i = this.elements.length; i < 4; i++ ) {
      if ( i == 0 )
          this.elements.push( [1, 0, 0, 0] );
      else if ( i == 1 )
          this.elements.push( [0, 1, 0, 0] );
      else if ( i == 2 )
          this.elements.push( [0, 0, 1, 0] );
      else if ( i == 3 )
          this.elements.push( [0, 0, 0, 1] );
    }

    return this;
  };

Matrix.prototype.make3x3 = function()
{
    if ( this.elements.length != 4 ||
        this.elements[0].length != 4 )
        return null;

    return Matrix.create( [[this.elements[0][0], this.elements[0][1], this.elements[0][2]],
                          [this.elements[1][0], this.elements[1][1], this.elements[1][2]],
                          [this.elements[2][0], this.elements[2][1], this.elements[2][2]]] );
  };

Vector.prototype.flatten = function ()
{
    return this.elements;
  };

function mht( m ) {
  var s = '';
  if ( m.length == 16 ) {
    for ( var i = 0; i < 4; i++ ) {
      s += '<span style=\'font-family: monospace\'>[' + m[i * 4 + 0].toFixed( 4 ) + ',' + m[i * 4 + 1].toFixed( 4 ) + ',' + m[i * 4 + 2].toFixed( 4 ) + ',' + m[i * 4 + 3].toFixed( 4 ) + ']</span><br>';
    }
  }
  else if ( m.length == 9 ) {
    for ( var i = 0; i < 3; i++ ) {
      s += '<span style=\'font-family: monospace\'>[' + m[i * 3 + 0].toFixed( 4 ) + ',' + m[i * 3 + 1].toFixed( 4 ) + ',' + m[i * 3 + 2].toFixed( 4 ) + ']</font><br>';
    }
  }
  else {
    return m.toString();
  }
  return s;
}

//
// gluLookAt
//
function makeLookAt( ex, ey, ez,
                    cx, cy, cz,
                    ux, uy, uz )
{
  var eye = $V( [ex, ey, ez] );
  var center = $V( [cx, cy, cz] );
  var up = $V( [ux, uy, uz] );

  var mag;

  var z = eye.subtract( center ).toUnitVector();
  var x = up.cross( z ).toUnitVector();
  var y = z.cross( x ).toUnitVector();

  var m = $M( [[x.e( 1 ), x.e( 2 ), x.e( 3 ), 0],
              [y.e( 1 ), y.e( 2 ), y.e( 3 ), 0],
              [z.e( 1 ), z.e( 2 ), z.e( 3 ), 0],
              [0, 0, 0, 1]] );

  var t = $M( [[1, 0, 0, - ex],
              [0, 1, 0, - ey],
              [0, 0, 1, - ez],
              [0, 0, 0, 1]] );
  return m.x( t );
}

//
// glOrtho
//
function makeOrtho( left, right,
                   bottom, top,
                   znear, zfar )
{
  var tx = - ( right + left ) / ( right - left );
  var ty = - ( top + bottom ) / ( top - bottom );
  var tz = - ( zfar + znear ) / ( zfar - znear );

  return $M( [[2 / ( right - left ), 0, 0, tx],
             [0, 2 / ( top - bottom ), 0, ty],
             [0, 0, - 2 / ( zfar - znear ), tz],
             [0, 0, 0, 1]] );
}

//
// gluPerspective
//
function makePerspective( fovy, aspect, znear, zfar )
{
  var ymax = znear * Math.tan( fovy * Math.PI / 360.0 );
  var ymin = - ymax;
  var xmin = ymin * aspect;
  var xmax = ymax * aspect;

  return makeFrustum( xmin, xmax, ymin, ymax, znear, zfar );
}

//
// glFrustum
//
function makeFrustum( left, right,
                     bottom, top,
                     znear, zfar )
{
  var X = 2 * znear / ( right - left );
  var Y = 2 * znear / ( top - bottom );
  var A = ( right + left ) / ( right - left );
  var B = ( top + bottom ) / ( top - bottom );
  var C = - ( zfar + znear ) / ( zfar - znear );
  var D = - 2 * zfar * znear / ( zfar - znear );

  return $M( [[X, 0, A, 0],
             [0, Y, B, 0],
             [0, 0, C, D],
             [0, 0, - 1, 0]] );
}

//
// glOrtho
//
function makeOrtho( left, right, bottom, top, znear, zfar )
{
  var tx = - ( right + left ) / ( right - left );
  var ty = - ( top + bottom ) / ( top - bottom );
  var tz = - ( zfar + znear ) / ( zfar - znear );

  return $M( [[2 / ( right - left ), 0, 0, tx],
         [0, 2 / ( top - bottom ), 0, ty],
         [0, 0, - 2 / ( zfar - znear ), tz],
         [0, 0, 0, 1]] );
}


var canvas;
var squareVerticesBuffer;
var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var perspectiveMatrix;


function getRelativePoint( minX, minY, maxX, maxY, w, h, coord ) {
  let rangX = getRang( minX, maxX ),
      rangY = getRang( minY, maxY );

  return [rule( rangX, w, coord[0] - minX ), rule( rangY, h, coord[1] - minY )];
}

//
// start
//
// Called when the canvas is created to get the ball rolling.
// Figuratively, that is. There's nothing moving in this demo.
//
//
let mapBuffers = [];
function start( data ) {
  canvas = document.getElementById( 'mapgl' );

  initWebGL( canvas );      // Initialize the GL context

  // Only continue if WebGL is available and working

  if ( gl ) {
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );  // Clear to black, fully opaque
    gl.clearDepth( 1.0 );                 // Clear everything
    gl.enable( gl.DEPTH_TEST );           // Enable depth testing
    gl.depthFunc( gl.LEQUAL );            // Near things obscure far things

    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.

    initShaders();

    // Here's where we call the routine that builds all the objects
    // we'll be drawing.
    //
    let rows = [];
    for ( var i = 0; i < data.length; i++ ) {
      let row = JSON.parse( data[i].the_geom ).coordinates;
      // initBuffers( row[0][0] );
      //
      rows.push( row[0][0] );
    }
    //
    var lim = calculateLimits( rows );

    for ( var i = 0; i < rows.length; i++ ) {
      let polygon = rows[i],
          poly = [];

      for ( var j = 0; j < polygon.length; j++ ) {
        let point = polygon[j];

        point = Coords.get.relativePoint( lim.min.x, lim.min.y, lim.max.x, lim.max.y, 2, 2, point );
        // console.log( point );
        point[0] -= 1;
        point[1] -= 1;

        poly.push( point );
      }


      let buffer = initBuffers( poly );
      mapBuffers.push( buffer );
      if ( i === 0 ) {
        drawScene( buffer );
      }
      else {
        simpleDraw( buffer );
      }
    }

    // Set up to draw the scene periodically.

    // setInterval( drawScene, 15 );
    //
    //
    //
    //
    perspectiveMatrix = makePerspective( 45, window.innerWidth / window.innerHeight, 0.02, 100.0 );

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.

    loadIdentity();

    // Now move the drawing position a bit to where we want to start
    // drawing the square.

    mvTranslate( [- 0.0, 0.0, - 3.0] );

  }
}

zoom = function ( scale ) {
  perspectiveMatrix = makePerspective( scale, window.innerWidth / window.innerHeight, 0.02, 100.0 );

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.

  loadIdentity();

  // Now move the drawing position a bit to where we want to start
  // drawing the square.

  mvTranslate( [- 0.0, 0.0, - 3.0] );

  for ( var i = 0; i < mapBuffers.length; i++ ) {
    if ( i === 0 ) {
      drawScene( mapBuffers[i], scale );
    }
    else {
      simpleDraw( mapBuffers[i] );
    }
  }
};
//
// initWebGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initWebGL() {
  gl = null;

  try {
    gl = canvas.getContext( 'experimental-webgl' );
  }
  catch ( e ) {
  }

  // If we don't have a GL context, give up now

  if ( !gl ) {
    alert( 'Unable to initialize WebGL. Your browser may not support it.' );
  }
}

function calculateLimits( data, redo ) {

  let minX = 1000, minY = 1000, maxX = - 1000, maxY = - 1000;

  for ( var i = 0; i < data.length; i++ ) {
    let polygon = data[i];

    for ( var j = 0; j < polygon.length; j++ ) {
      let c = polygon[j];

      minX = c[0] < minX ? c[0] : minX;
      minY = c[1] < minY ? c[1] : minY;

      maxX = c[0] > maxX ? c[0] : maxX;
      maxY = c[1] > maxY ? c[1] : maxY;
    }
  }

  return { max: { x: maxX, y: maxY }, min: { x: minX, y: minY } };
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just have
// one object -- a simple two-dimensional square.
//
function initBuffers( polygon ) {

  // Create a buffer for the square's vertices.
  let squareVerticesBuffer = gl.createBuffer();

  // Select the squareVerticesBuffer as the one to apply vertex
  // operations to from here out.

  gl.bindBuffer( gl.ARRAY_BUFFER, squareVerticesBuffer );

  // Now create an array of vertices for the square. Note that the Z
  // coordinate is always 0 here.
  var vertices = [];

  for ( var i = 0; i < polygon.length; i++ ) {
    let point = polygon[i];

    point.push( 0.0 );

    vertices.push( point );

    if ( i >= 1 ) {
      vertices.push( vertices[vertices.length - 1] );
    }
    // vertices = vertices.concat( point );
  }

  vertices = vertices.concat( [vertices[0]] );

  squareVerticesBuffer.itemSize = 3;
  numPoints = squareVerticesBuffer.numItems = vertices.length;

  vertices = _.flatten( vertices );

  // Now pass the list of vertices into WebGL to build the shape. We
  // do this by creating a Float32Array from the JavaScript array,
  // then use it to fill the current vertex buffer.

  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

  return squareVerticesBuffer;
}

//
// drawScene
//
// Draw the scene.
//
function drawScene( buffer, scale ) {
  // Clear the canvas before we start drawing on it.
  // gl.viewport( 0, 0, gl.viewportWidth, gl.viewportHeight );

  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

  // Establish the perspective with which we want to view the
  // scene. Our field of view is 45 degrees, with a width/height
  // ratio of 640:480, and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  perspectiveMatrix = makePerspective( scale || 10, window.innerWidth / window.innerHeight, 0.02, 100.0 );

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.

  loadIdentity();

  // Now move the drawing position a bit to where we want to start
  // drawing the square.

  mvTranslate( [- 0.0, 0.0, - 3.0] );

  // Draw the square by binding the array buffer to the square's vertices
  // array, setting attributes, and pushing it to GL.

  gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
  gl.vertexAttribPointer( vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0 );
  setMatrixUniforms();
  gl.lineWidth( 1.0 );
  gl.drawArrays( gl.LINES, 0, buffer.numItems );
}

function simpleDraw( buffer ) {
  gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
  gl.vertexAttribPointer( vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0 );
  setMatrixUniforms();
  gl.lineWidth( 1.0 );
  gl.drawArrays( gl.LINES, 0, buffer.numItems );
}

//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders() {
  var fragmentShader = getShader( gl, 'shader-fs' );
  var vertexShader = getShader( gl, 'shader-vs' );

  // Create the shader program

  shaderProgram = gl.createProgram();
  gl.attachShader( shaderProgram, vertexShader );
  gl.attachShader( shaderProgram, fragmentShader );
  gl.linkProgram( shaderProgram );

  // If creating the shader program failed, alert

  if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ) {
    alert( 'Unable to initialize the shader program: ' + gl.getProgramInfoLog( shader ) );
  }

  gl.useProgram( shaderProgram );

  vertexPositionAttribute = gl.getAttribLocation( shaderProgram, 'aVertexPosition' );
  gl.enableVertexAttribArray( vertexPositionAttribute );
}

//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader( gl, id ) {
  var shaderScript = document.getElementById( id );

  // Didn't find an element with the specified ID; abort.

  if ( !shaderScript ) {
    return null;
  }

  // Walk through the source element's children, building the
  // shader source string.

  var theSource = '';
  var currentChild = shaderScript.firstChild;

  while ( currentChild ) {
    if ( currentChild.nodeType == 3 ) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }

  // Now figure out what type of shader script we have,
  // based on its MIME type.

  var shader;

  if ( shaderScript.type == 'x-shader/x-fragment' ) {
    shader = gl.createShader( gl.FRAGMENT_SHADER );
  }
  else if ( shaderScript.type == 'x-shader/x-vertex' ) {
    shader = gl.createShader( gl.VERTEX_SHADER );
  }
  else {
    return null;  // Unknown shader type
  }

  // Send the source to the shader object

  gl.shaderSource( shader, theSource );

  // Compile the shader program

  gl.compileShader( shader );

  // See if it compiled successfully

  if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
    alert( 'An error occurred compiling the shaders: ' + gl.getShaderInfoLog( shader ) );
    return null;
  }

  return shader;
}

//
// Matrix utility functions
//

function loadIdentity() {
  mvMatrix = Matrix.I( 4 );
}

function multMatrix( m ) {
  mvMatrix = mvMatrix.x( m );
}

function mvTranslate( v ) {
  multMatrix( Matrix.Translation( $V( [v[0], v[1], v[2]] ) ).ensure4x4() );
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation( shaderProgram, 'uPMatrix' );
  gl.uniformMatrix4fv( pUniform, false, new Float32Array( perspectiveMatrix.flatten() ) );

  var mvUniform = gl.getUniformLocation( shaderProgram, 'uMVMatrix' );
  gl.uniformMatrix4fv( mvUniform, false, new Float32Array( mvMatrix.flatten() ) );
}

export {start};
