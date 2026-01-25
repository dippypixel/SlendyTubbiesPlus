#pragma strict

public var thePlayer : Transform;
public var theEnemy : Transform;

var speed : float = 5.0;
public var offscreenDotRange: float = 0.7;
public var visibleDotRange: float = 0.8; // ** between 0.75 and 0.85 (originally 0.8172719) 
public var followDistance: float = 3.0;
public var maxVisibleDistance: float = 25.0;
private var sqrDist: float = 0.0;
var health: float = 100.0;
var damage: float = 20.0;
var timer: float = 0.0;
var teleInterval1: float = 5;
var teleInterval2: float = 200;
var telenumb: float = 5;

var isOffScreen : boolean = false;
var isVisible : boolean = false;
var isInRange: boolean = false;
var hasPlayedAudio: boolean = false;
var teleported: boolean = false;
var stopTeleport: boolean = false;
var delayingHealth: boolean = false;
var delayedHealth: boolean = false;



var nearbyaudio: AudioClip;
var nearbyaudio2: AudioClip;
var friendlyaudio: AudioSource;

var triggerTarget: GameObject;
var tinkyObject: GameObject;
var gos: GameObject[];
var Ambience: GameObject;
var replacementTex : Texture;
var originalTex : Texture; 

var blackness : Texture2D;
var scare : Texture2D;

var endgamepopup : Transform;
var ifseesobject : Transform;




function Start() 
{
    tinkyObject.GetComponent.< Renderer > ().material.mainTexture = originalTex;
    if ( thePlayer == null )
    {
       thePlayer = GameObject.FindWithTag("Player").transform;
    }
    maxVisibleDistance = 10;
    theEnemy = transform;
    telenumb = Random.Range(teleInterval1, teleInterval2);
}

function Update() 
{
    if (originalTex == null) {
        Debug.Log("originaltex is not assigned!");
    }
thePlayer = GameObject.FindWithTag("Player").transform;
   	//Debug.Log("Player Position: " + thePlayer.position);
   // Debug.Log("Enemy Position: " + theEnemy.position);
    triggerTarget = thePlayer.gameObject;
   // tinkyObject = theEnemy.gameObject;
    // Movement : check if out-of-view, then move
    CheckIfOffScreen();
    CheckIfFallen();
    TeleportInv();
   // Debug.Log(GetComponent.< Rigidbody > ().velocity);

    //teleport
    timer += Time.deltaTime;



    // if is Off Screen, move
    if ( isOffScreen )
    {
       stopTeleport = false;
       MoveEnemy();
    }
    else
    {
       // check if Player is seen
       thePlayer = GameObject.FindWithTag("Player").transform;
       CheckIfVisible();

       if ( isVisible )
       {
           if (!delayingHealth && tinkyObject.GetComponent.< Renderer > ().material.mainTexture == originalTex && !delayedHealth){
               stopTeleport = true;
               StartCoroutine(DelayBeforeHealthDeduction());
           }
           else if (!delayingHealth && delayedHealth) {
               stopTeleport = true;
               maxVisibleDistance = 15;
               DeductHealth();
           }
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

function DelayBeforeHealthDeduction() {
    delayingHealth = true;  // Set flag to indicate delay is active
    yield WaitForSeconds(Random.Range(1, 3)); // 1-second delay
    delayingHealth = false;  // Reset flag after delay ends
    delayedHealth = true;
    // Proceed with health deduction after the delay if visible
    if (isVisible) {
        maxVisibleDistance = 20;
        DeductHealth();
    }
}

function DeductHealth() 
{
    // deduct health
    var attacktelechance = Random.Range(0, 200);
    if (attacktelechance == 25) {
        transform.position = thePlayer.position - thePlayer.forward * -100 + thePlayer.right * Random.Range(-50, 50);
    }

    health -= damage * Time.deltaTime;
    tinkyObject.GetComponent.<Renderer>().material.mainTexture = replacementTex;
    Network.Instantiate(ifseesobject, transform.position, transform.rotation, 1);

    // teleporting stuff
    var teleint = Random.Range(0.5, 1.5);
    var teleposleft = Random.Range(0, 2) == 0 ? teleint : (teleint * -1);
    var teleposup = Random.Range(-.2, .2);
    transform.position += transform.right * teleposleft + transform.forward * .4 + transform.up * teleposup;


    // AAAAAAAAAAAAAAAAAAAAAAAAAA... AAAAAAAAAAAAAAAAAAAAAAAAA...
  if (!GetComponent.<AudioSource>().isPlaying){
      GetComponent.< AudioSource > ().clip = Random.Range(0, 2) == 0 ? nearbyaudio : nearbyaudio2;
       GetComponent.< AudioSource > ().Play();
  }
    
    // check if no health left
    if ( health <= 0.0 )
    {
    Network.Instantiate(endgamepopup, transform.position, transform.rotation, 1);
        DestroyObject(gameObject);
        thePlayer.GetComponent.< crouchandrun > ().enabled = false;
        thePlayer.GetComponent.< CharacterMotor > ().enabled = false;
        thePlayer.GetComponent.< playerwalkingsound > ().enabled = false;
        if (Ambience.GetComponent.< AudioSource > ().isPlaying) {
            Ambience.GetComponent.< AudioSource > ().Stop();
        }
        if (thePlayer.GetComponent.< AudioSource > ().isPlaying) {
            thePlayer.GetComponent.< AudioSource > ().Stop();
        }
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
    if(gos.length == 8) {
        speed = 6.5;
        teleInterval1 = 1;
        teleInterval2 = 180;
        telenumbChange1();
    }
    if(gos.length == 6)
    {
        if (Ambience.GetComponent.< AudioSource > ().isPlaying) {
            Ambience.GetComponent.< AudioSource > ().Stop();
        }
        speed = 8.5;
        teleInterval2 = 120;
        telenumbChange2();
    }
    if(gos.length == 4) {
        speed = 9.5;
        teleInterval2 = 60;
        telenumbChange3();
    }
    if(gos.length == 2)
    {
        teleInterval2 = 30;
        speed = 11;
        telenumbChange4();
    }

    // Check closest player
    var closestPlayer : Transform = GetClosestPlayer();
    if (closestPlayer != null)
    {
        thePlayer = closestPlayer;
    }

    // Check the Follow Distance
    CheckDistance();

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

    if (!hasPlayedAudio && tinkyObject.GetComponent.< Renderer > ().material.mainTexture == originalTex)
    {
        if (!friendlyaudio.isPlaying) {
            Debug.Log("eh oh played");
            friendlyaudio.Play();
            hasPlayedAudio = true;
        }
    }
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
    var sqrFollowDist: float = followDistance * followDistance;
   // Debug.Log(sqrDist);

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
    if (!teleported)
    { // Only teleport if not already teleported
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
        if (audioSource.isPlaying)
        {
            audioSource.clip = nearbyaudio; // Change audio clip
            audioSource.Stop(); // Stop current audio
        }
        teleported = false;
        // Note: teleported is set to false later in the coroutine
    }
}

function TeleportInv()
{
    if (timer > telenumb && !stopTeleport)
    {
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

function GetClosestPlayer() : Transform
{
    var players : GameObject[] = GameObject.FindGameObjectsWithTag("Player");
    var closest : Transform = null;
    var minDist : float = Mathf.Infinity;

    for (var p : GameObject in players)
    {
        var dist : float = (p.transform.position - transform.position).sqrMagnitude;
        if (dist < minDist)
        {
            minDist = dist;
            closest = p.transform;
        }
    }

    return closest;
}
