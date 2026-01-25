


#pragma strict

public var door: GameObject; // Ensure 'GameObject' is capitalized

private var animationComponent: Animation;
var played: boolean = false;

function Start() {
    // Get the Animation component attached to the 'head' GameObject
    animationComponent = door.GetComponent.< Animation > ();
}

function OnTriggerEnter(other: Collider) {
    // Check if the colliding object has the "Player" tag
    Debug.Log("Collision detected with: " + other.gameObject.name);
    if (other.gameObject.CompareTag("Player")) {
        if (!played) {
            played = true;
            animationComponent.Play("Take 001"); // Replace with the name of your animation clip
        }

    }
}
