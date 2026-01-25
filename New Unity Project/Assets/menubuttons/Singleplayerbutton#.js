var clicked : boolean = false;
var CameraMenu : Camera;
var CameraSettings : Camera;
var CameraSingleplayer : Camera;
var CameraMultiplayer : Camera;
var CameraCoop : Camera;
var CameraVerses : Camera;



function OnMouseDown() {
    clicked = !clicked;
        CameraMenu.GetComponent.<Camera>().enabled = false;
        CameraSettings.GetComponent.<Camera>().enabled = false;
                CameraSingleplayer.GetComponent.<Camera>().enabled = true;
        CameraMultiplayer.GetComponent.<Camera>().enabled = false;
                CameraCoop.GetComponent.<Camera>().enabled = false;
        CameraVerses.GetComponent.<Camera>().enabled = false;        
}