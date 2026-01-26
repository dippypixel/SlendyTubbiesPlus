#pragma strict

public var thePlayer : Transform;
private var theEnemy : Transform;

var speed : float = 5.0;

var isOffScreen : boolean = false;
public var offscreenDotRange : float = 0.7;

var isVisible : boolean = false;
public var visibleDotRange : float = 0.8; // ** between 0.75 and 0.85 (originally 0.8172719) 

var isInRange : boolean = false;

public var followDistance : float = 3.0;
public var maxVisibleDistance : float = 25.0;

private var sqrDist : float = 0.0;

var health : float = 100.0;
var damage : float = 20.0;

var nearbyaudio : AudioClip;
var triggerTarget : GameObject;
var replacementTex : Texture;
var originalTex : Texture; 

var blackness : Texture2D;
var scare : Texture2D;

var endgamepopup : Transform;

var invisible : boolean = false;
var invisDuration : float = 5.0;
var invisCooldown : float = 10.0;
var canInvis : boolean = true;
static var tinkyInvisible : boolean = false;

var invisText: GUIText;
var bindText: GUIText;
var invisTimer: float = 0.0;
var playercam: Transform;
var model: Transform;
var tinkmodel: Transform;

function IsMine() : boolean
{
    var nv = GetComponent.<NetworkView>();
    return nv && nv.isMine;
}

function Start() 
{
    model = transform.Find("Model");
    tinkmodel = model.Find("Tinkywinky");
    if ( thePlayer == null )
    {
        thePlayer = GameObject.FindWithTag("Player").transform;
        playercam = GameObject.FindWithTag("Player").Find("Camera").transform;
    }

    theEnemy = transform;

}

function Update() 
{

    if (IsMine())
    {
        CreateInvisGUIText();
    }

    if (thePlayer)
    {
        Debug.Log("Looking At Player");
        model.transform.LookAt(playercam);
        if (isInRange) {
            DeductHealth();
            if (!GetComponent.< AudioSource > ().isPlaying) {
                GetComponent.< AudioSource > ().clip = nearbyaudio;
                GetComponent.< AudioSource > ().Play();
            }

            var teleint = Random.Range(0.5, 1.5);
            var teleposleft = Random.Range(-4, 4);
            var teleposup = Random.Range(-1, 1);
            var ogpos = model.transform;
            model.transform.position = Vector3(transform.position.x + teleposleft, transform.position.y + 1.07, transform.position.z + teleposup);
            model.transform.LookAt(playercam);
        }
        else {
            model.transform.position = Vector3(transform.position.x, transform.position.y + 1.07, transform.position.z);
        }
    }

    else 
    {
        model.transform.position = Vector3(transform.position.x, transform.position.y + 1.07, transform.position.z); 
    }


    if (IsMine() && invisText)
    {
        if (!canInvis)
        {
            invisTimer -= Time.deltaTime;

            if (invisTimer <= 0)
            {
                invisTimer = 0;
                canInvis = true;
                invisText.text = "INVISIBILITY READY";
            }
            else
            {
                invisText.text = "INVISIBILITY: " + Mathf.Ceil(invisTimer);
            }
        }
        else
        {
           invisText.text = "INVISIBILITY READY";
        }
     }

    if (IsMine() && Input.GetKeyDown(KeyCode.F) && canInvis)
    {
        Debug.Log("Pressed F!");
        tinkyInvisible = true;
        StartCoroutine(BecomeInvisible());
    }

    thePlayer = GameObject.FindWithTag("Player").transform;
    // Movement : check if out-of-view, then move
    CheckIfOffScreen();

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
    health -= damage * Time.deltaTime;
    
    // check if no health left
    if ( health <= 0.0 )
    {
       model.transform.position = Vector3(transform.position.x, transform.position.y + 1.07, transform.position.z);
       DestroyObject(thePlayer.gameObject);
       health = 0.0;
       Debug.Log( "YOU ARE OUT OF HEALTH !" );
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
    // Check the Follow Distance
    CheckDistance();

    // if not too close, move
    if ( !isInRange )
    {
//nothing happens if player is not in sight lolwut
    }
    else
    {
       StopEnemy();
    }
}


function StopEnemy() 
{

    GetComponent.<Rigidbody>().velocity = Vector3.zero;
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

    if ( sqrDist < sqrFollowDist )
    {
       isInRange = true;
    }
    else
    {
       isInRange = false;
       triggerTarget.GetComponent.<Renderer>().material.mainTexture = originalTex;
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

function BecomeInvisible()
{
    canInvis = false;
    invisible = true;

    invisTimer = invisDuration + invisCooldown;

    // Turn off renderer
    if (model)
    {
        var rends : Renderer[] = model.GetComponentsInChildren.<Renderer>();
        for (var r : Renderer in rends)
        {
            r.enabled = false;
        }
    }

    yield WaitForSeconds(invisDuration);

    // Turn renderer back on
    if (model)
    {
        var rends2 : Renderer[] = model.GetComponentsInChildren.<Renderer>();
        for (var r2 : Renderer in rends2)
        {
            r2.enabled = true;
        }
    }

    tinkyInvisible = false;
    invisible = false;
}

function CreateInvisGUIText()
{
    if (invisText != null) return;

    var go = new GameObject("InvisCooldownText");
    invisText = go.AddComponent.<GUIText>();

    invisText.text = "";
    invisText.fontSize = 18;
    invisText.color = Color.white;
    invisText.anchor = TextAnchor.UpperLeft;
    invisText.alignment = TextAlignment.Left;

    go.transform.position = Vector3(0.02, 0.95, 0);

    //keybind text
    var go2 = new GameObject("KeybindText");
    bindText = go2.AddComponent.< GUIText > ();

    bindText.text = "F to INVISIBLE";
    bindText.fontSize = 18;
    bindText.color = Color.white;
    bindText.anchor = TextAnchor.LowerRight;
    bindText.alignment = TextAlignment.Left;

    go2.transform.position = Vector3(0.95, 0.05, 0);

    Debug.Log("GUIText created by code");
}