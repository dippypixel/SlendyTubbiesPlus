#pragma strict

public var lala: GameObject; // Ensure 'GameObject' is capitalized

private var animationComponent: Animation;

var played: boolean = false;
var chance: int = 0;
var wait: float = 0;

function Start() {
    // Get the Animation component attached to the 'head' GameObject
    animationComponent = lala.GetComponent.< Animation > ();
}

function OnTriggerEnter(other: Collider) {
    // Check if the colliding object has the "Player" tag
    Debug.Log("Lala Collision detected with: " + other.gameObject.name);
    if (other.gameObject.CompareTag("Player"))
    {
        if (!played)
        {
            chance = Random.Range(0, 3);
            if (chance == 1)
            {
                wait = Random.Range(0, 3);
                yield WaitForSeconds(wait);
                // Trigger the animation
                played = true;
                lala.GetComponent.< AudioSource > ().Play();
                animationComponent.Play("LalaUp"); // Replace with the name of your animation clip
            }
        }
    }
}