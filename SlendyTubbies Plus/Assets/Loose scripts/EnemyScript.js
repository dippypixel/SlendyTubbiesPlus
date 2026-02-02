#pragma strict

public var thePlayer : Transform;
public var theEnemy : Transform;

var speed : float = 5.0;
public var offscreenDotRange: float = 0.7;
public var visibleDotRange: float = 0.8; // ** between 0.75 and 0.85 (originally 0.8172719) 
public var followDistance: float = 3.0;
public var maxVisibleDistance: float = 10.0;
private var sqrDist: float = 0.0;
public var health: float = 100.0;
var damage: float = 50.0;
var timer: float = 0.0;
var teleInterval1: float = 100;
var teleInterval2: float = 200;
var telenumb: float = 5;
var modifermult: float = 5;

var baseSpeed : float = 5.0;
var baseTeleInterval1 : float = 100;
var baseTeleInterval2 : float = 200;

var nightVisionMultiplierSpeed : float = 1.0;
var nightVisionMultiplierTele : float = 1.0;

var isOffScreen : boolean = false;
var isVisible : boolean = false;
var isInRange: boolean = false;
var hasPlayedAudio: boolean = false;
var teleported: boolean = false;
var stopTeleport: boolean = false;
var delayingHealth: boolean = false;
var delayedHealth: boolean = false;
var nightVisionActive : boolean = false;


var nearbyaudio: AudioClip;
var nearbyaudio2: AudioClip;
var friendlyaudio: AudioSource;

var triggerTarget: GameObject;
var tinkyObject: GameObject;
var gos: GameObject[];
var replacementTex : Texture;
var originalTex : Texture; 

var house: GameObject;
var ambience: AudioSource;

var blackness : Texture2D;
var scare : Texture2D;

var endgamepopup : Transform;
var ifseesobject : Transform;




function Start() 
{
    //set theEnemy variable as itself
    theEnemy = transform;
    //make face the happy one
    tinkyObject.GetComponent.< Renderer > ().material.mainTexture = originalTex;
    //seek out player
    if ( thePlayer == null )
    {
       thePlayer = GameObject.FindWithTag("Player").transform;
    }
    //seek out ambience
    house = GameObject.Find("Teletubby house");
    ambience = house.GetComponent.< AudioSource > ();
    // Initial values
    baseSpeed = speed;
    baseTeleInterval1 = teleInterval1;
    baseTeleInterval2 = teleInterval2;
    telenumb = Random.Range(teleInterval1, teleInterval2);
    maxVisibleDistance = 10;
    damage = 50;
}

function Update() 
{
    //texture debug
    if (originalTex == null) {
        Debug.Log("originaltex is not assigned!");
    }
    thePlayer = GameObject.FindWithTag("Player").transform;
    triggerTarget = thePlayer.gameObject;
    // Movement : check if out-of-view, then move
    CheckIfOffScreen();
    CheckIfFallen();
    EnemyModfier();
    TeleportInv();

    //teleport timer
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
    Debug.Log("Delaying scream");
    yield WaitForSeconds(Random.Range(1, 3)); // 1-second delay
    Debug.Log("Delayed scream");
    delayingHealth = false;  // Reset flag after delay ends
    delayedHealth = true;
    //if they try to run he teleports right in front of them
    if (isOffScreen) {
        tinkyObject.GetComponent.< Renderer > ().material.mainTexture = replacementTex;
        transform.position = thePlayer.position - thePlayer.forward * -maxVisibleDistance;
    }
    // Proceed with health deduction after the delay if visible
    if (!isOffScreen) {
        Debug.Log("Screaming");
        maxVisibleDistance = 40;
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
    transform.position += (transform.right * teleposleft) + (transform.forward * (.4*(modifermult))) + (transform.up * teleposup);


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
        if (ambience.isPlaying) {
            ambience.Stop();
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
    // Bitch gets crazy here
    speed = baseSpeed * nightVisionMultiplierSpeed;
    teleInterval1 = baseTeleInterval1 * nightVisionMultiplierTele;
    teleInterval2 = baseTeleInterval2 * nightVisionMultiplierTele;

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

function EnemyModfier()
{
    //if health is already delayed
    if (delayedHealth && gos.length <= 8) {
        maxVisibleDistance = 15 * modifermult;
    }
    gos = GameObject.FindGameObjectsWithTag("Paper");
    if (gos.length == 8)
    {
        baseSpeed = 6.5;
        baseTeleInterval1 = 1;
        baseTeleInterval2 = 180;
        modifermult = 1.2;
        damage = 75;
        telenumbChange1();
    }

    if (gos.length == 6) {
        //shit gets real
        if (ambience.isPlaying)
        {
            ambience.Stop();
        }
        //make him evil if not interacted yet
        delayedHealth = true;
        hasPlayedAudio = true;
        tinkyObject.GetComponent.< Renderer > ().material.mainTexture = replacementTex;
        //set stats
        baseSpeed = 8.5;
        baseTeleInterval2 = 120;
        modifermult = 1.4;
        damage = 100;
        telenumbChange2();
    }
    if (gos.length == 4)
    {
        //set stats
        baseSpeed = 9.5;
        baseTeleInterval2 = 60;
        modifermult = 1.6;
        damage = 125;
        telenumbChange3();
    }
    if (gos.length == 2)
    {
        //set stats
        baseSpeed = 11;
        baseTeleInterval2 = 30;
        modifermult = 1.8;
        damage = 150;
        telenumbChange4();
    }
}



function Teleport() {
    if (!teleported)
    { // Only teleport if not already teleported
        teleported = true; // Mark as teleported 
        // Teleporting the object
        var randompos: float = 0;
        var randomposside: float = 0;
        if (gos.length >= 4) {
            randompos = Random.Range(0, 2) == 0 ? (-100 / Random.Range(1, modifermult)) : (20 / Random.Range(1, modifermult));
            randomposside = Random.Range(-50, 50);
        }
        else {
            randompos = Random.Range(0, 2) == 0 ? (-50 / Random.Range(1, modifermult)) : 4; 
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

function EnableNightVisionEffect()
{
    nightVisionMultiplierSpeed = 1.3;   // fucking bitch is crazy
    nightVisionMultiplierTele = 0.65;    // bitch will tp more and scream more

    telenumb = Random.Range(teleInterval1, teleInterval2);
}

function DisableNightVisionEffect()
{
    nightVisionMultiplierSpeed = 1.0;
    nightVisionMultiplierTele = 1.0;

    telenumb = Random.Range(teleInterval1, teleInterval2);
}