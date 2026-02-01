#pragma strict

var moveSpeed : float = 8.0;
var fastSpeed : float = 15.0;
var mouseSpeed : float = 3.0;

private var rotX : float = 0.0;
private var rotY : float = 0.0;

function Start()
{
    Screen.lockCursor = true;
}

function Update()
{
    // mouse look
    rotX += Input.GetAxis("Mouse X") * mouseSpeed;
    rotY -= Input.GetAxis("Mouse Y") * mouseSpeed;
    rotY = Mathf.Clamp(rotY, -80, 80);

    transform.rotation = Quaternion.Euler(rotY, rotX, 0);

    // movement
    var speed = Input.GetKey(KeyCode.LeftShift) ? fastSpeed : moveSpeed;

    var dir = Vector3.zero;
    if (Input.GetKey(KeyCode.W)) dir += transform.forward;
    if (Input.GetKey(KeyCode.S)) dir -= transform.forward;
    if (Input.GetKey(KeyCode.A)) dir -= transform.right;
    if (Input.GetKey(KeyCode.D)) dir += transform.right;
    if (Input.GetKey(KeyCode.Space)) dir += transform.up;
    if (Input.GetKey(KeyCode.LeftControl)) dir -= transform.up;

    transform.position += dir * speed * Time.deltaTime;
}