var torchClick : AudioClip;

var flashLight : Light;
public var theEnemy: Transform;
var script: Component;
function Start()
{
    flashLight.GetComponent.<Light>().enabled = true;
    flashLight.GetComponent.<Light>().intensity = 5;
    theEnemy = GameObject.FindWithTag("Enemy").transform;
    script = theEnemy.GetComponent("EnemyScript");
}

function Update()
{

    if(flashLight.GetComponent.<Light>().enabled == true)
    {
        flashLight.GetComponent.< Light > ().intensity = script.health*.1;
        Debug.Log(flashLight.GetComponent.<Light>().intensity);
    }

    if(Input.GetKeyDown("f"))
    {
        GetComponent.<AudioSource>().PlayOneShot(torchClick);

        if(flashLight.GetComponent.<Light>().enabled == false)
        {
            flashLight.GetComponent.<Light>().enabled = true;
        }

        else
        {
            flashLight.GetComponent.<Light>().enabled = false;
        }
     }
 }