#pragma strict

public var po: GameObject; // Ensure 'GameObject' is capitalized
public var ambience: GameObject; // Ensure 'GameObject' is capitalized
public var collectsnd: GameObject; // Ensure 'GameObject' is capitalized
public var ropesound: GameObject;
public var head: GameObject;
private var animationComponent: Animation;
var chance: int = 0;

var played: boolean = false;

function Start() {
    // Get the Animation component attached to the 'head' GameObject
    animationComponent = po.GetComponent.< Animation > ();
}

function OnTriggerEnter(other: Collider) {
    // Check if the colliding object has the "Player" tag
    Debug.Log("Collision detected with: " + other.gameObject.name);
    if (other.gameObject.CompareTag("Player")) {
        if (!played) {
            chance = Random.Range(0, 3);
            if (chance == 1)
            {
                if (ambience.GetComponent.< AudioSource > ().isPlaying) {
                    ambience.GetComponent.< AudioSource > ().Stop();
                }
                if (collectsnd.GetComponent.< AudioSource > ().isPlaying) {
                    collectsnd.GetComponent.< AudioSource > ().Stop();
                }
                // Trigger the animation
                played = true;
                po.GetComponent.< AudioSource > ().Play();
                animationComponent.Stop("PoHung");
                animationComponent.Play("PoFall2"); // Replace with the name of your animation clip
                ropesound.GetComponent.< AudioSource > ().Stop();
            }
        }

    }
}