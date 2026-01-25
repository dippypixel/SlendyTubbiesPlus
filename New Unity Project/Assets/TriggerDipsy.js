#pragma strict

public var head: GameObject; // Ensure 'GameObject' is capitalized
public var bitch: GameObject; // Ensure 'GameObject' is capitalized
public var ambience: GameObject; // Ensure 'GameObject' is capitalized

private var animationComponent: Animation;
var played: boolean = false;
function Start() {
    // Get the Animation component attached to the 'head' GameObject
    animationComponent = head.GetComponent.< Animation > ();
}

function OnTriggerEnter(other: Collider) {
    // Check if the colliding object has the "Player" tag
    Debug.Log("Collision detected with: " + other.gameObject.name);
    if (other.gameObject.CompareTag("Player")) {
        if (!played)
        {
         played = true;
            if (ambience.GetComponent.< AudioSource > ().isPlaying)
         {
                ambience.GetComponent.< AudioSource > ().Stop();
         }
         head.GetComponent.< AudioSource > ().Play();
         yield WaitForSeconds(.5);
         bitch.SetActive(false);
         animationComponent.Play("HeadFall"); // Replace with the name of your animation clip
        }

    }
}