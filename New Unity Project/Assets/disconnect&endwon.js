var timeOut = 5.0;
var detachChildren = false;

function Awake ()
{
	Invoke ("DestroyNow", timeOut);
}

function DestroyNow ()
{
	if (detachChildren) {
		transform.DetachChildren ();
	}

	// SAVE LAST LEVEL YOU WON
	PlayerPrefs.SetInt("LastLevelWon", Application.loadedLevel);

	Network.Disconnect();
	MasterServer.UnregisterHost();

	// YOU WON SCENE
	Application.LoadLevel(12);
}
