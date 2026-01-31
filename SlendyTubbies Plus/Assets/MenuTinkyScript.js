#pragma strict
var replacementTex: Texture;
var originalTex: Texture;
public var menu: Transform;
var tinkyObject: GameObject;
var timer: float = 0.0;
var screamchance: float = 0.0;
var screamstarttime: float = 0.0;
var screamtimer: float = 0.0;
var scream_initated: boolean = false;
var Popup: Transform;
function Start() {
	RenderSettings.fog = false;
	RenderSettings.ambientLight = Color.white;
	Instantiate(Popup, transform.position, transform.rotation);
	tinkyObject.GetComponent.< Renderer > ().material.mainTexture = originalTex;
	menu = GameObject.Find("CameraMenu").transform;
	transform.LookAt(menu);
	transform.position = menu.position - menu.forward * -100;
	screamchance = Random.Range(1, 3);
	screamstarttime = Random.Range(2.0f, 6.0f);
}

function Update()
{
	transform.LookAt(menu);
	timer += Time.deltaTime;
	if (timer > screamstarttime && !scream_initated) {
		if (screamchance == 2)
		{
			Scream();
		}
		else
		{
			Application.Quit();
			Destroy(gameObject);
		}

	}
	if (scream_initated) {
		screamtimer += Time.deltaTime;
		if (screamtimer > 1) {
			Application.Quit();
			Destroy(gameObject);
		}

	}
}

function Scream() {
	menu.GetComponent.< Camera > ().fieldOfView = 30;
	scream_initated = true;
	tinkyObject.GetComponent.< Renderer > ().material.mainTexture = replacementTex;
	transform.position = menu.position - menu.forward * -5;
	GetComponent.< AudioSource > ().Play();
}

