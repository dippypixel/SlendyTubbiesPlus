#pragma strict

public var thePlayer: Transform;
public var Cube: Transform;

function Start() {
    if (thePlayer == null) {
        Debug.Log("Finding Player");
        thePlayer = GameObject.FindWithTag("Player").transform;
    }

    Cube = transform;
}
function Update() {
    thePlayer = GameObject.FindWithTag("Player").transform;
    //Debug.Log("Player Position: " + thePlayer.position);
   // Debug.Log("Cube Position: " + Cube.position);
    Cube.position = thePlayer.position;
}
