var flashlight : GameObject; //set this as your spotlight
var wait:float = 10; //how many seconds it takes to reduce your light intensity
var reduceby:float = 0.05; //how much it reduces by each time the wait ticks
var seconds:float;

function Update () 
{
	seconds += Time.deltaTime; 
	if(seconds > wait) 
	{ 
		flashlight.GetComponent.<Light>().intensity -= reduceby;
		seconds = 0;
	}
}