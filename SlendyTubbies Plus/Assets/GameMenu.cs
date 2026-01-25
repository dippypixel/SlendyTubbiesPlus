using UnityEngine;
using gui = UnityEngine.GUILayout;

public class GameMenu : MonoBehaviour
{
	public GameObject PlayerFlashlightPrefab; // ONLY BITCH WITH FLASHLIGHT
	string ip = "127.0.0.1";

	bool connected;

	void Awake()
	{
		Application.runInBackground = true;
	}

	void CreatePlayer()
	{
		GameObject g = (GameObject)Network.Instantiate(
			PlayerFlashlightPrefab,
			transform.position,
			transform.rotation,
			1
		);

		if (g == null)
		{
			Debug.LogError("Failed to spawn multiplayer player!");
			return;
		}

		Transform cam = g.transform.Find("Camera");
		if (cam != null)
			cam.GetComponent<Camera>().enabled = true;

		GetComponent<Camera>().enabled = false;
	}

	void OnConnectedToServer()
	{
		CreatePlayer();
		connected = true;
	}

	void OnServerInitialized()
	{
		CreatePlayer();
		connected = true;
	}

	void OnPlayerDisconnected(NetworkPlayer pl)
	{
		Network.DestroyPlayerObjects(pl);
	}

	void OnDisconnectedFromServer()
	{
		connected = false;
	}

	void OnGUI()
	{
		if (!connected)
		{
			ip = gui.TextField(ip);

			if (gui.Button("Connect (Coop)"))
				Network.Connect(ip, 250000);

			if (gui.Button("Host (Coop)"))
				Network.InitializeServer(10, 250000, false);
		}
	}
}