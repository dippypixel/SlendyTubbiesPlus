#pragma strict

public var Tree: GameObject; // Ensure 'GameObject' is capitalized

private var animationComponent: Animation;
var played: boolean = false;
var chance: int = 0;

function Start() {
    // Get the Animation component attached to the 'head' GameObject
    animationComponent = Tree.GetComponent.< Animation > ();
}

function OnTriggerEnter(other: Collider)
{
    // Check if the colliding object has the "Player" tag
    Debug.Log("Collision detected with: " + other.gameObject.name);
    if (other.gameObject.CompareTag("Player"))
    {
        if (!played)
        {
            chance = Random.Range(0, 2);
            if (chance == 1)
            {
                // Trigger the animation
                played = true;
                Tree.GetComponent.< AudioSource > ().Play();
                animationComponent.Play("fall"); // Replace with the name of your animation clip
            }
        }
    }
}