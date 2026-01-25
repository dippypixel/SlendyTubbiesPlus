using UnityEngine;
using gui = UnityEngine.GUILayout;


public class GameMenusingleplayer : MonoBehaviour
{
	public GameObject PlayerFlashlightPrefab;
	public GameObject PlayerNightVisionPrefab;
	public GameObject TinkyPrefab;
	string ip = "127.0.0.1";

	public void Awake()
	{
		Application.runInBackground = true;
	}

	public void CreatePlayer()
	{
		connected = true;

		int equipment = PlayerPrefs.GetInt("Equipment", 0); // 0 by default

		GameObject prefabToSpawn;

		if (equipment == 1)
		{
			prefabToSpawn = PlayerNightVisionPrefab;
		}
		else
		{
			prefabToSpawn = PlayerFlashlightPrefab;
		}

		var g = (GameObject)Network.Instantiate(
			prefabToSpawn,
			transform.position,
			transform.rotation,
			1
		);

		g.GetComponent<NetworkView>().stateSynchronization =
			NetworkStateSynchronization.Unreliable;

		g.transform.Find("Camera").GetComponent<Camera>().enabled = true;
		GetComponent<Camera>().enabled = false;
	}

	void OnDisconnectedFromServer()
	{
		connected = false;
	}
	void OnPlayerDisconnected(NetworkPlayer pl)
	{
		Network.DestroyPlayerObjects(pl);
	}
	void OnServerInitialized()
	{
		CreatePlayer();
	}
	bool connected;
	void OnGUI()
	{
		if (!connected)
		{
			if (gui.Button("Start"))
			{
				Network.InitializeServer(10, 5300, false);
			}
		}
	}
	void Start () {
		Network.InitializeServer(10, 5300, false);
	}
}