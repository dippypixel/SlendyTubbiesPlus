var flashlight : GameObject;
var switchsound : AudioClip;
var enemy : EnemyScript;

var myLight : Light = flashlight.GetComponent("Light");
function Start() {
    enemy = GameObject.FindWithTag("Enemy").GetComponent.<EnemyScript>();
}
function Update()
{

if(GetComponent.<NetworkView>().isMine){
if (Input.GetKeyDown("n"))
{
    myLight.enabled = !myLight.enabled;
    GetComponent.<AudioSource>().PlayOneShot(switchsound);

    if (myLight.enabled)
    {
        enemy.EnableNightVisionEffect();
    }
    else
    {
        enemy.DisableNightVisionEffect();
    }
}
}
}