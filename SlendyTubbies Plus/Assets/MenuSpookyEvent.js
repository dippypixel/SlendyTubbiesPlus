#pragma strict
var timer: float = 0.0;
var starttime: float = 0.0;
var spooky_initated: boolean = false;
var menu: GameObject;
var buttons: GameObject;
var house: GameObject;
var ground: GameObject;
var script: Component;
var music: AudioSource;
var ifseesobject: Transform;
function Start() {
	menu = GameObject.Find("CameraMenu");
	buttons = menu.Find("singleplayer");
	house = GameObject.Find("Teletubby house");
	ground = GameObject.Find("Terrain");
	script = menu.GetComponent("Popupguiscript");
	music = house.GetComponent.< AudioSource > ();
	starttime = Random.Range(30.0f, 80.0f);
}

function Update() {
	timer += Time.deltaTime;
	if (timer > starttime && !spooky_initated)
	{
		Spooky();
	}
}

function Spooky()
{
	if (menu.GetComponent.<Camera>().enabled)
	{
		Instantiate(ifseesobject, transform.position, transform.rotation);
		spooky_initated = true;
		Debug.Log("Activated");
		Destroy(script);
		DestroyObject(buttons);
		DestroyObject(ground);
		DestroyObject(house);
		if (music.isPlaying) {
			music.Stop();
		}

	}
}
	