using UnityEngine;
using gui = UnityEngine.GUILayout;

public class GameMenuVerses : MonoBehaviour
{
	public GameObject PlayerPrefab;     // white bitch
	public GameObject TinkyPrefab;      // screaming bitch
	public GameObject NoFog;
	public GameObject TinkySpawn;
	public GameObject TinkyGUI;
	public GameObject VictimGUI;

	string ip = "127.0.0.1";
	bool connected;

	void Awake()
	{
		Application.runInBackground = true;
		if (TinkyGUI) TinkyGUI.SetActive(false);
		if (VictimGUI) VictimGUI.SetActive(false);
	}

	//spawn victim
	void CreatePlayer()
	{
		connected = true;

		Debug.Log("[VERSUS] Creating Player (Victim)");

		GameObject g = (GameObject)Network.Instantiate(PlayerPrefab, transform.position, transform.rotation, 1);

		if (!Network.isServer)
		{
			//client is victim
			EnableLocalPlayer(g);
		}
		else
		{
			//host only sees clone
			DisablePlayer(g);
		}
	}

	//spawn screaming bitch
	void CreateTinkyPlayer()
	{
		connected = true;

		Debug.Log("[VERSUS] Creating Tinky (Host)");

		GameObject t = (GameObject)Network.Instantiate(TinkyPrefab, TinkySpawn.transform.position, TinkySpawn.transform.rotation, 1);

		if (Network.isServer)
		{
			//host controls tinky
			EnableLocalPlayer(t);
		}
		else
		{
			//client only sees victim
			DisablePlayer(t);
		}

		Instantiate(NoFog, transform.position, transform.rotation);
	}

	//local control
	void EnableLocalPlayer(GameObject g)
	{
		Debug.Log("[VERSUS] Enable local control: " + g.name);

		//camera
		Transform camT = g.transform.Find("Camera");
		if (camT)
		{
			camT.gameObject.SetActive(true);

			Camera cam = camT.GetComponent<Camera>();
			if (cam) cam.enabled = true;

			AudioListener al = camT.GetComponent<AudioListener>();
			if (al) al.enabled = true;

			Light l = camT.GetComponent<Light>();
			if (l) l.enabled = true;
		}
		else
		{
			Debug.LogError("[VERSUS] Camera NOT FOUND in " + g.name);
		}

		//movement
		CharacterMotor motor = g.GetComponent<CharacterMotor>();
		if (motor) motor.enabled = true;

		FPSInputController input = g.GetComponent<FPSInputController>();
		if (input) input.enabled = true;

		//disable shit
		Camera spawnCam = GetComponent<Camera>();
		if (spawnCam) spawnCam.enabled = false;
	}

	void DisablePlayer(GameObject g)
	{
		Transform camT = g.transform.Find("Camera");
		if (camT)
		{
			Camera cam = camT.GetComponent<Camera>();
			if (cam) cam.enabled = false;

			AudioListener al = camT.GetComponent<AudioListener>();
			if (al) al.enabled = false;

			camT.gameObject.SetActive(false);
		}

		CharacterMotor motor = g.GetComponent<CharacterMotor>();
		if (motor) motor.enabled = false;

		FPSInputController input = g.GetComponent<FPSInputController>();
		if (input) input.enabled = false;
	}

	//network shit
	void OnServerInitialized()
	{
		Debug.Log("[VERSUS] Server initialized");
		CreateTinkyPlayer(); //only tinky
		if (TinkyGUI)
		{
			TinkyGUI.SetActive(true);
		}
	}

	void OnConnectedToServer()
	{
		Debug.Log("[VERSUS] Connected to server");
		CreatePlayer(); //only victim
		if (VictimGUI)
		{
			VictimGUI.SetActive(true);
		}
	}

	void OnPlayerDisconnected(NetworkPlayer pl)
	{
		Network.DestroyPlayerObjects(pl);
	}

	void OnDisconnectedFromServer()
	{
		connected = false;
	}

	//gui shit
	void OnGUI()
	{
		if (!connected)
		{
			ip = gui.TextField(ip);

			if (gui.Button("Connect as Victim"))
			{
				Network.Connect(ip, 5300);
			}

			if (gui.Button("Host as Slendytubby"))
			{
				Network.InitializeServer(10, 5300, false);
			}
		}
	}
}
