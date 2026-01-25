var walkingsound : AudioClip;
private var audioSource : AudioSource;
private var isPlaying : boolean = false; // To track if sound is playing

function Start() {
    // Cache the AudioSource component for better performance
    audioSource = GetComponent.<AudioSource>();
    
    // Assign the walking sound and set loop only once
    audioSource.clip = walkingsound;
    audioSource.loop = true;
}

function Update() {
    Player = GameObject.FindWithTag("Player").transform;

    // Check if any of the movement keys are pressed (W, S, A, D, Arrow keys)
    if (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.S) ||
        Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.D) ||
        Input.GetKey(KeyCode.UpArrow) || Input.GetKey(KeyCode.DownArrow) ||
        Input.GetKey(KeyCode.LeftArrow) || Input.GetKey(KeyCode.RightArrow)) {

        // Play the walking sound if it's not already playing
        if (!isPlaying) {
            audioSource.Play();
            isPlaying = true; // Set the flag to true
        }
    } else {
        // Stop the walking sound if no keys are pressed
        if (isPlaying) {
            audioSource.Stop();
            isPlaying = false; // Reset the flag
        }
    }
}