var clicked : boolean = false;
var CameraMenu : Camera;
var CameraSettings : Camera;
var CameraSingleplayer : Camera;
var CameraMultiplayer : Camera;
var CameraCoop : Camera;
var CameraVerses : Camera;
var settingsobject : Transform;



function OnMouseDown() {
    clicked = !clicked;
    Instantiate(settingsobject, transform.position, transform.rotation);
        CameraMenu.GetComponent.<Camera>().enabled = false;
        CameraSettings.GetComponent.<Camera>().enabled = true;
                CameraSingleplayer.GetComponent.<Camera>().enabled = false;
        CameraMultiplayer.GetComponent.<Camera>().enabled = false;
                CameraCoop.GetComponent.<Camera>().enabled = false;
        CameraVerses.GetComponent.<Camera>().enabled = false;        
}