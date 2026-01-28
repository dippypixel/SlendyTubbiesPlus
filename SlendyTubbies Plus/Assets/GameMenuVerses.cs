using UnityEngine;
using gui = UnityEngine.GUILayout;


public class GameMenuVerses : MonoBehaviour
{
    public GameObject PlayerPrefab;
	public GameObject TinkyPrefab;
	public GameObject NoFog;
	public GameObject TinkySpawn;
    string ip = "127.0.0.1";
	
	public void Awake()
	{
		Application.runInBackground = true;
	}

    public void CreatePlayer()
    {
        connected = true;
        var g = (GameObject)Network.Instantiate(PlayerPrefab, transform.position, transform.rotation, 1);
		g.GetComponent<NetworkView>().stateSynchronization = NetworkStateSynchronization.Unreliable;
        g.transform.Find("Camera").GetComponent<Camera>().enabled = true;
        GetComponent<Camera>().enabled = false;
  }
	    public void CreateTinkyPlayer()
    {
        connected = true;
        var t = (GameObject)Network.Instantiate(TinkyPrefab, TinkySpawn.transform.position, TinkySpawn.transform.rotation, 1);
		t.GetComponent<NetworkView>().stateSynchronization = NetworkStateSynchronization.Unreliable;
        t.transform.Find("Camera").GetComponent<Camera>().enabled = true;
		t.transform.Find("Camera").GetComponent<Light>().enabled = true;		
        GetComponent<Camera>().enabled = false;
		var nf = Instantiate(NoFog, t.transform.position, t.transform.rotation) as GameObject;
		nf.transform.SetParent(t.transform);
		nf.transform.localPosition = Vector3.zero;
		nf.transform.localRotation = Quaternion.identity;
  }
	
    void OnDisconnectedFromServer()
    {
        connected = false;
    }
    void OnPlayerDisconnected(NetworkPlayer pl)
    {
        Network.DestroyPlayerObjects(pl);
    }
    void OnConnectedToServer()
    {
        CreatePlayer();
    }
    void OnServerInitialized()
    {
        CreateTinkyPlayer();
    }
    bool connected;
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
