#pragma strict

public var thePlayer : Transform;
public var theEnemy: Transform;

public var DistanceFromPlayer: float = 5.0;

var speed : float = 5.0;
var runspeed : float = 7.0;
var sprintspeed: float = 12.0;
var teleInterval1: float = 5;
var teleInterval2: float = 200;
var teleported: boolean = false;
var stopTeleport: boolean = false;
var isOffScreen: boolean = false;
var baseSpeed: float = 5.0;
var baseTeleInterval1: float = 10;
var baseTeleInterval2: float = 200;
var telenumb: float = 5;
public var offscreenDotRange: float = 0.7;

var isVisible : boolean = false;
public var visibleDotRange : float = 0.8; // ** between 0.75 and 0.85 (originally 0.8172719) 

var isInRange: boolean = false;
var hasPlayedAudio: boolean = false;

public var followDistance : float = 3.0;
public var maxVisibleDistance : float = 25.0;

private var sqrDist : float = 0.0;

var health : float = 100.0;
var damage : float = 20.0;

var nearbyaudio: AudioClip;
var triggerTarget: GameObject;
var tinkyObject: GameObject;
var replacementTex : Texture;
var originalTex : Texture; 

var blackness : Texture2D;
var scare : Texture2D;

var endgamepopup : Transform;
var ifseesobject: Transform;
var killsound: Transform;
var gos: GameObject[];

var timer: float = 0.0;



function Start() 
{
    baseSpeed = speed;
    baseTeleInterval1 = teleInterval1;
    baseTeleInterval2 = teleInterval2;
    telenumb = Random.Range(teleInterval1, teleInterval2);
    Debug.Log("started");
    if ( thePlayer == null )
    {
       thePlayer = GameObject.FindWithTag("Player").transform;
    }
    maxVisibleDistance = 10;
    theEnemy = transform;

    // Initial values
}

function Update() 
{
 
thePlayer = GameObject.FindWithTag("Player").transform;
   	//Debug.Log("Player Position: " + thePlayer.position);
   // Debug.Log("Enemy Position: " + theEnemy.position);
    triggerTarget = thePlayer.gameObject;
   // tinkyObject = theEnemy.gameObject;
    // Movement : check if out-of-view, then move
    CheckIfOffScreen();
    TeleportInv();
    //teleport
    timer += Time.deltaTime;

    // if is Off Screen, move
    if ( isOffScreen )
    {
    
       MoveEnemy();
    }
    else
    {
       // check if Player is seen
       thePlayer = GameObject.FindWithTag("Player").transform;
       CheckIfVisible();

       if ( isVisible )
       {
         // deduct health
         DeductHealth();

         // stop moving
         StopEnemy();
         
       }
       else
       {
         // check max range
         CheckMaxVisibleRange();

         // if far away then move, else stop
         if ( !isInRange )
         {
          MoveEnemy();
         }
         else
         {
          StopEnemy();
          
         }
       }
    }

}


function DeductHealth() 
{
    // deduct health
    health -= 0;
        Network.Instantiate(ifseesobject, transform.position, transform.rotation, 1);

   if (!GetComponent.<AudioSource>().isPlaying){
    GetComponent.<AudioSource>().clip = nearbyaudio;
       GetComponent.< AudioSource > ().Play();
    }

    // teleporting stuff
    var teleint = Random.Range(0.5, 1.5);
    var teleposleft = Random.Range(0, 2) == 0 ? teleint : (teleint * -1);
    var teleposup = Random.Range(-.2, .2);
    var teleposfwd = .4;
    CheckDistance();


    //make sure he doesnt teleport too far out of range when right in yo face
    if (DistanceFromPlayer < 20.0)
    {
        Debug.Log("too close");   
        teleposleft = teleposleft * 0;
        teleposfwd = 0;
        var fuckyou = triggerTarget.GetComponent.< CharacterMotor > ();
        health -= 1000;
        Network.Instantiate(killsound, transform.position, transform.rotation, 1);
        if (!killsound.GetComponent.< AudioSource > ().isPlaying) {
            killsound.GetComponent.< AudioSource > ().Play();
        }
        triggerTarget.transform.position.y = triggerTarget.transform.position.y + 10;
        fuckyou.grounded = false;
        fuckyou.movement.velocity.y = 100;
        fuckyou.movement.velocity.x = 100;
    }
    else
    {
        teleposleft = teleposleft * 0;
        teleposfwd = 1;
    }


    transform.position += (transform.right * teleposleft) + (transform.forward * teleposfwd) + (transform.up * teleposup);
    
    // check if no health left
    if ( health <= 0.0 )
    {
    Network.Instantiate(endgamepopup, transform.position, transform.rotation, 1);
        thePlayer.GetComponent.< CharacterMotor > ().canControl = false;
       health = 0.0;
       Debug.Log( "YOU ARE OUT OF HEALTH !" );
          
          
       // Restart game here!
       //
    }
}


function CheckIfOffScreen() 
{
    var fwd : Vector3 = thePlayer.forward.normalized;
    var other : Vector3 = (theEnemy.position - thePlayer.position).normalized;

    var theProduct : float = Vector3.Dot( fwd, other );

    if ( theProduct < offscreenDotRange )
    {
       isOffScreen = true;
    }
    else
    {
       isOffScreen = false;
    }
}


function MoveEnemy() 
{
gos = GameObject.FindGameObjectsWithTag("Paper");
if(gos.length == 5)
{
  speed = runspeed;
}
if(gos.length == 2)
{
  speed = sprintspeed;
}
    // Check the Follow Distance
    CheckDistance();
    CheckIfOffScreen();

    // if not too close, move
    if ( !isInRange )
    {
       transform.LookAt( thePlayer );

       GetComponent.<Rigidbody>().velocity = Vector3( 0, GetComponent.<Rigidbody>().velocity.y, 0 ); // maintain gravity

        transform.position += transform.forward * speed * Time.deltaTime;
    }
    else
    {
       StopEnemy();
    }
}


function StopEnemy() 
{
    transform.LookAt( thePlayer );

    GetComponent.< Rigidbody > ().velocity = Vector3.zero;
}


function CheckIfVisible() 
{
    var fwd : Vector3 = thePlayer.forward.normalized;
    var other : Vector3 = ( theEnemy.position - thePlayer.position ).normalized;

    var theProduct : float = Vector3.Dot( fwd, other );

    if ( theProduct > visibleDotRange )
    {
       // Check the Max Distance
       CheckMaxVisibleRange();

       if ( isInRange )
       {
         // Linecast to check for occlusion
         var hit : RaycastHit;

         if ( Physics.Linecast( theEnemy.position, thePlayer.position, hit ) )
         {
          //Debug.Log( "" + hit.collider.gameObject.name );

          if ( hit.collider.gameObject.tag == "Player" )
          {
              isVisible = true;
          }
         }
       }
       else
       {
         isVisible = false;
       }
    }
    else
    {
       isVisible = false;
    }
}


function CheckDistance() 
{
    var sqrDist : float = (theEnemy.position - thePlayer.position).sqrMagnitude;
    var sqrFollowDist : float = followDistance * followDistance;
    DistanceFromPlayer = sqrDist;
    if ( sqrDist < sqrFollowDist )
    {
       isInRange = true;
    }
    else
    {
       isInRange = false;
    }  
}


function CheckMaxVisibleRange() 
{
    var sqrDist : float = (theEnemy.position - thePlayer.position).sqrMagnitude;
    var sqrMaxDist : float = maxVisibleDistance * maxVisibleDistance;

    if ( sqrDist < sqrMaxDist )
    {
       isInRange = true;
    }
    else
    {
       isInRange = false;
    }  
}


function Teleport() {
    if (!teleported) { // Only teleport if not already teleported
        teleported = true; // Mark as teleported 
        // Teleporting the object
        var randompos: float = 0;
        var randomposside: float = 0;
        if (gos.length == 4) {
            randompos = Random.Range(0, 2) == 0 ? -100 : -20;
            randomposside = Random.Range(-50, 50);
        }
        else {
            randompos = Random.Range(0, 2) == 0 ? 4 : -50;
            randomposside = Random.Range(-10, 10);
        }
        transform.position = thePlayer.position - thePlayer.forward * randompos + thePlayer.right * randomposside;
        // Resetting timer if you need it for some logic
        timer = 0;

        // Handle audio
        var audioSource = GetComponent.< AudioSource > ();
        if (audioSource.isPlaying) {
            audioSource.clip = nearbyaudio; // Change audio clip
            audioSource.Stop(); // Stop current audio
        }
        teleported = false;
        // Note: teleported is set to false later in the coroutine
    }
}

function TeleportInv() {
    if (timer > telenumb && !stopTeleport) {
        Debug.Log("Teleported!");
        Teleport();
        telenumb = Random.Range(teleInterval1, teleInterval2);
    }
}
function CheckIfFallen() {
    if (transform.position.y < -5) {
        Teleport();
    }
}

var changetelenumb1: boolean = false;

function telenumbChange1() {
    if (!changetelenumb1) {
        telenumb = Random.Range(teleInterval1, teleInterval2);
        changetelenumb1 = true;
    }
}

var changetelenumb2: boolean = false;

function telenumbChange2() {
    if (!changetelenumb2) {
        telenumb = Random.Range(teleInterval1, teleInterval2);
        changetelenumb2 = true;
    }
}

var changetelenumb3: boolean = false;

function telenumbChange3() {
    if (!changetelenumb3) {
        telenumb = Random.Range(teleInterval1, teleInterval2);
        changetelenumb3 = true;
    }
}

var changetelenumb4: boolean = false;

function telenumbChange4() {
    if (!changetelenumb4) {
        telenumb = Random.Range(teleInterval1, teleInterval2);
        changetelenumb4 = true;
    }
}