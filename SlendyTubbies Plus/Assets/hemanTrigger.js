#pragma strict

public var speeker: GameObject; // Ensure 'GameObject' is capitalized
public var rise: AudioSource;
private var animationComponent: Animation;

var played: boolean = false;

function Start() {
    // Get the Animation component attached to the 'head' GameObject
    animationComponent = speeker.GetComponent.< Animation > ();
}

function OnTriggerEnter(other: Collider) {
    // Check if the colliding object has the "Player" tag
    Debug.Log("Collision detected with: " + other.gameObject.name);
    if (other.gameObject.CompareTag("Player")) {
        if (!played) {
            rise.Play();
            // Trigger the animation
            played = true;
            animationComponent.Play("Rise2"); 
            yield WaitForSeconds(3.75);
            speeker.GetComponent.< AudioSource > ().Play();
        }

    }
}