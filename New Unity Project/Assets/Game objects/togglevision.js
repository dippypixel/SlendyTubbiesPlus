var NoFog : Transform;
var switchsound : AudioClip;
function Update()
{
              if (Input.GetKeyDown("f"))
{
GetComponent.<AudioSource>().PlayOneShot(switchsound);
Instantiate(NoFog, transform.position, transform.rotation);
     }
     if (Input.GetMouseButtonDown(1))
{
GetComponent.<AudioSource>().PlayOneShot(switchsound);
Instantiate(NoFog, transform.position, transform.rotation);
}
}