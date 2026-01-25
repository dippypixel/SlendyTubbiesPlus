var popup1: Transform;
function Update () {
if(!this.GetComponent.<NetworkView>().isMine);
Checkbutton ();
enable=true;
}

function Checkbutton (){
if (Input.GetKeyDown("1")){
Network.Instantiate(popup1, transform.position, transform.rotation, 1);
}
}