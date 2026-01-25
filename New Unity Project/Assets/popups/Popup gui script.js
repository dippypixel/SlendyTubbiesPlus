var yourtexture : Texture2D;
var popupsound: AudioClip;

function Update(){
    GetComponent.<AudioSource>().clip = popupsound;
    GetComponent.<AudioSource>().Play();
    }
function OnGUI(){
     GUI.DrawTexture (Rect (0, 0, Screen.width, Screen.height), yourtexture);
}