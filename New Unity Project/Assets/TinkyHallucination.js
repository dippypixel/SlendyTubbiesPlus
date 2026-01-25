#pragma strict
var Hallucination: GameObject;
public var thePlayer: Transform;
public var theEnemy: Transform;
var timer: float = 0.0;
var halludist: float = 10;
var sqrDist: float = 0;
var sqrDist2: float = 0;
var activated: boolean = false;
var teleported: boolean = false;
function Start() {
    if (thePlayer == null) {
        thePlayer = GameObject.FindWithTag("Player").transform;
    }
}

function Update()
{
    transform.LookAt(thePlayer);
    timer += Time.deltaTime;
    thePlayer = GameObject.FindWithTag("Player").transform;
    sqrDist = (theEnemy.position - thePlayer.position).sqrMagnitude;
    sqrDist2 = (Hallucination.transform.position - thePlayer.position).sqrMagnitude;
    GetComponent.< Rigidbody > ().velocity = Vector3(0, GetComponent.< Rigidbody > ().velocity.y, 0); // maintain gravity
    if (sqrDist > 3000 && timer > 2)
    {
        activated = true;
    }
    if (activated == true)
    {
        if (teleported == false)
        {
            transform.position = thePlayer.position + thePlayer.transform.forward * halludist;
            teleported = true;
        }
        timer = 0;
        if (sqrDist2 > 10) {
            transform.position += transform.forward * 20 * Time.deltaTime;
        }
        else if (sqrDist2 <= 10) {
            timer = 0;
            transform.position = thePlayer.position + thePlayer.transform.up * -10f;
            activated = false;
        }
    }
}
