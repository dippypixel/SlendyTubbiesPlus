var colliding: boolean = false;
var chance: int = 0;
var Tinky: GameObject;
var Cube: GameObject;


function OnTriggerEnter(other: Collider) {
    // Check if the colliding object has the "Player" tag
    Debug.Log("Collision detected with: " + other.gameObject.name);
    if (other.gameObject.CompareTag("Player"))
    {
        chance = Random.Range(1, 4);
        if (chance == 1)
        {
            Debug.Log("colliding!");
            Tinky.transform.position = transform.position + transform.forward * 10 + transform.up * 1.25;
        }
        colliding = true;
    }
}

function OnTriggerExit(other: Collider)
{
    // Check if the colliding object has the "Player" tag
    Debug.Log("Collision detected with: " + other.gameObject.name);
    if (other.gameObject.CompareTag("Player"))
    {
        colliding = false;
    }
}

