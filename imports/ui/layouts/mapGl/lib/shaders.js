let Shaders = {};

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
    return null; // Unknown shader type
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

Shaders.init = function initShaders( gl ) {
  var fragmentShader = getShader( gl, 'shader-fs' );
  var vertexShader = getShader( gl, 'shader-vs' );

  // Create the shader program

  var program = gl.createProgram();
  gl.attachShader( program, vertexShader );
  gl.attachShader( program, fragmentShader );
  gl.linkProgram( program );

  // If creating the shader program failed, alert

  if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
    alert( 'Unable to initialize the shader program: ' + gl.getProgramInfoLog( shader ) );
  }

  gl.useProgram( program );

  vertexPositionAttribute = gl.getAttribLocation( program, 'aVertexPosition' );
  gl.enableVertexAttribArray( vertexPositionAttribute );

  return { program, vertexPositionAttribute };
};

export { Shaders };
