var clicked : boolean = false;

function OnMouseDown() {
    clicked = !clicked;
Application.LoadLevel(10);
    Debug.Log("clicked credits" + (clicked? "" : " off"));
}