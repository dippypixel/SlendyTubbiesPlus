var clicked : boolean = false;

function OnMouseDown() {
    clicked = !clicked;
Application.LoadLevel(11);
    Debug.Log("clicked credits" + (clicked? "" : " off"));
}