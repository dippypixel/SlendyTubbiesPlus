var torchClick : AudioClip;

var flashLight : Light;

function Start()
{
    flashLight.GetComponent.<Light>().enabled = false;
    flashLight.GetComponent.<Light>().intensity = 5;
}

function Update()
{
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