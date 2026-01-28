#pragma strict

public var thePlayer: Transform;
public var playerIndic: Transform;
private var fogApplied: boolean = false;
private var isTinkyLocal : boolean = false;

function Start()
{
    var players = GameObject.FindGameObjectsWithTag("Player");

    // Search victim
    for (var p : GameObject in players)
    {
        var nv = p.GetComponent.<NetworkView>();
        if (nv && !nv.isMine)
        {
            thePlayer = p.transform;
            Debug.Log("Victim found: " + p.name);
            break;
        }
    }

    // Detect victim
    for (var pSelf : GameObject in players)
    {
        var nvSelfCheck = pSelf.GetComponent.<NetworkView>();
        if (nvSelfCheck && nvSelfCheck.isMine)
        {
            isTinkyLocal = true;
            Debug.Log("Local client owns a player");
            break;
        }
    }

    // In versus host IS tinky
    if (Network.isServer)
    {
        isTinkyLocal = true;
        Debug.Log("Local client is Tinky (HOST)");
    }
    else
    {
        isTinkyLocal = false;
        Debug.Log("Local client is Victim (CLIENT)");
    }
}

function Update()
{
    // NetworkView of object
    var nvSelf = GetComponent.<NetworkView>();
    if (nvSelf && !nvSelf.isMine)
        return;

    // Retry search for victim if it doesn't spawn yet
    if (thePlayer == null)
    {
        var playersRetry = GameObject.FindGameObjectsWithTag("Player");
        for (var p2 : GameObject in playersRetry)
        {
            var nv2 = p2.GetComponent.<NetworkView>();
            if (nv2 && !nv2.isMine)
            {
                thePlayer = p2.transform;
                Debug.Log("Victim found late: " + p2.name);
                break;
            }
        }
    }

    // Tinky invisible on
    if (EnemyScriptPlayer.tinkyInvisible && !fogApplied)
    {
        Debug.Log("FogDisabled");
        RenderSettings.fog = false;
        fogApplied = true;

        // Indicator managed by host
        if (isTinkyLocal && thePlayer)
        {
            Instantiate(
                playerIndic,
                Vector3(
                    thePlayer.position.x,
                    thePlayer.position.y + 1.07,
                    thePlayer.position.z
                ),
                thePlayer.rotation
            );
        }
    }

    // Tinky invisible off
    else if (!EnemyScriptPlayer.tinkyInvisible && fogApplied)
    {
        Debug.Log("FogEnabled");
        RenderSettings.fog = true;
        fogApplied = false;

        // Only host can destroy indicator
        if (isTinkyLocal)
        {
            var numbIndic = GameObject.FindGameObjectsWithTag("PlayerIndicator");
            for (var obj in numbIndic) 
            {
                Destroy(obj);
            }
        }
    }
}