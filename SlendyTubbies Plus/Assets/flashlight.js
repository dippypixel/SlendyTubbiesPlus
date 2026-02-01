var torchClick : AudioClip;

var flashLight : Light;

private var isLocal : boolean = false;

function Start()
{
    flashLight.GetComponent.<Light>().enabled = false;
    flashLight.GetComponent.<Light>().intensity = 5;

    // object only local if:
    // i'm client and not host
    // i'm host and i control this prefab
    if (GetComponent.<NetworkView>() != null)
    {
        isLocal = GetComponent.<NetworkView>().isMine;
    }
}

function Update()
{

    if (!isLocal)
        return;

    if(flashLight.GetComponent.<Light>().enabled == true)
    {
        flashLight.GetComponent.<Light>().intensity -= 0.1 * Time.deltaTime / 5;
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