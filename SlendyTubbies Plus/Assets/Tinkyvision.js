#pragma strict

public var thePlayer: Transform;
public var playerIndic: Transform;
private var fogApplied: boolean = false;

function Start() {
    if (thePlayer == null) {
        thePlayer = GameObject.FindWithTag("Player").transform;
    }
}
function Update()
{
    // Tinky invisible on
    if (EnemyScriptPlayer.tinkyInvisible && !fogApplied)
    {
        Debug.Log("FogDisabled");
        RenderSettings.fog = false;
        fogApplied = true;
        Network.Instantiate(playerIndic, Vector3(thePlayer.position.x, thePlayer.position.y + 1.07, thePlayer.position.z), thePlayer.rotation, 1);
    }
    else if (!EnemyScriptPlayer.tinkyInvisible && fogApplied)
    {
        Debug.Log("FogEnabled");
        RenderSettings.fog = true;
        fogApplied = false;
        var numbIndic = GameObject.FindGameObjectsWithTag("PlayerIndicator");
        for (var obj in numbIndic) 
        {
            Destroy(obj);
        }
    }
}
