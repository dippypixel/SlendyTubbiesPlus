#pragma strict

public var po: GameObject; // Ensure 'GameObject' is capitalized

public var ropesound: GameObject;

private var animationComponent: Animation;

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
            // Trigger the animation
            played = true;
            po.GetComponent.<AudioSource>().Play();
            animationComponent.Stop("PoHung");
            animationComponent.Play("PoFall2"); // Replace with the name of your animation clip
            ropesound.GetComponent.< AudioSource > ().Stop();
            // yield WaitForSeconds(2.4);
           // animationComponent.Play("PoHung");
           // animationComponent.Stop("PoFall2"); // Replace with the name of your animation clip
        }

    }
}